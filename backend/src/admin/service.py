import os
from typing import Annotated
from sqlalchemy import func, desc
from fastapi import Depends, HTTPException, status
from starlette import status
from src.database import get_db
from sqlalchemy.orm import Session
from src.users.models import Users
from src.aquariums.models import Aquariums, Aquarium_Inhabitants
from src.catalog.models import Catalog_Inhabitants

db_dependency = Annotated[Session, Depends(get_db)]


def check_admin(db:db_dependency, admin_id):
    admin = db.query(Users).filter(Users.id == admin_id).first()
    if admin is None:
        raise  HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")
    if admin.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Only admin can access this resource',
        )
    return admin


def get_global_system_health(db: Session) -> dict:

    total_users = db.query(Users).count()

    active_aquariums = db.query(Aquariums).count()

    popular_fish_query = (
        db.query(
            Catalog_Inhabitants.name,
            func.count(Aquarium_Inhabitants.inhabitant_id).label('frequency')
        )
        .join(Aquarium_Inhabitants, Catalog_Inhabitants.id == Aquarium_Inhabitants.inhabitant_id)
        .group_by(Catalog_Inhabitants.name)
        .order_by(desc('frequency'))
        .first()
    )

    if popular_fish_query:
        most_popular = popular_fish_query.name
    else:
        most_popular = "Поки немає даних"

    return {
        "total_users": total_users,
        "active_aquariums": active_aquariums,
        "most_popular_fish": most_popular,
        "message": "Система працює стабільно."
    }