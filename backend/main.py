from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers import weather, alerts_controller

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://weatherfullstack-front.onrender.com",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather.router)
app.include_router(alerts_controller.router)