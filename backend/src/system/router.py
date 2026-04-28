from enum import Enum
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from . import service
from .schemas import ReadFeedback

from core.models.db_helper import db_helper


class SortByChoice(str, Enum):
    newest = "newest"
    highest = "highest"
    lowest = "lowest"


router = APIRouter(
    tags=["Feedback"],
)

upper_than_4: bool = True
upper_than_3: bool = False
upper_than_2: bool = False

new_ones_first: bool = True
highest_rating: bool = False
low_rating: bool = False


@router.get("/feedbacks/", response_model=list[ReadFeedback])
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
