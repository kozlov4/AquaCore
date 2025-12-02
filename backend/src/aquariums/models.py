import enum
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, Annotated

from sqlalchemy import (
    String, Text, Boolean, DateTime, Date, ForeignKey, 
    CheckConstraint, DECIMAL, BIGINT, INTEGER, func
)
from sqlalchemy.dialects.postgresql import  ENUM
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, declared_attr, relationship
from src.database import Base, TableNameMixin

int_pk = Annotated[int, mapped_column(BIGINT, primary_key=True)]
str_100_not_null = Annotated[str, mapped_column(String(100), nullable=False)]
int_not_null = Annotated[int, mapped_column(INTEGER, nullable=False)]


class WaterType(enum.Enum):
    freshwater = 'freshwater'
    saltwater = 'saltwater'


class Aquariums(Base, TableNameMixin):
    id: Mapped[int_pk]
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('users.id', ondelete='CASCADE'))
    name: Mapped[str_100_not_null]
    volume_l: Mapped[int_not_null]
    length_cm: Mapped[Optional[int]] = mapped_column(INTEGER)
    width_cm: Mapped[Optional[int]] = mapped_column(INTEGER)
    height_cm: Mapped[Optional[int]] = mapped_column(INTEGER)
    water_type: Mapped[Optional[WaterType]] = mapped_column(ENUM(WaterType), nullable=False)
    start_date: Mapped[Optional[date]] = mapped_column(Date)
    description: Mapped[Optional[str]] = mapped_column(Text)
    ground_type: Mapped[Optional[str]] = mapped_column(String(100))
    lighting_model: Mapped[Optional[str]] = mapped_column(String(100))
    filter_model: Mapped[Optional[str]] = mapped_column(String(100))
    has_plants: Mapped[bool] = mapped_column(Boolean, default=False)

    target_temp_c_min: Mapped[Optional[float]] = mapped_column(DECIMAL(4, 2))
    target_temp_c_max: Mapped[Optional[float]] = mapped_column(DECIMAL(4, 2))

    target_ph_min: Mapped[Optional[float]] = mapped_column(DECIMAL(4, 2))
    target_ph_max: Mapped[Optional[float]] = mapped_column(DECIMAL(4, 2))

    target_tds_min: Mapped[Optional[int]] = mapped_column(INTEGER)
    target_tds_max: Mapped[Optional[int]] = mapped_column(INTEGER)

    target_gh_min: Mapped[Optional[float]] = mapped_column(DECIMAL(4, 2))
    target_gh_max: Mapped[Optional[float]] = mapped_column(DECIMAL(4, 2))

    target_kh_min: Mapped[Optional[float]] = mapped_column(DECIMAL(4, 2))
    target_kh_max: Mapped[Optional[float]] = mapped_column(DECIMAL(4, 2))

    target_ammonia_max: Mapped[Optional[float]] = mapped_column(
        DECIMAL(4, 2), default=0.05
    )
    target_nitrite_max: Mapped[Optional[float]] = mapped_column(
        DECIMAL(4, 2), default=0.05
    )
    target_nitrate_max: Mapped[Optional[float]] = mapped_column(
        DECIMAL(5, 2), default=30.00
    )

    target_phosphate_max: Mapped[Optional[float]] = mapped_column(DECIMAL(4, 2))

    is_auto_targets: Mapped[bool] = mapped_column(
        Boolean, default=True
    )

    user: Mapped["Users"] = relationship(back_populates="aquariums")
    inhabitants: Mapped[list["Aquarium_Inhabitants"]] = relationship(back_populates="aquarium")
    activity_logs: Mapped[list["Activity_Log"]] = relationship(back_populates="aquarium")
    device: Mapped["Devices"] = relationship(back_populates="aquarium", uselist=False)
    manual_measurements: Mapped[list["Manual_Measurements"]] = relationship(back_populates="aquarium")
    tasks: Mapped[list["Tasks"]] = relationship(back_populates="aquarium")




class Aquarium_Inhabitants(Base, TableNameMixin):
    id: Mapped[int_pk]
    aquarium_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('aquariums.id', ondelete='CASCADE'))
    inhabitant_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('catalog_inhabitants.id'))
    quantity: Mapped[int] = mapped_column(INTEGER, default=1)
    added_at: Mapped[Optional[date]] = mapped_column(Date)

    aquarium: Mapped["Aquariums"] = relationship(back_populates="inhabitants")
    inhabitant: Mapped["Catalog_Inhabitants"] = relationship(back_populates="aquarium_links")
