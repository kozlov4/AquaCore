from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database import get_db
from src.auth.service import get_current_user
from src.catalog.schemas import InhabitantsShow
from src.catalog.service import get_all_inhabitants
router = APIRouter(prefix="/catalog", tags=["Catalog 📚"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/catalog/inhabitants", response_model=List[InhabitantsShow])
async def get_inhabitants(db:db_dependency, user:user_dependency):
    return get_all_inhabitants(db=db, user_id=user.get("user_id"))

