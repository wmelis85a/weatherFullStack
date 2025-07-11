import os
from dotenv import load_dotenv

load_dotenv()

HOME_FORECAST_API=os.getenv("HOME_FORECAST_API")
DETAILED_FORECAST_API=os.getenv("DETAILED_FORECAST_API")
WEATHER_API_KEY=os.getenv("WEATHER_API_KEY")
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT =os.getenv("SMTP_PORT")
SMTP_USERNAME =os.getenv("SMTP_USERNAME")
SMTP_PASSWORD =os.getenv("SMTP_PASSWORD")
SENDER_EMAIL =os.getenv("SENDER_EMAIL")