from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, date
from typing import Optional, List

from src.aquariums.models import WaterType


class AquariumCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    volume_l: int = Field(..., gt=0)
    length_cm: Optional[int] = Field(None, gt=10)
    width_cm: Optional[int] = Field(None, gt=10)
    height_cm: Optional[int] = Field(None, gt=10)
    water_type: WaterType
    start_date: Optional[date] = None
    description: Optional[str] = Field(None, max_length=500)
    ground_type: Optional[str] = Field(None, max_length=100)
    lighting_model: Optional[str] = Field(None, max_length=100)
    filter_model: Optional[str] = Field(None, max_length=100)

class AquariumUpdate(AquariumCreate):
    pass

class CatalogInhabitantSimple(BaseModel):
    id: int
    name: str
    type: str 
    image_url: Optional[str]

    class Config:
        from_attributes = True

class AquariumInhabitantRead(BaseModel):
    id: int
    quantity: int
    added_at: Optional[date]
    
    inhabitant: Optional[CatalogInhabitantSimple] = None 

    class Config:
        from_attributes = True

class DeviceRead(BaseModel):
    id: int
    name: Optional[str]
    status: str

    class Config:
        from_attributes = True


class AquariumListRead(BaseModel):
    id: int
    name: str
    volume_l: Optional[int]
    water_type: Optional[str]
    description: Optional[str]
    
    ground_type: Optional[str]
    lighting_model: Optional[str]
    filter_model: Optional[str] 

    class Config:
        from_attributes = True


class AquariumListResponse(BaseModel):
    aquariums: List[AquariumListRead]

class AquariumRead(AquariumListRead):

    inhabitants: List[AquariumInhabitantRead] = [] 
    device: Optional[DeviceRead] = None
    

    class Config:
        from_attributes = True