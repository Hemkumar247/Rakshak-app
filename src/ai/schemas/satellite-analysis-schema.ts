/**
 * @fileOverview Zod schemas and TypeScript types for the satellite farm analysis flow.
 */
import {z} from 'genkit';

export const SatelliteFarmAnalysisInputSchema = z.object({
  coordinates: z.string().regex(/^-?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*-?((1[0-7]\d(\.\d+)?|([1-9]?\d)(\.\d+)?))$/, "Invalid coordinates. Please use 'lat, lon' format.").describe("The geographical coordinates of the farm (latitude, longitude)."),
  language: z.string().describe("The language for the response (e.g., 'en' for English, 'hi' for Hindi, 'ta' for Tamil)."),
});
export type SatelliteFarmAnalysisInput = z.infer<typeof SatelliteFarmAnalysisInputSchema>;


export const SatelliteFarmAnalysisOutputSchema = z.object({
  ndvi: z.number().describe('The calculated Normalized Difference Vegetation Index (NDVI) score.'),
  healthDescription: z.string().describe("A brief, one-sentence interpretation of the NDVI score."),
  soilAnalysis: z.string().describe("A plausible analysis of the likely soil type and condition for the region."),
  recommendations: z.array(z.string()).describe('A list of actionable recommendations based on the analysis.'),
  imageDataUri: z.string().describe("A generated satellite heatmap image of the farm, as a data URI.").optional(),
});
export type SatelliteFarmAnalysisOutput = z.infer<typeof SatelliteFarmAnalysisOutputSchema>;
