from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.auth.service import get_current_user
from src.tasks.service import auto_generate_maintenance_tasks


router = APIRouter(prefix="/tasks", tags=["Tasks ✅"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.post("/{id}/generate-tasks/")
def generate_maintenance(
        id: int,
        db: db_dependency,
        user_id: user_dependency
):
    result = auto_generate_maintenance_tasks(db, id)
    return result