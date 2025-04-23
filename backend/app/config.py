import os
from dotenv import load_dotenv

load_dotenv()

HOME_FORECAST_API=os.getenv("HOME_FORECAST_API")
print("HOME_FORECAST_API:", HOME_FORECAST_API)  # Debugging step
