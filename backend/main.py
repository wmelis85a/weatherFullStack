from fastapi import FastAPI
from app.api import weather
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",    
                    "https://weatherfullstack-front.onrender.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather.router)
