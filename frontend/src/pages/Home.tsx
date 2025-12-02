import { useEffect, useState } from "react";
import ForecastCard from "../components/ForecastCard";
import { useCity } from "../contexts/CityContext";
import { getHomeForecast } from "../services/api";
import { ErrorModal } from '../components/ErrorModal';
import type { HomeForecastItem, PrevisaoResponse } from "../types/weather";

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
        const data: PrevisaoResponse = await getHomeForecast(city);
        
        // ... (Your existing data parsing logic here) ...
        // Keeping it short for clarity, paste your logic back here
        
        let forecastData: HomeForecastItem[] = [];
        if ("cidade" in data && data.cidade.previsao) {
             forecastData = data.cidade.previsao;
        } else if ("data" in data && data.data.current) {
             const fallbackInfo = data.data;
             forecastData = [{
                dia: fallbackInfo.location.localtime.split(" ")[0],
                tempo: fallbackInfo.current.condition.text,
                maxima: String(Math.round(fallbackInfo.current.temp_c)),
                minima: String(Math.round(fallbackInfo.current.temp_c)),
                iuv: String(fallbackInfo.current.uv),
             }];
        } else if (Array.isArray(data)) {
             forecastData = data;
        }

        setForecast(forecastData);
      } catch (err: any) {
        console.error("DETAILED ERROR:", err);

        // 1. IMPROVED CHECK: We also check for generic 503 code just in case the message text varies
        const isServiceUnavailable = 
            (err.message && (err.message.includes("CPTEC") || err.message.includes("unavailable"))) ||
            (err.response && err.response.status === 503);

        if (isServiceUnavailable) {
            // If it is our specific error, we Open Modal AND Set Error to null
            // so the UI behind the modal doesn't vanish
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

  // 2. RENDER FIX: Remove Early Returns
  // We handle loading/error INSIDE the main return so the Modal is always mounted
  return (
    <div className="w-full relative">
      
      {/* 3. The Modal is placed here, so it overlays everything else */}
      <ErrorModal 
        isOpen={isModalOpen} 
        message={modalMessage} 
        onClose={() => setIsModalOpen(false)} 
      />

      <h2 className="text-2xl font-bold text-center mb-2">
        Hometown forecast - 4 Days
      </h2>
      <p className="text-center text-gray-400 mb-8">{city}</p>

      {/* 4. Conditional Rendering Logic */}
      {load ? (
         <p className="text-center">Loading forecast...</p>
      ) : error ? (
         <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4">
          {forecast.length > 0 ? (
            forecast.map((dia) => <ForecastCard key={dia.dia} {...dia} />)
          ) : (
            <p className="col-span-4 text-center">No forecast to display.</p>
          )}
        </div>
      )}
    </div>
  );
}