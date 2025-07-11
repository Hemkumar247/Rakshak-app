import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      // The Google AI API key is configured via the GOOGLE_API_KEY environment variable.
    }),
  ],
  models: {
    // Define the default model for complex, multimodal tasks.
    gemini: 'googleai/gemini-2.0-flash',
    // Define a specific model for text-only, efficient tasks.
    gemma: {
      model: 'googleai/gemma-2-9b',
      // Optional: Configure safety settings if needed for Gemma.
      // safetySettings: [...] 
    },
  },
  // Set the default model for any ai.generate() call that doesn't specify one.
  model: 'gemini',
});
