from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.models.db_helper import db_helper
from users import get_current_user
from . import service
from .schemas import (
    WaterChangeCreate,
    WaterChangeResponse,
    WaterChangeScheduleUpdate,
    WaterChangeStatusResponse,
)

router = APIRouter(prefix="/water-changes", tags=["Water Changes"])


@router.get("/{aquarium_id}", response_model=WaterChangeStatusResponse)
async def get_water_change_dashboard(
    aquarium_id: int,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    """Віддає всі дані для сторінки 'Графік підмін' (статус циклу + історія)"""
    return await service.get_water_change_status(session, aquarium_id, user_id)


@router.post(
    "/{aquarium_id}",
    response_model=WaterChangeResponse,
    status_code=status.HTTP_201_CREATED,
)
async def record_water_change_action(
    aquarium_id: int,
    data: WaterChangeCreate,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    """Фіксує нову підміну води (Планову або Екстрену)"""
    return await service.record_water_change(session, aquarium_id, user_id, data)


@router.patch("/{aquarium_id}/schedule")
async def update_schedule(
    aquarium_id: int,
    data: WaterChangeScheduleUpdate,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    """Оновлює налаштування: як часто і скільки води міняти"""
    return await service.update_water_change_schedule(
        session, aquarium_id, user_id, data
    )
