import httpx
import xmltodict
from app.config import HOME_FORECAST_API
from app.services.translator import translate_dict_values, translation_map
import logging
import time


logger = logging.getLogger("uvicorn.error")

async def getHomeForecast() -> dict:
    total_start = time.perf_counter()

    url = f"{HOME_FORECAST_API}"
    logger.debug(f"Fetching data from {url}...")

    request_start = time.perf_counter()

    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        request_duration = time.perf_counter() - request_start
        logger.debug(f"HTTP request completed in {request_duration:.4f} seconds")


    if response.status_code == 200:
        parse_start = time.perf_counter()
        xml_data = response.text
        dict = xmltodict.parse(xml_data)
        logger.debug(f"Raw xml: {xml_data}")
        logger.info("Translating xml values...")
        translate_start = time.perf_counter()

        logger.info("Parsing xml data into json...")
        resp = translate_dict_values(dict, translation_map, keys_to_translate=["tempo"])
        translate_duration = time.perf_counter() - translate_start
        logger.debug(f"Dictionary translation took {translate_duration:.4f} seconds")

        total_duration = time.perf_counter() - total_start
        logger.info(f"Total processing time: {total_duration:.4f} seconds")
        
        return resp
    else:
        raise Exception(f"Error reaching out to CPTEC/INPE: {response.status_code}")
