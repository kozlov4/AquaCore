from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Optional

class ExpenseFrequency(str, Enum):
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    EVERY_3_MONTHS = "every_3_months"
    EVERY_6_MONTHS = "every_6_months"
    YEARLY = "yearly"

class ConsumableItem(BaseModel):
    name: str = Field(..., example="Корм TetraMin")
    price: float = Field(..., example=300.0, description="Ціна за упаковку")
    frequency: ExpenseFrequency = Field(..., description="На скільки вистачає упаковки")

class EconomyRequest(BaseModel):
    electricity_price: float = Field(..., example=2.64, description="Ціна за кВт*год (грн)")
    water_price_m3: float = Field(..., example=30.0, description="Ціна за куб води (грн)")
    manual_water_change_percent: int = Field(30, description="% підміни води на тиждень")
    consumables: List[ConsumableItem] = []

class EconomyResponse(BaseModel):
    total_monthly_cost: float
    currency: str = "UAH"
    breakdown: dict
    message: str