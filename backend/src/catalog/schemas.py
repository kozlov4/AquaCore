from pydantic import BaseModel, Field, condecimal
from typing import Optional, Text
from src.catalog.models import InhabitantType, AggressivenessType

class InhabitantsCreate(BaseModel):
    type: InhabitantType
    name: str = Field(min_length=2, max_length=100)
    species: str = Field(min_length=2, max_length=100)
    description: Optional[Text] = Field(None, min_length=10, max_length=500)
    image_url: Optional[str] = None
    size_cm: Optional[int] = None
    aggressiveness: Optional[AggressivenessType] = None
    lifespan_years: Optional[int] = None
    feeding_frequency: Optional[str] = Field(None, min_length=5, max_length=100)
    feeding_type: Optional[str] = Field(None, min_length=5, max_length=100)
    min_tank_size_l: Optional[int] = Field(None, gt=0)
    min_water_volume_l: Optional[int] = Field(None, gt=0)
    aeration_needed: bool = False
    ph_min: condecimal(max_digits=4, decimal_places=2)
    ph_max: condecimal(max_digits=4, decimal_places=2)
    temp_min_c: condecimal(max_digits=4, decimal_places=2)
    temp_max_c: condecimal(max_digits=4, decimal_places=2)
    dkh_min: condecimal(max_digits=4, decimal_places=2)
    dkh_max: condecimal(max_digits=4, decimal_places=2)
    gh_min: condecimal(max_digits=4, decimal_places=2)
    gh_max: condecimal(max_digits=4, decimal_places=2)
