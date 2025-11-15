from fastapi import FastAPI
from src.database import SessionLocal
from src.auth.router import router_login

app = FastAPI()
app.include_router(router_login)

@app.get("/hello")
async def get_hello():
  print(SessionLocal)
  return "hello"


