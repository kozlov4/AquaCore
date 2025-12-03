from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

from src.users.models import ThemeType, TempUnit, VolumeUnit, Language


class UserProfileRead(BaseModel):
    nickname:Optional[str]
    first_name:Optional[str]
    last_name:Optional[str]

    class Config:
        from_attributes = True


class UserSettingsRead(BaseModel):
    theme: ThemeType
    language: Language
    temperature_unit: TempUnit
    volume_unit: VolumeUnit

    class Config:
        from_attributes = True

class UserRead(BaseModel):
    id:int
    email:EmailStr
    role:str
    is_active: bool
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
    language: Optional[Language] = None
    temperature_unit: Optional[TempUnit] = None
    volume_unit: Optional[VolumeUnit] = None

class UserUpdate(BaseModel):
    
    user_profile: Optional[UserProfileUpdate] = None
    user_settings: Optional[UserSettingsUpdate] = None