# models/system.py
from datetime import datetime
from sqlalchemy import String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base


class Chat(Base):
    __tablename__ = "chats"

    user1_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user2_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, onupdate=datetime.utcnow
    )


class Message(Base):
    __tablename__ = "messages"

    chat_id: Mapped[int] = mapped_column(ForeignKey("chats.id"))
    sender_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    text: Mapped[str] = mapped_column(Text)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))  # Кому
    actor_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id")
    )  # Хто тригернув
    type: Mapped[str] = mapped_column(String(50))  # like, comment, system_alert
    post_id: Mapped[int | None] = mapped_column(ForeignKey("posts.id"))
    comment_id: Mapped[int | None] = mapped_column(ForeignKey("comments.id"))
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)


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
    action_type: Mapped[str] = mapped_column(String(50))  # register, reset_password
    payload: Mapped[str | None] = mapped_column(String(255))  # Наприклад, email
    expires_at: Mapped[datetime] = mapped_column(DateTime)
    is_used: Mapped[bool] = mapped_column(Boolean, default=False)
