from fastapi import HTTPException, status
from sqlalchemy import select, or_, Result, func
from sqlalchemy.ext.asyncio import AsyncSession
from core.models import Aquarium, UserGallery
from sqlalchemy.orm import joinedload, selectinload
from .schemas import PostIn


async def create_gallery_post(
    session: AsyncSession,
    user_id: int,
    post_in: PostIn,
):
    aquarium = await session.get(Aquarium, post_in.aquarium_id)
    if not aquarium:
        raise HTTPException(status_code=404, detail="Акваріум не знайдена")

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
