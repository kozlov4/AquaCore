from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import date
from core.models.db_helper import db_helper
from . import service
from .schemas import TimelineEventResponse
from core.models.system import TimelineEventType

router = APIRouter(prefix="/aquariums", tags=["Timeline"])


@router.get("/{aquarium_id}/timeline", response_model=List[TimelineEventResponse])
async def get_aquarium_timeline(
    aquarium_id: int,
    event_types: Optional[List[TimelineEventType]] = Query(None, alias="types"),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    period: Optional[str] = Query(None),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_timeline_events(
        session, aquarium_id, event_types, date_from, date_to, period
    )
