from datetime import datetime

from sqlalchemy import select, Result
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from core.models import Feedback, User
from .schemas import CreateFeedback


async def get_feedbacks(
    session: AsyncSession,
    limit: int,
    offset: int,
    min_rate: int,
    sort_by: str,
):
    stmt = (
        select(Feedback)
        .options(joinedload(Feedback.user).joinedload(User.avatar))
    )

    if min_rate > 0:
        stmt = stmt.where(Feedback.rate >= min_rate)

    if sort_by == "highest":
        stmt = stmt.order_by(Feedback.rate.desc())

    elif sort_by == "lowest":
        stmt = stmt.order_by(Feedback.rate.asc())

    else:
        stmt = stmt.order_by(Feedback.created_at.desc())

    stmt = stmt.limit(limit).offset(offset)

    result: Result = await session.execute(stmt)
    feedbacks = result.scalars().all()

    return list(feedbacks)


async def upsert_feedback(
    session: AsyncSession, user_id: int, feedback_in: CreateFeedback
):
    stmt = select(Feedback).where(Feedback.user_id == user_id)
    result = await session.execute(stmt)
    existing_feedback = result.scalar_one_or_none()

    if existing_feedback:
        existing_feedback.rate = feedback_in.rate
        existing_feedback.description = feedback_in.description
        existing_feedback.created_at = datetime.utcnow()
        feedback = existing_feedback
    else:
        feedback = Feedback(
            user_id=user_id,
            rate=feedback_in.rate,
            description=feedback_in.description,
            created_at=datetime.utcnow(),
        )
        session.add(feedback)

    await session.commit()
    await session.refresh(feedback)
    return feedback
