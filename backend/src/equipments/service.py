from datetime import date

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from starlette import status

from core.models import Equipment, EquipmentLog, Aquarium
from core.models.system import TimelineEventType
from time_line_event.service import log_ecosystem_event
from .schemas import (
    EquipmentCreate,
    EquipmentUpdate,
    EquipmentLogCreate,
    EquipmentAlertResponse,
)


async def get_equipment(
    session: AsyncSession,
    aquarium_id: int,
    user_id: int,
    equipment_category: str = None,
):
    aquarium = await session.get(Aquarium, aquarium_id)

    if not aquarium:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Акваріум не знайден"
        )

    if aquarium.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ви не можете переглядати чужой акваріум",
        )

    stmt = (
        select(Equipment)
        .options(selectinload(Equipment.logs))
        .where(Equipment.aquarium_id == aquarium_id)
    )
    if equipment_category:
        stmt = stmt.where(Equipment.category == equipment_category)

    result = await session.execute(stmt)
    return result.scalars().all()


async def create_equipment(
    session: AsyncSession, aquarium_id: int, data: EquipmentCreate, user_id: int
):
    aquarium = await session.get(Aquarium, aquarium_id)

    if not aquarium:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Акваріум не знайдено",
        )

    if aquarium.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="У вас немає прав додавати обладнання до цього акваріума",
        )

    new_eq = Equipment(aquarium_id=aquarium_id, **data.model_dump())
    session.add(new_eq)

    await log_ecosystem_event(
        session=session,
        aquarium_id=aquarium_id,
        event_type=TimelineEventType.EQUIPMENT,
        title="Нове обладнання",
        description=f"Додано {data.category.lower()} {data.name}.",
        event_metadata={"category": data.category, "name": data.name},
    )

    await session.commit()

    stmt = (
        select(Equipment)
        .where(Equipment.id == new_eq.id)
        .options(selectinload(Equipment.logs))
    )

    result = await session.execute(stmt)

    return result.scalar_one()


async def update_equipment(
    session: AsyncSession, equipment_id: int, data: EquipmentUpdate
):
    stmt = (
        select(Equipment)
        .options(selectinload(Equipment.logs))
        .where(Equipment.id == equipment_id)
    )
    result = await session.execute(stmt)
    eq = result.scalars().first()

    if not eq:
        raise HTTPException(status_code=404, detail="Не знайдено")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(eq, key, value)

    await session.commit()
    await session.refresh(eq)

    return eq


async def delete_equipment(session: AsyncSession, equipment_id: int):
    eq = await session.get(Equipment, equipment_id)
    if not eq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Обладнання не знайдено"
        )
    await session.delete(eq)
    await session.commit()


async def create_equipment_log(
    session: AsyncSession, equipment_id: int, data: EquipmentLogCreate
):
    eq = await session.get(Equipment, equipment_id)
    if not eq:
        raise HTTPException(status_code=404, detail="Обладнання не знайдено")

    new_log = EquipmentLog(equipment_id=equipment_id, **data.model_dump())
    session.add(new_log)

    await log_ecosystem_event(
        session=session,
        aquarium_id=eq.aquarium_id,
        event_type=TimelineEventType.MAINTENANCE,
        title=data.log_type,
        description=f"Пристрій: {eq.name}. Деталі: {data.description}",
        event_metadata={"equipment_name": eq.name, "is_resolved": data.is_resolved},
    )

    await session.commit()
    await session.refresh(new_log)
    return new_log


async def service_equipment(session: AsyncSession, equipment_id: int):
    eq = await session.get(Equipment, equipment_id)
    if not eq:
        raise HTTPException(status_code=404, detail="Обладнання не знайдено")

    new_log = EquipmentLog(
        equipment_id=equipment_id,
        log_type="Планове обслуговування",
        log_date=date.today(),
        description="Швидке планове обслуговування (натиснута кнопка 'Обслужити').",
        is_resolved=True,
    )
    session.add(new_log)
    eq.installation_date = date.today()

    await log_ecosystem_event(
        session=session,
        aquarium_id=eq.aquarium_id,
        event_type=TimelineEventType.MAINTENANCE,
        title="Планове обслуговування обладнання",
        description=f"Обслуговано пристрій {eq.name}.",
        event_metadata={"equipment_name": eq.name},
    )

    await session.commit()
    return {"message": "Обладнання успішно обслуговано, таймер скинуто"}


async def get_equipment_alerts(
    session: AsyncSession, aquarium_id: int, user_id
) -> EquipmentAlertResponse:
    equipments = await get_equipment(session, aquarium_id, user_id=user_id)
    overdue_count = 0
    first_overdue_name = None
    first_overdue_id = None

    for eq in equipments:
        if eq.days_until_maintenance == 0:
            overdue_count += 1
            if not first_overdue_name:
                first_overdue_name = eq.name
                first_overdue_id = eq.id

    if overdue_count > 0:
        msg = (
            f"Пристрій '{first_overdue_name}' та ще {overdue_count - 1} потребують планової очистки."
            if overdue_count > 1
            else f"Пристрій '{first_overdue_name}' потребує планової очистки."
        )
        return EquipmentAlertResponse(
            needs_attention_count=overdue_count,
            message=msg,
            equipment_id=first_overdue_id,
        )

    return EquipmentAlertResponse(needs_attention_count=0, message=None)
