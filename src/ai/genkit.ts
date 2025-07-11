import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      // The Google AI API key is configured via the GOOGLE_API_KEY environment variable.
    }),
  ],
  // Set the default model for any ai.generate() call that doesn't specify one.
  model: 'googleai/gemini-2.0-flash',
});
