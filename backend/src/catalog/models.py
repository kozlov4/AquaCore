import enum
from sqlalchemy import Table, Column, ForeignKey, Integer, String
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

class InhabitantType(enum.Enum):
    fish = 'fish'
    plant = 'plant'
    shrimp = 'shrimp'
    snail = 'snail'

class AggressivenessType(enum.Enum):
    peaceful = 'peaceful'
    semi_aggressive = 'semi_aggressive'
    aggressive = 'aggressive'

class Catalog_Inhabitants(Base, TableNameMixin):
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

    aquarium_links: Mapped[list["Aquarium_Inhabitants"]] = relationship(back_populates="inhabitant")

disease_symptom_association = Table(
    'disease_symptom_link',
    Base.metadata,
    Column('disease_id', Integer, ForeignKey('catalog_diseases.id', ondelete="CASCADE"), primary_key=True),
    Column('symptom_id', Integer, ForeignKey('catalogsymptom.id', ondelete="CASCADE"), primary_key=True)
)


class Catalog_Diseases(Base, TableNameMixin):
    id: Mapped[int_pk]
    name: Mapped[str_100_not_null]
    description: Mapped[Optional[str]] = mapped_column(Text)
    symptoms: Mapped[Optional[str]] = mapped_column(Text)
    treatment: Mapped[Optional[str]] = mapped_column(Text)

    symptoms_list: Mapped[list["CatalogSymptom"]] = relationship(
        "CatalogSymptom",
        secondary=disease_symptom_association,
        back_populates="diseases"
    )

class Knowledge_Base_Articles(Base, TableNameMixin):
    id: Mapped[int_pk]
    title: Mapped[str_255_not_null]
    content: Mapped[text_not_null]
    category: Mapped[Optional[str]] = mapped_column(String(100))
    author_id: Mapped[Optional[int]] = mapped_column(BIGINT, ForeignKey('users.id'))

    author: Mapped[Optional["Users"]] = relationship(back_populates="knowledge_base_articles")




class CatalogSymptom(Base, TableNameMixin):
    id: Mapped[int_pk]
    name: Mapped[str_100_not_null]

    diseases: Mapped[list["Catalog_Diseases"]] = relationship(
        "Catalog_Diseases",
        secondary=disease_symptom_association,
        back_populates="symptoms_list"
    )