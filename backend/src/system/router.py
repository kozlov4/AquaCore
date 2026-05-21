from enum import Enum

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from core.models.db_helper import db_helper
from users import get_current_user
from . import service
from .schemas import ReadFeedback, CreateFeedback


class SortByChoice(str, Enum):
    newest = "newest"
    highest = "highest"
    lowest = "lowest"


router = APIRouter(
    tags=["Feedback"],
)


@router.get("/feedbacks", response_model=list[ReadFeedback])
async def get_feedbacks(
    limit: int = Query(default=6, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    min_rate: int = Query(
        default=0, ge=0, le=5, description="Filter by stars (2, 3, 4)"
    ),
    sort_by: SortByChoice = Query(default=SortByChoice.newest, description="Sort type"),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_feedbacks(
        session=session, limit=limit, offset=offset, min_rate=min_rate, sort_by=sort_by
    )


@router.post("/feedbacks", status_code=status.HTTP_201_CREATED)
async def create_or_update_feedback(
    feedback_in: CreateFeedback,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.upsert_feedback(
        session=session, user_id=user_id, feedback_in=feedback_in
    )
