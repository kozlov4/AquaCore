import os
from typing import Annotated
from sqlalchemy import func, desc, select
from datetime import date, timedelta
from fastapi import Depends, HTTPException
from starlette import status
from src.database import get_db
from sqlalchemy.orm import Session, joinedload
from src.aquariums.schemas import AquariumCreate, AquariumUpdate
from src.users.service import get_user_by_id
from src.aquariums.models import Aquariums
from src.tasks.models import Tasks
from src.media.models import Media
from src.monitoring.models import Activity_Log
from src.catalog.models import  Catalog_Inhabitants
from src.aquariums.models import  Aquarium_Inhabitants, Aquariums

from src.monitoring.models import Sensor_Measurements, Devices, Manual_Measurements

db_dependency = Annotated[Session, Depends(get_db)]



def create_aquarium(db: Session, aquarium: AquariumCreate, user_id: int):
  user = get_user_by_id(db=db, user_id=user_id)

  new_aquarium = Aquariums(
        user_id=user.id,
        name=aquarium.name,
        volume_l=aquarium.volume_l,
        length_cm=aquarium.length_cm,
        width_cm=aquarium.width_cm,
        height_cm=aquarium.height_cm,
        water_type=aquarium.water_type,
        start_date=aquarium.start_date,
        description=aquarium.description,
        ground_type=aquarium.ground_type,
        lighting_model=aquarium.lighting_model,
        filter_model=aquarium.filter_model
    )

  existing_aqua_name = (
      db.query(Aquariums)
      .filter(
          Aquariums.user_id == user.id,
          func.lower(Aquariums.name) == aquarium.name.lower(),
      )
      .first()
  )
  
  if existing_aqua_name:
      raise  HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Name for aquarium already in use')

  db.add(new_aquarium)
  db.commit()
  db.refresh(new_aquarium)

  return {
        "message": "Акваріум успішно додано",
    }


def get_aquarium(db: Session, aquarium_id: int):
    aquarium = db.query(Aquariums). \
        options(joinedload(Aquariums.device)). \
        options(joinedload(Aquariums.inhabitants)). \
        filter(Aquariums.id == aquarium_id).first()

    if aquarium is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Акваріум не знайдено')
    return aquarium

def get_aquariums_by_user(db: Session, user_id: int):
    user = get_user_by_id(db=db, user_id=user_id)

    aquariums = db.query(Aquariums).filter(Aquariums.user_id == user.id).all()
    return {"aquariums": aquariums}


def update_aquarium(db: Session, aquarium_id: int, aquarium_data: AquariumUpdate, user_id: int):
    aquarium = get_aquarium(db=db, aquarium_id=aquarium_id)
    user = get_user_by_id(db=db, user_id=user_id)

    if aquarium.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ви не можете змінювати чужі акваріуми"
        )

    update_data = aquarium_data.model_dump(exclude_unset=True)

    new_name = update_data.get("name")
    if new_name:
        existing = (
            db.query(Aquariums)
            .filter(
                Aquariums.user_id == user.id,
                func.lower(Aquariums.name) == new_name.lower(),
                Aquariums.id != aquarium.id 
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Name for aquarium already in use"
            )

    for key, value in update_data.items():
        setattr(aquarium, key, value)

    db.commit()
    db.refresh(aquarium)
    return aquarium


def delete_aquarium(db: Session, aquarium_id: int, user_id:int):
    aquarium = get_aquarium(db=db, aquarium_id=aquarium_id)
    user = get_user_by_id(db=db, user_id=user_id)

    if aquarium.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ви не можете видаляти чужі акваріуми"
        )
    

    db.query(Media).filter(
        Media.attachable_type == "aquarium",
        Media.attachable_id == aquarium_id
    ).delete(synchronize_session=False)

    db.query(Activity_Log).filter(
        Activity_Log.aquarium_id == aquarium_id
    ).delete(synchronize_session=False)

    db.query(Tasks).filter(
        Tasks.aquarium_id == aquarium_id
    ).delete(synchronize_session=False)


    db.delete(aquarium)
    db.commit()

    return {"message": f"Акваріум '{aquarium.name}' успішно видалено"}

#TODO Стайність
def check_compatibility(
        db: Session,
        aquarium: Aquariums,
        new_fish: Catalog_Inhabitants,
        quantity: int
) -> list[str]:
    warnings = []

    current_inhabitants = (
        db.query(Aquarium_Inhabitants)
        .filter(Aquarium_Inhabitants.aquarium_id == aquarium.id)
        .join(Catalog_Inhabitants)
        .all()
    )

    for link in current_inhabitants:
        neighbor = link.inhabitant

        if new_fish.aggressiveness == "aggressive" and neighbor.aggressiveness == "peaceful":
            warnings.append(f"НЕБЕЗПЕЧНО: Агресивний '{new_fish.name}' може з'їсти мирного '{neighbor.name}'!")

        if new_fish.aggressiveness == "peaceful" and neighbor.aggressiveness == "aggressive":
            warnings.append(f"НЕБЕЗПЕЧНО: Хижак '{neighbor.name}' може напасти на нових '{new_fish.name}'!")

    current_load_l = 0

    for link in current_inhabitants:
        vol = link.inhabitant.min_water_volume_l
        current_load_l += vol * link.quantity

    new_fish_vol = new_fish.min_water_volume_l * quantity
    total_needed = current_load_l + new_fish_vol

    if aquarium.volume_l and total_needed > aquarium.volume_l:
        warnings.append(
            f"ПЕРЕНАСЕЛЕННЯ: Рибам потрібно {total_needed}л, а в акваріумі всього {aquarium.volume_l}л."
        )

    if aquarium.volume_l and new_fish.min_tank_size_l:
        if aquarium.volume_l < new_fish.min_tank_size_l:
            warnings.append(
                f"МАЛИЙ ОБʼЄМ: {new_fish.name} потребує мінімум {new_fish.min_tank_size_l}л "
                f"акваріума, а у вашому лише {aquarium.volume_l}л."
            )

    if aquarium.target_temp_c_min is not None:
        if new_fish.temp_min_c and new_fish.temp_min_c > aquarium.target_temp_c_max:
            warnings.append(
                f"ТЕМПЕРАТУРА: {new_fish.name} замерзне! Їй потрібно мін {new_fish.temp_min_c}°C, а в акваріумі макс {aquarium.target_temp_c_max}°C.")

        if new_fish.temp_max_c and new_fish.temp_max_c < aquarium.target_temp_c_min:
            warnings.append(
                f"ТЕМПЕРАТУРА: {new_fish.name} звариться! Їй потрібно макс {new_fish.temp_max_c}°C, а в акваріумі мін {aquarium.target_temp_c_min}°C.")

    if aquarium.target_ph_min is not None:
        if new_fish.ph_min and new_fish.ph_min > aquarium.target_ph_max:
            warnings.append(f"pH КОНФЛІКТ: Вода занадто кисла для {new_fish.name}.")

        if new_fish.ph_max and new_fish.ph_max < aquarium.target_ph_min:
            warnings.append(f"pH КОНФЛІКТ: Вода занадто лужна для {new_fish.name}.")

    return warnings


def update_device_smart_config(db: Session, aquarium_id: int):
    device = db.query(Devices).filter(Devices.aquarium_id == aquarium_id).first()
    if not device:
        return

    inhabitants = (
        db.query(Aquarium_Inhabitants)
        .filter(Aquarium_Inhabitants.aquarium_id == aquarium_id)
        .join(Catalog_Inhabitants)
        .all()
    )

    aquarium = db.query(Aquariums).filter(Aquariums.id == aquarium_id).first()

    config = dict(device.config) if device.config else {}

    config["feeding"] = calculate_feeding_config(inhabitants)
    config["lighting"] = calculate_lighting_config(aquarium)
    config["heating"] = calculate_heating_config(aquarium)

    config["last_auto_update"] = "Calculated based on livestock and aquarium settings"

    device.config = config
    db.add(device)
    db.commit()

def calculate_feeding_config(inhabitants: list[Aquarium_Inhabitants]):
    feed_intervals = []

    for link in inhabitants:
        freq = link.inhabitant.feeding_frequency or ""

        if "2" in freq:
            feed_intervals.append(12)
        elif "1" in freq:
            feed_intervals.append(24)

    new_interval = min(feed_intervals) if feed_intervals else 24

    return {
        "feed_interval_hours": new_interval
    }

def calculate_lighting_config(aquarium: Aquariums):
    if not aquarium.has_plants:
        return {
            "enabled": False
        }

    on_hour = 10
    off_hour = 18

    return {
        "enabled": True,
        "on_hour": on_hour,
        "off_hour": off_hour,
        "duration_hours": off_hour - on_hour
    }

def calculate_heating_config(aquarium: Aquariums):
    if aquarium.target_temp_c_min is None or aquarium.target_temp_c_max is None:
        return {
            "enabled": False
        }

    return {
        "enabled": True,
        "target_min": aquarium.target_temp_c_min,
        "target_max": aquarium.target_temp_c_max
    }


def calculate_stocking_level(db: Session, aquarium: Aquariums) -> dict:
    total_waste_load = 0

    inhabitants = (
        db.query(Aquarium_Inhabitants)
        .filter(Aquarium_Inhabitants.aquarium_id == aquarium.id)
        .join(Catalog_Inhabitants)
        .all()
    )

    for link in inhabitants:
        fish = link.inhabitant
        single_fish_load = fish.size_cm

        if (fish.size_cm or 0) > 15:
            single_fish_load *= 1.5

        total_waste_load += single_fish_load * link.quantity

    filter_capacity = aquarium.volume_l

    stocking_percent = (total_waste_load / filter_capacity) * 100

    status = "green"
    if stocking_percent > 80:
        status = "yellow"
    if stocking_percent > 100:
        status = "red"

    return {"percent": round(stocking_percent, 1), "status": status}


def recalculate_aquarium_targets(db: Session, aquarium: Aquariums):
    inhabitants = (
        db.query(Aquarium_Inhabitants)
        .filter(Aquarium_Inhabitants.aquarium_id == aquarium.id)
        .join(Catalog_Inhabitants)
        .all()
    )

    if not inhabitants:
        return

    target_temp_min = -100.0
    target_temp_max = 100.0
    target_ph_min = 0.0
    target_ph_max = 14.0

    first_pass = True

    for link in inhabitants:
        fish = link.inhabitant

        if first_pass:
            target_temp_min = fish.temp_min_c or 22
            target_temp_max = fish.temp_max_c or 28
            target_ph_min = fish.ph_min or 6.0
            target_ph_max = fish.ph_max or 8.0
            first_pass = False
        else:
            if fish.temp_min_c and fish.temp_min_c > target_temp_min:
                target_temp_min = fish.temp_min_c

            if fish.temp_max_c and fish.temp_max_c < target_temp_max:
                target_temp_max = fish.temp_max_c

            if fish.ph_min and fish.ph_min > target_ph_min:
                target_ph_min = fish.ph_min
            if fish.ph_max and fish.ph_max < target_ph_max:
                target_ph_max = fish.ph_max

    if target_temp_min > target_temp_max:
        pass

    aquarium.target_temp_c_min = target_temp_min
    aquarium.target_temp_c_max = target_temp_max
    aquarium.target_ph_min = target_ph_min
    aquarium.target_ph_max = target_ph_max

    db.add(aquarium)
    db.commit()


def predict_nitrogen_cycle_status(db: Session, aquarium_id: int) -> dict:

    aquarium = db.query(Aquariums).filter(Aquariums.id == aquarium_id).first()

    if not aquarium or not aquarium.start_date:
        return {
            "status": "Unknown",
            "percent": 0,
            "message": "Будь ласка, вкажіть дату запуску акваріума в налаштуваннях."
        }

    days_alive = (date.today() - aquarium.start_date).days

    measurement = (
        db.query(Manual_Measurements)
        .filter(Manual_Measurements.aquarium_id == aquarium_id)
        .order_by(desc(Manual_Measurements.timestamp))
        .first()
    )

    if not measurement:
        if days_alive < 5:
            return {
                "status": "New",
                "percent": 5,
                "message": "Акваріум стерильний. Додайте трохи корму, щоб запустити процес, і зробіть тест через 3 дні."
            }
        elif days_alive < 14:
            return {
                "status": "Cycling (Blind)",
                "percent": 20,
                "message": "Іде запуск. Без тестів неможливо сказати точно, але зараз має бути пік аміаку."
            }
        elif days_alive < 30:
            return {
                "status": "Cycling (Blind)",
                "percent": 70,
                "message": "Мав початися пік нітритів. Риб додавати ризиковано без тестів."
            }
        else:
            return {
                "status": "Probably Stable",
                "percent": 95,
                "message": "За часом цикл мав завершитися. Зробіть контрольний тест перед покупкою риби."
            }

    nh3 = float(measurement.ammonia) if measurement.ammonia is not None else 0.0
    no2 = float(measurement.nitrite) if measurement.nitrite is not None else 0.0
    no3 = float(measurement.nitrate) if measurement.nitrate is not None else 0.0

    if days_alive > 35 and (nh3 > 0.2 or no2 > 0.2):
        return {
            "status": "CRASHED",
            "percent": 0,
            "color": "red",
            "message": "УВАГА! Біофільтрація збилася (є аміак/нітрит у старому акваріумі). Терміново підмініть воду!"
        }

    if no2 > 0:
        return {
            "status": "Cycling: Nitrite Spike",
            "percent": 60,
            "color": "orange",
            "message": "Високі нітрити! Це найнебезпечніша фаза. Бактерії працюють, чекайте падіння NO2 в 0."
        }

    if nh3 > 0 and no2 == 0:
        return {
            "status": "Cycling: Ammonia Spike",
            "percent": 25,
            "color": "yellow",
            "message": "Рівень аміаку зростає. Процес пішов! Скоро з'являться нітрити."
        }

    if nh3 == 0 and no2 == 0 and no3 > 0:
        return {
            "status": "STABLE",
            "percent": 100,
            "color": "green",
            "message": "Вітаємо! Азотний цикл встановлено. Вода безпечна для риб."
        }

    if nh3 == 0 and no2 == 0 and no3 == 0:
        if days_alive < 10:
            return {
                "status": "New / Sterile",
                "percent": 10,
                "color": "grey",
                "message": "Вода ідеально чиста. Цикл ще не почався. Додайте джерело аміаку (корм)."
            }
        else:
            return {
                "status": "Suspiciously Clean",
                "percent": 100,
                "color": "blue",
                "message": "Ядів немає, але і нітратів немає. Якщо у вас багато рослин — це норма. Якщо ні — перевірте термін придатності тестів."
            }

    return {"status": "Analyzing", "percent": 50, "message": "Очікування нових даних..."}