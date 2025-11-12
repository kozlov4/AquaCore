import enum
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, Annotated

from sqlalchemy import (
    String, Text, Boolean, DateTime, Date, ForeignKey, 
    CheckConstraint, DECIMAL, BIGINT, INTEGER, func
)
from sqlalchemy.dialects.postgresql import TIMESTAMPTZ, ENUM
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, declared_attr

class Base(DeclarativeBase):
    pass

class TableNameMixin:
    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower()
    

class UserRole(enum.Enum):
    user = 'user'
    admin = 'admin'

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

class InhabitantType(enum.Enum):
    fish = 'fish'
    plant = 'plant'
    shrimp = 'shrimp'
    snail = 'snail'

class AggressivenessType(enum.Enum):
    peaceful = 'peaceful'
    semi_aggressive = 'semi-aggressive'
    aggressive = 'aggressive'

class DeviceStatus(enum.Enum):
    online = 'online'
    offline = 'offline'

class MediaType(enum.Enum):
    image = 'image'
    video = 'video'


int_pk = Annotated[int, mapped_column(BIGINT, primary_key=True)]
str_100_not_null = Annotated[str, mapped_column(String(100), nullable=False)]
str_255_not_null = Annotated[str, mapped_column(String(255), nullable=False)]
str_unique_not_null = Annotated[str, mapped_column(String(255), unique=True, nullable=False)]
text_not_null = Annotated[str, mapped_column(Text, nullable=False)]
timestamp_now = Annotated[datetime, mapped_column(TIMESTAMPTZ, server_default=func.now())]
date_now = Annotated[date, mapped_column(Date, server_default=func.now())]



class User(Base, TableNameMixin):
    id: Mapped[int_pk]
    email: Mapped[str_unique_not_null]
    hashed_password: Mapped[str_255_not_null]
    role: Mapped[UserRole] = mapped_column(ENUM(UserRole), default=UserRole.user)
    created_at: Mapped[timestamp_now]

class UserProfile(Base, TableNameMixin):
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('user.id', ondelete='CASCADE'), primary_key=True)
    nickname: Mapped[Optional[str]] = mapped_column(String(50), unique=True)
    first_name: Mapped[Optional[str]] = mapped_column(String(100))
    last_name: Mapped[Optional[str]] = mapped_column(String(100))

class UserSettings(Base, TableNameMixin):
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('user.id', ondelete='CASCADE'), primary_key=True)
    theme: Mapped[ThemeType] = mapped_column(ENUM(ThemeType), default=ThemeType.light)
    language: Mapped[str] = mapped_column(String(5), default='ua')
    temperature_unit: Mapped[TempUnit] = mapped_column(ENUM(TempUnit), default=TempUnit.C)
    volume_unit: Mapped[VolumeUnit] = mapped_column(ENUM(VolumeUnit), default=VolumeUnit.L)


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


class CatalogInhabitant(Base, TableNameMixin):
    id: Mapped[int_pk]
    type: Mapped[InhabitantType] = mapped_column(ENUM(InhabitantType), nullable=False)
    name: Mapped[str_100_not_null]
    species: Mapped[Optional[str]] = mapped_column(String(100))
    description: Mapped[Optional[str]] = mapped_column(Text)
    image_url: Mapped[Optional[str]] = mapped_column(String(255))
    size_cm: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(5, 2))
    aggressiveness: Mapped[Optional[AggressivenessType]] = mapped_column(ENUM(AggressivenessType))
    lifespan_years: Mapped[Optional[int]] = mapped_column(INTEGER)
    feeding_frequency: Mapped[Optional[str]] = mapped_column(String(100))
    feeding_type: Mapped[Optional[str]] = mapped_column(String(100))
    min_tank_size_l: Mapped[Optional[int]] = mapped_column(INTEGER)
    min_water_volume_l: Mapped[Optional[int]] = mapped_column(INTEGER)
    aeration_needed: Mapped[bool] = mapped_column(Boolean, default=False)
    ph_min: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(4, 2))
    ph_max: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(4, 2))
    temp_min_c: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(4, 2))
    temp_max_c: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(4, 2))
    dkh_min: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(4, 2))
    dkh_max: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(4, 2))
    gh_min: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(4, 2))
    gh_max: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(4, 2))

class CatalogDisease(Base, TableNameMixin):
    id: Mapped[int_pk]
    name: Mapped[str_100_not_null]
    description: Mapped[Optional[str]] = mapped_column(Text)
    symptoms: Mapped[Optional[str]] = mapped_column(Text)
    treatment: Mapped[Optional[str]] = mapped_column(Text)

class AquariumInhabitant(Base, TableNameMixin):
    id: Mapped[int_pk]
    aquarium_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('aquarium.id', ondelete='CASCADE'))
    inhabitant_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('cataloginhabitant.id'))
    quantity: Mapped[int] = mapped_column(INTEGER, default=1)
    added_at: Mapped[Optional[date]] = mapped_column(Date)


class ActivityLog(Base, TableNameMixin):
    id: Mapped[int_pk]
    aquarium_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('aquarium.id'), nullable=False)
    timestamp: Mapped[timestamp_now] = mapped_column(nullable=False)
    description: Mapped[text_not_null]
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    reference_id: Mapped[Optional[int]] = mapped_column(BIGINT)

class Device(Base, TableNameMixin):
    id: Mapped[int_pk]
    aquarium_id: Mapped[Optional[int]] = mapped_column(BIGINT, ForeignKey('aquarium.id', ondelete='SET NULL'))
    api_key: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    name: Mapped[Optional[str]] = mapped_column(String(100))
    status: Mapped[DeviceStatus] = mapped_column(ENUM(DeviceStatus), default=DeviceStatus.offline)

class SensorMeasurement(Base, TableNameMixin):
    id: Mapped[int_pk]
    device_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('device.id', ondelete='CASCADE'))
    timestamp: Mapped[timestamp_now]
    temperature: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(5, 2))
    ph: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(4, 2))
    tds: Mapped[Optional[int]] = mapped_column(INTEGER)
    turbidity: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(5, 2))

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


class Media(Base, TableNameMixin):
    id: Mapped[int_pk]
    url: Mapped[str_255_not_null]
    alt_text: Mapped[Optional[str]] = mapped_column(Text)
    media_type: Mapped[Optional[MediaType]] = mapped_column(ENUM(MediaType))
    attachable_type: Mapped[Optional[str]] = mapped_column(String(50))
    attachable_id: Mapped[Optional[int]] = mapped_column(BIGINT)
    created_at: Mapped[timestamp_now]

class Post(Base, TableNameMixin):
    id: Mapped[int_pk]
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('user.id', ondelete='CASCADE'))
    content: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[timestamp_now]

class Like(Base, TableNameMixin):
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('user.id', ondelete='CASCADE'), primary_key=True)
    post_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('post.id', ondelete='CASCADE'), primary_key=True)
    created_at: Mapped[timestamp_now]

class Follow(Base, TableNameMixin):
    follower_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('user.id', ondelete='CASCADE'), primary_key=True)
    following_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('user.id', ondelete='CASCADE'), primary_key=True)


class Task(Base, TableNameMixin):
    id: Mapped[int_pk]
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('user.id'), nullable=False)
    aquarium_id: Mapped[Optional[int]] = mapped_column(BIGINT, ForeignKey('aquarium.id'))
    title: Mapped[str_255_not_null]
    description: Mapped[Optional[str]] = mapped_column(Text)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    recurrence_rule: Mapped[Optional[str]] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

class TaskCompletion(Base, TableNameMixin):
    id: Mapped[int_pk]
    task_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('task.id'), nullable=False)
    completion_date: Mapped[timestamp_now] = mapped_column(nullable=False)

class KnowledgeBaseArticle(Base, TableNameMixin):
    id: Mapped[int_pk]
    title: Mapped[str_255_not_null]
    content: Mapped[text_not_null]
    category: Mapped[Optional[str]] = mapped_column(String(100))
    author_id: Mapped[Optional[int]] = mapped_column(BIGINT, ForeignKey('user.id'))