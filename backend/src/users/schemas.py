from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

from src.users.models import ThemeType, TempUnit, VolumeUnit


class UserProfileRead(BaseModel):
    nickname:Optional[str]
    first_name:Optional[str]
    last_name:Optional[str]

    class Config:
        from_attributes = True


class UserSettingsRead(BaseModel):
    theme: ThemeType
    language: str
    temperature_unit: TempUnit
    volume_unit: VolumeUnit

    class Config:
        from_attributes = True

class UserRead(BaseModel):
    id:int
    email:EmailStr
    role:str
    created_at:datetime

    user_profile: Optional[UserProfileRead] = None
    user_settings: Optional[UserSettingsRead] = None

    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    nickname: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserSettingsUpdate(BaseModel):
    theme: Optional[ThemeType] = None 
    language: Optional[str] = None
    temperature_unit: Optional[TempUnit] = None
    volume_unit: Optional[VolumeUnit] = None

class UserUpdate(BaseModel):
    
    user_profile: Optional[UserProfileUpdate] = None
    user_settings: Optional[UserSettingsUpdate] = None