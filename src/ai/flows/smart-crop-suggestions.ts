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

const CropRecommendationSchema = z.object({
    cropName: z.string().describe('The name of the suggested crop.'),
    reasoning: z.array(z.string()).describe('A short, crisp list of reasons why this crop is a good choice.'),
    imageQuery: z.string().describe('A one or two-word query for a stock photo of this crop.'),
});

const SmartCropSuggestionsOutputSchema = z.object({
  recommendations: z
    .array(CropRecommendationSchema)
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
  
  Recommend a list of the 3 most suitable crops for cultivation at this specific time of year in that location. For each crop, provide a brief, easy-to-understand list of reasons why it is a good choice, considering factors like climate suitability, profitability, and seasonal timing.

  Farm Location: {{{farmLocation}}}
  
  Keep the reasoning points very concise and simple for a farmer to understand.`,
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
