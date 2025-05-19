import { DiaPrevisao } from "../types/weather";

export default function ForecastCard({ dia, tempo, maxima, minima }: DiaPrevisao) {
  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300 h-full">
      <h3 className="text-md font-semibold mb-2">{dia}</h3>
      <p className="text-gray-300 mb-3">{tempo}</p>
      <div className="text-sm space-y-1">
        <p><span className="text-red-400 font-medium">Máxima:</span> {maxima}°C</p>
        <p><span className="text-blue-400 font-medium">Mínima:</span> {minima}°C</p>
      </div>
    </div>
  );
}