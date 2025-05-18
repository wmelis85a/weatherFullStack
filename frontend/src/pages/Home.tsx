import { useEffect, useState } from "react";
import { getHomeForecast } from "../services/api";
import { DiaPrevisao } from "../types/weather";
import ForecastCard from "../components/ForecastCard";

export default function Home() {
  const [forecast, setForecast] = useState<DiaPrevisao[]>([]);

  useEffect(() => {
    getHomeForecast().then((data) => {
      setForecast(data.cidade.previsao);
    });
  }, []);

  return (
  <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
    <h2 className="text-2xl font-bold text-center mb-2">Hometown forecast - 4 Days</h2>
    <p className="text-center text-gray-400 mb-8">Nilópolis - RJ</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {forecast.map((dia) => (
        <ForecastCard key={dia.dia} {...dia} />
      ))}
    </div>
  </div>
);
}
