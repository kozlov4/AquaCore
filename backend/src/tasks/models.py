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
str_255_not_null = Annotated[str, mapped_column(String(255), nullable=False)]
str_unique_not_null = Annotated[str, mapped_column(String(255), unique=True, nullable=False)]
text_not_null = Annotated[str, mapped_column(Text, nullable=False)]
timestamp_now = Annotated[datetime, mapped_column(TIMESTAMPTZ, server_default=func.now())]
date_now = Annotated[date, mapped_column(Date, server_default=func.now())]


class Task(Base, TableNameMixin):
    id: Mapped[int_pk]
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('user.id'), nullable=False)
    aquarium_id: Mapped[Optional[int]] = mapped_column(BIGINT, ForeignKey('aquarium.id'))
    title: Mapped[str_255_not_null]
    description: Mapped[Optional[str]] = mapped_column(Text)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    recurrence_rule: Mapped[Optional[str]] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    user: Mapped["User"] = relationship(back_populates="tasks")
    aquarium: Mapped[Optional["Aquarium"]] = relationship(back_populates="tasks")
    completions: Mapped[list["TaskCompletion"]] = relationship(back_populates="task")

class TaskCompletion(Base, TableNameMixin):
    id: Mapped[int_pk]
    task_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('task.id'), nullable=False)
    completion_date: Mapped[timestamp_now] = mapped_column(nullable=False)

    task: Mapped["Task"] = relationship(back_populates="completions")