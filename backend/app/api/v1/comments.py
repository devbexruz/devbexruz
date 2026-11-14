from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import desc
from typing import List, Optional

from app.core.database import get_db
from app.models import Comment, Problem, Solution, User
from app.schemas import CommentCreate, CommentResponse
from app.core.security import get_current_user

router = APIRouter(prefix="/comments", tags=["Paragraph & Solution Comments"])

@router.get("", response_model=List[CommentResponse])
async def list_comments(
    problem_id: Optional[str] = None,
    solution_id: Optional[str] = None,
    paragraph_index: Optional[int] = None,
    include_hidden: bool = False,
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Comment)
        .options(selectinload(Comment.replies))
        .where(Comment.parent_id == None) # Only top-level comments; replies are nested
        .order_by(Comment.created_at.asc())
    )

    if not include_hidden:
        query = query.where(Comment.is_hidden == False)

    if problem_id:
        query = query.where(Comment.problem_id == problem_id)
    if solution_id:
        query = query.where(Comment.solution_id == solution_id)
    if paragraph_index is not None:
        query = query.where(Comment.paragraph_index == paragraph_index)

    result = await db.execute(query)
    return result.scalars().all()

@router.post("", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    req: CommentCreate,
    current_user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not req.content or not req.content.strip():
        raise HTTPException(status_code=400, detail="Izoh matni bo'sh bo'lishi mumkin emas")

    if not req.problem_id and not req.solution_id and not req.parent_id:
        raise HTTPException(status_code=400, detail="Izoh muammo yoki yechimga biriktirilishi shart")

    # If replying to a comment, inherit problem_id / solution_id
    problem_id = req.problem_id
    solution_id = req.solution_id
    if req.parent_id:
        parent_res = await db.execute(select(Comment).where(Comment.id == req.parent_id))
        parent = parent_res.scalars().first()
        if not parent:
            raise HTTPException(status_code=404, detail="Asosiy izoh topilmadi")
        if not problem_id:
            problem_id = parent.problem_id
        if not solution_id:
            solution_id = parent.solution_id

    author_name = req.author_name.strip() if req.author_name else "Dasturchi"
    author_id = None
    if current_user:
        author_id = current_user.id
        author_name = current_user.full_name or current_user.username

    new_comment = Comment(
        problem_id=problem_id,
        solution_id=solution_id,
        parent_id=req.parent_id,
        paragraph_index=req.paragraph_index,
        author_id=author_id,
        author_name=author_name,
        content=req.content.strip(),
        is_flagged=False,
        is_hidden=False
    )

    db.add(new_comment)
    await db.commit()

    # Re-query with replies loaded
    result = await db.execute(
        select(Comment)
        .options(selectinload(Comment.replies))
        .where(Comment.id == new_comment.id)
    )
    return result.scalars().first()
