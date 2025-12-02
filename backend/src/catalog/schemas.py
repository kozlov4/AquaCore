from pydantic import BaseModel, Field, condecimal
from typing import Optional, Text, List

from pydantic.v1.errors import cls_kwargs

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

    model_config = {
        "from_attributes": True
    }

class InhabitantsUpdate(InhabitantsCreate):
    pass

    model_config = {
        "from_attributes": True
    }

class InhabitantsShowOne(BaseModel):
    id:int
    type: InhabitantType
    name: str
    species: str
    description: Optional[Text] = None
    image_url: Optional[str] = None
    size_cm: Optional[int] = None
    aggressiveness: Optional[AggressivenessType] = None
    lifespan_years: Optional[int] = None
    feeding_frequency: Optional[str] = None
    feeding_type: Optional[str] = None
    min_tank_size_l: Optional[int] = None
    min_water_volume_l: Optional[int] = None
    aeration_needed: bool = False

    ph_min: Optional[condecimal(max_digits=4, decimal_places=2)] = None
    ph_max: Optional[condecimal(max_digits=4, decimal_places=2)] = None
    temp_min_c: Optional[condecimal(max_digits=4, decimal_places=2)] = None
    temp_max_c: Optional[condecimal(max_digits=4, decimal_places=2)] = None
    dkh_min: Optional[condecimal(max_digits=4, decimal_places=2)] = None
    dkh_max: Optional[condecimal(max_digits=4, decimal_places=2)] = None
    gh_min: Optional[condecimal(max_digits=4, decimal_places=2)] = None
    gh_max: Optional[condecimal(max_digits=4, decimal_places=2)] = None

    model_config = {
        "from_attributes": True
    }

class InhabitantsShowList(BaseModel):
    id:int
    name: str
    species: str
    image_url: Optional[str] = None
    size_cm: Optional[int] = None
    lifespan_years: Optional[int] = None

    model_config = {
        "from_attributes": True
    }

class DiseasesShow(BaseModel):
    name:str
    description: Optional[Text] = None
    symptoms:Optional[Text]
    treatment:Optional[Text]

class InhabitantsFilter(BaseModel):
    name: Optional[str] = None
    type: Optional[InhabitantType] = None
    aggressiveness: Optional[AggressivenessType] = None

    min_size_cm: Optional[float] = None
    max_size_cm: Optional[float] = None

    min_lifespan: Optional[int] = None
    max_lifespan: Optional[int] = None

    min_tank_size_l: Optional[int] = None
    min_water_volume_l: Optional[int] = None

    aeration_needed: Optional[bool] = None

    ph_min: Optional[float] = None
    ph_max: Optional[float] = None

    temp_min_c: Optional[float] = None
    temp_max_c: Optional[float] = None

    gh_min: Optional[float] = None
    gh_max: Optional[float] = None

    dkh_min: Optional[float] = None
    dkh_max: Optional[float] = None


class AddInhabitantRequest(BaseModel):
    inhabitant_id: int
    quantity: int = Field(gt=0)
    ignore_warnings: bool = Field(False)

class AddInhabitantResponse(BaseModel):
    success: bool
    added: bool
    warnings: List[str] = []
    message: str