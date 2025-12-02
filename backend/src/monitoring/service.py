import os
from typing import Annotated
from sqlalchemy import func
from fastapi import Depends, HTTPException, status
from starlette import status
from src.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from src.aquariums.service import get_aquarium
from src.monitoring.schemas import ManualDataCreate
from src.monitoring.models import Manual_Measurements, Sensor_Measurements, Devices

db_dependency = Annotated[Session, Depends(get_db)]

def create_manual_measurement(db: Session, data: ManualDataCreate, aquarium_id: int, user_id:int):
    aquarium = get_aquarium(db=db, aquarium_id=aquarium_id)

    if aquarium.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ви не можете вносити тести в чужі акваріуми"
        )
    
    new_manual_measurement = Manual_Measurements(
        aquarium_id=aquarium.id,
        ammonia=data.ammonia,
        nitrite=data.nitrite,
        nitrate=data.nitrate,
        gh=data.gh,
        kh=data.kh,
        phosphate=data.phosphate
    )


    db.add(new_manual_measurement)
    db.commit()
    db.refresh(new_manual_measurement)

    return {
        "message": "Тести успішно додані",
        "measurement": new_manual_measurement
    }


def analyze_parameter_trends(
        db: Session,
        aquarium_id: int,
        parameter: str = "ph",
        n_points: int = 10
) -> dict:
    target_field = getattr(Sensor_Measurements, parameter)

    stmt = (
        select(Sensor_Measurements)
        .join(Devices)
        .where(Devices.aquarium_id == aquarium_id)
        .where(target_field.isnot(None))
        .order_by(desc(Sensor_Measurements.timestamp))
        .limit(n_points)
    )

    measurements = db.scalars(stmt).all()

    if len(measurements) < 2:
        return {
            "status": "Unknown",
            "rate_per_hour": 0,
            "message": "Недостатньо даних для аналізу тренду."
        }

    newest = measurements[0]
    oldest = measurements[-1]

    val_diff = float(getattr(newest, parameter)) - float(getattr(oldest, parameter))

    time_diff_seconds = (newest.timestamp - oldest.timestamp).total_seconds()

    if time_diff_seconds == 0:
        return {"status": "Error", "message": "Помилка часу вимірювань."}

    time_diff_hours = time_diff_seconds / 3600.0

    rate_per_hour = val_diff / time_diff_hours

    THRESHOLD = 0.2

    if parameter == "ph":
        if rate_per_hour < -THRESHOLD:
            return {
                "status": "CRITICAL DROP",
                "rate_per_hour": round(rate_per_hour, 3),
                "color": "red",
                "message": f"УВАГА! pH різко падає! ({round(rate_per_hour, 2)} за годину). Ризик pH-шоку."
            }
        elif rate_per_hour > THRESHOLD:
            return {
                "status": "Rapid Rise",
                "rate_per_hour": round(rate_per_hour, 3),
                "color": "orange",
                "message": f"pH різко зростає ({round(rate_per_hour, 2)} за годину). Можливий викид аміаку."
            }

    elif parameter == "temperature":
        if abs(rate_per_hour) > 2.0:
            return {
                "status": "Temp Shock",
                "rate_per_hour": round(rate_per_hour, 2),
                "color": "red",
                "message": "Температурний шок! Вода змінює температуру занадто швидко."
            }

    return {
        "status": "Stable",
        "rate_per_hour": round(rate_per_hour, 3),
        "color": "green",
        "message": "Параметри стабільні."
    }
