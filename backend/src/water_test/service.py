from .schemas import CreateWaterTest
from datetime import timedelta, date
import csv
import io
from fastapi.responses import StreamingResponse
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.models import Aquarium
from core.models import WaterTest
from core.models.system import TimelineEventType
from time_line_event.service import log_ecosystem_event
from .schemas import (
    WaterMetric,
    AnalyticsPeriod,
    WaterAnalyticsResponse,
    AnalyticsPoint,
)


async def create_water_test(
    session: AsyncSession,
    user_id: int,
    water_test_in: CreateWaterTest,
    aquarium_id: int,
):
    aquarium = await session.get(Aquarium, aquarium_id)

    if not aquarium or aquarium.user_id != user_id:
        raise HTTPException(status_code=404, detail="Aquarium not found")

    values = [
        water_test_in.ph,
        water_test_in.gh,
        water_test_in.kh,
        water_test_in.nh3,
        water_test_in.no2,
        water_test_in.no3,
    ]

    if all(v is None for v in values):
        raise HTTPException(
            status_code=400, detail="At least one water parameter is required"
        )

    new_water_test = WaterTest(
        aquarium_id=aquarium_id,
        **water_test_in.model_dump(),
    )
    session.add(new_water_test)

    await log_ecosystem_event(
        session=session,
        aquarium_id=aquarium_id,
        event_type=TimelineEventType.WATER_PARAMETERS,
        title="Записано нові параметри води",
        description="Система зафіксувала нові показники.",
        event_metadata={
            "ph": water_test_in.ph,
            "gh": water_test_in.gh,
            "nh3": water_test_in.nh3,
        },
    )

    if water_test_in.nh3 and water_test_in.nh3 > 0:
        await log_ecosystem_event(
            session=session,
            aquarium_id=aquarium_id,
            event_type=TimelineEventType.ALERT,
            title="Критичний рівень Аміаку (NH3)",
            description=f"Зафіксовано небезпечний рівень токсинів: {water_test_in.nh3} ppm. Ризики для жителів стрімко зростають.",
            event_metadata={"nh3_level": water_test_in.nh3},
        )

    await session.commit()
    await session.refresh(new_water_test)
    return new_water_test


OPTIMAL_RANGES = {
    "ph": (6.5, 7.5),
    "gh": (4, 12),
    "kh": (3, 8),
    "nh3": (0, 0.2),
    "no2": (0, 0.2),
    "no3": (0, 40),
}


async def get_water_analytics(
    session: AsyncSession,
    aquarium_id: int,
    user_id: int,
    metric: WaterMetric,
    period: AnalyticsPeriod,
):
    aquarium = await session.get(Aquarium, aquarium_id)

    if not aquarium or aquarium.user_id != user_id:
        raise HTTPException(
            status_code=404,
            detail="Aquarium not found",
        )

    metric_column = getattr(WaterTest, metric.value)

    today = date.today()

    if period == AnalyticsPeriod.week:
        start_date = today - timedelta(days=7)

    elif period == AnalyticsPeriod.month:
        start_date = today - timedelta(days=30)

    else:
        start_date = today - timedelta(days=365)

    stmt = (
        select(
            WaterTest.test_date,
            metric_column,
        )
        .where(WaterTest.aquarium_id == aquarium_id)
        .where(WaterTest.test_date >= start_date)
        .where(metric_column.isnot(None))
        .order_by(WaterTest.test_date)
    )

    result = await session.execute(stmt)

    rows = result.all()

    if not rows:
        return WaterAnalyticsResponse(
            metric=metric.value,
            current_value=None,
            average_value=None,
            min_value=None,
            max_value=None,
            min_date=None,
            max_date=None,
            optimal_min=OPTIMAL_RANGES[metric.value][0],
            optimal_max=OPTIMAL_RANGES[metric.value][1],
            points=[],
        )

    points = [
        AnalyticsPoint(
            date=row[0],
            value=row[1],
        )
        for row in rows
    ]

    values = [row[1] for row in rows]

    current_value = values[-1]

    average_value = round(
        sum(values) / len(values),
        2,
    )

    min_value = min(values)
    max_value = max(values)

    min_row = min(rows, key=lambda x: x[1])
    max_row = max(rows, key=lambda x: x[1])

    return WaterAnalyticsResponse(
        metric=metric.value,
        current_value=current_value,
        average_value=average_value,
        min_value=min_value,
        max_value=max_value,
        min_date=min_row[0],
        max_date=max_row[0],
        optimal_min=OPTIMAL_RANGES[metric.value][0],
        optimal_max=OPTIMAL_RANGES[metric.value][1],
        points=points,
    )


async def export_water_tests_csv(session: AsyncSession, aquarium_id: int, user_id: int):
    aquarium = await session.get(Aquarium, aquarium_id)
    if not aquarium or aquarium.user_id != user_id:
        raise HTTPException(status_code=404, detail="Aquarium not found")

    stmt = (
        select(WaterTest)
        .where(WaterTest.aquarium_id == aquarium_id)
        .order_by(WaterTest.test_date.desc())
    )
    result = await session.execute(stmt)
    tests = result.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output, delimiter=",", quoting=csv.QUOTE_MINIMAL)

    writer.writerow(
        ["Дата", "pH", "GH", "KH", "Аміак (NH3)", "Нітрити (NO2)", "Нітрати (NO3)"]
    )

    # Записуємо дані
    for t in tests:
        writer.writerow(
            [
                t.test_date.strftime("%Y-%m-%d"),
                t.ph if t.ph is not None else "-",
                t.gh if t.gh is not None else "-",
                t.kh if t.kh is not None else "-",
                t.nh3 if t.nh3 is not None else "-",
                t.no2 if t.no2 is not None else "-",
                t.no3 if t.no3 is not None else "-",
            ]
        )

    output.seek(0)

    filename = f"aquarium_{aquarium_id}_water_tests.csv"

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
