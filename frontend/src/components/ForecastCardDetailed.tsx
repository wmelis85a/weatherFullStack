import { DiaPrevisao } from "../types/weather";

export default function ForecastCard({
  dia,
  tempo,
  maxima,
  iuv,
  city,
  region,
  country,
  Temperatura,
  Humidade,
  Velocidade_Vendo,
  Térmica,
  uv,
  icon,
}: DiaPrevisao) {
  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300 h-full w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2 text-center">{dia}</h3>

      {icon && (
        <div className="flex justify-center mb-4">
          <img src={`https:${icon}`} alt="Ícone do clima" className="w-16 h-16" />
        </div>
      )}

      <p className="text-center text-gray-300 mb-2">{tempo}</p>

      <div className="text-sm space-y-1">
        <p><strong>Cidade:</strong> {city}, {region} - {country}</p>
        <p><span className="text-red-400 font-medium">Máxima:</span> {maxima}°C</p>
        <p><strong>Sensação térmica:</strong> {Térmica}°C</p>
        <p><strong>Temperatura real:</strong> {Temperatura}°C</p>
        <p><strong>Umidade:</strong> {Humidade}%</p>
        <p><strong>Vento:</strong> {Velocidade_Vendo} km/h</p>
        <p><strong>Índice UV:</strong> {uv || iuv}</p>
      </div>
    </div>
  );
}
