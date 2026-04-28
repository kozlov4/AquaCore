from sqlalchemy import select, Result
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from models import Feedback, User


from sqlalchemy import select, Result
from sqlalchemy.orm import joinedload
from models import Feedback, User


async def get_feedbacks(
    session: AsyncSession,
    limit: int,
    offset: int,
    min_rate: int,
    sort_by: str,
):
    stmt = select(Feedback).options(joinedload(Feedback.user).joinedload(User.avatar))

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
