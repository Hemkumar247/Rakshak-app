'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing a simulated satellite farm analysis.
 *
 * The flow takes geographic coordinates, generates a plausible NDVI score,
 * creates a descriptive analysis, and generates a representative heatmap image.
 */

import {ai} from '@/ai/genkit';
import {
  SatelliteFarmAnalysisInputSchema,
  SatelliteFarmAnalysisOutputSchema,
  type SatelliteFarmAnalysisInput,
  type SatelliteFarmAnalysisOutput
} from '@/ai/schemas/satellite-analysis-schema';

// Simple hashing function to create a deterministic "random" number from a string.
const deterministicHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

export async function satelliteFarmAnalysis(input: SatelliteFarmAnalysisInput): Promise<SatelliteFarmAnalysisOutput> {
  return satelliteFarmAnalysisFlow(input);
}

const satelliteFarmAnalysisPrompt = ai.definePrompt({
  name: 'satelliteFarmAnalysisPrompt',
  input: { schema: z.object({ 
    coordinates: SatelliteFarmAnalysisInputSchema.shape.coordinates,
    language: SatelliteFarmAnalysisInputSchema.shape.language,
    ndvi: z.number() 
  }) },
  output: { schema: z.object({
    healthDescription: SatelliteFarmAnalysisOutputSchema.shape.healthDescription,
    soilAnalysis: SatelliteFarmAnalysisOutputSchema.shape.soilAnalysis,
    recommendations: SatelliteFarmAnalysisOutputSchema.shape.recommendations,
  }) },
  config: {
    temperature: 0.2, 
  },
  prompt: `You are an expert agronomist and remote sensing analyst. Today's date is {{currentDate}}.

  A farmer has provided the following coordinates for their farm: {{coordinates}}.
  
  Based on these coordinates, you have determined the Normalized Difference Vegetation Index (NDVI) to be {{ndvi}}. An NDVI score between 0.6 and 0.8 is considered excellent, 0.4 to 0.6 is good, and below 0.4 is moderate or poor.

  Provide a concise and helpful analysis for the farmer in the following language: {{language}}.
  
  Your analysis should include:
  1.  **healthDescription**: A brief, one-sentence interpretation of the NDVI score.
  2.  **soilAnalysis**: A plausible analysis of the likely soil type and condition for that geographical region.
  3.  **recommendations**: A short, crisp list of 2-3 actionable recommendations based on the NDVI score and soil analysis.
  
  Keep the language simple and encouraging.`,
});

const satelliteFarmAnalysisFlow = ai.defineFlow(
  {
    name: 'satelliteFarmAnalysisFlow',
    inputSchema: SatelliteFarmAnalysisInputSchema,
    outputSchema: SatelliteFarmAnalysisOutputSchema,
  },
  async (input) => {
    const { coordinates } = input;

    // Generate a deterministic NDVI score from coordinates
    const hash = deterministicHash(coordinates);
    const ndvi = parseFloat((((hash % 600) / 1000) + 0.2).toFixed(3)); // Consistent value between 0.2 and 0.8

    // Generate the textual analysis and the image in parallel
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const [analysisResult, imageResult] = await Promise.all([
      satelliteFarmAnalysisPrompt({ ...input, ndvi, currentDate }),
      ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Generate a satellite NDVI (Normalized Difference Vegetation Index) heatmap of a farm field at coordinates ${coordinates}. The image should be a top-down aerial view. Use a color scale where vibrant green indicates healthy vegetation and yellow/red indicates stressed or bare areas. The overall health should look consistent with an NDVI score of approximately ${ndvi.toFixed(2)}. Do not include any text or labels on the image.`,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      })
    ]);
    
    const output = analysisResult.output;
    if (!output) {
      throw new Error("Failed to get a valid analysis from the AI model.");
    }
    
    const imageDataUri = imageResult.media.url;
    if (!imageDataUri) {
      throw new Error("Failed to generate a satellite image.");
    }

    return {
      ...output,
      ndvi,
      imageDataUri,
    };
  }
);
