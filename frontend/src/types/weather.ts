// src/types/weather.ts

// ===================================================================
// TYPES FOR THE HOME PAGE
// ===================================================================

export interface HomeForecastItem {
  dia: string;
  tempo: string;
  maxima: string;
  minima: string;
  iuv: string;
}

export interface CptecResponse {
  cidade: {
    nome: string;
    uf: string;
    atualizacao: string;
    previsao: HomeForecastItem[];
  };
}

export interface FallbackObjectResponse {
  source: string;
  data: {
    location: any;
    current: any;
  };
}

export type PrevisaoResponse = CptecResponse | FallbackObjectResponse | HomeForecastItem[];


// ===================================================================
// TYPES FOR THE "DETAILED FORECAST" PAGE
// ===================================================================

export interface DetailedWeatherData {
  dia: string;
  condition: string;
  temperature_c: number;
  city: string;
  region: string;
  country: string;
  icon: string;
  uv: number;
  humidity: number;
  wind_kph: number;
  pressure_mb: number;
  localtime: string;
  Updated: string; // Note: Property names are case-sensitive. 'Updated' with capital U.
  feelslike_c: number;
  termica: string;
}


// ===================================================================
// TYPES FOR THE "EXTENDED FORECAST" PAGE
// ===================================================================

export interface HourlyForecast {
  time: string;
  temp_c: number;
  condition: string;
  will_it_rain: 0 | 1;
  chance_of_rain: number;
}

export interface WeatherData {
  city: string;
  region: string;
  country: string;
  date: string;
  condition: string;
  min_temp_c: number;
  max_temp_c: number;
  hourly: HourlyForecast[];
}


// ===================================================================
// PROP TYPES FOR COMPONENTS (if needed)
// ===================================================================

export interface ForecastCardProps {
  dia: string;
  tempo: string;
  maxima: string;
  minima: string;
}