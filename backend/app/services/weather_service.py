import httpx
import xmltodict
from app.config import HOME_FORECAST_API
from app.services.translator import translate_dict_values, translation_map

async def getHomeForecast() -> dict:
    url = f"{HOME_FORECAST_API}"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

    if response.status_code == 200:
        xml_data = response.text
        dict = xmltodict.parse(xml_data)
        resp = translate_dict_values(dict, translation_map, keys_to_translate=["tempo"])
        return resp
    else:
        raise Exception(f"Error reaching out to CPTEC/INPE: {response.status_code}")
