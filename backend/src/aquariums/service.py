from datetime import date, datetime

from fastapi import HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from core.models import Aquarium, AquariumInhabitant, Species
from core.models.system import TimelineEventType
from time_line_event.service import log_ecosystem_event
from .schemas import (
    CreateAquarium,
    CompatibilityIssue,
    CheckCompatibilityResponse,
    InhabitantCreate,
    PopulationResponse,
    PopulationDTO,
    LastWaterTestDTO,
    AquariumCardResponse,
    UpdateAquarium,
)


async def create_aquarium(
    session: AsyncSession,
    user_id: int,
    aquarium_in: CreateAquarium,
):
    normalized_name = aquarium_in.name.lower().strip()

    stmt = select(Aquarium).where(
        Aquarium.user_id == user_id, func.lower(Aquarium.name) == normalized_name
    )

    result = await session.execute(stmt)
    aquarium = result.scalar()

    if aquarium:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Aquarium with that name already exists",
        )

    new_aquarium = Aquarium(
        name=aquarium_in.name,
        volume=aquarium_in.volume,
        type=aquarium_in.type,
        image_id=aquarium_in.image_id,
        user_id=user_id,
        status="Відмінний",
    )

    session.add(new_aquarium)
    await session.flush()

    await log_ecosystem_event(
        session=session,
        aquarium_id=new_aquarium.id,
        event_type=TimelineEventType.SYSTEM,
        title="Екосистему засновано!",
        description=f'Акваріум "{new_aquarium.name}" ({new_aquarium.volume} Л) успішно створено в системі.',
        event_metadata={"volume": new_aquarium.volume, "type": new_aquarium.type},
    )

    await session.commit()
    await session.refresh(new_aquarium)
    return new_aquarium


async def get_aquarium_names(session: AsyncSession, user_id: int):

    stmt = select(Aquarium).where(Aquarium.user_id == user_id)
    result = await session.execute(stmt)
    aquarium = result.scalars()

    return aquarium


async def get_user_aquariums_cards(session: AsyncSession, user_id: int):
    stmt = (
        select(Aquarium)
        .where(Aquarium.user_id == user_id)
        .options(
            joinedload(Aquarium.image),
            selectinload(Aquarium.inhabitants).joinedload(AquariumInhabitant.species),
            selectinload(Aquarium.water_tests),
        )
    )

    result = await session.execute(stmt)
    aquariums = result.scalars().all()

    response_cards = []

    for aq in aquariums:
        species_names_list = []
        total_qty = 0

        for inh in aq.inhabitants:
            if inh.species:
                species_names_list.append(inh.species.name)
            total_qty += inh.quantity

        population_dto = None
        if total_qty > 0:
            population_dto = PopulationDTO(
                species_names=", ".join(species_names_list), total_quantity=total_qty
            )

        last_test_dto = None
        if aq.water_tests:
            latest_test = sorted(
                aq.water_tests, key=lambda t: t.test_date, reverse=True
            )[0]
            days_ago = (date.today() - latest_test.test_date).days

            last_test_dto = LastWaterTestDTO(
                days_ago=days_ago,
                ph=latest_test.ph,
                gh=latest_test.gh,
                kh=latest_test.kh,
            )

        card = AquariumCardResponse(
            id=aq.id,
            name=aq.name,
            volume=aq.volume,
            status=aq.status,
            image_url=aq.image_url,
            population=population_dto,
            last_test=last_test_dto,
        )
        response_cards.append(card)

    return response_cards


async def check_new_inhabitant(
    session: AsyncSession, aquarium_id: int, species_id: int, user_id: int
):
    stmt_aq = (
        select(Aquarium)
        .options(
            selectinload(Aquarium.inhabitants).selectinload(AquariumInhabitant.species)
        )
        .where(Aquarium.id == aquarium_id)
    )
    aquarium = (await session.execute(stmt_aq)).scalar_one_or_none()

    new_species = await session.get(Species, species_id)

    if not aquarium or not new_species or aquarium.user_id != user_id:
        raise HTTPException(status_code=404, detail="Акваріум або вид не знайдено")

    issues = []
    status = "PERFECT"
    title = "Повна сумісність"

    if new_species.min_volume > aquarium.volume:
        status = "CRITICAL"
        title = "Критична несумісність"
        issues.append(
            CompatibilityIssue(
                title="Об'єм",
                description=f"Для цієї риби потрібен акваріум від {new_species.min_volume} Л (ваш: {aquarium.volume} Л).",
            )
        )

    if new_species.character == "Хижак":
        for inh in aquarium.inhabitants:
            if inh.species.max_size and "S" in inh.species.max_size:
                status = "CRITICAL"
                title = "Критична несумісність"
                issues.append(
                    CompatibilityIssue(
                        title="Хижак",
                        description=f"{new_species.name} може з'їсти поточних жителів ({inh.species.name}).",
                    )
                )
                break

    if new_species.character == "Територіальні":
        territorial_count = sum(
            1
            for inh in aquarium.inhabitants
            if inh.species.character == "Територіальні"
        )
        if territorial_count > 0:
            if status != "CRITICAL":
                status = "RISKY"
                title = "Можлива агресія"
            issues.append(
                CompatibilityIssue(
                    title="Територіальність",
                    description="Вид активно захищає свою територію. Можливі конфлікти з існуючими сусідами.",
                )
            )

    if not issues:
        issues.append(
            CompatibilityIssue(
                title="Ідеальний вибір",
                description="Ці риби мають схожі вимоги до параметрів води та мирний характер.",
            )
        )

    return CheckCompatibilityResponse(status=status, status_title=title, issues=issues)


async def add_inhabitant(
    session: AsyncSession, aquarium_id: int, data: InhabitantCreate, user_id: int
):
    aquarium = await session.get(Aquarium, aquarium_id)

    if aquarium is None or aquarium.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    new_inhabitant = AquariumInhabitant(aquarium_id=aquarium_id, **data.model_dump())
    session.add(new_inhabitant)

    species = await session.get(Species, data.species_id)
    species_name = species.name if species else "Невідомий вид"

    await log_ecosystem_event(
        session=session,
        aquarium_id=aquarium_id,
        event_type=TimelineEventType.POPULATION,
        title="Заселення нових жителів",
        description=f"Додано новий вид: {species_name}.",
        event_metadata={
            "species_name": species_name,
            "quantity": f"+{data.quantity} шт",
        },
    )

    await session.commit()
    return {"message": "Успішно заселено"}


async def get_aquarium_population(
    session: AsyncSession, aquarium_id: int, user_id: int
):
    aquarium = await session.get(Aquarium, aquarium_id)
    if not aquarium or aquarium.user_id != user_id:
        raise HTTPException(status_code=404, detail="Акваріум не знайдено")

    stmt = (
        select(AquariumInhabitant)
        .where(AquariumInhabitant.aquarium_id == aquarium_id)
        .options(selectinload(AquariumInhabitant.species).selectinload(Species.image))
    )
    result = await session.execute(stmt)
    raw_inhabitants = result.scalars().all()

    total_species = len(set(inh.species_id for inh in raw_inhabitants))
    total_individuals = sum(inh.quantity for inh in raw_inhabitants)

    grouped = {}

    for inh in raw_inhabitants:
        species_id = inh.species_id

        if species_id not in grouped:
            grouped[species_id] = {
                "id": inh.id,
                "quantity": inh.quantity,
                "settlement_date": inh.settlement_date,
                "species": inh.species,
            }
        else:
            grouped[species_id]["quantity"] += inh.quantity

    inhabitants = list(grouped.values())

    if not inhabitants:
        return PopulationResponse(
            total_species=0,
            total_individuals=0,
            overall_compatibility_status="INFO",
            overall_compatibility_text="Акваріум поки порожній. Додайте перших жителів!",
            inhabitants=[],
        )

    has_predator = False
    has_small_fish = False
    territorial_count = 0
    max_required_volume = 0

    for inh in inhabitants:
        sp = inh["species"]

        if sp.min_volume > max_required_volume:
            max_required_volume = sp.min_volume

        if sp.character == "Хижак":
            has_predator = True

        if sp.character == "Територіальна":
            territorial_count += 1

        if sp.max_size and "S" in sp.max_size:
            has_small_fish = True

    overall_status = "PERFECT"
    overall_text = (
        "Сумісність відмінна. Всі види мирні та підходять для поточних параметрів води."
    )

    if max_required_volume > aquarium.volume:
        overall_status = "CRITICAL"
        overall_text = f"Критична проблема: об'єм акваріума ({aquarium.volume} Л) занадто малий для поточних жителів. Потрібно мінімум {max_required_volume} Л."

    elif has_predator and has_small_fish:
        overall_status = "CRITICAL"
        overall_text = "Критична несумісність: в акваріумі є хижаки та дрібні види. Дрібні риби в небезпеці."

    elif territorial_count > 1:
        overall_status = "RISKY"
        overall_text = "Можлива агресія: кілька територіальних видів можуть битися за укриття на дні."

    return PopulationResponse(
        total_species=total_species,
        total_individuals=total_individuals,
        overall_compatibility_status=overall_status,
        overall_compatibility_text=overall_text,
        inhabitants=inhabitants,
    )


async def delete_aquarium(session: AsyncSession, aquarium_id: int, user_id: int):
    aquarium = await session.get(Aquarium, aquarium_id)
    if not aquarium or aquarium.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Aquarium not found"
        )

    await session.delete(aquarium)
    await session.commit()

    return {"message": f"Акваріум успішно видалено"}


async def update_aquarium(
    session: AsyncSession,
    aquarium_id: int,
    user_id: int,
    aquarium_in: UpdateAquarium,
):
    aquarium = await session.get(Aquarium, aquarium_id)
    if not aquarium:
        raise HTTPException(status_code=404, detail="Aquarium not found")

    if aquarium.user_id != user_id:
        raise HTTPException(
            status_code=403, detail="Ви не можете редагувати цей акваріум"
        )

    update_data = aquarium_in.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        if isinstance(value, datetime):
            value = value.replace(tzinfo=None)

        setattr(aquarium, key, value)

    await session.commit()
    await session.refresh(aquarium)

    return aquarium
