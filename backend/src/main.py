import src.models_registry
from fastapi import FastAPI
from src.database import SessionLocal
from src.auth.router import router as auth_router
from src.users.router import router as users_router
from src.aquariums.router import router as aquariums_router
from src.monitoring.router import router as monitoring_router
from src.admin.router import router as admin_router
from src.catalog.router import router as catalog_router
from src.tasks.router import router as tasks_router

app = FastAPI(
  title="AquaCore 🐠"
)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(aquariums_router)
app.include_router(monitoring_router)
app.include_router(admin_router)
app.include_router(catalog_router)
app.include_router(tasks_router)




