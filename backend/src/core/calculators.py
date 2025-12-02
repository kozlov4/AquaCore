from sqlalchemy.orm import Session
from src.aquariums.models import Aquariums
from src.monitoring.models import Devices
from src.core.schemas import ExpenseFrequency, EconomyRequest, EconomyResponse

def calculate_monthly_cost_smart(
        db: Session,
        aquarium_id: int,
        data: EconomyRequest
) -> dict:
    aquarium = db.query(Aquariums).filter(Aquariums.id == aquarium_id).first()
    if not aquarium:
        return {"error": "Aquarium not found"}

    devices = db.query(Devices).filter(Devices.aquarium_id == aquarium_id).all()

    total_watts = sum(d.power_watts for d in devices if d.power_watts)


    daily_kwh = (total_watts * 24 * 0.6) / 1000
    monthly_kwh = daily_kwh * 30
    electricity_cost = monthly_kwh * data.electricity_price

    tank_volume = aquarium.volume_l or 0
    monthly_water_liters = tank_volume * (data.manual_water_change_percent / 100) * 4

    monthly_water_m3 = monthly_water_liters / 1000
    water_cost = monthly_water_m3 * data.water_price_m3

    consumables_cost = 0

    for item in data.consumables:
        cost = item.price

        if item.frequency == ExpenseFrequency.WEEKLY:
            consumables_cost += cost * 4.3
        elif item.frequency == ExpenseFrequency.MONTHLY:
            consumables_cost += cost
        elif item.frequency == ExpenseFrequency.EVERY_3_MONTHS:
            consumables_cost += cost / 3
        elif item.frequency == ExpenseFrequency.EVERY_6_MONTHS:
            consumables_cost += cost / 6
        elif item.frequency == ExpenseFrequency.YEARLY:
            consumables_cost += cost / 12

    total = electricity_cost + water_cost + consumables_cost

    return {
        "total_monthly_cost": round(total, 2),
        "currency": "UAH",
        "breakdown": {
            "electricity": {
                "watts_total": total_watts,
                "kwh_month": round(monthly_kwh, 1),
                "cost": round(electricity_cost, 2)
            },
            "water": {
                "volume_m3": round(monthly_water_m3, 3),
                "cost": round(water_cost, 2)
            },
            "consumables": {
                "cost": round(consumables_cost, 2),
                "items_count": len(data.consumables)
            }
        },
        "message": f"Цей акваріум обходиться вам у ~{int(total)} грн/міс."
    }