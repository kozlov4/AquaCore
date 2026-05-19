from typing import List
from starlette import status
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from core.models.db_helper import db_helper
from . import service
from .schemas import (
    EquipmentCreate,
    EquipmentUpdate,
    EquipmentResponse,
    EquipmentLogCreate,
    EquipmentLogResponse,
    EquipmentAlertResponse,
)

equipment_router = APIRouter(
    prefix="/aquariums/{aquarium_id}/equipment", tags=["Equipment"]
)


@equipment_router.get("/", response_model=List[EquipmentResponse])
async def list_equipment(
    aquarium_id: int,
    session: AsyncSession = Depends(db_helper.session_dependency),
    equipment_category: Optional[str] = None,
):
    return await service.get_equipment(
        session, aquarium_id, equipment_category=equipment_category
    )


@equipment_router.post(
    "/", response_model=EquipmentResponse, status_code=status.HTTP_201_CREATED
)
async def add_equipment(
    aquarium_id: int,
    data: EquipmentCreate,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.create_equipment(session, aquarium_id, data)


@equipment_router.delete("/{equipment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_equipment(
    equipment_id: int, session: AsyncSession = Depends(db_helper.session_dependency)
):
    await service.delete_equipment(session, equipment_id)


@equipment_router.patch("/{equipment_id}", response_model=EquipmentResponse)
async def edit_equipment(
    equipment_id: int,
    data: EquipmentUpdate,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    """Редагувати обладнання"""
    return await service.update_equipment(session, equipment_id, data)


@equipment_router.post(
    "/{equipment_id}/logs",
    response_model=EquipmentLogResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_equipment_log(
    equipment_id: int,
    data: EquipmentLogCreate,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    """Зафіксувати проблему або ручне обслуговування"""
    return await service.create_equipment_log(session, equipment_id, data)


@equipment_router.post("/{equipment_id}/service")
async def quick_service_equipment(
    equipment_id: int, session: AsyncSession = Depends(db_helper.session_dependency)
):
    """Швидке обслуговування (натискання кнопки 'Обслужити')"""
    return await service.service_equipment(session, equipment_id)


@equipment_router.get("/alerts/status", response_model=EquipmentAlertResponse)
async def check_equipment_alerts(
    aquarium_id: int, session: AsyncSession = Depends(db_helper.session_dependency)
):
    """Ручка для жовтої плашки 'Потребує уваги' на головній сторінці"""
    return await service.get_equipment_alerts(session, aquarium_id)
