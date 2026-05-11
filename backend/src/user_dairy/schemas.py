from enum import Enum

from pydantic import BaseModel, ConfigDict
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


class DiaryUpdate(BaseModel):
    title: Optional[str] = None
    observation: Optional[str] = None
    tag: Optional[str] = None
    is_pinned: Optional[bool] = None
    image_id: Optional[int] = None


class DiaryListResponse(DiaryBase):
    id: int
    aquarium_name: Optional[str] = None
    tag: str
    cover_image_url: Optional[str] = None
    is_pinned: Optional[bool]


class DiaryCreate(DiaryBase):
    aquarium_id: int
    tag: DiaryTag
    image_id: Optional[int] = None
    is_pinned: Optional[bool] = False
