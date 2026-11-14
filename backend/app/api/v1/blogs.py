from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from datetime import datetime
import re
from typing import List, Optional

from app.core.database import get_db
from app.models import BlogPost, User
from app.schemas import BlogPostCreate, BlogPostUpdate, BlogPostResponse
from app.core.security import get_current_admin_user

router = APIRouter(tags=["Blogs & Career News"])

def generate_slug(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    text = re.sub(r"^-+|-+$", "", text)
    return text or "post"

# --- Public Endpoints ---

@router.get("/blogs", response_model=List[BlogPostResponse])
async def list_published_blogs(
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(BlogPost).where(BlogPost.is_published == True).order_by(desc(BlogPost.created_at))
    if category and category != "Barchasi":
        query = query.where(BlogPost.category.ilike(f"%{category}%"))
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/blogs/{slug}", response_model=BlogPostResponse)
async def get_blog_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BlogPost).where(BlogPost.slug == slug))
    post = result.scalars().first()
    if not post:
        raise HTTPException(status_code=404, detail="Maqola topilmadi")
    return post

# --- Admin Protected Endpoints ---

@router.get("/admin/blogs/all", response_model=List[BlogPostResponse])
async def list_all_blogs_admin(
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(BlogPost).order_by(desc(BlogPost.created_at)))
    return result.scalars().all()

@router.post("/admin/blogs", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
async def create_blog_post(
    post_in: BlogPostCreate,
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    slug = post_in.slug or generate_slug(post_in.title)
    
    # Ensure slug uniqueness
    res = await db.execute(select(BlogPost).where(BlogPost.slug == slug))
    if res.scalars().first():
        slug = f"{slug}-{int(datetime.utcnow().timestamp())}"

    new_post = BlogPost(
        title=post_in.title,
        slug=slug,
        category=post_in.category or "Career",
        summary=post_in.summary,
        content_markdown=post_in.content_markdown,
        tags=post_in.tags or "",
        image_url=post_in.image_url,
        read_time=post_in.read_time or "4 min",
        is_published=post_in.is_published,
        author_name=post_in.author_name or current_admin.full_name or "Bexruz Boynazarov"
    )
    db.add(new_post)
    await db.commit()
    await db.refresh(new_post)
    return new_post

@router.put("/admin/blogs/{post_id}", response_model=BlogPostResponse)
async def update_blog_post(
    post_id: str,
    post_in: BlogPostUpdate,
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(BlogPost).where(BlogPost.id == post_id))
    post = res.scalars().first()
    if not post:
        raise HTTPException(status_code=404, detail="Maqola topilmadi")

    update_data = post_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(post, field, val)

    await db.commit()
    await db.refresh(post)
    return post

@router.delete("/admin/blogs/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog_post(
    post_id: str,
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(BlogPost).where(BlogPost.id == post_id))
    post = res.scalars().first()
    if not post:
        raise HTTPException(status_code=404, detail="Maqola topilmadi")

    await db.delete(post)
    await db.commit()
    return None
