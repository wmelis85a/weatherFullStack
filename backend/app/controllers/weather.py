import logging

from fastapi import APIRouter, HTTPException, Query

from app.helpers.normalize import normalize_city_name
from app.services.weather_service import (
    getDailyForecast,
    getDetailedConditions,
    getHomeForecast,
)

logger = logging.getLogger("uvicorn.error")


router = APIRouter()


@router.api_route("/health", tags=["Health Check"], methods=["GET", "HEAD"])
async def healthCheck():
    logger.info("Hello from keepalive endpoint")
    return {"status": "ok"}


@router.get("/getHomeForecast")
async def get_forecast(city: str = Query(..., description="CPTEC city name")):
    logger.info("Fetching home forecast info ")
    try:
        normalizedName = normalize_city_name(city)
        print(normalizedName)
        data = await getHomeForecast(normalizedName)
        return data
    except Exception as e:
        logger.error("Unable to reach for INPE api", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/getdetailed")
async def get_detailedCondiditons(
    city: str = Query(..., description="Weather Api city name"),
):
    logger.info("Fetching home detailed conditions ")
    try:
        normalizedName = normalize_city_name(city)
        data = await getDetailedConditions(normalizedName)
        return data
    except Exception as e:
        logger.error("Unable to reach Weather Api", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/getDailyForecast")
async def get_daily_forecast(
    city: str = Query(..., description="Weather Api city name"),
):
    logger.info("Fetching daily forecast")
    try:
        normalizedName = normalize_city_name(city)
        data = await getDailyForecast(normalizedName)
        return data
    except Exception as e:
        logger.error("Unable to reach Weather Api", e)
        raise HTTPException(status_code=500, detail=str(e))
