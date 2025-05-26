import { DetailedWeatherData } from "../types/weather";

export default function ForecastCard({
  dia,
  condition,
  maxima,
  minima,
  temperature_c,
  city,
  region,
  country,
  icon,
  uv,
  humidity,
  wind_kph,
  pressure_mb, // Corrigido para pressure_mb
  localtime,
  updated,
  feelslike_c,
}: DetailedWeatherData) {

    const getPressureValue = () => {
    // Caso 1: Se já vier como número (1021)
    if (typeof pressure_mb === 'number') {
      return `${pressure_mb} hPa`;
    }
    
    // Caso 2: Se vier como string descritiva ("Pressure milibars: 1021")
    if (typeof pressure_mb === 'string') {
      const match = pressure_mb.match(/\d+/);
      return match ? `${match[0]} hPa` : 'N/A';
    }
    
    // Caso 3: Se for undefined ou null
    return 'N/A';
  };

  // Função para formatar datas
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    
    try {
      // Remove "Pressure milibars:" se existir (para o caso da data)
      const cleanString = dateString.replace('Pressure milibars:', '').trim();
      // Converte para formato ISO válido
      const isoString = cleanString.replace(' ', 'T');
      return new Date(isoString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300 h-full w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2 text-center">{dia}</h3>

      <div className="flex flex-col items-center mb-4">
        {icon && (
          <img 
            src={`https:${icon}`} 
            alt={`Condição climática: ${condition}`} 
            className="w-16 h-16"
          />
        )}
        <p className="mt-2 text-xl font-medium">{temperature_c}°C</p>
        <p className="text-gray-300">{condition}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p><span className="font-semibold">Sensação:</span> {feelslike_c}°C</p>
        </div>
        <div>
          <p><span className="font-semibold">Umidade:</span> {humidity}%</p>
          <p><span className="font-semibold">Vento:</span> {wind_kph} km/h</p>
          <p><span className="font-semibold">UV:</span> {uv}</p>
        </div>
        
        <div className="col-span-2">
          <p><span className="font-semibold">Localização:</span> {city}, {region} - {country}</p>
          <p><span className="font-semibold">Hora Local:</span> {formatDate(localtime)}</p>
          <p><span className="font-semibold">Pressão:</span> {getPressureValue()} hPa</p>
          <p><span className="font-semibold">Atualizado:</span> {new Date(updated).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}