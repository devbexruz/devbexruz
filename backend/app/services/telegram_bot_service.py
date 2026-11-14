import httpx
import logging
import secrets
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.models import TelegramUser, TelegramVerificationCode, User
from app.core.security import get_password_hash, create_access_token

logger = logging.getLogger("telegram_bot_service")
TELEGRAM_API = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}"

async def send_telegram_message(chat_id: int, text: str, reply_markup: Optional[dict] = None) -> bool:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            payload = {
                "chat_id": chat_id,
                "text": text,
                "parse_mode": "HTML"
            }
            if reply_markup:
                payload["reply_markup"] = reply_markup
            res = await client.post(f"{TELEGRAM_API}/sendMessage", json=payload)
            data = res.json()
            if not data.get("ok"):
                logger.error(f"Telegram sendMessage failed: {data}")
                return False
            return True
    except Exception as e:
        logger.error(f"Error sending telegram message to {chat_id}: {e}")
        return False

async def handle_telegram_update(update: dict, db: AsyncSession):
    """
    Handles incoming webhook updates from @developerlogicbot
    """
    message = update.get("message")
    if not message:
        return

    chat = message.get("chat", {})
    chat_id = chat.get("id")
    if not chat_id:
        return

    from_user = message.get("from", {})
    user_id = from_user.get("id")
    first_name = from_user.get("first_name", "Foydalanuvchi")
    username = from_user.get("username")

    text = message.get("text", "")
    contact = message.get("contact")

    # 1. Handle Contact Sharing
    if contact:
        raw_phone = contact.get("phone_number", "")
        clean_phone = "".join(filter(str.isdigit, raw_phone))
        if clean_phone.startswith("8") and len(clean_phone) == 11:
            clean_phone = "7" + clean_phone[1:]

        # Upsert TelegramUser
        res = await db.execute(select(TelegramUser).where(TelegramUser.chat_id == chat_id))
        tg_user = res.scalars().first()
        if not tg_user:
            tg_user = TelegramUser(
                chat_id=chat_id,
                telegram_id=user_id,
                phone_number=clean_phone,
                first_name=first_name,
                username=username
            )
            db.add(tg_user)
        else:
            tg_user.phone_number = clean_phone
            tg_user.first_name = first_name
            tg_user.username = username
        await db.commit()

        # Generate a new 6-digit code for this user immediately
        code = f"{secrets.randbelow(900000) + 100000}"
        expires_at = datetime.utcnow() + timedelta(minutes=10)

        verif = TelegramVerificationCode(
            phone_number=clean_phone,
            chat_id=chat_id,
            code=code,
            expires_at=expires_at,
            is_used=False
        )
        db.add(verif)
        await db.commit()

        reply_text = (
            f"✅ <b>Raqamingiz tasdiqlandi!</b>\n\n"
            f"Developer Logic platformasiga kirish uchun kodingiz:\n\n"
            f"🔐 <code>{code}</code>\n\n"
            f"⏳ Ushbu kod <b>10 daqiqa</b> davomida amal qiladi. Kodni saytga kiriting."
        )
        await send_telegram_message(chat_id, reply_text)
        return

    # 2. Handle /start command or /start auth_<code>
    if text.startswith("/start"):
        # Check if deep link parameter exists: /start auth_123456
        parts = text.split(" ")
        auth_param = parts[1] if len(parts) > 1 else None

        if auth_param and auth_param.startswith("auth_"):
            passed_code = auth_param.replace("auth_", "").strip()
            # Link this chat_id with the pending code
            res = await db.execute(
                select(TelegramVerificationCode).where(
                    TelegramVerificationCode.code == passed_code,
                    TelegramVerificationCode.is_used == False,
                    TelegramVerificationCode.expires_at >= datetime.utcnow()
                )
            )
            verif = res.scalars().first()
            if verif:
                verif.chat_id = chat_id
                await db.commit()

                reply_text = (
                    f"👋 Assalomu alaykum, <b>{first_name}</b>!\n\n"
                    f"Developer Logic platformasiga kirish uchun tasdiqlash kodingiz:\n\n"
                    f"🔑 <code>{passed_code}</code>\n\n"
                    f"⏳ Kod <b>10 daqiqa</b> davomida amal qiladi. Kodni saytga kiriting."
                )
                await send_telegram_message(chat_id, reply_text)
                return

        # Regular /start or generic deep link: generate a fresh code and prompt for contact
        code = f"{secrets.randbelow(900000) + 100000}"
        expires_at = datetime.utcnow() + timedelta(minutes=10)

        # Store or update user
        res = await db.execute(select(TelegramUser).where(TelegramUser.chat_id == chat_id))
        tg_user = res.scalars().first()
        if not tg_user:
            tg_user = TelegramUser(
                chat_id=chat_id,
                telegram_id=user_id,
                first_name=first_name,
                username=username
            )
            db.add(tg_user)
        await db.commit()

        verif = TelegramVerificationCode(
            chat_id=chat_id,
            phone_number=tg_user.phone_number if tg_user else None,
            code=code,
            expires_at=expires_at,
            is_used=False
        )
        db.add(verif)
        await db.commit()

        reply_markup = {
            "keyboard": [
                [{"text": "📱 Telefon raqamimni ulashish", "request_contact": True}]
            ],
            "resize_keyboard": True,
            "one_time_keyboard": True
        }

        reply_text = (
            f"👋 Assalomu alaykum, <b>{first_name}</b>!\n\n"
            f"Developer Logic (<b>developerlogic.uz</b>) platformasiga xush kelibsiz.\n\n"
            f"Sizning tasdiqlash kodingiz:\n\n"
            f"🔐 <code>{code}</code>\n\n"
            f"⏳ Ushbu kod <b>10 daqiqa</b> davomida amal qiladi.\n\n"
            f"<i>Keyingi safar 1-bosqichda avtomatik kirish uchun quyidagi tugma orqali telefon raqamingizni ulashing.</i>"
        )
        await send_telegram_message(chat_id, reply_text, reply_markup=reply_markup)
        return

    # 3. Default fallback message
    reply_text = (
        f"Developer Logic platformasiga kirish uchun <code>/start</code> buyrug'ini bosing "
        f"yoki saytdagi <b>'Telegram orqali kod olish'</b> tugmasidan foydalaning."
    )
    await send_telegram_message(chat_id, reply_text)
