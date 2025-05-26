def conditions_filtered(data: dict) -> dict:
    return {
        "city": data["location"]["name"],
        "region": data["location"]["region"],
        "country": data["location"]["country"],
        "temperature_c": data["current"]["temp_c"],
        "condition": data["current"]["condition"]["text"],
        "icon": data["current"]["condition"]["icon"],
        "humidity": data["current"]["humidity"],
        "wind_kph": data["current"]["wind_kph"],
        "feelslike_c": data["current"]["feelslike_c"],
        "uv": data["current"]["uv"],
        "Updated": data["current"]["last_updated"],
        "Pressure milibars": data["current"]["pressure_mb"],

        }

