from datetime import date
from typing import Optional, List

from pydantic import ConfigDict, BaseModel


class EquipmentLogCreate(BaseModel):
    log_type: str
    log_date: date
    description: Optional[str] = None
    is_resolved: bool = True


class EquipmentLogResponse(EquipmentLogCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


class EquipmentCreate(BaseModel):
    category: str
    name: str
    installation_date: date
    specifications: Optional[str] = None
    maintenance_interval_days: Optional[int] = None


class EquipmentUpdate(BaseModel):
    category: Optional[str] = None
    name: Optional[str] = None
    installation_date: Optional[date] = None
    specifications: Optional[str] = None
    maintenance_interval_days: Optional[int] = None


class EquipmentBaseResponse(EquipmentCreate):
    id: int
    days_until_maintenance: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)


class EquipmentResponse(EquipmentBaseResponse):
    logs: List[EquipmentLogResponse] = []


class EquipmentAlertResponse(BaseModel):
    needs_attention_count: int
    message: str | None
    equipment_id: int | None = None
