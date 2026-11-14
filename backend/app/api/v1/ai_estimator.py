from fastapi import APIRouter
import json
import logging
from app.schemas import BusinessEstimateRequest, BusinessEstimateResponse
from app.services.estimator_service import analyze_and_estimate
from app.services.gemini_service import call_gemini

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["AI Business Estimator"])

@router.post("/estimate-solution", response_model=BusinessEstimateResponse)
async def estimate_business_solution(req: BusinessEstimateRequest):
    """
    Biznes egasi yozgan muammoni tahlil qiladi va Bexruzning xizmatlar matritsasi
    hamda Gemini 2.5 Flash arxitektura tahlili asosida texnik arxitektura, muddat,
    narxlar koridori va kutilayotgan ROI ni hisoblab beradi.
    """
    proposal = analyze_and_estimate(
        problem_description=req.problem_description,
        business_type=req.business_type or ""
    )

    # Enhance with Gemini 2.5 Flash if available
    try:
        gemini_prompt = f"""Siz tajribali Systems Architect va IT Maslahatchisiz.
Biznes egasi quyidagi ehtiyoj/muammoni bildirdi:
\"{req.problem_description}\"
Biznes turi: \"{req.business_type or 'Savdo / Xizmat koʻrsatish'}\"

Tavsiya etilayotgan xizmatlar: {[s.name for s in proposal.selected_services]}

Iltimos, ushbu biznes uchun chuqur tahlil va aniq hisoblangan kutilayotgan ROI (daromad/vaqt samaradorligi) beruvchi JSON qaytaring:
{{
  "problem_diagnosis": "Biznesdagi real muammo mohiyati, qayerda vaqt yoki pul yo'qotilayotgani haqida professional xulosa (2-3 jumla, O'zbek tilida)",
  "business_roi": "Ushbu yechim tatbiq etilgandan keyingi aniq foizlar va foyda ko'rsatkichlari (masalan: buyurtmalarni qayta ishlash 3 barobar tezlashadi, xatoliklar 0 ga tushadi, har oyda o'rtacha 40+ soat xodim vaqti tejaladi)",
  "recommended_architecture": "Tavsiya etiladigan mikro-servis va asinxron backend arxitekturasi qisqa ta'rifi"
}}"""
        raw_ai = await call_gemini(gemini_prompt, response_mime_type="application/json", max_tokens=1000)
        if raw_ai:
            parsed = json.loads(raw_ai)
            if parsed.get("problem_diagnosis"):
                proposal.problem_diagnosis = parsed["problem_diagnosis"]
            if parsed.get("business_roi"):
                proposal.business_roi = parsed["business_roi"]
            if parsed.get("recommended_architecture"):
                proposal.recommended_architecture = parsed["recommended_architecture"]
    except Exception as e:
        logger.warning(f"Gemini estimate enrichment fallback to heuristic: {e}")

    return proposal

