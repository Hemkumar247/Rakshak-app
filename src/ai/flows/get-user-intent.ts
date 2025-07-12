'use server';
/**
 * @fileOverview An AI agent that determines user intent from a voice command.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetUserIntentInputSchema = z.object({
  command: z
    .string()
    .describe(
      "A transcribed voice command from the user."
    ),
  language: z
    .string()
    .describe(
      "The language of the user's command (e.g., 'en', 'hi', 'ta')."
    ),
});
export type GetUserIntentInput = z.infer<typeof GetUserIntentInputSchema>;

const GetUserIntentOutputSchema = z.object({
  intent: z
    .enum(['navigation', 'diagnosis', 'market_price', 'unsupported'])
    .describe('The primary intent of the user command.'),
  page: z
    .string()
    .optional()
    .describe(
      "If intent is 'navigation', the absolute path of the page to navigate to (e.g., '/weather', '/dashboard')."
    ),
  cropName: z
    .string()
    .optional()
    .describe(
      "If intent is 'market_price', the name of the crop the user is asking about."
    ),
});
export type GetUserIntentOutput = z.infer<typeof GetUserIntentOutputSchema>;

export async function getUserIntent(
  input: GetUserIntentInput
): Promise<GetUserIntentOutput> {
  return getUserIntentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getUserIntentPrompt',
  input: { schema: GetUserIntentInputSchema },
  output: { schema: GetUserIntentOutputSchema },
  prompt: `You are a command interpreter for a farming assistance app called Rakshak.
Your task is to analyze the user's transcribed command and determine their intent.

The available pages and their corresponding paths are:
- Dashboard: /dashboard
- Crop Suggestions: /crop-suggestions
- Plant Diagnosis: /agronomic-tips
- Market Analysis: /market-analysis
- Government Schemes: /schemes
- Weather Forecast: /weather
- Profile: /profile
- Settings: /settings
- Support: /support

Analyze the user's command.
- If the user wants to go to a specific page, set the intent to 'navigation' and the 'page' to the correct path.
- If the user is asking about the price of a specific crop, set the intent to 'market_price' and extract the 'cropName'.
- If the user wants to diagnose a plant, set the intent to 'diagnosis'.
- If the command is not related to the app's features, set the intent to 'unsupported'.

The entire command is in the language: {{language}}

User's command: {{{command}}}`,
});

const getUserIntentFlow = ai.defineFlow(
  {
    name: 'getUserIntentFlow',
    inputSchema: GetUserIntentInputSchema,
    outputSchema: GetUserIntentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
