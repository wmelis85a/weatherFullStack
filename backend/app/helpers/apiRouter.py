import httpx
import unicodedata
from urllib.parse import quote
from app.helpers.normalize import normalize_city_name
import xml.etree.ElementTree as ET



from app.config import HOME_FORECAST_API, HOME_FORECAST_API_FALLBACK, WEATHER_API_KEY

# HELPER: Normalizes text to handle accents (e.g., "Nilópolis" == "Nilopolis")
def normalize_string(text: str) -> str:
    if not text:
        return ""
    # Decompose unicode characters and remove non-spacing marks (accents)
    return ''.join(c for c in unicodedata.normalize('NFD', text)
                  if unicodedata.category(c) != 'Mn').lower()


async def discover_city_country(name) -> dict:
    """
    Fetches the list of Brazilian city codes from the IBGE API.
    Returns a dictionary indicating if the city is Brazilian or not.
    """

    # 1. Normalize user input (removes accents for comparison)
    target_normalized = normalize_string(name)
    print("Normalized target city:", target_normalized)
    
    city_codes_url = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"

    async with httpx.AsyncClient() as client:
        response = await client.get(city_codes_url, timeout=10.0)
        response.raise_for_status()
        city_codes = response.json()
        print(f"Fetched {len(city_codes)} cities from IBGE API.")
    
    # Default state: Not found / Not Brazilian
    found_obj = {'is_brazilian': False, 'name': name}

    for city in city_codes:
        # 2. Use the SAME normalization function for consistency
        api_city_normalized = normalize_string(city["nome"])
        
        if api_city_normalized == target_normalized:
            found_obj = {'is_brazilian': True, 'name': city['nome']}
            print(f"Match found: {found_obj['name']}")
            break

    print(f"Target normalized: {target_normalized}")
    print(f"Last API normalized: {api_city_normalized}")        
    return found_obj


async def api_router(check_city) -> str:
    # LOGIC: If NOT Brazilian -> Fallback. If Brazilian -> CPTEC.
    print("Routing API for city:", check_city)
    if check_city['is_brazilian'] is False:
        print(f"Non-Brazilian city detected: {check_city['name']}. Using Fallback.")
        
        # Use quote to handle spaces/accents in URL safely
        safe_name = quote(check_city['name'])
        api_invoked = f"{HOME_FORECAST_API_FALLBACK}?key={WEATHER_API_KEY}&q={safe_name}&aqi=no"
        return api_invoked
        
    else:
        print(f"Brazilian city detected: {check_city['name']}. Using CPTEC.")
        
        safe_name = quote(check_city['name'])
        citycode_url = f"http://servicos.cptec.inpe.br/XML/listaCidades?city={normalize_city_name(check_city['name'])}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(citycode_url)
            response.raise_for_status()
            xml_data = response.text
            print(f"CPTEC Response: {xml_data}")
        
        # Parse XML and extract city ID
        try:
            root = ET.fromstring(xml_data)
            cidade_elems = root.findall("cidade")
            
            if cidade_elems:
                id_elem = cidade_elems[0].find("id")
                if id_elem is not None:
                    city_id = id_elem.text  # Salva o ID em uma variável
                    print(f"City ID extracted: {city_id}")
                    api_invoked = f"{HOME_FORECAST_API}/{city_id}/previsao.xml"
                    return api_invoked
        except ET.ParseError as e:
            print(f"Error parsing XML: {e}")
        
        # Fallback if no ID found
        return None
    

async def get_weather_url(city_name: str) -> str:
    """
    Main router function to encapsulate the url generation logic.
    """
    # 1. Try to fetch city status
    city_data = await discover_city_country(city_name)
    print("City data fetched:", city_data)
    
    # 2. Generate URL based on result
    final_url = await api_router(city_data)
    
    return final_url