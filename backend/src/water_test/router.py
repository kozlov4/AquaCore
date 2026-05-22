from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from core.models.db_helper import db_helper
from users import get_current_user
from . import service
from .schemas import WaterMetric, AnalyticsPeriod, CreateWaterTest

router = APIRouter(prefix="/tests", tags=["Tests"])


@router.get("/analytics")
async def get_water_analytics_route(
    aquarium_id: int,
    metric: WaterMetric,
    period: AnalyticsPeriod,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_water_analytics(
        session=session,
        aquarium_id=aquarium_id,
        user_id=user_id,
        metric=metric,
        period=period,
    )


@router.get("/export/csv")
async def export_water_tests_csv(
    aquarium_id: int,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.export_water_tests_csv(
        aquarium_id=aquarium_id, user_id=user_id, session=session
    )


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
async def create_water_test_route(
    water_test_in: CreateWaterTest,
    aquarium_id: int,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.create_water_test(
        session=session,
        user_id=user_id,
        aquarium_id=aquarium_id,
        water_test_in=water_test_in,
    )
