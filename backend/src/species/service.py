from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from core.models import Species


async def get_all_species(
    session: AsyncSession,
    search: Optional[str] = None,
    category: Optional[str] = None,
    water_type: Optional[str] = None,
    character: Optional[str] = None,
    max_volume: Optional[int] = None,
    max_sizes: Optional[list[str]] = None,
    care_levels: Optional[list[str]] = None,
    diets: Optional[list[str]] = None,
):
    query = select(Species).options(selectinload(Species.image))

    if search:
        query = query.where(Species.name.ilike(f"%{search}%"))

    if category and category != "Всі":
        query = query.where(Species.category == category)

    if water_type and water_type != "Будь-яка вода":
        query = query.where(Species.water_type == water_type)

    if character and character != "Всі види":
        query = query.where(Species.character == character)

    if max_volume:
        query = query.where(Species.min_volume <= max_volume)

    if max_sizes:
        query = query.where(Species.max_size.in_(max_sizes))

    if care_levels:
        query = query.where(Species.care_level.in_(care_levels))

    if diets:
        query = query.where(Species.diet.in_(diets))

    result = await session.execute(query)
    return result.scalars().all()


async def get_species_by_id(session: AsyncSession, species_id: int):
    query = (
        select(Species)
        .options(selectinload(Species.image))
        .where(Species.id == species_id)
    )
    result = await session.execute(query)
    return result.scalar_one_or_none()
