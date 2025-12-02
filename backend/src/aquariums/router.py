from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.catalog.models import Catalog_Inhabitants
from src.aquariums.models import Aquariums, Aquarium_Inhabitants
from src.database import get_db
from src.auth.service import get_current_user
from src.catalog.schemas import  AddInhabitantRequest, AddInhabitantResponse
from src.aquariums.service import create_aquarium, get_aquarium, get_aquariums_by_user, update_aquarium, delete_aquarium, recalculate_aquarium_targets, calculate_stocking_level, predict_nitrogen_cycle_status
from src.aquariums.schemas import AquariumCreate, AquariumRead,  AquariumListResponse, AquariumUpdate
from src.aquariums.service import check_compatibility, update_device_smart_config
from src.monitoring.schemas import NitrogenStatusResponse
from src.monitoring.service import analyze_parameter_trends


router = APIRouter(prefix="/aquariums", tags=["Aquariums 🪼"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/", response_model=AquariumListResponse)
async def get_all_my_aquariums(
  db:db_dependency,
  user:user_dependency
):
  return get_aquariums_by_user(db=db, user_id=user.get("user_id"))

@router.get("/{aquarium_id}", response_model=AquariumRead)
async def get_aquarium_by_id(
  db:db_dependency,
  aquarium_id:int,
):
  return get_aquarium(db=db, aquarium_id=aquarium_id)


@router.get("/{id}/analyze/{parameter}")
def get_trend_analysis(
        id: int,
        parameter: str,
        db: Session = Depends(get_db)  #
):
    if parameter not in ["ph", "temperature", "tds"]:
        raise HTTPException(status_code=400, detail="Invalid parameter")

    result = analyze_parameter_trends(db, aquarium_id=id, parameter=parameter)

    return result

@router.get("/{id}/cycle-status", response_model=NitrogenStatusResponse)
def get_aquarium_cycle_status(
        id: int,
        db: db_dependency,
        user_id: user_dependency
):
    aquarium = get_aquarium(db, id)
    if aquarium.user_id != user_id.get("user_id"):
        raise HTTPException(status_code=403, detail="Access denied")

    result = predict_nitrogen_cycle_status(db, id)

    return result

@router.post("/", status_code=201)
async def create(
  db:db_dependency,
  aquarium:AquariumCreate,
  user:user_dependency
):
  return create_aquarium(db=db, aquarium=aquarium, user_id=user.get("user_id"))


@router.post("/{id}/inhabitants", response_model=AddInhabitantResponse, status_code=201)
def add_inhabitant_to_aquarium(
        id: int,
        body: AddInhabitantRequest,
        db: db_dependency,
        user_id: user_dependency
):
    aquarium = get_aquarium(db=db, aquarium_id=id)

    new_fish = db.query(Catalog_Inhabitants).filter(Catalog_Inhabitants.id == body.inhabitant_id).first()
    if not new_fish:
        raise HTTPException(status_code=404, detail="Цього мешканця не існує")

    warnings = check_compatibility(db=db, aquarium=aquarium, new_fish=new_fish, quantity=body.quantity)

    if warnings and not body.ignore_warnings:
        return AddInhabitantResponse(
            success=False, added=False, warnings=warnings,
            message="Виявлено проблеми сумісності."
        )

    existing_link = db.query(Aquarium_Inhabitants).filter(
        Aquarium_Inhabitants.aquarium_id == aquarium.id,
        Aquarium_Inhabitants.inhabitant_id == new_fish.id
    ).first()

    if existing_link:
        existing_link.quantity += body.quantity
    else:
        new_link = Aquarium_Inhabitants(
            aquarium_id=aquarium.id, inhabitant_id=new_fish.id, quantity=body.quantity
        )
        db.add(new_link)

    db.commit()
    db.refresh(aquarium)


    update_device_smart_config(db, aquarium.id)

    if getattr(aquarium, "is_auto_targets", True):
        recalculate_aquarium_targets(db, aquarium)

    stocking = calculate_stocking_level(db, aquarium)

    if stocking['status'] == 'red':
        warnings.append(f"КРИТИЧНА БІОНАВАНТАЖЕНІСТЬ: {stocking['percent']}%! Покращіть фільтрацію.")
    elif stocking['status'] == 'yellow':
        warnings.append(f"Висока біонавантаженість: {stocking['percent']}%.")

    return AddInhabitantResponse(
        success=True,
        added=True,
        warnings=warnings,
        message=f"Додано {body.quantity} шт. {new_fish.name}. Завантаження: {stocking['percent']}%"
    )


@router.put("/{aquarium_id}")
async def update_my_aquarium(
  db:db_dependency,
  aquarium_id:int,
  aquarium_data: AquariumUpdate,
  user:user_dependency
):
  return update_aquarium(db=db, aquarium_id=aquarium_id, aquarium_data=aquarium_data, user_id=user.get("user_id"))

@router.delete("/{aquarium_id}")
async def delete_my_aquarium(
  db:db_dependency,
  aquarium_id:int,
  user:user_dependency
):
  return delete_aquarium(db=db, aquarium_id=aquarium_id, user_id=user.get("user_id"))