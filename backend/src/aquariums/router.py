from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from models import Aquarium
from .schemas import (
    CreateAquarium,
    AquariumNameResponse,
    PopulationResponse,
    CheckCompatibilityResponse,
    InhabitantCreate,
)
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


@router.get("/{aquarium_id}/population", response_model=PopulationResponse)
async def get_population(
    aquarium_id: int,
    session: AsyncSession = Depends(db_helper.session_dependency),
    user_id: int = Depends(get_current_user),
):
    """Виводить вкладку 'Населення' з підрахунком кількості та списком жителів"""
    return await service.get_aquarium_population(session, aquarium_id, user_id=user_id)


@router.get(
    "/{aquarium_id}/check-compatibility/{species_id}",
    response_model=CheckCompatibilityResponse,
)
async def check_compatibility_before_add(
    aquarium_id: int,
    species_id: int,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    """Фронтенд викликає це, коли юзер обрав рибку в модалці, щоб показати попередження"""
    return await service.check_new_inhabitant(
        session, aquarium_id, species_id, user_id=user_id
    )


@router.post("/{aquarium_id}/inhabitants")
async def add_inhabitant_to_aquarium(
    aquarium_id: int,
    data: InhabitantCreate,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    """Фронтенд викликає це, коли юзер натиснув 'Заселити' (можливо поставивши галочку ризику)"""
    return await service.add_inhabitant(session, aquarium_id, data, user_id=user_id)
