import { PrevisaoResponse } from "../types/weather";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export async function getHomeForecast(): Promise<PrevisaoResponse> {
  const res = await fetch(`${VITE_API_URL}`);
  if (!res.ok) {
    throw new Error("Error fetching home forecast");
  }
  const data = await res.json();
  return data as PrevisaoResponse;
}
