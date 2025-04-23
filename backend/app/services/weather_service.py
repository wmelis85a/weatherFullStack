import httpx
import xmltodict
from app.config import HOME_FORECAST_API

async def getHomeForecast() -> dict:
    url = f"{HOME_FORECAST_API}"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

    if response.status_code == 200:
        xml_data = response.text
        return xmltodict.parse(xml_data)
    else:
        raise Exception(f"Error reaching out to CPTEC/INPE: {response.status_code}")
