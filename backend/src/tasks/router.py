from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.models.db_helper import db_helper
from users import get_current_user
from . import service
from .schemas import TaskCreate, TaskResponse, TaskStatusUpdate, TaskUpdate

tasks_router = APIRouter(prefix="/tasks", tags=["Tasks"])


@tasks_router.get("", response_model=List[TaskResponse])
async def list_tasks(
    date_from: Optional[date] = Query(
        None, description="Початок місяця/тижня для календаря"
    ),
    date_to: Optional[date] = Query(
        None, description="Кінець місяця/тижня для календаря"
    ),
    aquarium_id: Optional[int] = Query(
        None, description="Фільтр по конкретній екосистемі"
    ),
    is_completed: Optional[bool] = Query(
        None, description="Фільтр по статусу (виконані/ні)"
    ),
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_tasks(
        session, user_id, date_from, date_to, aquarium_id, is_completed
    )


@tasks_router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def add_task(
    data: TaskCreate,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.create_task(session, user_id, data)


@tasks_router.patch("/{task_id}/status", response_model=TaskResponse)
async def complete_task(
    task_id: int,
    data: TaskStatusUpdate,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.update_task_status(session, user_id, task_id, data)


@tasks_router.put("/{task_id}", response_model=TaskResponse)
async def update_task_route(
    task_id: int,
    task_in: TaskUpdate,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.update_task(
        session=session,
        task_id=task_id,
        user_id=user_id,
        task_in=task_in,
    )


@tasks_router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.delete_task(
        task_id=task_id,
        session=session,
        user_id=user_id,
    )
