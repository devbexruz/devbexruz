from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.core.database import get_db
from app.models import ServiceItem
from app.schemas import ServiceItemResponse
from app.services.estimator_service import DEFAULT_CATALOG

router = APIRouter(prefix="/services", tags=["Services & Pricing"])

@router.get("", response_model=List[ServiceItemResponse])
async def get_services(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ServiceItem).where(ServiceItem.is_active == True).order_by(ServiceItem.order_index))
    items = result.scalars().all()
    if not items:
        # Fallback to default catalog if database is not yet seeded
        return [
            ServiceItemResponse(
                id=f"default-{i}",
                key=item["key"],
                name=item["name"],
                category=item["category"],
                description=item["description"],
                duration_estimate=item["duration_estimate"],
                price_min=item["price_min"],
                price_max=item["price_max"],
                is_active=True,
                order_index=i
            )
            for i, item in enumerate(DEFAULT_CATALOG)
        ]
    return items
