from typing import List, Dict, Any
from app.models import ServiceItem
from app.schemas import SelectedServiceItem, BusinessEstimateResponse

DEFAULT_CATALOG = [
    {
        "key": "fastapi_backend",
        "name": "Yuqori Yuklamali FastAPI Backend",
        "category": "core_system",
        "description": "Asinxron REST/WebSocket API, JWT autentifikatsiya, PostgreSQL integratsiyasi",
        "duration_estimate": "1-2 hafta",
        "price_min": 700,
        "price_max": 1200
    },
    {
        "key": "ecommerce_platform",
        "name": "E-Commerce / Marketplace Tizimi",
        "category": "core_system",
        "description": "Mahsulotlar katalogi, savat, buyurtmalar boshqaruvi, rolli admin panel",
        "duration_estimate": "2-3 hafta",
        "price_min": 1200,
        "price_max": 2500
    },
    {
        "key": "crm_workflow_system",
        "name": "Custom CRM & Biznes Jarayonlar Avtomatizatsiyasi",
        "category": "core_system",
        "description": "Lidlarni marshrutlash, xodimlar KPI nazorati, statuslar konveyeri",
        "duration_estimate": "1.5-3 hafta",
        "price_min": 1000,
        "price_max": 2000
    },
    {
        "key": "ai_rag_system",
        "name": "AI Maslahatchi & RAG Qidiruv Tizimi",
        "category": "core_system",
        "description": "Claude / OpenAI asosidagi kompaniya ma'lumotlari bilan ishlovchi aqlli yordamchi",
        "duration_estimate": "1-2 hafta",
        "price_min": 900,
        "price_max": 1800
    },
    {
        "key": "scraping_analytics",
        "name": "Web Scraping & Bozor Ma'lumotlari Yig'ish Motori",
        "category": "core_system",
        "description": "Raqobatchilar narxlarini kuzatish, avtomatik parsing va Excel/DB ga yozish",
        "duration_estimate": "3-7 kun",
        "price_min": 400,
        "price_max": 800
    },
    {
        "key": "payment_click_payme",
        "name": "To'lov Tizimlari Integratsiyasi (Payme, Click, Uzum)",
        "category": "integration",
        "description": "Fiskallashtirish, avtomatik kvitansiya va tranzaksiyalar xavfsizligi",
        "duration_estimate": "2-4 kun",
        "price_min": 200,
        "price_max": 350
    },
    {
        "key": "telegram_bot_miniapp",
        "name": "Telegram Bot & WebApp (Mini App) Interfeysi",
        "category": "integration",
        "description": "Mijozlar Telegram ichida buyurtma berishi, to'lashi va holatini ko'rishi",
        "duration_estimate": "4-7 kun",
        "price_min": 300,
        "price_max": 600
    },
    {
        "key": "crm_sync_external",
        "name": "Tashqi CRM Sinxronizatsiyasi (AmoCRM, Bitrix24)",
        "category": "integration",
        "description": "Buyurtmalar va kontaktlarni ikki tomonlama uzluksiz yangilash",
        "duration_estimate": "3-5 kun",
        "price_min": 250,
        "price_max": 450
    },
    {
        "key": "notification_service",
        "name": "SMS / Telegram / Email Avtomatik Xabarnomalar",
        "category": "integration",
        "description": "Eskiz SMS va Telegram kanallar orqali buyurtma xabarlarini yuborish",
        "duration_estimate": "2-3 kun",
        "price_min": 100,
        "price_max": 200
    },
    {
        "key": "postgres_highload_tune",
        "name": "PostgreSQL Chuqur Optimallashtirish & High-Load",
        "category": "optimization",
        "description": "Indekslash strategiyasi, murakkab so'rovlarni tezlashtirish (40%+ latency drop)",
        "duration_estimate": "3-5 kun",
        "price_min": 350,
        "price_max": 700
    },
    {
        "key": "docker_cloud_deploy",
        "name": "Cloud DevOps, Docker & CI/CD Sozlash",
        "category": "cloud",
        "description": "Nginx, SSL, avtomatik yangilanish va 99.9% uzluksiz ishlash muhiti",
        "duration_estimate": "2-3 kun",
        "price_min": 200,
        "price_max": 400
    }
]

def analyze_and_estimate(problem_description: str, business_type: str = "") -> BusinessEstimateResponse:
    text = (problem_description + " " + business_type).lower()
    selected: List[SelectedServiceItem] = []
    
    total_min = 0
    total_max = 0
    
    # 1. Check for E-Commerce / Marketplace
    if any(k in text for k in ["do'kon", "dastur", "savat", "magazin", "tovar", "mahsulot", "sotish", "savdo", "shop", "commerce", "store"]):
        item = next(x for x in DEFAULT_CATALOG if x["key"] == "ecommerce_platform")
        selected.append(SelectedServiceItem(
            key=item["key"],
            name=item["name"],
            category=item["category"],
            reason="Mahsulotlar katalogi, buyurtmalar oqimi va xaridorlar profilini to'liq tizimlashtirish uchun.",
            price_estimate=f"${item['price_min']} - ${item['price_max']}",
            duration=item["duration_estimate"]
        ))
        total_min += item["price_min"]
        total_max += item["price_max"]
    elif any(k in text for k in ["crm", "mijoz", "lid", "menejer", "boshqaruv", "xodim", "hisob", "avtomat"]):
        item = next(x for x in DEFAULT_CATALOG if x["key"] == "crm_workflow_system")
        selected.append(SelectedServiceItem(
            key=item["key"],
            name=item["name"],
            category=item["category"],
            reason="Mijozlar bilan ishlash jarayonini tartibga solish va inson omili xatolarini nolga tushirish uchun.",
            price_estimate=f"${item['price_min']} - ${item['price_max']}",
            duration=item["duration_estimate"]
        ))
        total_min += item["price_min"]
        total_max += item["price_max"]
    else:
        item = next(x for x in DEFAULT_CATALOG if x["key"] == "fastapi_backend")
        selected.append(SelectedServiceItem(
            key=item["key"],
            name=item["name"],
            category=item["category"],
            reason="Tizimingiz uchun yuqori tezlikda ishlovchi barqaror server va ma'lumotlar bazasi asosi.",
            price_estimate=f"${item['price_min']} - ${item['price_max']}",
            duration=item["duration_estimate"]
        ))
        total_min += item["price_min"]
        total_max += item["price_max"]

    # 2. Check for Telegram Bot / Mini App
    if any(k in text for k in ["telegram", "bot", "tg", "mini app", "kanal", "guruh"]):
        item = next(x for x in DEFAULT_CATALOG if x["key"] == "telegram_bot_miniapp")
        selected.append(SelectedServiceItem(
            key=item["key"],
            name=item["name"],
            category=item["category"],
            reason="O'zbekiston foydalanuvchilari uchun eng qulay Telegram orqali xarid va muloqot kanali.",
            price_estimate=f"${item['price_min']} - ${item['price_max']}",
            duration=item["duration_estimate"]
        ))
        total_min += item["price_min"]
        total_max += item["price_max"]

    # 3. Check for Payment integrations
    if any(k in text for k in ["to'lov", "payme", "click", "uzum", "karta", "payment", "pul", "hisob-kitob"]):
        item = next(x for x in DEFAULT_CATALOG if x["key"] == "payment_click_payme")
        selected.append(SelectedServiceItem(
            key=item["key"],
            name=item["name"],
            category=item["category"],
            reason="Mijozlardan to'lovlarni avtomatik qabul qilish va kvitansiya shakllantirish.",
            price_estimate=f"${item['price_min']} - ${item['price_max']}",
            duration=item["duration_estimate"]
        ))
        total_min += item["price_min"]
        total_max += item["price_max"]

    # 4. Check for AI / LLM / Bot intelligence
    if any(k in text for k in ["ai", "sun'iy", "intellekt", "chatgpt", "claude", "yordamchi", "aqlli", "maslahat"]):
        item = next(x for x in DEFAULT_CATALOG if x["key"] == "ai_rag_system")
        selected.append(SelectedServiceItem(
            key=item["key"],
            name=item["name"],
            category=item["category"],
            reason="Kompaniyangiz ma'lumotlari asosida mijozlar savollariga 24/7 javob beruvchi intellektual yordamchi.",
            price_estimate=f"${item['price_min']} - ${item['price_max']}",
            duration=item["duration_estimate"]
        ))
        total_min += item["price_min"]
        total_max += item["price_max"]

    # 5. Check for High-load / speed issues
    if any(k in text for k in ["sekin", "qotish", "yuklama", "tezlik", "optimiz", "ko'p odam", "server"]):
        item = next(x for x in DEFAULT_CATALOG if x["key"] == "postgres_highload_tune")
        selected.append(SelectedServiceItem(
            key=item["key"],
            name=item["name"],
            category=item["category"],
            reason="Ma'lumotlar bazasi so'rovlarini qayta optimallashtirib, server yuklamasini 40% dan ortiq kamaytirish.",
            price_estimate=f"${item['price_min']} - ${item['price_max']}",
            duration=item["duration_estimate"]
        ))
        total_min += item["price_min"]
        total_max += item["price_max"]

    # 6. Check for Notifications
    if any(k in text for k in ["sms", "xabar", "bildirishnoma", "ogohlantirish", "notify", "email"]):
        item = next(x for x in DEFAULT_CATALOG if x["key"] == "notification_service")
        selected.append(SelectedServiceItem(
            key=item["key"],
            name=item["name"],
            category=item["category"],
            reason="Har bir buyurtma va to'lov haqida mijozga hamda adminga lahzalik bildirishnoma uzatish.",
            price_estimate=f"${item['price_min']} - ${item['price_max']}",
            duration=item["duration_estimate"]
        ))
        total_min += item["price_min"]
        total_max += item["price_max"]

    # Always ensure Cloud deployment is included if not single small task
    if len(selected) >= 2:
        item = next(x for x in DEFAULT_CATALOG if x["key"] == "docker_cloud_deploy")
        selected.append(SelectedServiceItem(
            key=item["key"],
            name=item["name"],
            category=item["category"],
            reason="Tizimni xavfsiz Linux serverda Docker konteynerlarida uzluksiz 99.9% uptime bilan ishga tushirish.",
            price_estimate=f"${item['price_min']} - ${item['price_max']}",
            duration=item["duration_estimate"]
        ))
        total_min += item["price_min"]
        total_max += item["price_max"]

    # Calculate duration
    if total_min <= 800:
        duration_str = "1 - 1.5 hafta"
    elif total_min <= 1500:
        duration_str = "2 - 3 hafta"
    else:
        duration_str = "3 - 4 hafta"

    diagnosis = f"Tahlil natijasida biznesingizda qo'lda bajarilayotgan rutin jarayonlar va tizimlararo uzilishlar aniqlandi. Zamonaviy avtomatlashtirilgan backend va integratsiyalar orqali muammo to'liq bartaraf etiladi."
    architecture = f"FastAPI asosidagi asinxron mikro-servis arxitekturasi, PostgreSQL ma'lumotlar bazasi va {len(selected)} ta zaruriy modul integratsiyasi."
    
    deliverables = [
        "To'liq avtomatlashtirilgan, 24/7 ishlovchi xatolarsiz backend tizim",
        "Mijozlar buyurtmalari va to'lovlarining 100% shaffof nazorati",
        "Telegram va veb orqali qulay boshqaruv paneli",
        "Xavfsiz Docker server sozlamasi va 1 oylik kafolatli texnik ko'mak"
    ]
    
    roi = "Xodimlarning buyurtmalarni qo'lda qayta ishlash vaqti 60% tejaladi, inson omili sababli yuzaga keladigan buyurtma yo'qolishlari 0 ga tushadi."

    return BusinessEstimateResponse(
        problem_diagnosis=diagnosis,
        recommended_architecture=architecture,
        selected_services=selected,
        total_price_min=total_min,
        total_price_max=total_max,
        total_duration_estimate=duration_str,
        deliverables=deliverables,
        business_roi=roi,
        call_to_action="Ushbu yechimni Bexruz Boynazarov bilan muhokama qilish va loyihani boshlash"
    )
