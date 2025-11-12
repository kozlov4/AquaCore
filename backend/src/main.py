from fastapi import FastAPI
from backend.src.database import SessionLocal
app = FastAPI()


@app.get("/hello")
async def get_hello():
  print(SessionLocal)
  return "hello"