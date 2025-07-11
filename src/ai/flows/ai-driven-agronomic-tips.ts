'use server';
/**
 * @fileOverview An AI agent that provides agronomic tips and potential action items tailored to specific crops and farm conditions.
 *
 * - getAgronomicTips - A function that generates agronomic tips based on crop and farm conditions.
 * - AgronomicTipsInput - The input type for the getAgronomicTips function.
 * - AgronomicTipsOutput - The return type for the getAgronomicTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgronomicTipsInputSchema = z.object({
  cropType: z.string().describe('The type of crop being grown (e.g., corn, soybeans, wheat).'),
  farmConditions: z.string().describe('A description of the current farm conditions, including soil type, weather patterns, and any known issues (e.g., pests, diseases, nutrient deficiencies).'),
  language: z.string().describe("The language for the response (e.g., 'en' for English, 'hi' for Hindi, 'ta' for Tamil)."),
});
export type AgronomicTipsInput = z.infer<typeof AgronomicTipsInputSchema>;

const AgronomicTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('A list of agronomic tips and potential action items tailored to the specified crop and farm conditions.'),
});
export type AgronomicTipsOutput = z.infer<typeof AgronomicTipsOutputSchema>;

export async function getAgronomicTips(input: AgronomicTipsInput): Promise<AgronomicTipsOutput> {
  return agronomicTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'agronomicTipsPrompt',
  input: {schema: AgronomicTipsInputSchema},
  output: {schema: AgronomicTipsOutputSchema},
  prompt: `You are an expert agronomist providing advice to farmers.

  Based on the crop type and farm conditions provided, generate a list of agronomic tips and potential action items.
  Summarize from relevant agronomic sources, and tailor the advice to the specific situation.

  The entire response, including all tips and text, must be in the following language: {{language}}.

  Crop Type: {{{cropType}}}
  Farm Conditions: {{{farmConditions}}}

  Provide the tips as a numbered list.
  `,
});

const agronomicTipsFlow = ai.defineFlow(
  {
    name: 'agronomicTipsFlow',
    inputSchema: AgronomicTipsInputSchema,
    outputSchema: AgronomicTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
