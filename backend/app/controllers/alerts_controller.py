import logging

from fastapi import APIRouter, HTTPException
from app.services.Alerts import AlertService

logger = logging.getLogger("uvicorn.error")

router = APIRouter()

@router.get("/alerts")
async def get_alerts():
    logger.info("Fetching alerts info")
    alerts = "ativos"  # Forcing a specific region for now.
    try:
        alert_service = AlertService(alerts)
        alert_response = await alert_service.fetch_alerts()
        return alert_response
    except Exception as e:
        logger.exception("Unable to reach INMET alerts API")
        message = str(e)
        if "timed out" in message:
            raise HTTPException(status_code=504, detail="Alerts API timed out")
        raise HTTPException(status_code=502, detail="Unable to reach INMET alerts API")
    
@router.get("/send-email")
async def send_email():
    logger.info("Sending alert email")
    alerts = "ativos"  # Forcing a specific region for now.
    try:
        alert_service = AlertService(alerts)
        result = await alert_service.email_notifier()
        return result
    except Exception as e:
        logger.exception("Unable to send alert email")
        raise HTTPException(status_code=500, detail=str(e))