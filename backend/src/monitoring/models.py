import enum
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, Annotated

from sqlalchemy import (
    String, Text, Boolean, DateTime, Date, ForeignKey, 
    CheckConstraint, DECIMAL, BIGINT, INTEGER, func
)
from sqlalchemy.dialects.postgresql import TIMESTAMP, ENUM
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, declared_attr, relationship
from src.database import Base, TableNameMixin

int_pk = Annotated[int, mapped_column(BIGINT, primary_key=True)]
str_100_not_null = Annotated[str, mapped_column(String(100), nullable=False)]
str_255_not_null = Annotated[str, mapped_column(String(255), nullable=False)]
str_unique_not_null = Annotated[str, mapped_column(String(255), unique=True, nullable=False)]
text_not_null = Annotated[str, mapped_column(Text, nullable=False)]
timestamp_now = Annotated[datetime, mapped_column(TIMESTAMP, server_default=func.now())]
date_now = Annotated[date, mapped_column(Date, server_default=func.now())]

class DeviceStatus(enum.Enum):
    online = 'online'
    offline = 'offline'

class Device(Base, TableNameMixin):
    id: Mapped[int_pk]
    aquarium_id: Mapped[Optional[int]] = mapped_column(BIGINT, ForeignKey('aquarium.id', ondelete='SET NULL'))
    api_key: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    name: Mapped[Optional[str]] = mapped_column(String(100))
    status: Mapped[DeviceStatus] = mapped_column(ENUM(DeviceStatus), default=DeviceStatus.offline)

    aquarium: Mapped[Optional["Aquarium"]] = relationship(back_populates="device")
    sensor_measurements: Mapped[list["SensorMeasurement"]] = relationship(back_populates="device")

class SensorMeasurement(Base, TableNameMixin):
    id: Mapped[int_pk]
    device_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('device.id', ondelete='CASCADE'))
    timestamp: Mapped[timestamp_now]
    temperature: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(5, 2))
    ph: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(4, 2))
    tds: Mapped[Optional[int]] = mapped_column(INTEGER)
    turbidity: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(5, 2))

    device: Mapped["Device"] = relationship(back_populates="sensor_measurements")

class ManualMeasurement(Base, TableNameMixin):
    id: Mapped[int_pk]
    aquarium_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('aquarium.id', ondelete='CASCADE'))
    timestamp: Mapped[timestamp_now]
    ammonia: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(4, 2))
    nitrite: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(4, 2))
    nitrate: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(4, 2))
    gh: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(4, 2))
    kh: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(4, 2))
    phosphate: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(4, 2))

    aquarium: Mapped["Aquarium"] = relationship(back_populates="manual_measurements")


class ActivityLog(Base, TableNameMixin):
    id: Mapped[int_pk]
    aquarium_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('aquarium.id'), nullable=False)
    timestamp: Mapped[timestamp_now] = mapped_column(nullable=False)
    description: Mapped[text_not_null]
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    reference_id: Mapped[Optional[int]] = mapped_column(BIGINT)

    aquarium: Mapped["Aquarium"] = relationship(back_populates="activity_logs")