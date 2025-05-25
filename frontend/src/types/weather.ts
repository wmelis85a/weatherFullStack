export interface DiaPrevisao {
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
  Velocidade_Vendo?: string;
  Térmica?: string;
  uv?: string;
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

 export interface DetailedConditionsResponse {
  dia: string;
  max_temp_c: any;
  city: string;
  region: string;
  country: string;
  temperature_c: number;
  condition: string;
  icon: string;
  humidity: number;
  wind_kph: number;
  feelslike_c: number;
  uv: number;
  }

  export interface ForecastCardProps {
    dia: string;
    tempo: string;
    maxima: string;
    minima: string;
  }
  