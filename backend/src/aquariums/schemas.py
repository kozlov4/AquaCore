from datetime import date
from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, ConfigDict

from species.schemas import SpeciesShortResponse


class AquariumType(str, Enum):
    fresh_water = "Прісноводний"
    salty_water = "Морський"


class CreateAquarium(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    volume: float
    type: AquariumType
    created_at: datetime
    image_id: Optional[int] = None


class UpdateAquarium(CreateAquarium):
    pass


class AquariumNameResponse(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)


class LastWaterTestDTO(BaseModel):
    days_ago: int
    ph: Optional[float] = None
    gh: Optional[float] = None
    kh: Optional[float] = None
    nh3: Optional[float] = None
    no2: Optional[float] = None
    no3: Optional[float] = None


class PopulationDTO(BaseModel):
    species_names: str
    total_quantity: int


class AquariumCardResponse(BaseModel):
    id: int
    name: str
    volume: float
    image_url: Optional[str] = None

    population: Optional[PopulationDTO] = None
    last_test: Optional[LastWaterTestDTO] = None

    model_config = ConfigDict(from_attributes=True)


class InhabitantCreate(BaseModel):
    species_id: int
    quantity: int
    settlement_date: date


class InhabitantResponse(BaseModel):
    id: int
    quantity: int
    settlement_date: date
    species: "SpeciesShortResponse"

    model_config = ConfigDict(from_attributes=True)


class CompatibilityIssue(BaseModel):
    title: str
    description: str


class CheckCompatibilityResponse(BaseModel):
    status: str
    status_title: str
    issues: List[CompatibilityIssue]


class PopulationResponse(BaseModel):
    total_species: int
    total_individuals: int
    overall_compatibility_status: str
    overall_compatibility_text: str
    inhabitants: List[InhabitantResponse]
