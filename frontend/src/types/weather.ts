// src/types/weather.ts

// ===================================================================
// 1. BASE TYPE FOR THE HOME PAGE FORECAST
// ===================================================================
// This is the final format your Home page uses to render the cards.
// Simplified by removing fields not relevant to this screen.
export interface HomeForecastItem {
  dia: string;
  tempo: string;
  maxima: string;
  minima: string;
  iuv: string;
}


// ===================================================================
// 2. TYPES THAT THE BACKEND ACTUALLY SENDS FOR THE HOME PAGE
// ===================================================================

// TYPE A: CPTEC Response (Nested Object)
export interface CptecResponse {
  cidade: {
    nome: string;
    uf: string;
    atualizacao: string;
    previsao: HomeForecastItem[]; // Uses the base type
  };
}

// TYPE B: Fallback Response as an OBJECT (what we discovered in the log)
export interface FallbackObjectResponse {
  source: string;
  data: {
    location: any; // Kept as 'any' for simplicity, can be detailed later
    current: any;  // Kept as 'any' for simplicity
  };
}


// ===================================================================
// 3. THE FINAL UNION TYPE FOR THE HOME PAGE
// ===================================================================
// This is the type your `getHomeForecast` function SHOULD return.
// It's a union of ALL possibilities:
// It can be a CPTEC object, OR a Fallback object, OR a simple array.
export type PrevisaoResponse = CptecResponse | FallbackObjectResponse | HomeForecastItem[];


// ===================================================================
// YOUR OTHER TYPES (for other pages, can remain here)
// ===================================================================
export interface DetailedWeatherData {
  // ... your type ...
}

export interface ForecastCardProps {
  // ... your type ...
}

export interface HourlyForecast {
  // ... your type ...
}

export interface WeatherData {
  // ... your type ...
}