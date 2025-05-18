import { DiaPrevisao } from "../types/weather";

export default function ForecastCard({ dia, tempo, maxima, minima }: DiaPrevisao) {
  return (
    <div className="bg-white text-black rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300">
      <h3 className="text-md font-semibold mb-1">{dia}</h3>
      <p className="text-gray-700 mb-2">{tempo}</p>
      <div className="text-sm">
        <p><span className="text-red-600 font-semibold">Máxima:</span> {maxima}°C</p>
        <p><span className="text-blue-600 font-semibold">Mínima:</span> {minima}°C</p>
      </div>
    </div>
  );
}
