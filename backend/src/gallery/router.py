from fastapi import APIRouter, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status
from core.models.db_helper import db_helper
from . import service
from users import get_current_user
from .schemas import PostIn

router = APIRouter(prefix="/gallery", tags=["Gallery"])


@router.post(
    "/",
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
