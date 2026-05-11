from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


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


class SortOrder(str, Enum):
    newest = "newest"
    oldest = "oldest"


class ImageResponse(BaseModel):
    id: int
    cover_image_url: str

    model_config = ConfigDict(from_attributes=True)
