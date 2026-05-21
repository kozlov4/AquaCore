import re

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.models import Species
from .schemas import (
    AnalyzeRequest,
    CompatibilityResponse,
    ConflictDetail,
    EcosystemRequirements,
)


def extract_range(value: str | None) -> tuple[float, float] | None:
    if not value:
        return None
    numbers = [float(x) for x in re.findall(r"\d+\.\d+|\d+", value)]
    if len(numbers) >= 2:
        return (numbers[0], numbers[1])
    elif len(numbers) == 1:
        return (numbers[0], numbers[0])
    return None


async def analyze_compatibility(
    session: AsyncSession, request: AnalyzeRequest
) -> CompatibilityResponse:
    if not request.items:
        raise HTTPException(
            status_code=400, detail="Додайте хоча б один вид для аналізу"
        )

    species_ids = [item.species_id for item in request.items]
    stmt = select(Species).where(Species.id.in_(species_ids))
    result = await session.execute(stmt)
    species_list = result.scalars().all()

    if len(species_list) != len(set(species_ids)):
        raise HTTPException(
            status_code=404, detail="Один або кілька видів не знайдено в базі"
        )

    max_min_volume = 0
    temp_ranges = []
    ph_ranges = []

    has_predator = False
    has_small_fish = False
    has_territorial = 0

    conflicts = []

    for sp in species_list:
        if sp.min_volume > max_min_volume:
            max_min_volume = sp.min_volume

        if sp.temperature:
            temp_ranges.append(extract_range(sp.temperature))
        if sp.ph:
            ph_ranges.append(extract_range(sp.ph))

        if sp.character == "Хижак":
            has_predator = True
        if sp.character == "Територіальні":
            has_territorial += 1
        if sp.max_size and "S" in sp.max_size:
            has_small_fish = True

    if has_predator and has_small_fish:
        conflicts.append(
            ConflictDetail(
                type="CRITICAL",
                title="Хижак та Здобич",
                description="Знайдено хижака та дрібних риб. Дрібні види гарантовано будуть з'їдені.",
            )
        )

    if has_territorial > 1:
        conflicts.append(
            ConflictDetail(
                type="RISKY",
                title="Територіальність",
                description="Два або більше територіальних видів можуть битися за укриття на дні. Потрібно багато декору.",
            )
        )

    common_temp = "Залежить від видів"
    common_ph = "Залежить від видів"

    if temp_ranges and all(x is not None for x in temp_ranges):
        max_of_mins = max([t[0] for t in temp_ranges])
        min_of_maxs = min([t[1] for t in temp_ranges])
        if max_of_mins <= min_of_maxs:
            common_temp = f"{max_of_mins} - {min_of_maxs} °C"
        else:
            common_temp = "Немає спільної"
            conflicts.append(
                ConflictDetail(
                    type="WARNING",
                    title="Різниця температур",
                    description="Види мають несумісні вимоги до температури води.",
                )
            )

    if ph_ranges and all(x is not None for x in ph_ranges):
        max_of_mins_ph = max([p[0] for p in ph_ranges])
        min_of_maxs_ph = min([p[1] for p in ph_ranges])
        if max_of_mins_ph <= min_of_maxs_ph:
            common_ph = f"{max_of_mins_ph} - {min_of_maxs_ph}"
        else:
            common_ph = "Немає спільного"
            conflicts.append(
                ConflictDetail(
                    type="WARNING",
                    title="Різні вимоги до pH",
                    description="Види потребують різної кислотності води.",
                )
            )

    if any(c.type == "CRITICAL" for c in conflicts):
        status = "CRITICAL"
        title = "Критична несумісність"
        desc = "Знайдено фатальні конфлікти між обраними видами. Збірка нежиттєздатна."
    elif any(c.type == "RISKY" for c in conflicts):
        status = "RISKY"
        title = "Можлива агресія"
        desc = "Ризикове поєднання. Висока ймовірність територіальних суперечок або стресу."
    elif any(c.type == "WARNING" for c in conflicts):
        status = "WARNING"
        title = "Часткова сумісність"
        desc = "Збірка можлива, але вимагає компромісу в параметрах води."
    else:
        status = "PERFECT"
        title = "Повна сумісність"
        desc = (
            "Ідеальне поєднання! Види чудово уживаються разом і мають спільні вимоги."
        )
        conflicts.append(
            ConflictDetail(
                type="INFO",
                title="Жодних конфліктів не знайдено",
                description="Всі параметри в нормі.",
            )
        )

    return CompatibilityResponse(
        status=status,
        status_title=title,
        status_description=desc,
        conflicts=conflicts,
        requirements=EcosystemRequirements(
            min_volume=max_min_volume, temperature=common_temp, ph=common_ph
        ),
    )
