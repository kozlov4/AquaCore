import uvicorn
from fastapi import FastAPI
from auth.router import router as auth_router
from system.router import router as system_router
from diseases.router import router as diseases_router

app = FastAPI(title="AquaCore 🐠")
app.include_router(auth_router)
app.include_router(system_router)

app.include_router(diseases_router)


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
