from typing import Annotated
from fastapi import Depends
from src.database import get_db
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from sqlalchemy import desc
from sqlalchemy.orm import Session
from src.aquariums.models import Aquariums
from src.monitoring.models import Sensor_Measurements, Devices, Activity_Log
from src.tasks.models import Tasks
from src.aquariums.service import calculate_stocking_level


db_dependency = Annotated[Session, Depends(get_db)]


def auto_generate_maintenance_tasks(db: Session, aquarium_id: int):

    aquarium = db.query(Aquariums).filter(Aquariums.id == aquarium_id).first()
    if not aquarium:
        return

    measurement = (
        db.query(Sensor_Measurements)
        .join(Devices)
        .filter(Devices.aquarium_id == aquarium_id)
        .order_by(desc(Sensor_Measurements.timestamp))
        .first()
    )


    stocking_data = calculate_stocking_level(db, aquarium)
    bioload_percent = stocking_data.get('percent', 0)

    def get_days_since_last_event(event_type_keyword):
        last_log = (
            db.query(Activity_Log)
            .filter(
                Activity_Log.aquarium_id == aquarium_id,
                Activity_Log.event_type.ilike(f"%{event_type_keyword}%")
            )
            .order_by(desc(Activity_Log.timestamp))
            .first()
        )

        if last_log:
            delta = datetime.now() - last_log.timestamp.replace(tzinfo=None)
            return delta.days
        else:
            if aquarium.start_date:
                delta = date.today() - aquarium.start_date
                return delta.days
            return 999

    days_since_water = get_days_since_last_event("water_change")
    days_since_filter = get_days_since_last_event("filter")

    def create_task_if_missing(title, description):
        existing_task = (
            db.query(Tasks)
            .filter(
                Tasks.aquarium_id == aquarium_id,
                Tasks.title == title,
                Tasks.is_active == True
            )
            .first()
        )

        if not existing_task:
            new_task = Tasks(
                user_id=aquarium.user_id,
                aquarium_id=aquarium_id,
                title=title,
                description=description,
                start_date=date.today(),
                is_active=True
            )
            db.add(new_task)
            return True
        return False

    created_count = 0

    if days_since_water > 7 and bioload_percent > 80:
        if create_task_if_missing(
                title="Підміна води (Високе навантаження)",
                description=f"Пройшло {days_since_water} днів, а біонавантаження {bioload_percent}%. Рекомендується підмінити 30% води."
        ):
            created_count += 1

    if days_since_filter > 30:
        if create_task_if_missing(
                title="Промивка фільтра",
                description=f"Фільтр не чистився {days_since_filter} днів. Промийте губки в акваріумній воді."
        ):
            created_count += 1

    current_tds = measurement.tds if (measurement and measurement.tds) else 0
    target_tds = aquarium.target_tds_max or 500

    if current_tds > target_tds:
        if create_task_if_missing(
                title="Критична підміна води (TDS)",
                description=f"Датчик TDS показує {current_tds} ppm (Норма до {target_tds}). Вода занадто брудна."
        ):
            created_count += 1

    db.commit()
    return {"status": "success", "tasks_created": created_count}