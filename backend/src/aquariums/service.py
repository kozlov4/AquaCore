from fastapi import HTTPException, status
from sqlalchemy import select, or_, Result, func
from sqlalchemy.ext.asyncio import AsyncSession
from core.models import Aquarium
from sqlalchemy.orm import joinedload, selectinload
from .schemas import CreateAquarium


async def create_aquarium(
    session: AsyncSession,
    user_id: int,
    aquarium_in: CreateAquarium,
):
    normalized_name = aquarium_in.name.lower().strip()

    stmt = select(Aquarium).where(
        Aquarium.user_id == user_id, func.lower(Aquarium.name) == normalized_name
    )

    result = await session.execute(stmt)
    aquarium = result.scalar()

    if aquarium:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Aquarium with that name already exists",
        )
    new_aquarium = Aquarium(
        name=aquarium_in.name,
        volume=aquarium_in.volume,
        type=aquarium_in.type,
        image_id=aquarium_in.image_id,
        user_id=user_id,
        status="Невизначений",
    )

    session.add(new_aquarium)
    await session.commit()
    await session.refresh(new_aquarium)
    return new_aquarium


async def get_aquariums(session: AsyncSession, user_id: int):

    stmt = select(Aquarium).where(Aquarium.user_id == user_id)
    result = await session.execute(stmt)
    aquarium = result.scalars()

    return aquarium
