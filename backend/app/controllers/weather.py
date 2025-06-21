from fastapi import APIRouter, Body, Query, HTTPException
from app.services.weather_service import getDetailedConditions, getHomeForecast
from app.services.emailer import EmailRequest, sendEmail
from app.helpers.normalize import normalize_city_name

import logging

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
        data = await getHomeForecast(normalizedName)
        return data
    except Exception as e:
        logger.error("Unable to reach for INPE api", e)
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/getdetailed")
async def get_detailedCondiditons(city: str = Query(..., description="Weather Api city name")):
    logger.info("Fetching home detailed conditions ")
    try:
        normalizedName = normalize_city_name(city)
        data = await getDetailedConditions(normalizedName)
        return data
    except Exception as e:
        logger.error("Unable to reach Weather Api", e)
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/send-email/",
             summary="Enviar e-mail",
             description="Endpoint para envio de e-mails via SMTP",
             response_description="Confirmação de envio",
             tags=["E-mails"])
async def send_email(email_request: EmailRequest = Body(..., examples={
    "normal": {
        "summary": "simple email",
        "value": {
            "to": "user@example.com",
            "subject": "something",
            "body": "hello world!"
        }
    },
    "html": {
        "summary": "html email",
        "value": {
            "to": "user@example.com",
            "subject": "bla bla bla",
            "body": "whatever xyz",
            "html": "<h1>Hello</h1><p>World</p>"
        }
    }
})):
    try:
        data = await sendEmail(email_request)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
