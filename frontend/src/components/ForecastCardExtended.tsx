import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WeatherData, HourlyForecast } from '../types/weather';

interface ForecastCardExtendedProps {
    city: string;
}

const ForecastCardExtended: React.FC<ForecastCardExtendedProps> = ({ city }) => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchWeatherData() {
            // A chamada de API só deve ocorrer se a cidade for fornecida
            if (!city) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true); // Definir o estado de carregamento antes de buscar os dados
                const response = await axios.get<WeatherData>(`${import.meta.env.VITE_API_EXTENDED_CONDITIONS_URL}?city=${city}`);
                setWeatherData(response.data);
            } catch (err: any) {
                if (axios.isAxiosError(err) && err.response) {
                    setError(`Error: ${err.response.status} - ${err.response.statusText}`);
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchWeatherData();
    }, [city]); // 👈 Adicionamos `city` como dependência aqui

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Carregando dados...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 font-bold p-4">Erro: {error}</div>;
    }

    if (!weatherData) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 font-sans">
            {/* Card Principal de Resumo Diário */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">{weatherData.city}, {weatherData.region}</h2>
                <p className="text-lg text-gray-600 mb-4 text-center">Data: {new Date(weatherData.date).toLocaleDateString('pt-BR')}</p>
                
                <p className="text-2xl font-semibold text-center mb-4">Condição: <strong className="text-blue-600">{weatherData.condition}</strong></p>
                
                <div className="flex justify-around items-center text-xl text-gray-700">
                    <span>Mínima: <span className="font-bold text-red-500">{weatherData.min_temp_c}°C</span></span>
                    <span>Máxima: <span className="font-bold text-blue-500">{weatherData.max_temp_c}°C</span></span>
                </div>
            </div>

            {/* Container para os Cards da Previsão Horária */}
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Previsão Horária</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {weatherData.hourly.map((hour: HourlyForecast, index: number) => (
                    // Card para cada hora
                    <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center">
                        <p className="text-lg font-bold text-gray-900">{hour.time.split(' ')[1].slice(0, 5)}h</p>
                        <p className="text-3xl font-light text-gray-800 my-2">{hour.temp_c}°C</p>
                        <p className="text-sm text-gray-600">{hour.condition}</p>
                        {hour.will_it_rain === 1 && (
                            <p className="text-xs text-green-600 mt-1 font-semibold">
                                Chuva: {hour.chance_of_rain}%
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForecastCardExtended;