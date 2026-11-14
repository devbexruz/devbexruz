from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import desc
from datetime import datetime
from typing import List, Optional

from app.core.database import get_db
from app.models import Report, Problem, Solution, Comment, User
from app.schemas import ReportCreate, ReportReviewRequest, ReportResponse
from app.core.security import get_current_user, get_current_admin_user

router = APIRouter(tags=["Reports & Moderation"])

# --- Public: Submit Report (Instant Soft-Hide) ---
@router.post("/reports", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def submit_report(
    req: ReportCreate,
    current_user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    target_type = req.target_type.lower().strip()
    if target_type not in ["problem", "solution", "comment"]:
        raise HTTPException(status_code=400, detail="Noto'g'ri shikoyat obyekti (problem, solution yoki comment)")

    target_content = None
    target_author = None
    problem_title = None
    parent_content = None

    # Find target and soft-hide it immediately
    if target_type == "problem":
        res = await db.execute(select(Problem).where(Problem.id == req.target_id))
        prob = res.scalars().first()
        if not prob:
            raise HTTPException(status_code=404, detail="Muammo topilmadi")
        prob.is_flagged = True
        prob.is_hidden = True # Instant soft-hide
        target_content = prob.title + "\n\n" + prob.content_markdown
        target_author = prob.author.username if prob.author else "Anonim"
        problem_title = prob.title

    elif target_type == "solution":
        res = await db.execute(select(Solution).options(selectinload(Solution.problem)).where(Solution.id == req.target_id))
        sol = res.scalars().first()
        if not sol:
            raise HTTPException(status_code=404, detail="Yechim topilmadi")
        sol.is_flagged = True
        sol.is_hidden = True # Instant soft-hide
        target_content = sol.content_markdown
        target_author = sol.author_name
        if sol.problem:
            problem_title = sol.problem.title

    elif target_type == "comment":
        res = await db.execute(
            select(Comment)
            .options(
                selectinload(Comment.problem),
                selectinload(Comment.solution),
                selectinload(Comment.parent)
            )
            .where(Comment.id == req.target_id)
        )
        comm = res.scalars().first()
        if not comm:
            raise HTTPException(status_code=404, detail="Izoh topilmadi")
        comm.is_flagged = True
        comm.is_hidden = True # Instant soft-hide
        target_content = comm.content
        target_author = comm.author_name

        if comm.problem:
            problem_title = comm.problem.title
        elif comm.solution and comm.solution.problem:
            problem_title = comm.solution.problem.title

        if comm.parent:
            parent_content = f"{comm.parent.author_name}: {comm.parent.content}"
        elif comm.solution:
            parent_content = f"Yechim ({comm.solution.author_name}): {comm.solution.content_markdown[:200]}..."

    reporter_id = current_user.id if current_user else None
    reporter_name = current_user.full_name or current_user.username if current_user else (req.reporter_name or "Foydalanuvchi")

    new_report = Report(
        reporter_id=reporter_id,
        reporter_name=reporter_name,
        target_type=target_type,
        target_id=req.target_id,
        reason=req.reason,
        details=req.details,
        status="pending"
    )

    db.add(new_report)
    await db.commit()
    await db.refresh(new_report)

    resp = ReportResponse.model_validate(new_report)
    resp.target_content = target_content
    resp.target_author = target_author
    resp.problem_title = problem_title
    resp.parent_content = parent_content
    return resp

# --- Admin: Moderation Endpoints ---
@router.get("/admin/reports", response_model=List[ReportResponse])
async def list_reports_admin(
    status_filter: Optional[str] = Query(None, description="pending, restored, deleted"),
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Report).order_by(desc(Report.created_at))
    if status_filter and status_filter != "all":
        query = query.where(Report.status == status_filter)

    res = await db.execute(query)
    reports = res.scalars().all()

    enriched_reports: List[ReportResponse] = []
    for r in reports:
        item = ReportResponse.model_validate(r)

        # Populate context tree
        if r.target_type == "problem":
            p_res = await db.execute(select(Problem).where(Problem.id == r.target_id))
            prob = p_res.scalars().first()
            if prob:
                item.target_content = f"{prob.title}\n\n{prob.content_markdown}"
                item.target_author = prob.author.username if prob.author else "Anonim"
                item.problem_title = prob.title

        elif r.target_type == "solution":
            s_res = await db.execute(select(Solution).options(selectinload(Solution.problem)).where(Solution.id == r.target_id))
            sol = s_res.scalars().first()
            if sol:
                item.target_content = sol.content_markdown
                item.target_author = sol.author_name
                if sol.problem:
                    item.problem_title = sol.problem.title

        elif r.target_type == "comment":
            c_res = await db.execute(
                select(Comment)
                .options(selectinload(Comment.problem), selectinload(Comment.solution), selectinload(Comment.parent))
                .where(Comment.id == r.target_id)
            )
            comm = c_res.scalars().first()
            if comm:
                item.target_content = comm.content
                item.target_author = comm.author_name
                if comm.problem:
                    item.problem_title = comm.problem.title
                elif comm.solution and comm.solution.problem:
                    item.problem_title = comm.solution.problem.title

                if comm.parent:
                    item.parent_content = f"{comm.parent.author_name}: {comm.parent.content}"
                elif comm.solution:
                    item.parent_content = f"Yechim ({comm.solution.author_name}): {comm.solution.content_markdown[:200]}..."

        enriched_reports.append(item)

    return enriched_reports

@router.post("/admin/reports/{report_id}/review", response_model=ReportResponse)
async def review_report_admin(
    report_id: str,
    action_in: ReportReviewRequest,
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Report).where(Report.id == report_id))
    report = res.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Shikoyat topilmadi")

    action = action_in.action.lower().strip()
    if action not in ["restore", "delete"]:
        raise HTTPException(status_code=400, detail="Noto'g'ri amal ('restore' yoki 'delete')")

    target_type = report.target_type
    target_id = report.target_id

    if action == "restore":
        # Un-hide the content
        if target_type == "problem":
            prob_res = await db.execute(select(Problem).where(Problem.id == target_id))
            prob = prob_res.scalars().first()
            if prob:
                prob.is_hidden = False
                prob.is_flagged = False
        elif target_type == "solution":
            sol_res = await db.execute(select(Solution).where(Solution.id == target_id))
            sol = sol_res.scalars().first()
            if sol:
                sol.is_hidden = False
                sol.is_flagged = False
        elif target_type == "comment":
            com_res = await db.execute(select(Comment).where(Comment.id == target_id))
            comm = com_res.scalars().first()
            if comm:
                comm.is_hidden = False
                comm.is_flagged = False

        report.status = "restored"

    elif action == "delete":
        # Permanently delete the target content
        if target_type == "problem":
            prob_res = await db.execute(select(Problem).where(Problem.id == target_id))
            prob = prob_res.scalars().first()
            if prob:
                await db.delete(prob)
        elif target_type == "solution":
            sol_res = await db.execute(select(Solution).where(Solution.id == target_id))
            sol = sol_res.scalars().first()
            if sol:
                await db.delete(sol)
        elif target_type == "comment":
            com_res = await db.execute(select(Comment).where(Comment.id == target_id))
            comm = com_res.scalars().first()
            if comm:
                await db.delete(comm)

        report.status = "deleted"

    report.reviewed_by = current_admin.full_name or current_admin.username
    report.reviewed_at = datetime.utcnow()

    await db.commit()
    await db.refresh(report)
    return ReportResponse.model_validate(report)
