from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from core.models.db_helper import db_helper
from users.dependencies import get_current_user
from . import service
from .schemas import PostCategory, PostCardResponse, PostCreate

router = APIRouter(prefix="/posts", tags=["Social"])


@router.get("/", response_model=list[PostCardResponse])
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


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=PostCreate)
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
