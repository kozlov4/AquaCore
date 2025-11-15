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

class MediaType(enum.Enum):
    image = 'image'
    video = 'video'

class Media(Base, TableNameMixin):
    id: Mapped[int_pk]
    url: Mapped[str_255_not_null]
    alt_text: Mapped[Optional[str]] = mapped_column(Text)
    media_type: Mapped[Optional[MediaType]] = mapped_column(ENUM(MediaType))
    attachable_type: Mapped[Optional[str]] = mapped_column(String(50))
    attachable_id: Mapped[Optional[int]] = mapped_column(BIGINT)
    created_at: Mapped[timestamp_now]