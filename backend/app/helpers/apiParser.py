# Example weather_translations dictionary; replace or extend as needed
weather_translations = {
    "Sunny": "Ensolarado",
    "Partly Cloudy": "Parcialmente nublado",
    "Cloudy": "Nublado",
    "Rain": "Chuva",
    "Clear": "Limpo",
}

# Em app/helpers/apiParser.py

# (weather_translations dictionary should be defined above this)


def adapt_current_weather_for_frontend(api_response):
    """
    Adapts the current weather API response to the list format expected by the frontend.
    """
    # CORREÇÃO: Acessa 'location' e 'current' diretamente do objeto principal.
    location_data = api_response["location"]
    current_data = api_response["current"]

    # O resto da função continua exatamente igual
    adapted_forecast = {
        "dia": location_data["localtime"].split(" ")[0],
        "tempo": weather_translations.get(
            current_data["condition"]["text"],
            current_data["condition"]["text"],  # Valor padrão se não houver tradução
        ),
        "maxima": str(round(current_data["temp_c"])),
        "minima": str(round(current_data["temp_c"])),
        "iuv": str(current_data["uv"]),
    }

    return [adapted_forecast]

def adapt_current_weather_for_frontend_outage(api_response):
    location = api_response["location"]
    forecastday = api_response["forecast"]["forecastday"][:4]  # Get first 4 days
    
    cptec_outage_forecast = []
    
    for day in forecastday:
        condition = day["day"]["condition"]["text"]
        max_c = day["day"]["maxtemp_c"]
        min_c = day["day"]["mintemp_c"]
        
        forecast_item = {
            "dia": day["date"],  # or use location["localtime"].split(" ")[0]
            "tempo": condition,
            "maxima": str(round(max_c)),
            "minima": str(round(min_c)),
            "iuv": "N/A",
        }
        cptec_outage_forecast.append(forecast_item)
    
    return cptec_outage_forecast

