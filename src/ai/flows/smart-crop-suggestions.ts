// src/ai/flows/smart-crop-suggestions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing smart crop suggestions to farmers.
 *
 * The flow takes farm location, weather patterns, soil data, and market trends as input and
 * returns crop recommendations based on this data.
 *
 * @exports smartCropSuggestions - The main function to trigger the crop suggestion flow.
 * @exports SmartCropSuggestionsInput - The input type for the smartCropSuggestions function.
 * @exports SmartCropSuggestionsOutput - The output type for the smartCropSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartCropSuggestionsInputSchema = z.object({
  farmLocation: z
    .string()
    .describe('The geographical location of the farm (e.g., latitude, longitude, or address).'),
  weatherPatterns: z
    .string()
    .describe('Description of recent and expected weather patterns in the farm location.'),
  soilData: z.string().describe('Data about the soil composition and health on the farm.'),
  marketTrends: z
    .string()
    .describe('Information about current market trends for various crops.'),
});
export type SmartCropSuggestionsInput = z.infer<typeof SmartCropSuggestionsInputSchema>;

const SmartCropSuggestionsOutputSchema = z.object({
  cropRecommendations: z
    .string()
    .describe('A list of crop recommendations, with reasoning, based on the input data.'),
});
export type SmartCropSuggestionsOutput = z.infer<typeof SmartCropSuggestionsOutputSchema>;

export async function smartCropSuggestions(input: SmartCropSuggestionsInput): Promise<SmartCropSuggestionsOutput> {
  return smartCropSuggestionsFlow(input);
}

const smartCropSuggestionsPrompt = ai.definePrompt({
  name: 'smartCropSuggestionsPrompt',
  input: {schema: SmartCropSuggestionsInputSchema},
  output: {schema: SmartCropSuggestionsOutputSchema},
  prompt: `You are an AI crop advisor providing smart crop suggestions to farmers.

  Based on the following information about the farm, provide a list of crop recommendations, along with a brief explanation of why each crop is suitable.

  Farm Location: {{{farmLocation}}}
  Weather Patterns: {{{weatherPatterns}}}
  Soil Data: {{{soilData}}}
  Market Trends: {{{marketTrends}}}

  Consider factors such as yield, profitability, and sustainability when making your recommendations.
  Format your output as a paragraph.`,
});

const smartCropSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartCropSuggestionsFlow',
    inputSchema: SmartCropSuggestionsInputSchema,
    outputSchema: SmartCropSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await smartCropSuggestionsPrompt(input);
    return output!;
  }
);
