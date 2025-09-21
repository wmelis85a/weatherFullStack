def conditions_filtered(data: dict) -> dict:
    return {
        "city": data["location"]["name"],
        "localtime": data["location"]["localtime"],
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


def extended_conditions_filtered(data):
    location = data.get("location", {})
    forecastday = data.get("forecast", {}).get("forecastday", [{}])[0]
    day = forecastday.get("day", {})
    hours = forecastday.get("hour", [])

    return {
        "city": location.get("name"),
        "region": location.get("region"),
        "country": location.get("country"),
        "date": forecastday.get("date"),
        "condition": day.get("condition", {}).get("text"),
        "min_temp_c": day.get("mintemp_c"),
        "max_temp_c": day.get("maxtemp_c"),
        "hourly": [
            {
                "time": hour.get("time"),
                "temp_c": hour.get("temp_c"),
                "condition": hour.get("condition", {}).get("text"),
                "will_it_rain": hour.get("will_it_rain"),
                "chance_of_rain": hour.get("chance_of_rain"),
            }
            for hour in hours
        ],
    }
