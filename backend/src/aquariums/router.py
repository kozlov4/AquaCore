from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from core.models.db_helper import db_helper
from users import get_current_user
from . import service
from .schemas import (
    CreateAquarium,
    AquariumNameResponse,
    PopulationResponse,
    CheckCompatibilityResponse,
    InhabitantCreate,
    AquariumCardResponse,
    UpdateAquarium,
)

router = APIRouter(prefix="/aquariums", tags=["Aquariums"])


@router.get("/my-aquariums", response_model=list[AquariumCardResponse])
async def list_aquariums(
    session: AsyncSession = Depends(db_helper.session_dependency),
    user_id: int = Depends(get_current_user),
):
    return await service.get_user_aquariums_cards(session=session, user_id=user_id)


@router.get("/names", response_model=List[AquariumNameResponse])
async def get_aquarium_names_route(
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_aquarium_names(
        session=session,
        user_id=user_id,
    )


@router.post(
    "",
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


@router.put("/{aquarium_id}")
async def update_aquarium(
    aquarium_id: int,
    aquarium_in: UpdateAquarium,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.update_aquarium(
        session, aquarium_id, user_id=user_id, aquarium_in=aquarium_in
    )


@router.delete("/{aquarium_id}")
async def delete_aquarium(
    aquarium_id: int,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.delete_aquarium(session, aquarium_id, user_id=user_id)
