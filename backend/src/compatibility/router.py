from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.models.db_helper import db_helper
from .schemas import AnalyzeRequest, CompatibilityResponse
from . import service

router = APIRouter(prefix="/compatibility", tags=["Compatibility"])


@router.post("/analyze/", response_model=CompatibilityResponse)
async def analyze_ecosystem(
    request: AnalyzeRequest,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.analyze_compatibility(session, request)
