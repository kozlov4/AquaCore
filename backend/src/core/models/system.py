import enum
from datetime import date, datetime, timedelta
from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    Date,
)
from sqlalchemy import ForeignKey, String, Text, DateTime, Enum as SQLEnum, JSON
from sqlalchemy import (
    Integer,
    CheckConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .user import User
    from .aquarium import Aquarium
    from .base import Image


class Notification(Base):
    __tablename__ = "notifications"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    actor_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )
    post_id: Mapped[int | None] = mapped_column(
        ForeignKey("posts.id", ondelete="CASCADE")
    )

    image_id: Mapped[int | None] = mapped_column(
        ForeignKey("images.id", ondelete="SET NULL")
    )

    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    author: Mapped["User"] = relationship(foreign_keys=[actor_id])

    recipient: Mapped["User"] = relationship(
        foreign_keys=[user_id], back_populates="notifications"
    )

    image: Mapped["Image"] = relationship()

    @property
    def image_url(self) -> str | None:
        if self.image:
            return self.image.image_url
        return None


class Report(Base):
    __tablename__ = "reports"

    reporter_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    reported_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    reported_post_id: Mapped[int | None] = mapped_column(ForeignKey("posts.id"))
    reason: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(50), default="pending")
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)


class BannedEmail(Base):
    __tablename__ = "banned_emails"

    email: Mapped[str] = mapped_column(String(255), unique=True)
    reason: Mapped[str] = mapped_column(Text)
    banned_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)


class VerificationCode(Base):
    __tablename__ = "verification_codes"

    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    code: Mapped[str] = mapped_column(String(6))
    action_type: Mapped[str] = mapped_column(String(50))
    payload: Mapped[str | None] = mapped_column(String(255))
    expires_at: Mapped[datetime] = mapped_column(DateTime)
    is_used: Mapped[bool] = mapped_column(Boolean, default=False)


class Feedback(Base):
    __tablename__ = "feedbacks"

    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    rate: Mapped[int] = mapped_column(Integer)
    description: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime)

    user: Mapped["User"] = relationship(back_populates="feedback")

    __table_args__ = (
        CheckConstraint("rate >= 1 AND rate <= 5", name="check_valid_rate"),
    )


class TaskType(str, Enum):
    WATER_CHANGE = "Підміна води"
    MAINTENANCE = "Обслуговування"
    TESTS = "Тести води"
    PLANTS = "Рослини"
    CUSTOM = "Власне завдання"


class RepeatType(str, Enum):
    NONE = "Не повторювати"
    DAILY = "Щодня"
    WEEKLY = "Щотижня"
    MONTHLY = "Щомісяця"


class Task(Base):
    __tablename__ = "tasks"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))

    aquarium_id: Mapped[int | None] = mapped_column(
        ForeignKey("aquariums.id", ondelete="CASCADE"), nullable=True
    )

    task_type: Mapped[TaskType] = mapped_column(SQLEnum(TaskType))
    title: Mapped[str] = mapped_column(String(200))
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    due_date: Mapped[date] = mapped_column(Date)

    repeat_type: Mapped[RepeatType] = mapped_column(
        SQLEnum(RepeatType), default=RepeatType.NONE
    )
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    aquarium: Mapped["Aquarium"] = relationship()

    @property
    def is_overdue(self) -> bool:
        return self.due_date < date.today() and not self.is_completed


class Equipment(Base):
    __tablename__ = "equipment"

    aquarium_id: Mapped[int] = mapped_column(
        ForeignKey("aquariums.id", ondelete="CASCADE")
    )

    category: Mapped[str] = mapped_column(String(100))
    name: Mapped[str] = mapped_column(String(200))
    installation_date: Mapped[date] = mapped_column(Date)
    specifications: Mapped[str | None] = mapped_column(String(100), nullable=True)
    maintenance_interval_days: Mapped[int | None] = mapped_column(
        Integer, nullable=True
    )
    logs: Mapped[list[EquipmentLog]] = relationship(back_populates="equipment")

    @property
    def days_until_maintenance(self) -> int | None:
        if not self.maintenance_interval_days or not self.installation_date:
            return None

        last_service_date = self.installation_date

        if self.logs:
            latest_log = max(self.logs, key=lambda log: log.log_date)
            last_service_date = latest_log.log_date

        next_maintenance = last_service_date + timedelta(
            days=self.maintenance_interval_days
        )
        today = date.today()

        days_left = (next_maintenance - today).days
        return days_left if days_left > 0 else 0


class EquipmentLog(Base):
    __tablename__ = "equipment_logs"

    equipment_id: Mapped[int] = mapped_column(
        ForeignKey("equipment.id", ondelete="CASCADE")
    )

    log_type: Mapped[str] = mapped_column(String(120))
    log_date: Mapped[date] = mapped_column(Date)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_resolved: Mapped[bool] = mapped_column(Boolean, default=True)

    equipment: Mapped["Equipment"] = relationship(back_populates="logs")


class TimelineEventType(str, enum.Enum):
    WATER_PARAMETERS = "Параметри води"
    POPULATION = "Населення"
    EQUIPMENT = "Обладнання"
    MAINTENANCE = "Обслуговування"
    ALERT = "Алерти"
    SYSTEM = "Системні"


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id: Mapped[int] = mapped_column(primary_key=True)
    aquarium_id: Mapped[int] = mapped_column(
        ForeignKey("aquariums.id", ondelete="CASCADE")
    )

    event_type: Mapped[TimelineEventType] = mapped_column(SQLEnum(TimelineEventType))
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    event_metadata: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    aquarium: Mapped["Aquarium"] = relationship()
