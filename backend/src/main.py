import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from aquariums.router import router as aquariums_router
from auth.router import router as auth_router
from compatibility.router import router as compatibility_router
from diseases.router import router as diseases_router
from equipments.router import equipment_router as equipment_router
from gallery.router import router as gallery_router
from knowledge_base.router import router as knowledge_base_router
from password_reset.router import router as password_reset_router
from social.router import router as social_router
from species.router import router as species_router
from system.router import router as system_router
from tasks.router import tasks_router as task_router
from time_line_event.router import router as time_line_event_router
from uploads.router import router as uploads_router
from user_dairy.router import router as user_diary_router
from water_change.router import router as water_change_router
from water_test.router import router as water_test_router

app = FastAPI(title="AquaCore 🐠")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(system_router)

app.include_router(diseases_router)
app.include_router(knowledge_base_router)
app.include_router(uploads_router)
app.include_router(aquariums_router)

app.include_router(gallery_router)

app.include_router(user_diary_router)

app.include_router(species_router)
app.include_router(compatibility_router)

app.include_router(water_test_router)
app.include_router(task_router)
app.include_router(equipment_router)
app.include_router(password_reset_router)
app.include_router(water_change_router)
app.include_router(time_line_event_router)
app.include_router(social_router)


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
