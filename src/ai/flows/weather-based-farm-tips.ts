'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing farming tips based on weather conditions.
 *
 * @exports getWeatherBasedFarmTip - The main function to trigger the tip generation flow.
 */

import {ai} from '@/ai/genkit';
import {
  WeatherBasedFarmTipInputSchema,
  WeatherBasedFarmTipOutputSchema,
  type WeatherBasedFarmTipInput,
  type WeatherBasedFarmTipOutput
} from '@/ai/schemas/weather-tip-schema';


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
