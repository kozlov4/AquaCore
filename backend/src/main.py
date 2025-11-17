import src.models_registry
from fastapi import FastAPI
from src.database import SessionLocal
from src.auth.router import router as auth_router
from src.users.router import router as users_router
from src.aquariums.router import router as aquariums_router

app = FastAPI(
  title="AquaCore 🐠"
)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(aquariums_router)



