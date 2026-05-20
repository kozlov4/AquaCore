from fastapi import HTTPException, status
from sqlalchemy import or_, func
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from core.models import Disease, DiagnosticStep
from .schemas import SortByTargetType


async def get_disease_tags(session: AsyncSession) -> list[str]:
    stmt = select(func.unnest(Disease.tags)).distinct()

    result = await session.execute(stmt)
    tags = result.scalars().all()

    return [tag for tag in tags if tag]


async def get_diseases(
    session: AsyncSession,
    target_type: SortByTargetType | None = None,
    search_text: str | None = None,
    category_tags: list[str] | None = None,
):
    stmt = select(Disease)

    if target_type:
        stmt = stmt.where(Disease.target_type == target_type)

    if search_text:
        search_pattern = f"%{search_text}%"
        stmt = stmt.where(
            or_(
                Disease.name.ilike(search_pattern),
                Disease.diagnostic_steps.any(DiagnosticStep.text.ilike(search_pattern)),
            )
        )

    if category_tags:
        stmt = stmt.where(Disease.tags.overlap(category_tags))

    stmt = stmt.options(
        selectinload(Disease.image),
    )

    result = await session.scalars(stmt)
    diseases = result.unique().all()

    return diseases


async def get_disease_by_id(disease_id: int, session: AsyncSession):
    stmt = (
        select(Disease)
        .where(Disease.id == disease_id)
        .options(
            selectinload(Disease.diagnostic_steps),
            selectinload(Disease.treatment_steps),
            selectinload(Disease.image),
        )
    )
    result = await session.execute(stmt)
    disease = result.scalar_one_or_none()

    if not disease:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Хворобу не знайдено"
        )

    return disease
