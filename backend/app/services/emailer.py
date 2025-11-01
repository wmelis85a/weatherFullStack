from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from aiosmtplib import SMTP
from app.config import (SENDER_EMAIL, SMTP_PASSWORD, SMTP_PORT, SMTP_SERVER,
                        SMTP_USERNAME)
from fastapi import HTTPException
from pydantic import BaseModel, EmailStr


class EmailRequest(BaseModel):
    to: EmailStr
    subject: str
    body: str
    html: str | None = None


async def sendEmail(emailRequest):
    try:
        # Mounts the email
        msg = MIMEMultipart("alternative")
        msg["From"] = SENDER_EMAIL
        msg["To"] = emailRequest.to
        msg["Subject"] = emailRequest.subject

        msg.attach(MIMEText(emailRequest.body, "plain"))
        if emailRequest.html:
            msg.attach(MIMEText(emailRequest.html, "html"))

        # sends with aiosmtplib
        smtp = SMTP(hostname=SMTP_SERVER, port=SMTP_PORT, start_tls=True)
        await smtp.connect()
        await smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
        await smtp.send_message(msg)
        await smtp.quit()

        return {"message": "Email sent successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")
