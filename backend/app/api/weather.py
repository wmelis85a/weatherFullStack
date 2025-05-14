from fastapi import APIRouter, Body, Query, HTTPException
from app.services.weather_service import getHomeForecast
from app.services.emailer import EmailRequest, sendEmail


router = APIRouter()

@router.get("/health", tags=["Health Check"])
async def healthCheck():
    return {"status": "ok"}

@router.get("/getHomeForecast")
async def get_forecast():
    try:
        data = await getHomeForecast()
        return data
    except Exception as e:
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
