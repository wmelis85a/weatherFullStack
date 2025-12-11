import asyncio
import logging
import time
import xml.etree.ElementTree as ET

from fastapi.responses import JSONResponse
import httpx
import xmltodict
from fastapi import HTTPException
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import (
    DETAILED_FORECAST_API,
    HOME_FORECAST_API,
    HOME_FORECAST_API_FALLBACK,
    WEATHER_API_KEY,
    FEATURE_FLAG_DISABLE_CPTEC,
)
from app.helpers.apiParser import adapt_current_weather_for_frontend , adapt_current_weather_for_frontend_outage
from app.helpers.dict import conditions_filtered, extended_conditions_filtered
from app.helpers.translator import translate_dict_values, translation_map
from app.helpers.apiRouter import api_router, discover_city_country, get_weather_url

logger = logging.getLogger("uvicorn.error")


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)
async def getHomeForecast(name) -> dict:
    total_start = time.perf_counter()
    print("Getting weather for:", name)

    api_router = await get_weather_url(name)
    print("API URL:", api_router)

    # Feature flag check for fallback
    if FEATURE_FLAG_DISABLE_CPTEC == "true":
        logger.info("CPTEC API calls are disabled via feature flag. Using fallback...")
        url = f"{DETAILED_FORECAST_API}/forecast.json?key={WEATHER_API_KEY}&q={name}&days=4&lang=pt"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            logger.debug(f"fallback object {response.text}...")
            request_duration = time.perf_counter() - total_start
            response.raise_for_status()

            response_data = response.json()

            if "error" in response_data:
                error_message = response_data["error"]["message"]
                logger.error(
                    f"WeatherAPI fallback failed for city '{name}': {error_message}"
                )
                raise HTTPException(status_code=404, detail=f"City '{name}' not found.")

            parsed_weather = adapt_current_weather_for_frontend_outage(response_data)
            return parsed_weather

    # Main CPTEC flow
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(api_router)
            response.raise_for_status()

            xml_data = response.text
            print("helooo from CPTEC XML Data:", xml_data)

            # first checks if the cptec xml contains a city info
            root = ET.fromstring(xml_data)
            
            # DEBUG LOGS
            print(f"Root tag: {root.tag}")
            
            # Se a raiz já é <cidade>, usa direto. Se é <cidades>, procura <cidade>
            if root.tag == "cidade":
                city = root
                print(f"City found (root is cidade): {city.tag}")
            else:
                city = root.find("cidade")
                print(f"City found (searched in root): {city}")

            if city is not None:
                print(f"City tag: {city.tag}")
                print(f"City children count: {len(city)}")
                print(f"City content: {ET.tostring(city, encoding='unicode')}")

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

            # Parse city info - XML root is <cidade>, not <cidades>
            dict_response = xmltodict.parse(xml_data)
            logger.debug(f"Raw xml: {xml_data}")
            logger.info("Translating xml city data values...")
            logger.info("Parsing xml data into json...")
            cidade = dict_response["cidade"]

            logger.info("Processing CPTEC forecast data...")
            resp = translate_dict_values(cidade, translation_map, keys_to_translate=["tempo"])
            total_duration = time.perf_counter() - total_start
            logger.info(f"Total processing time: {total_duration:.4f} seconds")

            return resp

        except httpx.HTTPStatusError as exc:
            status = exc.response.status_code
            return JSONResponse(
                content={"error": "upstream_error", "message": "CPTEC API is unreachable."},
                status_code=status
            )


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
