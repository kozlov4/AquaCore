
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc
from sqlalchemy.orm import Session
from starlette import status

from src.database import get_db
from src.auth.service import get_current_user
from src.monitoring.models import Devices, Manual_Measurements, Sensor_Measurements
from src.monitoring.service import create_manual_measurement
from src.monitoring.schemas import ManualDataCreate, SensorIncoming, SensorMeasurementResponse,ManualMeasurementResponse

router = APIRouter(prefix="/measurements", tags=["Measurements 📈"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/sensor/{device_id}", response_model=list[SensorMeasurementResponse])
def get_sensor_measurements(
        device_id: int,
        limit: int = 50,
        db: Session = Depends(get_db)
):
  measurements = db.query(Sensor_Measurements) \
    .filter(Sensor_Measurements.device_id == device_id) \
    .order_by(desc(Sensor_Measurements.timestamp)) \
    .limit(limit) \
    .all()

  if not measurements:
    return []

  return measurements

@router.get("/manual/{aquarium_id}", response_model=list[ManualMeasurementResponse])
def get_manual_measurements(
        aquarium_id: int,
        limit: int = 20,
        db: Session = Depends(get_db)
):

  measurements = db.query(Manual_Measurements) \
    .filter(Manual_Measurements.aquarium_id == aquarium_id) \
    .order_by(desc(Manual_Measurements.timestamp)) \
    .limit(limit) \
    .all()

  if not measurements:
    return []

  return measurements


@router.post("/manual/{aquarium_id}")
async def add_manual_measurements(
  db:db_dependency,
  data:ManualDataCreate,
  aquarium_id:int,
  user:user_dependency
):
  return create_manual_measurement(db=db, data=data, aquarium_id=aquarium_id, user_id=user.get("user_id"))


@router.post("/sensor", status_code=status.HTTP_200_OK)
def receive_sensor_data_route(data: SensorIncoming, db: db_dependency):
  device = db.query(Devices).filter(Devices.api_key == data.api_key).first()

  if not device:
    raise HTTPException(status_code=404, detail="Девайс не знайдено або невірний api key")

  new_measurement = Sensor_Measurements(
    device_id=device.id,
    temperature=data.measurements.temperature,
    ph=data.measurements.ph,
    tds=data.measurements.tds,
    turbidity=data.measurements.turbidity,
    water_level=data.measurements.water_level,
    room_temperature=data.measurements.room_temperature,
    room_humidity=data.measurements.room_humidity
  )

  db.add(new_measurement)
  db.commit()
  db.refresh(new_measurement)

  return {"status": "success", "message": "Дані збережено"}