from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.models.db_helper import db_helper
from users.dependencies import get_current_user
from . import service
from .schemas import AnalyzeRequest, CompatibilityResponse

router = APIRouter(prefix="/compatibility", tags=["Compatibility"])


@router.post(
    "/analyze",
    response_model=CompatibilityResponse,
    dependencies=[Depends(get_current_user)],
)
async def analyze_ecosystem(
    request: AnalyzeRequest,
    session: AsyncSession = Depends(db_helper.session_dependency),
):
    return await service.analyze_compatibility(session, request)
