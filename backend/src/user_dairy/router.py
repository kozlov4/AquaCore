from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from core.models import UserDairy
from core.models.db_helper import db_helper
from users import get_current_user
from . import service
from .schemas import DiaryListResponse, DiaryCreate, DiaryResponse, DiaryUpdate

router = APIRouter(prefix="/diary", tags=["Diary"])


@router.get("", response_model=list[DiaryListResponse])
async def list_entries(
    aquarium_id: Optional[int] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_diary_entries(session, user_id, aquarium_id, tag, search)


@router.get("/{entry_id}", response_model=DiaryResponse)
async def get_entry(
    entry_id: int,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_diary_entry(session, user_id, entry_id)


@router.post("", response_model=DiaryCreate)
async def create_entry(
    diary_in: DiaryCreate,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.create_diary_entry(session, user_id, diary_in)


@router.put("/{entry_id}", response_model=DiaryResponse)
async def update_entry_route(
    entry_id: int,
    entry_in: DiaryUpdate,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.update_entry(
        session=session,
        entry_id=entry_id,
        user_id=user_id,
        entry_in=entry_in,
    )


@router.delete("/{entry_id}", status_code=204)
async def delete_entry(
    entry_id: int,
    user_id: int = Depends(get_current_user),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    entry = await session.get(UserDairy, entry_id)

    if not entry or entry.user_id != user_id:
        raise HTTPException(status_code=404, detail="Запис не знайдено")

    await session.delete(entry)
    await session.commit()
    return None
