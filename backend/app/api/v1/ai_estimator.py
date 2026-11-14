from fastapi import APIRouter
from app.schemas import BusinessEstimateRequest, BusinessEstimateResponse
from app.services.estimator_service import analyze_and_estimate

router = APIRouter(prefix="/ai", tags=["AI Business Estimator"])

@router.post("/estimate-solution", response_model=BusinessEstimateResponse)
async def estimate_business_solution(req: BusinessEstimateRequest):
    """
    Biznes egasi yozgan muammoni tahlil qiladi va Bexruzning xizmatlar matritsasi
    asosida texnik arxitektura, muddat, narxlar koridori va kutilayotgan ROI ni hisoblab beradi.
    """
    proposal = analyze_and_estimate(
        problem_description=req.problem_description,
        business_type=req.business_type or ""
    )
    return proposal
