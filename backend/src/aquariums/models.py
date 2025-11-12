import enum
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, Annotated

from sqlalchemy import (
    String, Text, Boolean, DateTime, Date, ForeignKey, 
    CheckConstraint, DECIMAL, BIGINT, INTEGER, func
)
from sqlalchemy.dialects.postgresql import TIMESTAMPTZ, ENUM
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, declared_attr, relationship
from src.database import Base, TableNameMixin

int_pk = Annotated[int, mapped_column(BIGINT, primary_key=True)]
str_100_not_null = Annotated[str, mapped_column(String(100), nullable=False)]


class ThemeType(enum.Enum):
    light = 'light'
    dark = 'dark'

class TempUnit(enum.Enum):
    C = 'C'
    F = 'F'

class VolumeUnit(enum.Enum):
    L = 'L'
    Gal = 'Gal'

class WaterType(enum.Enum):
    freshwater = 'freshwater'
    saltwater = 'saltwater'


class Aquarium(Base, TableNameMixin):
    id: Mapped[int_pk]
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('user.id', ondelete='CASCADE'))
    name: Mapped[str_100_not_null]
    volume_l: Mapped[Optional[int]] = mapped_column(INTEGER)
    length_cm: Mapped[Optional[int]] = mapped_column(INTEGER)
    width_cm: Mapped[Optional[int]] = mapped_column(INTEGER)
    height_cm: Mapped[Optional[int]] = mapped_column(INTEGER)
    water_type: Mapped[Optional[WaterType]] = mapped_column(ENUM(WaterType))
    start_date: Mapped[Optional[date]] = mapped_column(Date)
    description: Mapped[Optional[str]] = mapped_column(Text)
    ground_type: Mapped[Optional[str]] = mapped_column(String(100))
    lighting_model: Mapped[Optional[str]] = mapped_column(String(100))
    filter_model: Mapped[Optional[str]] = mapped_column(String(100))

    user: Mapped["User"] = relationship(back_populates="aquariums")
    inhabitants: Mapped[list["AquariumInhabitant"]] = relationship(back_populates="aquarium")
    activity_logs: Mapped[list["ActivityLog"]] = relationship(back_populates="aquarium")
    device: Mapped["Device"] = relationship(back_populates="aquarium")
    manual_measurements: Mapped[list["ManualMeasurement"]] = relationship(back_populates="aquarium")
    tasks: Mapped[list["Task"]] = relationship(back_populates="aquarium")




class AquariumInhabitant(Base, TableNameMixin):
    id: Mapped[int_pk]
    aquarium_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('aquarium.id', ondelete='CASCADE'))
    inhabitant_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('cataloginhabitant.id'))
    quantity: Mapped[int] = mapped_column(INTEGER, default=1)
    added_at: Mapped[Optional[date]] = mapped_column(Date)

    aquarium: Mapped["Aquarium"] = relationship(back_populates="inhabitants")
    inhabitant: Mapped["CatalogInhabitant"] = relationship(back_populates="aquarium_links")
