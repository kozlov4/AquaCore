from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, date
from typing import Optional, List
from decimal import Decimal

class ManualDataCreate(BaseModel):
    ammonia: Optional[Decimal]
    nitrite: Optional[Decimal]
    nitrate: Optional[Decimal]
    gh: Optional[Decimal]
    kh: Optional[Decimal]
    phosphate: Optional[Decimal]

class NitrogenStatusResponse(BaseModel):
    status: str
    percent: int
    message: str