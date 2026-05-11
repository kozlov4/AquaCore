from fastapi import HTTPException, status
from sqlalchemy import select, or_, Result, func, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession
from core.models import Aquarium, UserGallery
from sqlalchemy.orm import joinedload, selectinload
from .schemas import PostIn, SortOrder


async def create_gallery_post(
    session: AsyncSession,
    user_id: int,
    post_in: PostIn,
):
    aquarium = await session.get(Aquarium, post_in.aquarium_id)
    if not aquarium:
        raise HTTPException(status_code=404, detail="Акваріум не знайден")

    if aquarium.user_id != user_id:
        raise HTTPException(
            status_code=403, detail="Ви не можете додавати фото для цього акваріума"
        )

    new_gallery_post = UserGallery(
        signature=post_in.signature,
        category=post_in.category,
        aquarium_id=post_in.aquarium_id,
        image_id=post_in.image_id,
        user_id=user_id,
    )

    session.add(new_gallery_post)
    await session.commit()
    await session.refresh(new_gallery_post)
    return new_gallery_post


async def get_gallery_photos(
    session: AsyncSession,
    user_id: int,
    category: str | None = None,
    aquarium_name: str | None = None,
    sort_order: SortOrder = SortOrder.newest,
):
    query = (
        select(UserGallery)
        .options(selectinload(UserGallery.image))
        .where(UserGallery.user_id == user_id)
    )

    if category and category != "Всі фотографії":
        query = query.where(UserGallery.category == category)

    if aquarium_name:
        query = query.join(Aquarium).where(Aquarium.name == aquarium_name)

    if sort_order == SortOrder.newest:
        query = query.order_by(desc(UserGallery.created_at))
    else:
        query = query.order_by(asc(UserGallery.created_at))

    result = await session.execute(query)
    return result.scalars().all()
