import { useEffect, useState } from "react";
import { getDetailedConditions } from "../services/api";
import { DetailedConditionsResponse } from "../types/weather";
import ForecastCard from "../components/ForecastCard";

export default function Conditions() {
  const [data, setData] = useState<DetailedConditionsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDetailedConditions()
      .then((res) => setData(res))
      .catch(() => setError("Erro ao Error fetching climate data"));
  }, []);

  if (!data) {
    return <p>Carregando previsão...</p>;
  }


  if (error) {
    return <p>{error}</p>;
  }

  const cardData = {
  dia: "Hoje", // ou você pode usar uma função que gera a data atual formatada
  tempo: data.condition,
  maxima: `${data.temperature_c}`, // como não há máxima, usa-se a atual
  minima: `${data.feelslike_c}` ,  // usa-se o "feels like" como mínima
  iuv: `${data.uv}`, // agora inclui o campo exigido
  city: `${data.city}`,
  region: `${data.region}`,
  country: `${data.country}`,
  Temperatura: `${data.temperature_c}`,
  icon: `${data.icon}`,
  Humidade: `${data.humidity}`,
  Velocidade_Vendo: `${data.wind_kph}`,
  Térmica:  `${data.feelslike_c}`,
  uv:  `${data.uv}`

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