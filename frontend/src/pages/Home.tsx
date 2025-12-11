import { useEffect, useState } from "react";
import ForecastCard from "../components/ForecastCard";
import { useCity } from "../contexts/CityContext";
import { getHomeForecast } from "../services/api";
import { ErrorModal } from '../components/ErrorModal';
import type { HomeForecastItem } from "../types/weather";

export default function Home() {
  const { city } = useCity();
  const [forecast, setForecast] = useState<HomeForecastItem[]>([]);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for error modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (!city) {
      setForecast([]);
      setLoad(false);
      return;
    }

    async function fetchData() {
      setLoad(true);
      setError(null);

      try {
        // We use 'any' temporarily to handle the variable structure (string vs object)
        const data: any = await getHomeForecast(city);
        
        console.log("RECEIVED DATA (DEBUG):", data); 

        let forecastData: HomeForecastItem[] = [];

        // 0. Direct CPTEC Response (root object with previsao array)
        if (data && "previsao" in data && Array.isArray(data.previsao)) {
             forecastData = data.previsao;
        }
        
        // 1. CPTEC Scenario (Standard Object with cidade)
        else if (data && "cidade" in data && data.cidade.previsao) {
             forecastData = Array.isArray(data.cidade.previsao) 
                ? data.cidade.previsao 
                : [data.cidade.previsao];
        } 
        
        // 2. CRITICAL FIX: Handle Stringified JSON inside 'data' field
        // This addresses the issue where backend returns: { status: "success", data: "{\"location\": ...}" }
        else if (data && "data" in data && typeof data.data === 'string') {
            console.log("Stringified JSON detected. Parsing...");
            try {
                const parsedData = JSON.parse(data.data);
                
                if (parsedData.location && parsedData.current) {
                    const fallbackInfo = parsedData;
                    forecastData = [{
                        dia: fallbackInfo.location.localtime.split(" ")[0],
                        tempo: fallbackInfo.current.condition.text,
                        maxima: String(Math.round(fallbackInfo.current.temp_c)),
                        minima: String(Math.round(fallbackInfo.current.temp_c)),
                        iuv: String(fallbackInfo.current.uv || 0),
                    }];
                }
            } catch (e) {
                console.error("Error parsing stringified JSON:", e);
                // We assume if parse fails, it might be caught by the main catch block or just show empty
            }
        }

        // 3. Normal Fallback Scenario (Already an Object)
        else if (data && "data" in data && data.data.current) {
             const fallbackInfo = data.data;
             forecastData = [{
                dia: fallbackInfo.location.localtime.split(" ")[0],
                tempo: fallbackInfo.current.condition.text,
                maxima: String(Math.round(fallbackInfo.current.temp_c)),
                minima: String(Math.round(fallbackInfo.current.temp_c)),
                iuv: String(fallbackInfo.current.uv || 0),
             }];
        } 
        
        // 4. Direct WeatherAPI Fallback (at root)
        else if (data && "current" in data && "location" in data) {
             const fallbackInfo = data;
             forecastData = [{
                dia: fallbackInfo.location.localtime.split(" ")[0],
                tempo: fallbackInfo.current.condition.text,
                maxima: String(Math.round(fallbackInfo.current.temp_c)),
                minima: String(Math.round(fallbackInfo.current.temp_c)),
                iuv: String(fallbackInfo.current.uv || 0),
             }];
        }

        // 5. Generic Array Scenario
        else if (Array.isArray(data)) {
             forecastData = data;
        }

        setForecast(forecastData);

      } catch (err: any) {
        console.error("DETAILED ERROR:", err);

        const isServiceUnavailable = 
            (err.message && (err.message.includes("CPTEC") || err.message.includes("unavailable"))) ||
            (err.response && err.response.status === 503);

        if (isServiceUnavailable) {
            setModalMessage(err.message || "Service Unavailable");
            setIsModalOpen(true);
        } else {
            setError("Error loading forecast for the city."); 
        }
      } finally {
        setLoad(false);
      }
    }

    fetchData();
  }, [city]);

  return (
    <div className="w-full relative">
      
      <ErrorModal 
        isOpen={isModalOpen} 
        message={modalMessage} 
        onClose={() => setIsModalOpen(false)} 
      />

      <h2 className="text-2xl font-bold text-center mb-2">
        Hometown forecast - 4 Days
      </h2>
      <p className="text-center text-gray-400 mb-8">{city}</p>

      {load ? (
         <p className="text-center">Loading forecast...</p>
      ) : error ? (
         <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4">
          {forecast.length > 0 ? (
            forecast.map((dia, index) => <ForecastCard key={`${dia.dia}-${index}`} {...dia} />)
          ) : (
            <p className="col-span-4 text-center">No forecast to display.</p>
          )}
        </div>
      )}
    </div>
  );
}