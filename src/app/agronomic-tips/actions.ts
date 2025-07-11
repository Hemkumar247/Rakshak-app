"use server";

import { getAgronomicTips, AgronomicTipsInput, AgronomicTipsOutput } from "@/ai/flows/ai-driven-agronomic-tips";

export async function getAIAgronomicTips(input: AgronomicTipsInput): Promise<AgronomicTipsOutput> {
    try {
        const result = await getAgronomicTips(input);
        return result;
    } catch (error) {
        console.error("Error in getAIAgronomicTips action:", error);
        throw new Error("Failed to fetch agronomic tips from AI.");
    }
}
