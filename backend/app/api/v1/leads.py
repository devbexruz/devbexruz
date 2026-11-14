from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from typing import List
import httpx
from app.core.database import get_db
from app.core.config import settings
from app.models import LeadInquiry
from app.schemas import LeadInquiryCreate, LeadInquiryResponse

router = APIRouter(prefix="/leads", tags=["Client Inquiries & Leads"])

async def notify_telegram(inquiry: LeadInquiry):
    if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_ADMIN_CHAT_ID:
        print(f"[LEAD NOTIFICATION] Yangi mijoz: {inquiry.client_name} ({inquiry.client_contact}) | Muammo: {inquiry.problem_description[:100]}")
        return

    text = (
        f"🚀 <b>Yangi Tijoriy Ariza (DevBexruz Platform)</b>\n\n"
        f"👤 <b>Mijoz:</b> {inquiry.client_name}\n"
        f"📞 <b>Aloqa:</b> {inquiry.client_contact}\n"
        f"🏢 <b>Biznes turi:</b> {inquiry.business_type or 'Ko‘rsatilmagan'}\n"
        f"📝 <b>Muammo:</b> {inquiry.problem_description}\n"
    )
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            await client.post(url, json={
                "chat_id": settings.TELEGRAM_ADMIN_CHAT_ID,
                "text": text,
                "parse_mode": "HTML"
            })
    except Exception as e:
        print(f"Telegram alert failed: {e}")

@router.post("/submit", response_model=LeadInquiryResponse, status_code=status.HTTP_201_CREATED)
async def submit_inquiry(inquiry_in: LeadInquiryCreate, db: AsyncSession = Depends(get_db)):
    inquiry = LeadInquiry(
        client_name=inquiry_in.client_name,
        client_contact=inquiry_in.client_contact,
        business_type=inquiry_in.business_type,
        problem_description=inquiry_in.problem_description,
        estimated_solution_json=inquiry_in.estimated_solution_json
    )
    db.add(inquiry)
    await db.commit()
    await db.refresh(inquiry)

    # Async Telegram notification
    await notify_telegram(inquiry)

    return LeadInquiryResponse.model_validate(inquiry)

@router.get("", response_model=List[LeadInquiryResponse])
async def list_inquiries(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(LeadInquiry).order_by(desc(LeadInquiry.created_at)))
    return result.scalars().all()
