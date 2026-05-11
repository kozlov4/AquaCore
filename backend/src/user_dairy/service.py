from typing import Optional

from fastapi import HTTPException
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from core.models import UserDairy, User
from .schemas import DiaryCreate


async def get_diary_entries(
    session: AsyncSession,
    user_id: int,
    aquarium_id: Optional[int] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
):
    stmt = (
        select(UserDairy)
        .where(UserDairy.user_id == user_id)
        .options(selectinload(UserDairy.aquarium), selectinload(UserDairy.image))
    )

    if aquarium_id:
        stmt = stmt.where(UserDairy.aquarium_id == aquarium_id)
    if tag and tag != "Всі записи":
        stmt = stmt.where(UserDairy.tag == tag)
    if search:
        stmt = stmt.where(
            or_(
                UserDairy.title.ilike(f"%{search}%"),
                UserDairy.observation.ilike(f"%{search}%"),
            )
        )

    stmt = stmt.order_by(UserDairy.is_pinned.desc(), UserDairy.created_at.desc())

    result = await session.execute(stmt)
    return result.scalars().all()


async def create_diary_entry(
    session: AsyncSession, user_id: int, diary_in: DiaryCreate
):
    new_entry = UserDairy(**diary_in.model_dump(), user_id=user_id)
    session.add(new_entry)
    await session.commit()
    await session.refresh(new_entry)
    return new_entry


async def get_diary_entry(session: AsyncSession, user_id: int, entry_id: int):

    entry = await session.get(UserDairy, entry_id)

    if not entry or entry.user_id != user_id:
        raise HTTPException(status_code=404, detail="Запис не знайдено")

    stmt = (
        select(UserDairy)
        .where(UserDairy.id == entry_id)
        .options(
            selectinload(UserDairy.image),
            selectinload(UserDairy.author).selectinload(User.aquariums),
        )
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none()
