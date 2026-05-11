from typing import List

from fastapi import APIRouter, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from models import Aquarium
from .schemas import CreateAquarium, AquariumNameResponse
from core.models.db_helper import db_helper
from . import service
from users import get_current_user

router = APIRouter(prefix="/aquariums", tags=["Aquariums"])


@router.get("/", response_model=List[AquariumNameResponse])
async def get_aquariums_route(
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_aquariums(
        session=session,
        user_id=user_id,
    )


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
)
async def create_aquarium_route(
    aquarium_in: CreateAquarium,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.create_aquarium(
        session=session,
        user_id=user_id,
        aquarium_in=aquarium_in,
    )
