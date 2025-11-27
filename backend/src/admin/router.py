from typing import Annotated, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.catalog.schemas import InhabitantsCreate, InhabitantsUpdate, InhabitantsShow
from src.database import get_db
from src.auth.service import get_current_user
from src.catalog.service import  create_new_inhabitant_in_db, update_inhabitant_in_db, get_all_inhabitants
from src.users.service import get_all_users, user_ban
from src.users.schemas import UserRead
router = APIRouter(prefix="/admin", tags=["Admin 👑"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/users/", response_model=List[UserRead])
async def get_users(db: db_dependency, user: user_dependency):
    return get_all_users(db=db, user_id=user.get("user_id"))


@router.post("/catalog/inhabitants/", status_code=201)
async def create_new_inhabitant(
        db:db_dependency,
        inhabitant: InhabitantsCreate,
        user:user_dependency
):
    return create_new_inhabitant_in_db(
        db=db,
        inhabitant=inhabitant,
        user_id=user.get("user_id")
    )

@router.put("/catalog/inhabitants/{inhabitant_id}")
async def update_inhabitant(
    db:db_dependency,
    inhabitant_id:int,
    inhabitant: InhabitantsUpdate,
    user:user_dependency
):
    return update_inhabitant_in_db(
        db=db,
        inhabitant_id=inhabitant_id,
        inhabitant_data=inhabitant,
        user_id=user.get("user_id"))

@router.patch("/users/{user_id}/ban")
async def banned_user_by_id(db:db_dependency, user_id:int, user: user_dependency):
    return user_ban(db=db, user_id=user_id, admin_id=user.get("user_id"))