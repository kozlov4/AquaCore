# from sqlalchemy import select
# from sqlalchemy.ext.asyncio import AsyncSession
# from .schemas import EquipmentCreate
# from core.models import Equipment
#
#
# async def get_equipment(session: AsyncSession, aquarium_id: int):
#     stmt = select(Equipment).where(Equipment.aquarium_id == aquarium_id)
#     result = await session.execute(stmt)
#     return result.scalars().all()
#
#
# async def create_equipment(
#     session: AsyncSession, aquarium_id: int, data: EquipmentCreate
# ):
#     new_eq = Equipment(aquarium_id=aquarium_id, **data.model_dump())
#     session.add(new_eq)
#     await session.commit()
#     await session.refresh(new_eq)
#     return new_eq
#
#
# async def delete_equipment(session: AsyncSession, equipment_id: int):
#     eq = await session.get(Equipment, equipment_id)
#     if eq:
#         await session.delete(eq)
#         await session.commit()
