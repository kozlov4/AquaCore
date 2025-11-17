import src.models_registry
from fastapi import FastAPI
from src.database import SessionLocal
from src.auth.router import router as auth_router


app = FastAPI(
  title="AquaCore 🐠"
)
app.include_router(auth_router)


