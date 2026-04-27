import uvicorn
from fastapi import FastAPI

app = FastAPI(
  title="AquaCore 🐠"
)

@app.get("/")
def hello_index():
    return {
        "message": "Hello index!",
    }





if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
