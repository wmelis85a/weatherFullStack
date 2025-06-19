import axios from "axios";
import axiosRetry from 'axios-retry';
import { PrevisaoResponse } from "../types/weather";
import { DetailedWeatherData } from "../types/weather";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const VITE_API_CONDITIONS_URL = import.meta.env.VITE_API_CONDITIONS_URL;

const api = axios.create({
  baseURL: `${VITE_API_URL}`,
  timeout: 5000,
});

axiosRetry(api, {
  retries: 3, // Number of attempts
  retryDelay: axiosRetry.exponentialDelay, // Exponential backoff
  retryCondition: (error) => {
  return (
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    (typeof error.response?.status === 'number' && error.response.status >= 500)
    );
  }
});

export async function getHomeForecast(query: string): Promise<PrevisaoResponse> {
  try {
    console.log(query);

    const response = await api.get<PrevisaoResponse>(`${VITE_API_URL}` , {
      params: { city: query }
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching home forecast");
  }
}
export async function getDetailedConditions(query: string): Promise<DetailedWeatherData> {
  try {
    console.log("🔎 Enviando query para detailed:", query);

    const response = await api.get<DetailedWeatherData>(`${VITE_API_CONDITIONS_URL}`, {
       params: { city: query }
    }); //replaces axios const baseUrl
    return response.data;
  } catch (error) {
    throw new Error("Error fetching detailed conditions");
  }
}

