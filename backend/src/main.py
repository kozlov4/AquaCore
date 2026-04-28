import uvicorn
from fastapi import FastAPI
from auth.router import router as auth_router

app = FastAPI(title="AquaCore 🐠")
app.include_router(auth_router)


@app.get("/")
def hello_index():
    return {
        "message": "Hello index!",
    }


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
