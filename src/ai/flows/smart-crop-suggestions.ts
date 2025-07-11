'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing smart crop suggestions to farmers.
 *
 * The flow takes a farm location as input, determines the current season, and
 * returns crop recommendations suitable for that region and time of year, including a generated image for each.
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
  language: z.string().describe("The language for the response (e.g., 'en' for English, 'hi' for Hindi, 'ta' for Tamil)."),
});
export type SmartCropSuggestionsInput = z.infer<typeof SmartCropSuggestionsInputSchema>;

const CropRecommendationSchema = z.object({
    cropName: z.string().describe('The name of the suggested crop.'),
    reasoning: z.array(z.string()).describe('A short, crisp list of reasons why this crop is a good choice.'),
    imageQuery: z.string().describe('A one or two-word query for a stock photo of this crop.'),
    imageDataUri: z.string().describe("A generated image of the crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.").optional(),
});

const SmartCropSuggestionsOutputSchema = z.object({
  recommendations: z
    .array(CropRecommendationSchema)
    .describe('A list of crop recommendations, with reasoning and a generated image, based on the location and current season.'),
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

  The entire response, including crop names and reasoning, must be in the following language: {{language}}.

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

    if (!output?.recommendations) {
      return { recommendations: [] };
    }

    // Generate an image for each recommendation
    const imagePromises = output.recommendations.map(async (rec) => {
      try {
        const {media} = await ai.generate({
          model: 'googleai/gemini-2.0-flash-preview-image-generation',
          prompt: `A vibrant, high-quality photo of ${rec.imageQuery} growing in a field, suitable for an agricultural advisory app.`,
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        });
        rec.imageDataUri = media.url;
      } catch (e) {
        console.error(`Failed to generate image for ${rec.cropName}`, e);
        // Fallback to a placeholder URL if generation fails
        rec.imageDataUri = `https://placehold.co/600x400.png?text=${rec.cropName.replace(/\s/g, '+')}`;
      }
      return rec;
    });

    const recommendationsWithImages = await Promise.all(imagePromises);

    return { recommendations: recommendationsWithImages };
  }
);
