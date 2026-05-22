from datetime import date, timedelta

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.models import Aquarium, WaterChangeLog
from core.models.system import TimelineEventType
from time_line_event.service import log_ecosystem_event
from .schemas import (
    WaterChangeCreate,
    WaterChangeScheduleUpdate,
    WaterChangeStatusResponse,
)


async def record_water_change(
    session: AsyncSession, aquarium_id: int, user_id: int, data: WaterChangeCreate
):
    aquarium = await session.get(Aquarium, aquarium_id)
    if not aquarium or aquarium.user_id != user_id:
        raise HTTPException(status_code=404, detail="Акваріум не знайдено")

    new_log = WaterChangeLog(aquarium_id=aquarium_id, **data.model_dump())
    session.add(new_log)

    await log_ecosystem_event(
        session=session,
        aquarium_id=aquarium_id,
        event_type=TimelineEventType.MAINTENANCE,
        title=data.change_type.value,
        description=(
            data.comment if data.comment else f"Замінено {data.percentage}% води."
        ),
        event_metadata={"percentage": f"{data.percentage}%"},
    )

    await session.commit()
    await session.refresh(new_log)
    return new_log


async def update_water_change_schedule(
    session: AsyncSession,
    aquarium_id: int,
    user_id: int,
    data: WaterChangeScheduleUpdate,
):
    aquarium = await session.get(Aquarium, aquarium_id)
    if not aquarium or aquarium.user_id != user_id:
        raise HTTPException(status_code=404, detail="Акваріум не знайдено")

    aquarium.water_change_interval_days = data.water_change_interval_days
    aquarium.water_change_percentage = data.water_change_percentage

    await session.commit()
    return {"message": "Налаштування графіка оновлено"}


async def get_water_change_status(
    session: AsyncSession, aquarium_id: int, user_id: int
):
    aquarium = await session.get(Aquarium, aquarium_id)
    if not aquarium or aquarium.user_id != user_id:
        raise HTTPException(status_code=404, detail="Акваріум не знайдено")

    stmt = (
        select(WaterChangeLog)
        .where(WaterChangeLog.aquarium_id == aquarium_id)
        .order_by(WaterChangeLog.change_date.desc(), WaterChangeLog.created_at.desc())
    )
    result = await session.execute(stmt)
    history = result.scalars().all()

    last_change_date = history[0].change_date if history else None

    next_change_date = None
    days_left = None

    if aquarium.water_change_interval_days > 0:
        base_date = last_change_date if last_change_date else date.today()
        next_change_date = base_date + timedelta(
            days=aquarium.water_change_interval_days
        )
        days_left = (next_change_date - date.today()).days
        if days_left < 0:
            days_left = 0

    return WaterChangeStatusResponse(
        interval_days=aquarium.water_change_interval_days,
        target_percentage=aquarium.water_change_percentage,
        last_change_date=last_change_date,
        next_change_date=next_change_date,
        days_left=days_left,
        history=history,
    )
