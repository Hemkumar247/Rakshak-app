// src/ai/flows/smart-crop-suggestions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing smart crop suggestions to farmers.
 *
 * The flow takes a farm location as input, determines the current season, and
 * returns crop recommendations suitable for that region and time of year.
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
    .describe('The geographical location of the farm (e.g., city, state, country, or specific address).'),
});
export type SmartCropSuggestionsInput = z.infer<typeof SmartCropSuggestionsInputSchema>;

const SmartCropSuggestionsOutputSchema = z.object({
  cropRecommendations: z
    .string()
    .describe('A list of crop recommendations, with reasoning, based on the location and current season.'),
});
export type SmartCropSuggestionsOutput = z.infer<typeof SmartCropSuggestionsOutputSchema>;

export async function smartCropSuggestions(input: SmartCropSuggestionsInput): Promise<SmartCropSuggestionsOutput> {
  return smartCropSuggestionsFlow(input);
}

const smartCropSuggestionsPrompt = ai.definePrompt({
  name: 'smartCropSuggestionsPrompt',
  input: {schema: SmartCropSuggestionsInputSchema},
  output: {schema: SmartCropSuggestionsOutputSchema},
  prompt: `You are an expert agronomist AI, and your task is to provide seasonal crop recommendations. Today's date is {{currentDate}}.

  Based on the farm's location, analyze the regional climate, typical soil types, and the current season.
  
  Recommend a list of the most suitable crops for cultivation at this specific time of year in that location. For each crop, provide a brief explanation for why it is a good choice, considering factors like climate suitability, profitability, and seasonal timing.

  Farm Location: {{{farmLocation}}}

  Format your response as a clear, easy-to-read paragraph.`,
});

const smartCropSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartCropSuggestionsFlow',
    inputSchema: SmartCropSuggestionsInputSchema,
    outputSchema: SmartCropSuggestionsOutputSchema,
  },
  async (input) => {
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    const {output} = await smartCropSuggestionsPrompt({
      ...input,
      currentDate,
    });
    return output!;
  }
);
