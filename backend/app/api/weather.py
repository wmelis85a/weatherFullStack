from fastapi import APIRouter, Query, HTTPException
from app.services.weather_service import getHomeForecast

router = APIRouter()

@router.get("/getHomeForecast")
async def get_forecast():
    try:
        data = await getHomeForecast()
        print(data)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
