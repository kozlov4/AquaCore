from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, date, timedelta
from core.models import TimelineEvent
from .schemas import TimelineEventType


async def log_ecosystem_event(
    session: AsyncSession,
    aquarium_id: int,
    event_type: TimelineEventType,
    title: str,
    description: str | None = None,
    event_metadata: dict | None = None,
):
    new_event = TimelineEvent(
        aquarium_id=aquarium_id,
        event_type=event_type,
        title=title,
        description=description,
        event_metadata=event_metadata,
    )
    session.add(new_event)


async def get_timeline_events(
    session: AsyncSession,
    aquarium_id: int,
    event_types: list[TimelineEventType] | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    period: str | None = None,
):
    stmt = select(TimelineEvent).where(TimelineEvent.aquarium_id == aquarium_id)

    if event_types:
        stmt = stmt.where(TimelineEvent.event_type.in_(event_types))

    today = date.today()
    if period == "Останній місяць":
        stmt = stmt.where(TimelineEvent.created_at >= (today - timedelta(days=30)))
    elif period == "Півроку":
        stmt = stmt.where(TimelineEvent.created_at >= (today - timedelta(days=180)))

    if date_from:
        stmt = stmt.where(TimelineEvent.created_at >= date_from)
    if date_to:
        stmt = stmt.where(TimelineEvent.created_at <= (date_to + timedelta(days=1)))

    stmt = stmt.order_by(TimelineEvent.created_at.desc())

    result = await session.execute(stmt)
    return result.scalars().all()
