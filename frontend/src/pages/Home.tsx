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
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Dia</th>
            <th className="px-4 py-2 text-left">Tempo</th>
            <th className="px-4 py-2 text-left">Máxima</th>
            <th className="px-4 py-2 text-left">Mínima</th>
          </tr>
        </thead>
        <tbody>
          {forecast.map((dia) => (
            <ForecastCard key={dia.dia} {...dia} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
