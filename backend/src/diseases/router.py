from fastapi import APIRouter, Query, Depends
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from models import Disease, DiagnosticStep
from core.models.db_helper import db_helper
from . import service
from .schemas import SortByTargetType, DiseasesCardResponse, DiseaseDetailResponse
from users import get_current_user

router = APIRouter(tags=["Diseases"])


@router.get(
    "/diseases/",
    dependencies=[Depends(get_current_user)],
    response_model=list[DiseasesCardResponse],
)
async def get_diseases(
    target_type: SortByTargetType | None = None,
    search_text: str | None = None,
    category_tags: list[str] = Query(default=[]),
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_diseases(
        target_type=target_type,
        search_text=search_text,
        category_tags=category_tags,
        session=session,
    )


@router.get(
    "/diseases/{disease_id}/",
    response_model=DiseaseDetailResponse,
    dependencies=[Depends(get_current_user)],
)
async def get_disease_by_id(
    disease_id: int,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.get_disease_by_id(
        disease_id=disease_id,
        session=session,
    )
