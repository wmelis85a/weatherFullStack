import logging
import time
import xml.etree.ElementTree as ET

import httpx
import xmltodict
from fastapi import HTTPException
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import (
    DETAILED_FORECAST_API,
    HOME_FORECAST_API,
    HOME_FORECAST_API_FALLBACK,
    WEATHER_API_KEY,
)
from app.helpers.apiParser import adapt_current_weather_for_frontend
from app.helpers.dict import conditions_filtered, extended_conditions_filtered
from app.helpers.translator import translate_dict_values, translation_map

logger = logging.getLogger("uvicorn.error")


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)
async def getHomeForecast(name) -> dict:
    total_start = time.perf_counter()

    # gets the city code from CPTEC api
    cityNameUrl = f"http://servicos.cptec.inpe.br/XML/listaCidades?city={name}"

    async with httpx.AsyncClient() as client:
        response = await client.get(cityNameUrl)
        response.raise_for_status()

    xml_data = response.text

    # first checks if the cptec xml contains a city info
    root = ET.fromstring(xml_data)
    city = root.find("cidade")

    request_start = time.perf_counter()

    if city is None or len(city) == 0:
        logger.info(
            f"City '{name}' not found in CPTEC API. Fallback to Openweather API starting..."
        )
        url = f"{HOME_FORECAST_API_FALLBACK}?key={WEATHER_API_KEY}&q={name}&aqi=no"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            logger.debug(f"fallback object {response.text}...")
            request_duration = time.perf_counter() - request_start
            response.raise_for_status()

            response_data = response.json()

            if "error" in response_data:
                error_message = response_data["error"]["message"]
                logger.error(
                    f"WeatherAPI fallback failed for city '{name}': {error_message}"
                )
                raise HTTPException(status_code=404, detail=f"City '{name}' not found.")

            parsed_weather = adapt_current_weather_for_frontend(response_data)
            return parsed_weather

    dict = xmltodict.parse(xml_data)
    logger.debug(f"Raw xml: {xml_data}")
    logger.info("Translating xml city data values...")
    logger.info("Parsing xml data into json...")
    code = cidade = dict["cidades"]["cidade"]
    if isinstance(cidade, list):
        cidade = cidade[0]  # Uses first result, if multiple availiable

    code = cidade["id"]

    # passes city cod to get the weather forecast api
    url = f"{HOME_FORECAST_API}/{code}/previsao.xml"
    logger.debug(f"Fetching data from {url}...")

    request_start = time.perf_counter()

    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        request_duration = time.perf_counter() - request_start
        logger.debug(f"HTTP request completed in {request_duration:.4f} seconds")

        response.raise_for_status()

    # xml to dict parsing logic
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


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)
async def getDetailedConditions(city):
    baseUrl = f"{DETAILED_FORECAST_API}"
    url = f"{baseUrl}/current.json?key={WEATHER_API_KEY}&q={city}&aqi=no"
    logger.debug(f"Fetching data from {url}...")

    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()

    filtered = conditions_filtered(response.json())
    return filtered


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)
async def getDailyForecast(city) -> dict:
    dailyForecastUrl = f"{DETAILED_FORECAST_API}/forecast.json?key={WEATHER_API_KEY}&q={city}&days=1&hourly=1&lang=pt"
    async with httpx.AsyncClient() as client:
        response = await client.get(dailyForecastUrl)
        response.raise_for_status()

    filtered = extended_conditions_filtered(response.json())
    return filtered
