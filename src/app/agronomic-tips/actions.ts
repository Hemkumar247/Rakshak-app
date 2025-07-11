"use server";

import { diagnosePlantDisease, DiagnosePlantDiseaseInput, DiagnosePlantDiseaseOutput } from "@/ai/flows/diagnose-plant-disease";

export async function getPlantDiagnosis(input: DiagnosePlantDiseaseInput): Promise<DiagnosePlantDiseaseOutput> {
    try {
        const result = await diagnosePlantDisease(input);
        return result;
    } catch (error) {
        console.error("Error in getPlantDiagnosis action:", error);
        throw new Error("Failed to fetch plant diagnosis from AI.");
    }
}
