from fastapi import FastAPI
from src.database import SessionLocal
app = FastAPI()


@app.get("/hello")
async def get_hello():
  print(SessionLocal)
  return "hello"