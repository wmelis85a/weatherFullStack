import axios from "axios";
import { PrevisaoResponse } from "../types/weather";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export async function getHomeForecast(): Promise<PrevisaoResponse> {
  try {
    const response = await axios.get<PrevisaoResponse>(`${VITE_API_URL}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching home forecast");
  }
}
