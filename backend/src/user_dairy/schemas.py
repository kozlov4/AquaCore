from enum import Enum

from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional


class DiaryBase(BaseModel):
    created_at: datetime
    title: str
    observation: str

    model_config = ConfigDict(from_attributes=True)


class DiaryTag(str, Enum):
    plants_fertilizers = "plants_fertilizers"
    diseases_health_issues = "diseases_health_issues"
    behavior_spawning = "behavior_spawning"
    equipment = "equipment"


class DiaryListResponse(DiaryBase):
    id: int
    aquarium_name: Optional[str] = None
    tag: str
    cover_image_url: Optional[str] = None
    is_pinned: Optional[bool]


class DiaryResponse(DiaryBase):
    cover_image_url: Optional[str] = None
    tag: str
    aquarium_name: Optional[str] = None


class DiaryCreate(DiaryBase):
    aquarium_id: int
    tag: DiaryTag
    image_id: Optional[int] = None
    is_pinned: Optional[bool] = False


class DiaryUpdate(BaseModel):
    created_at: datetime
    aquarium_id: int
    tag: DiaryTag

    title: str = Field(..., min_length=1, description="Заголовок не може бути порожнім")
    observation: str = Field(
        ..., min_length=1, description="Спостереження не може бути порожнім"
    )

    image_id: Optional[int] = None
    is_pinned: bool = False
