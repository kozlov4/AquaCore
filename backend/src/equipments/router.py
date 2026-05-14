# from typing import List
#
# from starlette import status
#
# from core.models.db_helper import db_helper
#
# from fastapi import APIRouter, Depends
# from sqlalchemy.ext.asyncio import AsyncSession
# from . import service
# from .schemas import EquipmentCreate, EquipmentResponse
#
# equipment_router = APIRouter(
#     prefix="/aquariums/{aquarium_id}/equipment", tags=["Equipment"]
# )
#
#
# @equipment_router.get("/", response_model=List[EquipmentResponse])
# async def list_equipment(
#     aquarium_id: int, session: AsyncSession = Depends(db_helper.session_dependency)
# ):
#     return await service.get_equipment(session, aquarium_id)
#
#
# @equipment_router.post(
#     "/", response_model=EquipmentResponse, status_code=status.HTTP_201_CREATED
# )
# async def add_equipment(
#     aquarium_id: int,
#     data: EquipmentCreate,
#     session: AsyncSession = Depends(db_helper.session_dependency),
# ):
#     return await service.create_equipment(session, aquarium_id, data)
#
#
# @equipment_router.delete("/{equipment_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def remove_equipment(
#     equipment_id: int, session: AsyncSession = Depends(db_helper.session_dependency)
# ):
#     await service.delete_equipment(session, equipment_id)
