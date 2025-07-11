// src/app/market-analysis/actions.ts
"use server";

import { marketAnalysis, type MarketAnalysisInput, type MarketAnalysisOutput } from "@/ai/flows/market-analysis-flow";

export type { MarketAnalysisOutput };

export async function getMarketAnalysis(input: MarketAnalysisInput): Promise<MarketAnalysisOutput> {
  try {
    const result = await marketAnalysis(input);
    return result;
  } catch (error) {
    console.error("Error in getMarketAnalysis action:", error);
    throw new Error("Failed to fetch market analysis from AI.");
  }
}
