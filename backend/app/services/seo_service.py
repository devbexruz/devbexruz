import re
from typing import Dict, List, Optional
import httpx
from app.core.config import settings

def strip_markdown(text: str) -> str:
    # Remove code blocks
    text = re.sub(r'```.*?```', '', text, flags=re.DOTALL)
    # Remove inline code
    text = re.sub(r'`(.*?)`', r'\1', text)
    # Remove markdown links [text](url)
    text = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', text)
    # Remove headings (#, ##, etc.)
    text = re.sub(r'#+\s*', '', text)
    # Remove bold/italic (*, _)
    text = re.sub(r'[*_~]', '', text)
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def generate_fallback_seo(title: str, content: str, tags: str = "") -> Dict[str, str]:
    clean_content = strip_markdown(content)
    # 300-500 chars fallback description
    if len(clean_content) > 350:
        fallback_desc = clean_content[:350].rsplit(' ', 1)[0] + "..."
    else:
        fallback_desc = clean_content

    fallback_title = f"{title} | DevBexruz Dasturchilar Hamjamiyati"
    
    tag_list = [t.strip() for t in tags.split(",") if t.strip()]
    keywords = ", ".join(tag_list + ["dasturlash muammosi", "backend xatolik", "yechim", "Python", "FastAPI"])

    return {
        "meta_title": fallback_title,
        "meta_description": fallback_desc,
        "meta_keywords": keywords,
        "search_intent_summary": "Standart avtomatik shakllantirilgan SEO tavsifi."
    }

async def generate_ai_seo_meta(title: str, content: str, tags: str = "") -> Dict[str, str]:
    clean_content = strip_markdown(content)
    
    # If OpenAI API key is configured, call OpenAI
    if settings.OPENAI_API_KEY:
        try:
            prompt = f"""Siz Google va Yandex qidiruv tizimlari bo'yicha etakchi SEO mutaxassisisiz.
Quyidagi dasturchi muammosini tahlil qilib, odamlar qidiruv tizimlarida (Google, Yandex) aynan qanday so'rov berishini (Search Intent) hisobga olgan holda SEO meta teglarini JSON formatida yarating:

Muammo sarlavhasi: {title}
Teglar: {tags}
Muammo matni: {clean_content[:1000]}

Talablar:
1. meta_title: 50-60 belgi, jozibador va aniq kalit so'zlar bilan (masalan: "FastAPI 500 Error: Async DB Connection Pool qanday tuzatiladi?")
2. meta_description: 140-160 belgi, qidiruv natijasida (snippet) bosish ehtimolini (CTR) oshiruvchi aniq tushuntirish va yechim ishorasi
3. meta_keywords: 6-10 ta aniq vergul bilan ajratilgan kalit so'zlar
4. search_intent_summary: Qidiruvchilarning niyati nima ekanligi (1 gap)

Faqat valid JSON qaytaring:
{{"meta_title": "...", "meta_description": "...", "meta_keywords": "...", "search_intent_summary": "..."}}"""

            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                    json={
                        "model": "gpt-4o-mini",
                        "messages": [{"role": "user", "content": prompt}],
                        "response_format": {"type": "json_object"}
                    }
                )
                if resp.status_code == 200:
                    import json
                    data = resp.json()
                    content_str = data["choices"][0]["message"]["content"]
                    return json.loads(content_str)
        except Exception as e:
            print(f"OpenAI call failed, using heuristic AI SEO: {e}")

    # High-quality Search-Intent Heuristic SEO Generator (No API key needed!)
    # Detect core issue patterns
    main_subject = title.strip()
    # Normalize common tech terms
    tech_keywords = []
    for tech in ["FastAPI", "Django", "PostgreSQL", "Docker", "Python", "SQLAlchemy", "Async", "Celery", "Redis", "Next.js", "React", "JWT", "OAuth", "API"]:
        if tech.lower() in (title + " " + tags + " " + clean_content).lower():
            tech_keywords.append(tech)
    
    tech_str = " ".join(tech_keywords[:3]) if tech_keywords else "Backend"

    # Search Intent optimized title (Google/Yandex CTR focused)
    if "error" in main_subject.lower() or "xato" in main_subject.lower() or "fail" in main_subject.lower():
        seo_title = f"{main_subject} — Sababi va To'liq Yechimi ({tech_str})"
    elif "how" in main_subject.lower() or "qanday" in main_subject.lower() or "optim" in main_subject.lower():
        seo_title = f"{main_subject} | To'g'ri Arxitektura va Qo'llanma"
    else:
        seo_title = f"{main_subject} — Muammo Tahlili va Professional Yechim"

    if len(seo_title) > 65:
        seo_title = seo_title[:62] + "..."

    # High-CTR Meta Description
    snippet = clean_content[:130].strip()
    seo_desc = f"{snippet} Ushbu muammoning kelib chiqish sabablari, kod tahlili va amaliy yechimini ko'ring."
    if len(seo_desc) > 160:
        seo_desc = seo_desc[:157] + "..."

    keywords = ", ".join(list(set(tech_keywords + [t.strip() for t in tags.split(",") if t.strip()] + ["xatolik yechimi", "dasturchilar forumi", "clean architecture"])))

    return {
        "meta_title": seo_title,
        "meta_description": seo_desc,
        "meta_keywords": keywords,
        "search_intent_summary": f"Dasturchi {tech_str} muhitidagi muammoga tez va professional yechim qidirmoqda."
    }
