// ExtendedForecast.tsx
import React from "react";
import ForecastCardExtended from "../components/ForecastCardExtended";
import { useCity } from "../contexts/CityContext";

export default function ExtendedForecast() {
  const { city } = useCity(); // supondo que você está usando um contexto para armazenar a cidade

  return (
    <div className="min-h-screen bg-gray-100">
      <ForecastCardExtended city={city} />
    </div>
  );
}
