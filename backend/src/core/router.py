from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.database import get_db
from src.auth.service import get_current_user
from src.core.schemas import EconomyRequest, EconomyResponse
from src.core.calculators import calculate_monthly_cost_smart

router = APIRouter(prefix="/calculators", tags=["Calculators 📟"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.post("/{id}/calculate-economy/", response_model=EconomyResponse)
def get_aquarium_economy(
    id: int,
    body: EconomyRequest,
    db: db_dependency
):
    result = calculate_monthly_cost_smart(db, id, body)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result