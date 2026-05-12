from datetime import date
from enum import Enum

from pydantic import BaseModel


class CreateWaterTest(BaseModel):
    test_date: date

    ph: float | None = None
    gh: float | None = None
    kh: float | None = None

    nh3: float | None = None
    no2: float | None = None
    no3: float | None = None


class WaterMetric(str, Enum):
    ph = "ph"
    gh = "gh"
    kh = "kh"
    nh3 = "nh3"
    no2 = "no2"
    no3 = "no3"


class AnalyticsPeriod(str, Enum):
    week = "7d"
    month = "month"
    year = "year"


class AnalyticsPoint(BaseModel):
    date: date
    value: float


class WaterAnalyticsResponse(BaseModel):
    metric: str

    current_value: float | None
    average_value: float | None

    min_value: float | None
    max_value: float | None

    min_date: date | None
    max_date: date | None

    optimal_min: float | None
    optimal_max: float | None

    points: list[AnalyticsPoint]
