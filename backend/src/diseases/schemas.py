from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict


class SortByTargetType(str, Enum):
    shrimps = "Безхребетні"
    fish = "Риби"


class DiseasesCardResponse(BaseModel):
    id: int
    name: str
    tags: list[str] = []
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class DiagnosticStepResponse(BaseModel):
    id: int
    text: str

    model_config = ConfigDict(from_attributes=True)


class TreatmentStepResponse(BaseModel):
    id: int
    step_number: int
    text: str
    subtext: Optional[str] = None  # Серый текст, может быть пустым

    model_config = ConfigDict(from_attributes=True)


class DiseaseDetailResponse(BaseModel):
    id: int
    name: str
    danger_level: str
    causes_text: str

    tags: list[str] = []
    avatar_url: Optional[str] = None

    diagnostic_steps: list[DiagnosticStepResponse] = []
    treatment_steps: list[TreatmentStepResponse] = []

    model_config = ConfigDict(from_attributes=True)
