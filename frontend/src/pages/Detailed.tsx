import { useEffect, useState } from "react";
import { getDetailedConditions } from "../services/api";
import { useCity } from "../contexts/CityContext";
import ForecastCard from "../components/ForecastCardDetailed";
import { DetailedWeatherData } from "../types/weather";

export default function Conditions() {
  const { city } = useCity();
  const [data, setData] = useState<DetailedWeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getDetailedConditions(city); // city vem do contexto
        setData(response);
      } catch (err) {
        setError("Erro ao buscar dados climáticos");
        console.error(err);
      }
    }

    fetchData();
  }, [city]);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Carregando dados...</p>;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center mb-2">Detailed conditions</h2>
      <div className="flex justify-center">
        <ForecastCard {...data} />
      </div>
    </div>
  );
}
