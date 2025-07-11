
"use server";

import { getWeatherBasedFarmTip } from "@/ai/flows/weather-based-farm-tips";
import type { WeatherBasedFarmTipInput, WeatherBasedFarmTipOutput } from "@/ai/schemas/weather-tip-schema";

export interface WeatherData {
    current: {
      temperature: number;
      humidity: number;
      windSpeed: number;
    };
    forecast: {
      day: string;
      condition: string;
      high: number;
      low: number;
      humidity: number;
      rainChance: number;
      icon: any; // Mapped on client
    }[];
}

export async function getAIFarmTip(input: WeatherBasedFarmTipInput): Promise<WeatherBasedFarmTipOutput> {
    try {
        const result = await getWeatherBasedFarmTip(input);
        return result;
    } catch (error) {
        console.error("Error in getAIFarmTip action:", error);
        // Return a generic tip in case of an error
        return { tip: "Check local conditions and plan your day accordingly." };
    }
}

export async function getRealtimeWeather(location: string): Promise<WeatherData> {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      throw new Error("Weather API key is not configured.");
    }
  
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=no&alerts=no`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Weather API Error:", errorData);
        throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
  
      const formatDay = (dateStr: string, index: number) => {
        if (index === 0) return 'Today';
        if (index === 1) return 'Tomorrow';
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
      };

      return {
        current: {
          temperature: data.current.temp_c,
          humidity: data.current.humidity,
          windSpeed: data.current.wind_kph,
        },
        forecast: data.forecast.forecastday.map((day: any, index: number) => ({
          day: formatDay(day.date, index),
          condition: day.day.condition.text,
          high: Math.round(day.day.maxtemp_c),
          low: Math.round(day.day.mintemp_c),
          humidity: day.day.avghumidity,
          rainChance: day.day.daily_chance_of_rain,
          icon: null // Icon is mapped on the client side
        })),
      };
    } catch (error) {
      console.error("Failed to fetch real-time weather:", error);
      throw new Error("Could not fetch weather data.");
    }
}
