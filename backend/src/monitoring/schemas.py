from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, date
from typing import Optional, List
from decimal import Decimal

class ManualDataCreate(BaseModel):
    ammonia: Optional[Decimal]
    nitrite: Optional[Decimal]
    nitrate: Optional[Decimal]
    gh: Optional[Decimal]
    kh: Optional[Decimal]
    phosphate: Optional[Decimal]

class NitrogenStatusResponse(BaseModel):
    status: str
    percent: int
    message: str

class SymptomDTO(BaseModel):
    id: int
    name: str

class SmartDiagnosisRequest(BaseModel):
    symptom_ids: List[int]


class SensorMeasurements(BaseModel):
    temperature: float
    ph: float
    tds: float
    turbidity: float
    water_level: int
    room_temperature: float
    room_humidity: float

class SensorIncoming(BaseModel):
    api_key: str
    measurements: SensorMeasurements


class SensorMeasurementResponse(BaseModel):
    id: int
    device_id: int
    timestamp: datetime
    temperature: Optional[float]
    ph: Optional[float]
    tds: Optional[int]
    turbidity: Optional[float]
    water_level: Optional[int]
    room_temperature: Optional[float]
    room_humidity: Optional[float]

    class Config:
        from_attributes = True

class ManualMeasurementResponse(BaseModel):
    id: int
    aquarium_id: int
    timestamp: datetime
    ammonia: Optional[float]
    nitrite: Optional[float]
    nitrate: Optional[float]
    gh: Optional[float]
    kh: Optional[float]
    phosphate: Optional[float]

    class Config:
        from_attributes = True