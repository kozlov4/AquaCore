from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, date
from typing import Optional

from src.aquariums.models import WaterType


class AquariumCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    volume_l: int = Field(..., gt=0)
    length_cm: Optional[int] = Field(None, gt=10)
    width_cm: Optional[int] = Field(None, gt=10)
    height_cm: Optional[int] = Field(None, gt=10)
    water_type: WaterType
    start_date: Optional[date] = None
    description: Optional[str] = Field(None, max_length=500)
    ground_type: Optional[str] = Field(None, max_length=100)
    lighting_model: Optional[str] = Field(None, max_length=100)
    filter_model: Optional[str] = Field(None, max_length=100)