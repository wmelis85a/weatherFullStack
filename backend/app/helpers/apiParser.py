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
