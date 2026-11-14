from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.core.database import get_db
from app.models import ProjectItem
from app.schemas import ProjectItemResponse

router = APIRouter(prefix="/projects", tags=["Founder Projects"])

DEFAULT_PROJECTS = [
    {
        "id": "norestyle-marketplace",
        "title": "NoreStyle Marketplace — E-Commerce Platform",
        "slug": "norestyle-marketplace",
        "category": "E-Commerce & High-Load",
        "summary": "Katta hajmdagi foydalanuvchilar va savdo aylanmasiga mo'ljallangan decoupled arxitekturadagi savdo platformasi.",
        "business_problem": "Mijozlarning pik yuklama paytida (aksiyalar, bayramlar) buyurtmalari yo'qolishi va server qotib qolishi muammosi.",
        "technical_solution": "FastAPI/Django asinxron arxitekturasi, Celery + Redis fon vazifalari va chuqur PostgreSQL indeksatsiya strategiyasi.",
        "metrics_results": "API javob berish vaqti 40% ga qisqardi, buyurtma o'tkazuvchanligi 3 barobarga oshdi, 99.9% uzluksiz ishlash ta'minlandi.",
        "live_url": "https://github.com/devbexruz",
        "github_url": "https://github.com/devbexruz",
        "image_url": "/projects/norestyle.png",
        "is_featured": True,
        "order_index": 1
    },
    {
        "id": "math-visual-ai-bot",
        "title": "Math Visual AI Bot — Diagnostic & LLM Engine",
        "slug": "math-visual-ai-bot",
        "category": "AI / LLM & Computer Vision",
        "summary": "Murakkab matematik va texnik savollarni qabul qilib, real vaqtda 2D/3D vizual tahlil bilan javob beruvchi sun'iy intellekt tizimi.",
        "business_problem": "Foydalanuvchilarga faqat matnli javob yetarli emasligi, grafik va vizual tushuntirishlarni tezkor render qilish zarurati.",
        "technical_solution": "FastAPI asinxron API, Claude/OpenAI LLM orkestratsiyasi, OpenCV va Matplotlib yordamida fon rendering konveyeri.",
        "metrics_results": "Bir necha ming concurrent foydalanuvchilar oqimi boshqarildi, o'rtacha generatsiya tezligi 1.2 soniyaga tushirildi.",
        "live_url": "https://github.com/devbexruz/math_visual_bot",
        "github_url": "https://github.com/devbexruz/math_visual_bot",
        "image_url": "/projects/math_ai.png",
        "is_featured": True,
        "order_index": 2
    },
    {
        "id": "dangasa-control",
        "title": "Dangasa Control — Smart Productivity & Habits System",
        "slug": "dangasa-control",
        "category": "Workflow & Automation",
        "summary": "Dasturchilar va biznes jamoalari uchun vaqt o'g'rilarini cheklovchi va fokusni oshiruvchi aqlli monitoring tizimi.",
        "business_problem": "Xodimlarning vaqtini noaniq taqsimlanishi va vazifalar muddatlari kechikishi.",
        "technical_solution": "Telegram bot va veb dashboard orqali maqsadlar matritsasi va avtomatlashgan eslatmalar zanjiri.",
        "metrics_results": "Jamoaviy topshiriqlarni o'z vaqtida bajarish ko'rsatkichi 45% ga oshdi.",
        "live_url": "https://github.com/devbexruz/dangasa_control",
        "github_url": "https://github.com/devbexruz/dangasa_control",
        "image_url": "/projects/dangasa.png",
        "is_featured": True,
        "order_index": 3
    },
    {
        "id": "dayplan-system",
        "title": "DayPlan — Real-Time Task & Operations Hub",
        "slug": "dayplan-system",
        "category": "Enterprise Tools",
        "summary": "Kunlik operatsion ishlarni tezkor rejalashtirish va webhooklar orqali tashqi servislar bilan bog'lanuvchi platforma.",
        "business_problem": "Tarqoq ma'lumotlar bazalari va kundalik hisobotlarni yig'ishdagi qiyinchiliklar.",
        "technical_solution": "PostgreSQL, FastAPI va real-vaqt WebSocket notifikatsiyalari.",
        "metrics_results": "Kunlik hisobot topshirish vaqti 30 daqiqadan 2 daqiqaga qisqardi.",
        "live_url": "https://github.com/devbexruz/dayplan",
        "github_url": "https://github.com/devbexruz/dayplan",
        "image_url": "/projects/dayplan.png",
        "is_featured": True,
        "order_index": 4
    }
]

@router.get("", response_model=List[ProjectItemResponse])
async def get_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ProjectItem).where(ProjectItem.is_featured == True).order_by(ProjectItem.order_index))
    items = result.scalars().all()
    if not items:
        return [ProjectItemResponse(**p) for p in DEFAULT_PROJECTS]
    return items
