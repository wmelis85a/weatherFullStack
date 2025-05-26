import { useEffect, useState } from "react";
import { getDetailedConditions } from "../services/api";
import { DetailedWeatherData } from "../types/weather";
import ForecastCard from "../components/ForecastCardDetailed";

export default function Conditions() {
  const [data, setData] = useState<DetailedWeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  getDetailedConditions()
    .then((res) => {
      console.log("Dados do getDetailedConditions:", res);
      setData(res);
    })
    .catch(() => setError("Erro ao buscar dados climáticos"));
}, []);


  if (!data) {
    return <p>Carregando previsão...</p>;
  }


  if (error) {
    return <p>{error}</p>;
  }

const cardData: DetailedWeatherData = {
    dia: "Hoje",
    tempo: data.condition,
    condition: data.condition,
    maxima: "", // Você precisará obter esse valor
    minima: "", // Você precisará obter esse valor
    iuv: data.uv.toString(),
    city: data.city,
    region: data.region,
    country: data.country,
    temperature_c: data.temperature_c, // Nome igual ao da API
    feelslike_c: data.feelslike_c,    // Nome igual ao da API
    icon: data.icon,
    humidity: data.humidity,          // Nome igual ao da API
    wind_kph: data.wind_kph,          // Nome igual ao da API
    uv: data.uv,
    updated: data.updated,            // Nome igual ao da API
    pressure_mb: data.pressure_mb,
    localtime: data.localtime,        // Nome igual ao da API
    termica: ""
};

  return (
    <div className="w-full">
    <h2 className="text-2xl font-bold text-center mb-2">Detailed hometown conditions</h2>
    <div className="flex justify-center">
      <ForecastCard {...cardData} />
    </div>
  </div>
  );
}