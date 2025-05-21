import axios from "axios";
import axiosRetry from 'axios-retry';
import { PrevisaoResponse } from "../types/weather";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${VITE_API_URL}`,
  timeout: 5000,
});

axiosRetry(api, {
  retries: 3, // Number of attempts
  retryDelay: axiosRetry.exponentialDelay, // Exponential backoff
  retryCondition: (error) => {
    // Retry on network errors or 5xx responses
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500;
  }
});

export async function getHomeForecast(): Promise<PrevisaoResponse> {
  try {
    const response = await api.get<PrevisaoResponse>(`${VITE_API_URL}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching home forecast");
  }
}
