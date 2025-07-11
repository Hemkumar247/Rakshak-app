'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing farming tips based on weather conditions.
 *
 * @exports getWeatherBasedFarmTip - The main function to trigger the tip generation flow.
 * @exports WeatherBasedFarmTipInput - The input type for the getWeatherBasedFarmTip function.
 * @exports WeatherBasedFarmTipOutput - The output type for the getWeatherBasedFarmTip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const WeatherBasedFarmTipInputSchema = z.object({
  condition: z.string().describe("The weather condition for the day (e.g., 'Sunny', 'Partly Cloudy', 'Rain')."),
  tempHigh: z.number().describe('The high temperature for the day in Celsius.'),
  tempLow: z.number().describe('The low temperature for the day in Celsius.'),
  rainChance: z.number().describe('The percentage chance of rain.'),
  humidity: z.number().describe('The humidity percentage.'),
  language: z.string().describe("The language for the response (e.g., 'en' for English, 'hi' for Hindi, 'ta' for Tamil)."),
});
export type WeatherBasedFarmTipInput = z.infer<typeof WeatherBasedFarmTipInputSchema>;

export const WeatherBasedFarmTipOutputSchema = z.object({
  tip: z.string().describe('A short, actionable farming tip based on the weather conditions.'),
});
export type WeatherBasedFarmTipOutput = z.infer<typeof WeatherBasedFarmTipOutputSchema>;

export async function getWeatherBasedFarmTip(input: WeatherBasedFarmTipInput): Promise<WeatherBasedFarmTipOutput> {
  return weatherBasedFarmTipFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weatherBasedFarmTipPrompt',
  input: {schema: WeatherBasedFarmTipInputSchema},
  output: {schema: WeatherBasedFarmTipOutputSchema},
  prompt: `You are an expert agronomist providing helpful advice to farmers. Based on the following weather forecast for a single day, provide one short, actionable, and encouraging farming tip. The tip should be very concise and easy to understand.

  Keep the tip to a single sentence.

  Weather Conditions:
  - Condition: {{{condition}}}
  - High Temperature: {{{tempHigh}}}°C
  - Low Temperature: {{{tempLow}}}°C
  - Chance of Rain: {{{rainChance}}}%
  - Humidity: {{{humidity}}}%
  
  The response must be in the following language: {{language}}.`,
});


const weatherBasedFarmTipFlow = ai.defineFlow(
  {
    name: 'weatherBasedFarmTipFlow',
    inputSchema: WeatherBasedFarmTipInputSchema,
    outputSchema: WeatherBasedFarmTipOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
