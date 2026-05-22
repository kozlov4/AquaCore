from datetime import date
from typing import Optional, List

from pydantic import BaseModel, ConfigDict

from core.models.aquarium import ChangeType


class WaterChangeScheduleUpdate(BaseModel):
    water_change_interval_days: int
    water_change_percentage: int


class WaterChangeCreate(BaseModel):
    change_type: ChangeType
    percentage: int
    change_date: date
    comment: Optional[str] = None


class WaterChangeResponse(WaterChangeCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


class WaterChangeStatusResponse(BaseModel):
    interval_days: int
    target_percentage: int
    last_change_date: Optional[date]
    next_change_date: Optional[date]
    days_left: Optional[int]
    history: List[WaterChangeResponse]
