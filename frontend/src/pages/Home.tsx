import { useEffect, useState } from "react";
import { getHomeForecast } from "../services/api";
import { DiaPrevisao } from "../types/weather";
import ForecastCard from "../components/ForecastCard";
import { useCity } from "../contexts/CityContext";

export default function Home() {
  const { city } = useCity(); 
  const [forecast, setForecast] = useState<DiaPrevisao[]>([]);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoad(true);
      setError(null);

      try {
        const data = await getHomeForecast(city); 
        setForecast(data.cidade.previsao);
      } catch (err: any) {
        setError("Erro ao carregar previsão para a cidade.");
      } finally {
        setLoad(false);
      }
    }

    fetchData();
  }, [city]);

  if (load) {
    return <p>Carregando previsão...</p>;
  }


  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-2">Hometown forecast - 4 Days</h2>
      <p className="text-center text-gray-400 mb-8">{city}</p>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4">
        {forecast.map((dia) => (
          <ForecastCard key={dia.dia} {...dia} />
        ))}
      </div>
    </div>
  );
}