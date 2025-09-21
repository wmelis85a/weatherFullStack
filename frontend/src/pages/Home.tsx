import { useEffect, useState } from "react";
import { getHomeForecast } from "../services/api";
// We import the new types we've defined
import { HomeForecastItem, PrevisaoResponse } from "../types/weather";
import ForecastCard from "../components/ForecastCard";
import { useCity } from "../contexts/CityContext";

export default function Home() {
  const { city } = useCity(); 
  // The state now uses our clean, specific type for the Home page
  const [forecast, setForecast] = useState<HomeForecastItem[]>([]);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Added a handler to avoid fetching for an empty city
    if (!city) {
      setForecast([]);
      setLoad(false);
      return;
    }

    async function fetchData() {
      setLoad(true);
      setError(null);

      try {
        // The API function now returns the 'PrevisaoResponse' type, which can be one of 3 formats
        const data: PrevisaoResponse = await getHomeForecast(city);
        
        console.log("RAW DATA RECEIVED FROM THE BACKEND:", data);

        let forecastData: HomeForecastItem[] = []; // Initialize as an empty array

        // THIS BLOCK NOW WORKS WITHOUT TYPE ERRORS
        if ('cidade' in data && data.cidade.previsao) {
          // --- CASE 1: CPTEC Response (nested object) ---
          forecastData = data.cidade.previsao;

        } else if ('data' in data && data.data.current) {
          // --- CASE 2: Fallback Response as an OBJECT (what your log showed) ---
          // We build the forecast array manually from the data.
          const fallbackInfo = data.data;
          const forecastObject: HomeForecastItem = {
            dia: fallbackInfo.location.localtime.split(' ')[0],
            tempo: fallbackInfo.current.condition.text,
            maxima: String(Math.round(fallbackInfo.current.temp_c)),
            minima: String(Math.round(fallbackInfo.current.temp_c)),
            iuv: String(fallbackInfo.current.uv),
          };
          forecastData = [forecastObject]; // We put the object into an array so .map() can work

        } else if (Array.isArray(data)) {
          // --- CASE 3: Fallback Response as an ARRAY (for the future) ---
          forecastData = data;
        }

        console.log("Final forecast to be rendered:", forecastData);
        setForecast(forecastData);

      } catch (err: any) {
        console.error("DETAILED ERROR ON API CALL:", err);
        setError("Error loading forecast for the city.");
      } finally {
        setLoad(false);
      }
    }

    fetchData();
  }, [city]);

  if (load) {
    return <p>Loading forecast...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-2">Hometown forecast - 4 Days</h2>
      <p className="text-center text-gray-400 mb-8">{city}</p>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4">
        {forecast.length > 0 ? (
          forecast.map((dia) => (
            <ForecastCard key={dia.dia} {...dia} />
          ))
        ) : (
          <p className="col-span-4 text-center">No forecast to display.</p>
        )}
      </div>
    </div>
  );
}