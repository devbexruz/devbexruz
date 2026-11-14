import httpx
import json
import logging
from typing import Optional, Dict, Any, List
from app.core.config import settings

logger = logging.getLogger(__name__)

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models"

def get_api_key() -> str:
    return settings.GEMINI_API_KEY or ""

async def call_gemini(prompt: str, response_mime_type: Optional[str] = None, max_tokens: int = 4096) -> Optional[str]:
    api_key = get_api_key()
    if not api_key:
        logger.warning("GEMINI_API_KEY not configured")
        return None

    model = settings.GEMINI_MODEL or "gemini-2.5-flash"
    url = f"{GEMINI_API_URL}/{model}:generateContent?key={api_key}"

    generation_config: Dict[str, Any] = {
        "maxOutputTokens": max_tokens,
        "thinkingConfig": {"thinkingBudget": 0}
    }
    if response_mime_type:
        generation_config["response_mime_type"] = response_mime_type

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": generation_config
    }

    try:
        async with httpx.AsyncClient(timeout=35.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates and "content" in candidates[0]:
                    parts = candidates[0]["content"].get("parts", [])
                    if parts and "text" in parts[0]:
                        return parts[0]["text"]
            else:
                logger.error(f"Gemini API returned status {resp.status_code}: {resp.text}")
    except Exception as e:
        logger.error(f"Error calling Gemini API: {str(e)}")
    return None

async def polish_problem_with_gemini(raw_text: str, author_name: str = "Mehmon") -> Dict[str, Any]:
    """
    Foydalanuvchi oddiy so'zlar bilan yozgan muammoni Gemini 2.5 Flash yordamida
    professional IT arxitekturasi darajasiga ko'taradi.
    """
    prompt = f"""Siz tajribali Systems Architect va Product Engineersiz (Bexruz Boynazarov uslubida).
Foydalanuvchi quyidagi muammoni o'z so'zlari bilan yozib yubordi:

Muallif: {author_name}
Muammo matni:
\"\"\"{raw_text.strip()}\"\"\"

Vazifangiz: Ushbu muammoni professional IT arxitektura va biznes tizimlari darajasiga ko'tarib, quyidagi JSON strukturasida qaytaring:
{{
  "title": "Muammoning professional, aniq va jozibador sarlavhasi (O'zbek tilida)",
  "category": "Toifa nomi (masalan: 1C & Ombor integratsiyasi, Telegram Bot & E-Commerce, Kassa & POS Uskunalar, High-load Backend, To'lov tizimlari yoki Mobile Ilova)",
  "problem_summary": "Muammo mohiyati va biznesga keltirayotgan real zarari (2-3 jumla)",
  "root_cause": "Asosiy texnik sabab (masalan: sinxron bloklovchi so'rovlar, race condition, tarmoq uzilishlariga tayyor bo'lmagan arxitektura va h.k.)",
  "recommended_architecture": "Tavsiya etiladigan professional arxitektura va texnik yechim",
  "tech_stack": ["Texnologiya 1", "Texnologiya 2", "Texnologiya 3", "Texnologiya 4"],
  "tags": "Vergul bilan ajratilgan 4-6 ta kalit so'z (masalan: 1C, Kassa, POS, FastAPI, Redis, Sync)",
  "action_steps": [
    "1-bosqich: Tezkor diagnoz va qadam",
    "2-bosqich: Arxitektura va modul ishlab chiqish",
    "3-bosqich: Sinov, monitoring va uzluksiz integratsiya"
  ]
}}

Faqat valid JSON formatda javob bering, qo'shimcha so'zsiz."""

    raw_response = await call_gemini(prompt, response_mime_type="application/json")
    if raw_response:
        try:
            parsed = json.loads(raw_response)
            if "title" in parsed and "problem_summary" in parsed:
                # Assemble beautiful Markdown
                steps_md = "\n".join([f"{i+1}. {step}" for i, step in enumerate(parsed.get("action_steps", []))])
                tech_md = ", ".join(parsed.get("tech_stack", []))
                
                content_markdown = f"""## 1. Muammoning tub mohiyati va biznesga ta'siri
{parsed.get("problem_summary", "")}

## 2. Asosiy texnik sabab (Root Cause)
{parsed.get("root_cause", "")}

## 3. Tavsiya etiladigan Professional Arxitektura
{parsed.get("recommended_architecture", "")}

### Tavsiya etilgan texnologiyalar steki:
**{tech_md}**

## 4. Bosqichma-bosqich amalga oshirish rejasi (Action Plan)
{steps_md}

## 5. Kutilayotgan Natija
Ushbu arxitektura joriy etilgach, inson omili sababli yuzaga keladigan xatolar va tizim to'xtalishlari bartaraf etiladi, 99.9% ma'lumotlar aniqligi va uzluksiz ishlash kafolatlanadi.
"""
                parsed["content_markdown"] = content_markdown.strip()
                return parsed
        except Exception as e:
            logger.error(f"Failed to parse Gemini JSON: {e}")

    # Fallback if Gemini is unavailable
    clean_title = raw_text.strip().split("\n")[0][:80]
    if len(clean_title) < 10:
        clean_title = f"{clean_title} bo'yicha tizimli muammo va yechim"
    
    fallback_markdown = f"""## 1. Muammoning tub mohiyati
{raw_text.strip()}

## 2. Biznesga ta'siri va yo'qotishlar
Ushbu muammo tufayli biznes jarayonlarida uzilishlar, ma'lumotlar nomutanosibligi yoki vaqt yo'qotilishi kuzatilishi mumkin.

## 3. Texnik sabab (Root Cause)
Tizimlar o'rtasida to'g'ri arxitektura, keshlashtirish yoki asinxron navbat (queue) mexanizmlarining to'liq yo'lga qo'yilmaganligi.

## 4. Tavsiya etiladigan Arxitektura va Yechim
- FastAPI asosidagi mikro-servis va asinxron fon vazifalari (Celery/Redis)
- Tranzaksion xavfsizlik va Idempotency kalitlari
- Webhook va avtomatik qayta urinish (retry) siyosati

## 5. Kutilayotgan Natija
99.9% uzluksiz ishlash, to'liq ma'lumotlar aniqligi va inson omilini minimallashtirish."""

    return {
        "title": clean_title,
        "category": "Biznes va Tizim Integratsiyasi",
        "problem_summary": "Tizimlararo integratsiya va ma'lumotlar sinxronizatsiyasidagi uzilish.",
        "root_cause": "Asinxron qatlam va xatoliklarni qayta ishlash zanjiri yetishmasligi.",
        "recommended_architecture": "FastAPI, PostgreSQL va Redis Queue asosidagi event-driven integratsiya.",
        "tech_stack": ["FastAPI", "PostgreSQL", "Redis", "Docker"],
        "tags": "FastAPI, Integratsiya, Avtomatlashtirish, Redis, PostgreSQL",
        "content_markdown": fallback_markdown
    }

async def generate_gemini_seo(title: str, content: str, tags: str) -> Dict[str, str]:
    """
    Google va Yandex uchun yuqori CTR li SEO meta title, description va keywords yaratadi.
    """
    prompt = f"""Quyidagi dasturchilar va biznes IT muammosi uchun SEO meta teglar generatsiya qiling:
Sarlavha: {title}
Teglar: {tags}
Matn qisqartmasi: {content[:400]}

Faqat JSON qaytaring:
{{
  "meta_title": "Google qidiruvi uchun jozibador 50-60 belgilik sarlavha (O'zbek tilida) | DevBexruz",
  "meta_description": "140-155 belgilik, bosishga undovchi aniq meta tavsif",
  "meta_keywords": "vergul bilan ajratilgan 5-8 ta qidiruv so'zi"
}}"""

    raw_response = await call_gemini(prompt, response_mime_type="application/json")
    if raw_response:
        try:
            parsed = json.loads(raw_response)
            if "meta_title" in parsed and "meta_description" in parsed:
                return parsed
        except Exception:
            pass

    # Fallback SEO
    clean_title = title.strip()
    return {
        "meta_title": f"{clean_title[:55]} | DevBexruz Muhandislik",
        "meta_description": f"{clean_title}. Real keyslar, FastAPI arxitekturasi va professional tizimli yechimlar tahlili.",
        "meta_keywords": f"{tags}, Bexruz Boynazarov, Systems Architect, Dev Q&A, O'zbekiston dasturchilari"
    }
