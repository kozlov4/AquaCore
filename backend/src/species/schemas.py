from typing import Optional

from pydantic import BaseModel, ConfigDict


class SpeciesBase(BaseModel):
    id: int
    name: str
    scientific_name: Optional[str] = None  # Додали, бо є на картках
    category: str
    image_url: Optional[str] = None
    care_level: str
    min_volume: int

    model_config = ConfigDict(from_attributes=True)


class SpeciesShortResponse(SpeciesBase):
    character: Optional[str] = None
    lighting: Optional[str] = None
    co2: Optional[str] = None
    water_type: Optional[str] = None
    diet: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class SpeciesDetailResponse(SpeciesBase):
    description: Optional[str] = None
    water_type: str
    max_size: str
    temperature: Optional[str] = None
    ph: Optional[str] = None
    lifespan: Optional[str] = None
    diet: Optional[str] = None
    character: Optional[str] = None
    lighting: Optional[str] = None
    co2: Optional[str] = None
