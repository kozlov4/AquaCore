from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class UserProfileRead(BaseModel):
    nickname:Optional[str]
    first_name:Optional[str]
    last_name:Optional[str]

    class Config:
        from_attributes = True


class UserSettingsRead(BaseModel):
    theme: str
    language: str
    temperature_unit: str
    volume_unit: str

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