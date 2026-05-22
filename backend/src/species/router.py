from typing import Optional

from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from core.models.db_helper import db_helper
from users.dependencies import get_current_user
from . import service
from .schemas import SpeciesDetailResponse, SpeciesShortResponse

router = APIRouter(
    prefix="/species",
    tags=["Species"],
    dependencies=[Depends(get_current_user)],
)


@router.get("", response_model=list[SpeciesShortResponse])
async def list_species(
    search: Optional[str] = Query(None, description="Пошук за назвою"),
    category: Optional[str] = Query(None),
    water_type: Optional[str] = Query(None),
    character: Optional[str] = Query(None),
    max_volume: Optional[int] = Query(None, alias="maxVolume"),
    max_sizes: Optional[list[str]] = Query(None, alias="maxSizes"),
    care_levels: Optional[list[str]] = Query(None, alias="careLevels"),
    diets: Optional[list[str]] = Query(None, alias="diets"),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_all_species(
        session=session,
        search=search,
        category=category,
        water_type=water_type,
        character=character,
        max_volume=max_volume,
        max_sizes=max_sizes,
        care_levels=care_levels,
        diets=diets,
    )


@router.get("/{species_id}", response_model=SpeciesDetailResponse)
async def get_species_detail(
    species_id: int,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    species = await service.get_species_by_id(session, species_id)
    if not species:
        raise HTTPException(status_code=404, detail="Вид не знайдено")
    return species
