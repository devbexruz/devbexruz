from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import desc, func
from typing import List, Optional
import uuid
import re

from app.core.database import get_db
from app.models import Problem, Solution, User, LeadInquiry
from app.schemas import (
    ProblemCreate, ProblemResponse, SolutionCreate, SolutionResponse,
    ProblemAIPolishRequest, ProblemAIPolishResponse
)
from app.services.seo_service import generate_fallback_seo
from app.services.gemini_service import polish_problem_with_gemini, generate_gemini_seo
from app.services.telegram_bot_service import send_telegram_alert

router = APIRouter(prefix="/problems", tags=["Developer Problems (Dev Q&A)"])

def create_slug(title: str) -> str:
    # Uzbek transliteration & slugify
    translit_map = {
        'sh': 'sh', 'ch': 'ch', "o'": 'o', "g'": 'g',
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'ў': 'o', 'қ': 'q', 'ғ': 'g', 'ҳ': 'h'
    }
    s = title.lower()
    for k, v in translit_map.items():
        s = s.replace(k, v)
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'[\s-]+', '-', s).strip('-')
    if not s:
        s = "muammo"
    random_suffix = str(uuid.uuid4())[:6]
    return f"{s[:60]}-{random_suffix}"

def enrich_seo_fields(problem: Problem) -> ProblemResponse:
    resp = ProblemResponse.model_validate(problem)
    if problem.meta_generated_by_ai and problem.meta_title:
        resp.effective_meta_title = problem.meta_title
        resp.effective_meta_description = problem.meta_description
    else:
        fallback = generate_fallback_seo(problem.title, problem.content_markdown, problem.tags or "")
        resp.effective_meta_title = fallback["meta_title"]
        resp.effective_meta_description = fallback["meta_description"]
    return resp

@router.get("", response_model=List[ProblemResponse])
async def list_problems(
    tag: Optional[str] = None,
    q: Optional[str] = None,
    sort_by: str = Query("latest", description="latest, popular, or unsolved"),
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    query = select(Problem).options(
        selectinload(Problem.solutions),
        selectinload(Problem.author)
    )

    if tag:
        query = query.where(Problem.tags.ilike(f"%{tag}%"))
    if q:
        query = query.where((Problem.title.ilike(f"%{q}%")) | (Problem.content_markdown.ilike(f"%{q}%")))
    if sort_by == "unsolved":
        query = query.where(Problem.status == "open")
    elif sort_by == "popular":
        query = query.order_by(desc(Problem.upvotes_count), desc(Problem.view_count))
    else:
        query = query.order_by(desc(Problem.created_at))

    query = query.limit(limit).offset(offset)
    result = await db.execute(query)
    problems = result.scalars().all()

    return [enrich_seo_fields(p) for p in problems]

@router.post("/ai-polish", response_model=ProblemAIPolishResponse)
async def ai_polish_problem(req: ProblemAIPolishRequest, db: AsyncSession = Depends(get_db)):
    """
    Foydalanuvchi oddiy so'zlar bilan yozgan muammoni Gemini AI orqali tahlil qilib,
    professional IT arxitektura maqolasiga aylantiradi va bazaga saqlaydi.
    """
    author = req.author_name.strip() if req.author_name else "Mehmon"
    raw = req.raw_problem.strip()
    if not raw or len(raw) < 5:
        raise HTTPException(status_code=400, detail="Muammo tavsifi juda qisqa")

    # 1. Polish with Gemini 2.5 Flash
    polished = await polish_problem_with_gemini(raw, author)

    # 2. Generate SEO
    seo = await generate_gemini_seo(polished["title"], polished["content_markdown"], polished["tags"])

    saved_id = None
    saved_slug = None

    if req.publish_immediately:
        slug = create_slug(polished["title"])
        new_problem = Problem(
            title=polished["title"],
            slug=slug,
            content_markdown=polished["content_markdown"],
            tags=polished.get("tags", ""),
            meta_title=seo.get("meta_title"),
            meta_description=seo.get("meta_description"),
            meta_keywords=seo.get("meta_keywords"),
            meta_generated_by_ai=True
        )
        db.add(new_problem)

        # Also register lead inquiry if contact is provided
        if req.contact and req.contact.strip():
            inquiry = LeadInquiry(
                client_name=author,
                client_contact=req.contact.strip(),
                business_type=polished.get("category", "Muammo"),
                problem_description=f"AI Polished Problem: {polished['title']}\nOriginal: {raw}",
                estimated_solution_json=polished.get("recommended_architecture", "")
            )
            db.add(inquiry)
            try:
                await send_telegram_alert(
                    f"🔥 <b>Yangi Muammo / Lead!</b>\n\n"
                    f"👤 <b>Muallif:</b> {author}\n"
                    f"📞 <b>Aloqa:</b> {req.contact}\n"
                    f"📌 <b>Sarlavha:</b> {polished['title']}\n"
                    f"🔗 <b>Slug:</b> {slug}"
                )
            except Exception:
                pass

        await db.commit()
        await db.refresh(new_problem)
        saved_id = new_problem.id
        saved_slug = new_problem.slug

    return ProblemAIPolishResponse(
        id=saved_id,
        slug=saved_slug,
        title=polished["title"],
        category=polished.get("category"),
        problem_summary=polished.get("problem_summary"),
        root_cause=polished.get("root_cause"),
        recommended_architecture=polished.get("recommended_architecture"),
        tech_stack=polished.get("tech_stack"),
        tags=polished.get("tags", ""),
        content_markdown=polished["content_markdown"],
        author_name=author,
        is_saved=bool(saved_id)
    )

@router.get("/{slug_or_id}", response_model=ProblemResponse)
async def get_problem(slug_or_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Problem).options(
            selectinload(Problem.solutions),
            selectinload(Problem.author)
        ).where((Problem.slug == slug_or_id) | (Problem.id == slug_or_id))
    )
    problem = result.scalars().first()
    if not problem:
        raise HTTPException(status_code=404, detail="Muammo topilmadi")
    
    # Increment view count
    problem.view_count += 1
    await db.commit()
    await db.refresh(problem)

    return enrich_seo_fields(problem)

@router.post("", response_model=ProblemResponse, status_code=status.HTTP_201_CREATED)
async def create_problem(problem_in: ProblemCreate, db: AsyncSession = Depends(get_db)):
    slug = create_slug(problem_in.title)
    
    # Generate automatic fallback SEO initially
    fallback_seo = generate_fallback_seo(problem_in.title, problem_in.content_markdown, problem_in.tags or "")

    new_problem = Problem(
        title=problem_in.title,
        slug=slug,
        content_markdown=problem_in.content_markdown,
        tags=problem_in.tags or "",
        meta_title=fallback_seo["meta_title"],
        meta_description=fallback_seo["meta_description"],
        meta_keywords=fallback_seo["meta_keywords"],
        meta_generated_by_ai=False
    )
    db.add(new_problem)
    await db.commit()
    await db.refresh(new_problem)

    # Load with relations
    result = await db.execute(
        select(Problem).options(
            selectinload(Problem.solutions),
            selectinload(Problem.author)
        ).where(Problem.id == new_problem.id)
    )
    saved = result.scalars().first()
    return enrich_seo_fields(saved)

@router.post("/{problem_id}/solutions", response_model=SolutionResponse)
async def add_solution(problem_id: str, sol_in: SolutionCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Problem).where(Problem.id == problem_id))
    problem = result.scalars().first()
    if not problem:
        raise HTTPException(status_code=404, detail="Muammo topilmadi")

    solution = Solution(
        problem_id=problem_id,
        author_name=sol_in.author_name or "Anonim Dasturchi",
        content_markdown=sol_in.content_markdown
    )
    db.add(solution)
    await db.commit()
    await db.refresh(solution)
    return SolutionResponse.model_validate(solution)

@router.post("/{problem_id}/upvote")
async def upvote_problem(problem_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Problem).where(Problem.id == problem_id))
    problem = result.scalars().first()
    if not problem:
        raise HTTPException(status_code=404, detail="Muammo topilmadi")
    problem.upvotes_count += 1
    await db.commit()
    return {"id": problem.id, "upvotes_count": problem.upvotes_count}

@router.post("/solutions/{solution_id}/upvote")
async def upvote_solution(solution_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Solution).where(Solution.id == solution_id))
    solution = result.scalars().first()
    if not solution:
        raise HTTPException(status_code=404, detail="Yechim topilmadi")
    solution.upvotes_count += 1
    await db.commit()
    return {"id": solution.id, "upvotes_count": solution.upvotes_count}

@router.post("/solutions/{solution_id}/accept")
async def accept_solution(solution_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Solution).where(Solution.id == solution_id))
    solution = result.scalars().first()
    if not solution:
        raise HTTPException(status_code=404, detail="Yechim topilmadi")
    
    # Mark this solution accepted and close the problem
    solution.is_accepted = True
    result_prob = await db.execute(select(Problem).where(Problem.id == solution.problem_id))
    problem = result_prob.scalars().first()
    if problem:
        problem.status = "solved"
    await db.commit()
    return {"id": solution.id, "is_accepted": True, "problem_status": "solved"}
