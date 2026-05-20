from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from core.models.db_helper import db_helper
from users.dependencies import get_current_user
from . import service
from .schemas import (
    PostCategory,
    PostCardResponse,
    PostCreate,
    UsersCardResponse,
    PostResponse,
)

router = APIRouter(prefix="/social", tags=["Social"])


@router.get("/posts/", response_model=list[PostCardResponse])
async def get_posts(
    limit: int = Query(default=8, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    category: PostCategory = Query(
        default=PostCategory.all_posts, description="Сортування постів за категоріями"
    ),
    curr_user_id=Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_posts(
        session=session,
        limit=limit,
        offset=offset,
        category=category,
        curr_user_id=curr_user_id,
    )


@router.get("/{post_id}/", response_model=PostResponse)
async def get_post_by_id(
    post_id: int,
    curr_user_id=Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_post_by_id(
        post_id=post_id,
        session=session,
        curr_user_id=curr_user_id,
    )


@router.get("/users/", response_model=list[UsersCardResponse])
async def search_users(
    curr_user_id=Depends(get_current_user),
    search_text: str | None = None,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.search_users(
        session=session,
        search_text=search_text,
        curr_user_id=curr_user_id,
    )


@router.post("/create/", status_code=status.HTTP_201_CREATED, response_model=PostCreate)
async def create_post(
    post_in: PostCreate,
    curr_user_id=Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.create_post(
        session=session,
        post_in=post_in,
        curr_user_id=curr_user_id,
    )


@router.post("/create/{post_id}/like/", status_code=status.HTTP_201_CREATED)
async def create_like(
    post_id: int,
    curr_user_id=Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.create_like(
        post_id=post_id,
        session=session,
        curr_user_id=curr_user_id,
    )


@router.delete("/remove/{post_id}/like/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_like(
    post_id: int,
    curr_user_id=Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.delete_like(
        post_id=post_id,
        session=session,
        curr_user_id=curr_user_id,
    )
