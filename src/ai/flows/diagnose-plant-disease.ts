'use server';
/**
 * @fileOverview An AI agent that diagnoses plant diseases from an image.
 *
 * - diagnosePlantDisease - A function that handles the plant diagnosis process.
 * - DiagnosePlantDiseaseInput - The input type for the diagnosePlantDisease function.
 * - DiagnosePlantDiseaseOutput - The return type for the diagnosePlantDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePlantDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userDescription: z.string().describe('Optional user-provided description of the plant and its symptoms.'),
  language: z.string().describe("The language for the response (e.g., 'en' for English, 'hi' for Hindi, 'ta' for Tamil)."),
});
export type DiagnosePlantDiseaseInput = z.infer<typeof DiagnosePlantDiseaseInputSchema>;

const DiagnosePlantDiseaseOutputSchema = z.object({
  isPlant: z.boolean().describe('Whether the image contains a plant or not.'),
  plantName: z.string().describe("The common name of the identified plant. 'Unknown' if not identifiable."),
  isHealthy: z.boolean().describe('Whether the plant appears to be healthy.'),
  diseaseName: z.string().describe("The common name of the identified disease. 'None' if healthy."),
  diagnosis: z.array(z.string()).describe("A short, crisp list of observations about the plant's health from the image."),
  treatment: z.array(z.string()).describe("A short, crisp list of recommended steps to treat the disease."),
  prevention: z.array(z.string()).describe("A short, crisp list of tips to prevent this disease in the future."),
  diseaseImageUrl: z.string().optional().describe('A generated image URL of a plant with the diagnosed disease for reference.'),
});
export type DiagnosePlantDiseaseOutput = z.infer<typeof DiagnosePlantDiseaseOutputSchema>;

export async function diagnosePlantDisease(input: DiagnosePlantDiseaseInput): Promise<DiagnosePlantDiseaseOutput> {
  return diagnosePlantDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantDiseasePrompt',
  input: {schema: DiagnosePlantDiseaseInputSchema},
  output: {schema: DiagnosePlantDiseaseOutputSchema},
  prompt: `You are Rakshak AI, an expert plant pathologist and botanist. Your task is to analyze an image of a plant and provide a detailed diagnosis.

Analyze the provided image and the user's description to identify the plant and any diseases or pests affecting it.

Based on your analysis, provide the following:
1.  **isPlant**: Determine if the image actually contains a plant.
2.  **plantName**: The common name of the plant.
3.  **isHealthy**: State if the plant is healthy or not.
4.  **diseaseName**: The specific name of the disease or pest. If healthy, this should be 'None'.
5.  **diagnosis**: A concise, easy-to-understand list of what is wrong with the plant.
6.  **treatment**: A simple, actionable list of steps the farmer can take to treat the issue.
7.  **prevention**: A simple, actionable list of steps to prevent the issue from happening again.

Do not fill the diseaseImageUrl field. This will be handled in a separate step.

The entire response, including all names and descriptions, must be in the following language: {{language}}.

User's Description: {{{userDescription}}}
Plant Photo: {{media url=photoDataUri}}`,
});

const diagnosePlantDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnosePlantDiseaseFlow',
    inputSchema: DiagnosePlantDiseaseInputSchema,
    outputSchema: DiagnosePlantDiseaseOutputSchema,
  },
  async input => {
    const {output: diagnosisResult} = await prompt(input);
    
    if (!diagnosisResult) {
        throw new Error("Failed to get a diagnosis from the AI.");
    }

    // If the plant is not healthy, generate a reference image of the disease.
    if (!diagnosisResult.isHealthy && diagnosisResult.plantName && diagnosisResult.diseaseName !== 'None') {
        try {
            const {media} = await ai.generate({
                model: 'googleai/gemini-2.0-flash-preview-image-generation',
                prompt: `Generate a clear, close-up reference photo of a ${diagnosisResult.plantName} plant leaf showing typical symptoms of ${diagnosisResult.diseaseName}.`,
                config: {
                    responseModalities: ['TEXT', 'IMAGE'],
                },
            });
            diagnosisResult.diseaseImageUrl = media.url;
        } catch(e) {
            console.error(`Failed to generate disease reference image for ${diagnosisResult.diseaseName}`, e);
            // Fallback to a placeholder if image generation fails
            diagnosisResult.diseaseImageUrl = `https://placehold.co/600x400.png?text=Reference+Image`;
        }
    }

    return diagnosisResult;
  }
);
