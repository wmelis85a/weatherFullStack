export interface DiaPrevisao {
  feelslike_c: any;
  wind_kph: any;
  condition: any;
  humidity: any;
  dia: string;
  tempo: string;
  maxima: string;
  minima: string;
  iuv?: string;
  city?: string;
  region?: string;
  country?: string;
  icon?: string;
  Temperatura?: string;
  Humidade?: string;
  Velocidade_vento?: string;
  Térmica?: string;
  uv?: string;
  atualizado: string;
  pressao: number;
  localTime: string;
}

  
  export interface Cidade {
    nome: string;
    uf: string;
    atualizacao: string;
    previsao: DiaPrevisao[];
  }
  
  export interface PrevisaoResponse {
    cidade: Cidade;
  }

 // types/weather.ts

export interface DetailedWeatherData {
    dia: string;
    tempo: string;
    condition: string;
    maxima: string;
    minima: string;
    iuv: string;
    city: string;
    region: string;
    country: string;
    temperature_c: number; // Agora corresponde à API
    feelslike_c: number;  // Agora corresponde à API
    icon: string;
    humidity: number;     // Agora corresponde à API
    wind_kph: number;     // Agora corresponde à API
    uv: number;
    updated: string;      // Agora corresponde à API
    pressure_mb: string;
    localtime: string;    // Agora corresponde à API
    termica: string;
}


  export interface ForecastCardProps {
    dia: string;
    tempo: string;
    maxima: string;
    minima: string;
  }
  