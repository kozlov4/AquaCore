from fastapi import APIRouter, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from core.models.db_helper import db_helper
from users import get_current_user
from . import service
from .schemas import (
    PostIn,
    SortOrder,
    ImageResponseList,
    ImageResponse,
    UserGalleryUpdate,
    PostCategory,
)

router = APIRouter(prefix="/gallery", tags=["Gallery"])


@router.get("", response_model=list[ImageResponseList])
async def get_gallery_photos(
    session: AsyncSession = Depends(db_helper.session_dependency),
    user_id: int = Depends(get_current_user),
    category: PostCategory | None = Query(default=None),
    aquarium_name: str | None = Query(default=None),
    sort_order: SortOrder = Query(default=SortOrder.newest),
):
    return await service.get_gallery_photos(
        session=session,
        user_id=user_id,
        category=category,
        aquarium_name=aquarium_name,
        sort_order=sort_order,
    )


@router.get("/{id}", response_model=ImageResponse)
async def get_gallery_photo(
    id: int,
    session: AsyncSession = Depends(db_helper.session_dependency),
    user_id: int = Depends(get_current_user),
):
    return await service.get_gallery_photo(
        id=id,
        session=session,
        user_id=user_id,
    )


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
async def create_post_to_gallery_route(
    post_in: PostIn,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.create_gallery_post(
        session=session,
        user_id=user_id,
        post_in=post_in,
    )


@router.put("/{id}", response_model=ImageResponse)
async def update_photo_route(
    id: int,
    photo_in: UserGalleryUpdate,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.update_photo(
        session=session,
        id=id,
        user_id=user_id,
        photo_in=photo_in,
    )


@router.delete("/{id}")
async def delete_photo_route(
    id: int,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.delete_photo(
        session=session,
        id=id,
        user_id=user_id,
    )
