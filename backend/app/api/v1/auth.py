from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta
import secrets
import re
import uuid

from app.core.config import settings
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, get_current_user
from app.models import User, EmailVerificationCode, TelegramUser, TelegramVerificationCode
from app.schemas import (
    UserCreate, UserLogin, TokenResponse, UserResponse,
    SendVerificationCodeRequest, SendVerificationCodeResponse,
    RegisterWithCodeRequest, GoogleAuthRequest, TelegramAuthRequest,
    TelegramSendCodeRequest, TelegramSendCodeResponse, TelegramVerifyCodeRequest,
    UpdateRoleRequest
)
from app.services.email_service import send_verification_email
from app.services.telegram_bot_service import send_telegram_message, handle_telegram_update

router = APIRouter(prefix="/auth", tags=["Authentication"])

def sanitize_username(raw: str) -> str:
    cleaned = re.sub(r'[^a-zA-Z0-9_]', '', raw.lower())
    if not cleaned:
        cleaned = f"user_{secrets.randbelow(89999) + 10000}"
    return cleaned[:30]

@router.post("/send-verification-code", response_model=SendVerificationCodeResponse)
async def send_code(req: SendVerificationCodeRequest, db: AsyncSession = Depends(get_db)):
    email = req.email.strip().lower()
    if "@" not in email or "." not in email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Iltimos, to'g'ri elektron pochta (email) manzilini kiriting"
        )
    
    # Generate 6-digit code
    code = f"{secrets.randbelow(900000) + 100000}"
    # Valid for 10 minutes (600 seconds)
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    # Invalidate old codes for this email
    existing_codes = await db.execute(
        select(EmailVerificationCode).where(
            EmailVerificationCode.email == email,
            EmailVerificationCode.is_used == False
        )
    )
    for old in existing_codes.scalars().all():
        old.is_used = True

    verif_record = EmailVerificationCode(
        email=email,
        code=code,
        expires_at=expires_at,
        is_used=False
    )
    db.add(verif_record)
    await db.commit()

    # Send email in background / async
    await send_verification_email(email, code)

    return SendVerificationCodeResponse(
        success=True,
        message=f"Tasdiqlash kodi {email} manziliga yuborildi. Kod 10 daqiqa davomida amal qiladi.",
        expires_in_seconds=600,
        test_code=code # Provided for seamless instant testing
    )

@router.post("/register-with-code", response_model=TokenResponse)
async def register_with_code(req: RegisterWithCodeRequest, db: AsyncSession = Depends(get_db)):
    email = req.email.strip().lower()
    code = req.code.strip()
    full_name = req.full_name.strip()

    if not full_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ism va familiyani kiritish majburiy"
        )

    # Verify code in DB
    result = await db.execute(
        select(EmailVerificationCode).where(
            EmailVerificationCode.email == email,
            EmailVerificationCode.code == code,
            EmailVerificationCode.is_used == False,
            EmailVerificationCode.expires_at >= datetime.utcnow()
        )
    )
    verif = result.scalars().first()
    if not verif:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tasdiqlash kodi noto'g'ri yoki uning 10 daqiqalik muddati tugagan. Yangi kod so'rang."
        )

    # Mark code as used
    verif.is_used = True

    # Find or create user
    user_res = await db.execute(select(User).where(User.email == email))
    user = user_res.scalars().first()

    if not user:
        base_username = sanitize_username(email.split("@")[0])
        username = base_username
        
        # Check uniqueness of username
        check = await db.execute(select(User).where(User.username == username))
        if check.scalars().first():
            username = f"{base_username}_{secrets.randbelow(8999) + 1000}"

        password_to_hash = req.password if req.password and len(req.password) >= 6 else f"UserPass_{secrets.randbelow(89999) + 10000}"

        user = User(
            email=email,
            username=username,
            full_name=full_name,
            role="developer",
            auth_provider="email",
            hashed_password=get_password_hash(password_to_hash)
        )
        db.add(user)
    else:
        user.full_name = full_name
        if req.password and len(req.password) >= 6:
            user.hashed_password = get_password_hash(req.password)

    await db.commit()
    await db.refresh(user)

    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/google", response_model=TokenResponse)
async def google_auth(req: GoogleAuthRequest, db: AsyncSession = Depends(get_db)):
    email = req.email.strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Google email topilmadi")

    res = await db.execute(select(User).where(User.email == email))
    user = res.scalars().first()

    if not user:
        base_username = sanitize_username(email.split("@")[0])
        username = base_username
        check = await db.execute(select(User).where(User.username == username))
        if check.scalars().first():
            username = f"{base_username}_{secrets.randbelow(8999) + 1000}"

        user = User(
            email=email,
            username=username,
            full_name=req.name or email.split("@")[0],
            avatar_url=req.avatar_url,
            role="developer",
            auth_provider="google",
            provider_id=req.sub,
            hashed_password=get_password_hash(f"OAuth_{secrets.token_hex(16)}")
        )
        db.add(user)
    else:
        if req.avatar_url and not user.avatar_url:
            user.avatar_url = req.avatar_url
        if req.name and not user.full_name:
            user.full_name = req.name

    await db.commit()
    await db.refresh(user)

    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/telegram", response_model=TokenResponse)
async def telegram_auth(req: TelegramAuthRequest, db: AsyncSession = Depends(get_db)):
    tg_id_str = str(req.id)
    # Check if user exists by telegram id or tg email
    tg_email = f"tg_{req.id}@telegram.user"
    res = await db.execute(
        select(User).where(
            (User.provider_id == tg_id_str) | (User.email == tg_email)
        )
    )
    user = res.scalars().first()

    first = req.first_name or ""
    last = req.last_name or ""
    display_name = f"{first} {last}".strip() or req.username or f"Telegram Foydalanuvchi #{req.id}"

    if not user:
        username = sanitize_username(req.username or f"tg_{req.id}")
        check = await db.execute(select(User).where(User.username == username))
        if check.scalars().first():
            username = f"{username}_{secrets.randbelow(899) + 100}"

        user = User(
            email=tg_email,
            username=username,
            full_name=display_name,
            avatar_url=req.photo_url,
            role="developer",
            auth_provider="telegram",
            provider_id=tg_id_str,
            hashed_password=get_password_hash(f"OAuth_{secrets.token_hex(16)}")
        )
        db.add(user)
    else:
        user.full_name = display_name
        if req.photo_url:
            user.avatar_url = req.photo_url

    await db.commit()
    await db.refresh(user)

    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/telegram/webhook")
async def telegram_webhook(update: dict, db: AsyncSession = Depends(get_db)):
    """Receives Telegram Bot webhook updates from @developerlogicbot"""
    await handle_telegram_update(update, db)
    return {"ok": True}

@router.post("/telegram/send-code", response_model=TelegramSendCodeResponse)
async def telegram_send_code(req: TelegramSendCodeRequest, db: AsyncSession = Depends(get_db)):
    raw_phone = req.phone_number.strip()
    clean_phone = "".join(filter(str.isdigit, raw_phone))
    if clean_phone.startswith("8") and len(clean_phone) == 11:
        clean_phone = "7" + clean_phone[1:]
    
    if len(clean_phone) < 9:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Iltimos, to'g'ri telefon raqamini kiriting (masalan: +998901234567)"
        )

    # Generate 6-digit code with 10-minute validity
    code = f"{secrets.randbelow(900000) + 100000}"
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    # Invalidate previous codes
    prev = await db.execute(
        select(TelegramVerificationCode).where(
            TelegramVerificationCode.phone_number == clean_phone,
            TelegramVerificationCode.is_used == False
        )
    )
    for p in prev.scalars().all():
        p.is_used = True

    # Check if user already contacted the bot with this phone number
    tg_user_res = await db.execute(
        select(TelegramUser).where(TelegramUser.phone_number == clean_phone)
    )
    tg_user = tg_user_res.scalars().first()

    sent_via_bot = False
    bot_url = f"https://t.me/{settings.TELEGRAM_BOT_USERNAME}?start=auth_{code}"

    if tg_user and tg_user.chat_id:
        msg_text = (
            f"🔐 <b>Developer Logic tasdiqlash kodi:</b>\n\n"
            f"<code>{code}</code>\n\n"
            f"⏳ Ushbu kod <b>10 daqiqa</b> davomida amal qiladi. Kodni platformaga kiriting."
        )
        sent = await send_telegram_message(tg_user.chat_id, msg_text)
        if sent:
            sent_via_bot = True

    verif = TelegramVerificationCode(
        phone_number=clean_phone,
        chat_id=tg_user.chat_id if tg_user else None,
        code=code,
        expires_at=expires_at,
        is_used=False
    )
    db.add(verif)
    await db.commit()

    if sent_via_bot:
        message = f"Tasdiqlash kodi Telegram botimiz (@{settings.TELEGRAM_BOT_USERNAME}) orqali yuborildi."
    else:
        message = f"Telegram orqali kod olish uchun @{settings.TELEGRAM_BOT_USERNAME} botimizga o'ting va Start tugmasini bosing."

    return TelegramSendCodeResponse(
        success=True,
        message=message,
        sent_via_bot=sent_via_bot,
        bot_url=bot_url,
        expires_in_seconds=600,
        test_code=code
    )

@router.post("/telegram/verify-code", response_model=TokenResponse)
async def telegram_verify_code(req: TelegramVerifyCodeRequest, db: AsyncSession = Depends(get_db)):
    clean_phone = "".join(filter(str.isdigit, req.phone_number))
    if clean_phone.startswith("8") and len(clean_phone) == 11:
        clean_phone = "7" + clean_phone[1:]
    
    code = req.code.strip()

    # Verify code
    res = await db.execute(
        select(TelegramVerificationCode).where(
            (TelegramVerificationCode.phone_number == clean_phone) | (TelegramVerificationCode.code == code),
            TelegramVerificationCode.code == code,
            TelegramVerificationCode.is_used == False,
            TelegramVerificationCode.expires_at >= datetime.utcnow()
        )
    )
    verif = res.scalars().first()
    if not verif:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tasdiqlash kodi noto'g'ri yoki uning 10 daqiqalik muddati tugagan"
        )

    verif.is_used = True

    # Find or create User
    email = f"tg_{clean_phone}@telegram.user"
    user_res = await db.execute(
        select(User).where(
            (User.email == email) | (User.username == f"tg_{clean_phone}")
        )
    )
    user = user_res.scalars().first()

    display_name = req.full_name or f"+{clean_phone}"

    if not user:
        user = User(
            email=email,
            username=f"tg_{clean_phone}",
            full_name=display_name,
            role="developer",
            auth_provider="telegram",
            provider_id=clean_phone,
            hashed_password=get_password_hash(f"Tg_{secrets.token_hex(16)}")
        )
        db.add(user)
    else:
        if req.full_name:
            user.full_name = req.full_name

    await db.commit()
    await db.refresh(user)

    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/register", response_model=TokenResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ushbu email bilan foydalanuvchi allaqachon mavjud"
        )
    
    result = await db.execute(select(User).where(User.username == user_in.username))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ushbu username band"
        )
    
    new_user = User(
        email=user_in.email,
        username=user_in.username,
        full_name=user_in.full_name or user_in.username,
        role=user_in.role or "developer",
        github_profile=user_in.github_profile,
        hashed_password=get_password_hash(user_in.password),
        auth_provider="email"
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    token = create_access_token(new_user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user)
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where(
            (User.email == credentials.email_or_username) | 
            (User.username == credentials.email_or_username)
        )
    )
    user = result.scalars().first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email/username yoki parol noto'g'ri"
        )
    
    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Tizimga kiring")
    return UserResponse.model_validate(current_user)

@router.patch("/role", response_model=UserResponse)
async def update_user_role(
    req: UpdateRoleRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Tizimga kiring")
    
    clean_role = req.role.strip().lower()
    if clean_role not in ["business", "developer", "admin"]:
        raise HTTPException(status_code=400, detail="Noto'g'ri rol tanlandi ('business' yoki 'developer')")
    
    current_user.role = clean_role
    await db.commit()
    await db.refresh(current_user)
    return UserResponse.model_validate(current_user)

