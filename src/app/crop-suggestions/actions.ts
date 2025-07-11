"use server";

import { smartCropSuggestions, SmartCropSuggestionsInput, SmartCropSuggestionsOutput } from "@/ai/flows/smart-crop-suggestions";

export async function getSmartCropSuggestions(input: SmartCropSuggestionsInput): Promise<SmartCropSuggestionsOutput> {
  try {
    const result = await smartCropSuggestions(input);
    return result;
  } catch (error) {
    console.error("Error in getSmartCropSuggestions action:", error);
    throw new Error("Failed to fetch crop suggestions from AI.");
  }
}
