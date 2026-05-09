from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class AquariumType(str, Enum):
    fresh_water = "Прісноводний"
    salty_water = "Морський"


class CreateAquarium(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    volume: float
    type: AquariumType
    created_at: datetime
    image_id: Optional[int] = None
