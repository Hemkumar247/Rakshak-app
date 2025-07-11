"use server";

import { getWeatherBasedFarmTip } from "@/ai/flows/weather-based-farm-tips";
import type { WeatherBasedFarmTipInput, WeatherBasedFarmTipOutput } from "@/ai/schemas/weather-tip-schema";

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
