from datetime import date, timedelta

from fastapi import HTTPException
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from starlette import status

from core.models import Task, Aquarium
from .schemas import TaskCreate, TaskStatusUpdate, TaskUpdate


async def get_tasks(
    session: AsyncSession,
    user_id: int,
    date_from: date | None = None,
    date_to: date | None = None,
    aquarium_id: int | None = None,
    is_completed: bool | None = None,
):
    stmt = (
        select(Task).options(selectinload(Task.aquarium)).where(Task.user_id == user_id)
    )

    if date_from:
        stmt = stmt.where(Task.due_date >= date_from)
    if date_to:
        stmt = stmt.where(Task.due_date <= date_to)
    if aquarium_id:
        stmt = stmt.where(Task.aquarium_id == aquarium_id)
    if is_completed is not None:
        stmt = stmt.where(Task.is_completed == is_completed)

    stmt = stmt.order_by(Task.due_date.asc())
    result = await session.execute(stmt)
    tasks = result.scalars().all()

    today = date.today()
    response_list = []

    for task in tasks:
        task_dict = {
            "id": task.id,
            "aquarium_id": task.aquarium_id,
            "task_type": task.task_type,
            "title": task.title,
            "notes": task.notes,
            "due_date": task.due_date,
            "repeat_type": task.repeat_type,
            "is_completed": task.is_completed,
            "aquarium_name": task.aquarium.name if task.aquarium else "Усі екосистеми",
            "is_overdue": task.due_date < today and not task.is_completed,
        }
        response_list.append(task_dict)

    return response_list


async def create_task(session: AsyncSession, user_id: int, data: TaskCreate):
    aquarium = await session.get(Aquarium, data.aquarium_id)

    if aquarium is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Акваріум не знайден",
        )

    if aquarium.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ви не маєте права на створення записів в іншому акваріумі",
        )

    new_task = Task(user_id=user_id, **data.model_dump())
    session.add(new_task)
    await session.commit()
    await session.refresh(new_task)
    stmt = (
        select(Task).options(selectinload(Task.aquarium)).where(Task.id == new_task.id)
    )
    return (await session.execute(stmt)).scalar_one()


async def update_task_status(
    session: AsyncSession, user_id: int, task_id: int, update_data: TaskStatusUpdate
):
    task = await session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Завдання не знайдено")

    task.is_completed = update_data.is_completed

    if task.is_completed and task.repeat_type != "Не повторювати":
        next_date = None
        if task.repeat_type == "Щодня":
            next_date = task.due_date + timedelta(days=1)
        elif task.repeat_type == "Щотижня":
            next_date = task.due_date + timedelta(days=7)
        elif task.repeat_type == "Щомісяця":
            next_date = task.due_date + timedelta(days=30)

        if next_date:
            new_task = Task(
                user_id=user_id,
                aquarium_id=task.aquarium_id,
                task_type=task.task_type,
                title=task.title,
                notes=task.notes,
                due_date=next_date,
                repeat_type=task.repeat_type,
            )
            session.add(new_task)

    await session.commit()

    stmt = select(Task).options(selectinload(Task.aquarium)).where(Task.id == task_id)
    return (await session.execute(stmt)).scalar_one()


async def delete_task(session: AsyncSession, task_id: int, user_id: int):
    task = await session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=404,
            detail="Ви не маєте доступу до видалення цієї таски або її нема",
        )
    stmt_task = delete(Task).where(
        Task.user_id == user_id,
        Task.id == task_id,
    )
    await session.execute(stmt_task)
    await session.commit()


async def update_task(
    session: AsyncSession,
    user_id: int,
    task_id: int,
    task_in: TaskUpdate,
):

    stmt = select(Task).where(Task.id == task_id)
    result = await session.execute(stmt)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Таску не знайдено")

    if task.user_id != user_id:
        raise HTTPException(
            status_code=403, detail="Ви не можете редагувати чужу таску"
        )

    update_data = task_in.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(task, key, value)

    await session.commit()
    await session.refresh(task)

    return task
