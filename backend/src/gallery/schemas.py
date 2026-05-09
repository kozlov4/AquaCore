from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class PostCategory(str, Enum):
    plants = "Рослини"
    other = "Інше"
    inhabitants = "Жителі"
    general_plan = "Загальний план"


class PostIn(BaseModel):
    signature: Optional[str] = None
    category: PostCategory
    created_at: datetime
    aquarium_id: int
    image_id: int
