import httpx
import unicodedata
from urllib.parse import quote

from app.config import HOME_FORECAST_API_FALLBACK, WEATHER_API_KEY

# HELPER: Normalizes text to handle accents (e.g., "Nilópolis" == "Nilopolis")
def normalize_string(text: str) -> str:
    if not text:
        return ""
    # Decompose unicode characters and remove non-spacing marks (accents)
    return ''.join(c for c in unicodedata.normalize('NFD', text)
                  if unicodedata.category(c) != 'Mn').lower()


async def fetch_city_codes(name) -> dict:
    """
    Fetches the list of Brazilian city codes from the IBGE API.
    Returns a dictionary indicating if the city is Brazilian or not.
    """

    # 1. Normalize user input (removes accents for comparison)
    # This solves the "Nilópolis" (input) vs "Nilópolis" (API) mismatch
    target_normalized = normalize_string(name)
    
    city_codes_url = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"

    async with httpx.AsyncClient() as client:
        # Increased timeout for safety with large lists
        response = await client.get(city_codes_url, timeout=10.0)
        response.raise_for_status()
        city_codes = response.json()
    
    # Default state: Not found / Not Brazilian
    found_obj = {'is_brazilian': False, 'name': name}

    for city in city_codes:
        # 2. Normalize API name to match the user input format
        # Note: API uses key "nome" (Portuguese)
        api_city_normalized = normalize_string(city["nome"])
        
        if api_city_normalized == target_normalized:
            # MATCH FOUND! 
            # We use the OFFICIAL name from IBGE (check_city['name'] will have the accent)
            found_obj = {'is_brazilian': True, 'name': city['nome']}
            break
            
    return found_obj


async def api_router(check_city) -> str:
    # LOGIC: If NOT Brazilian -> Fallback. If Brazilian -> CPTEC.
    if check_city['is_brazilian'] is False:
        print(f"Non-Brazilian city detected: {check_city['name']}. Using Fallback.")
        
        # Use quote to handle spaces/accents in URL safely
        safe_name = quote(check_city['name'])
        api_invoked = f"{HOME_FORECAST_API_FALLBACK}?key={WEATHER_API_KEY}&q={safe_name}&aqi=no"
        return api_invoked
        
    else:
        print(f"Brazilian city detected: {check_city['name']}. Using CPTEC.")
        
        safe_name = quote(check_city['name'])
        api_invoked = f"http://servicos.cptec.inpe.br/XML/listaCidades?city={safe_name}"
        return api_invoked
    

async def get_weather_url(city_name: str) -> str:
    """
    Main router function to encapsulate the url generation logic.
    """
    # 1. Try to fetch city status
    city_data = await fetch_city_codes(city_name)
    
    # 2. Generate URL based on result
    final_url = await api_router(city_data)
    
    return final_url