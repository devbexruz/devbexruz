from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from datetime import datetime
from typing import List

from app.core.database import get_db
from app.models import Problem
from app.schemas import AISecMetaResult, ProblemResponse
from app.services.seo_service import generate_ai_seo_meta

router = APIRouter(prefix="/admin/seo", tags=["Admin SEO Engine"])

@router.get("/stats")
async def get_seo_stats(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Problem))
    all_problems = result.scalars().all()
    
    total = len(all_problems)
    ai_optimized = sum(1 for p in all_problems if p.meta_generated_by_ai)
    fallback_only = total - ai_optimized
    
    return {
        "total_problems": total,
        "ai_optimized_count": ai_optimized,
        "fallback_count": fallback_only,
        "ai_coverage_percentage": round((ai_optimized / total * 100), 1) if total > 0 else 0
    }

@router.post("/generate-meta/{problem_id}", response_model=AISecMetaResult)
async def generate_single_problem_seo(problem_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Problem).where(Problem.id == problem_id))
    problem = result.scalars().first()
    if not problem:
        raise HTTPException(status_code=404, detail="Muammo topilmadi")

    seo_data = await generate_ai_seo_meta(
        title=problem.title,
        content=problem.content_markdown,
        tags=problem.tags or ""
    )

    problem.meta_title = seo_data["meta_title"]
    problem.meta_description = seo_data["meta_description"]
    problem.meta_keywords = seo_data["meta_keywords"]
    problem.meta_generated_by_ai = True
    problem.meta_generated_at = datetime.utcnow()

    await db.commit()
    await db.refresh(problem)

    return AISecMetaResult(
        problem_id=problem.id,
        slug=problem.slug,
        meta_title=problem.meta_title,
        meta_description=problem.meta_description,
        meta_keywords=problem.meta_keywords,
        search_intent_summary=seo_data.get("search_intent_summary", "Qidiruv niyati tahlil qilindi.")
    )

@router.post("/batch-generate-top-k", response_model=List[AISecMetaResult])
async def batch_generate_top_k(
    limit: int = Query(10, ge=1, le=50, description="Eng mashhur K ta muammoni tanlash"),
    only_unoptimized: bool = Query(False, description="Faqat hali AI generatsiya qilinmaganlarini tanlash"),
    db: AsyncSession = Depends(get_db)
):
    query = select(Problem).order_by(desc(Problem.upvotes_count), desc(Problem.view_count))
    if only_unoptimized:
        query = query.where(Problem.meta_generated_by_ai == False)
    
    query = query.limit(limit)
    result = await db.execute(query)
    problems = result.scalars().all()

    updated_results = []
    for p in problems:
        seo_data = await generate_ai_seo_meta(
            title=p.title,
            content=p.content_markdown,
            tags=p.tags or ""
        )
        p.meta_title = seo_data["meta_title"]
        p.meta_description = seo_data["meta_description"]
        p.meta_keywords = seo_data["meta_keywords"]
        p.meta_generated_by_ai = True
        p.meta_generated_at = datetime.utcnow()
        
        updated_results.append(
            AISecMetaResult(
                problem_id=p.id,
                slug=p.slug,
                meta_title=p.meta_title,
                meta_description=p.meta_description,
                meta_keywords=p.meta_keywords,
                search_intent_summary=seo_data.get("search_intent_summary", "Avtomatik qidiruv tahlili.")
            )
        )
    
    await db.commit()
    return updated_results
