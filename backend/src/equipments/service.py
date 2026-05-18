from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from core.models import Equipment, EquipmentLog
from .schemas import (
    EquipmentCreate,
    EquipmentUpdate,
    EquipmentLogCreate,
    EquipmentAlertResponse,
)
from datetime import date


async def get_equipment(
    session: AsyncSession, aquarium_id: int, equipment_category: str = None
):
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
    session: AsyncSession, aquarium_id: int, data: EquipmentCreate
):
    new_eq = Equipment(aquarium_id=aquarium_id, **data.model_dump())
    session.add(new_eq)
    await session.commit()
    await session.refresh(new_eq)
    return new_eq


async def update_equipment(
    session: AsyncSession, equipment_id: int, data: EquipmentUpdate
):
    eq = await session.get(Equipment, equipment_id)
    if not eq:
        raise HTTPException(status_code=404, detail="Обладнання не знайдено")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(eq, key, value)

    await session.commit()
    await session.refresh(eq)
    return eq


async def delete_equipment(session: AsyncSession, equipment_id: int):
    eq = await session.get(Equipment, equipment_id)
    if eq:
        await session.delete(eq)
        await session.commit()


async def create_equipment_log(
    session: AsyncSession, equipment_id: int, data: EquipmentLogCreate
):
    new_log = EquipmentLog(equipment_id=equipment_id, **data.model_dump())
    session.add(new_log)
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

    await session.commit()
    return {"message": "Обладнання успішно обслуговано, таймер скинуто"}


async def get_equipment_alerts(
    session: AsyncSession, aquarium_id: int
) -> EquipmentAlertResponse:
    equipments = await get_equipment(session, aquarium_id)

    overdue_count = 0
    first_overdue_name = None

    for eq in equipments:
        if eq.days_until_maintenance == 0:
            overdue_count += 1
            if not first_overdue_name:
                first_overdue_name = eq.name

    if overdue_count > 0:
        msg = (
            f"Пристрій '{first_overdue_name}' та ще {overdue_count - 1} потребують планової очистки."
            if overdue_count > 1
            else f"Пристрій '{first_overdue_name}' потребує планової очистки."
        )
        return EquipmentAlertResponse(needs_attention_count=overdue_count, message=msg)

    return EquipmentAlertResponse(needs_attention_count=0, message=None)
