// src/app/market-analysis/actions.ts
"use server";

import { getCommodityPriceData, type PriceData } from "@/services/data-gov-service";

export interface MarketPriceData {
    commodity: string;
    state: string;
    market: string;
    priceData: PriceData[];
}

export async function getMarketPrices(commodity: string, state: string, market: string): Promise<MarketPriceData> {
  if (!commodity || !state || !market) {
    throw new Error("Commodity, State, and Market are required.");
  }
  
  try {
    const prices = await getCommodityPriceData({ commodity, state, market });
    
    if (prices.length === 0) {
        throw new Error(`No market data found for ${commodity} in ${market}, ${state}. Please check your inputs or try a different location.`);
    }
    
    return {
        commodity,
        state,
        market,
        priceData: prices
    };
  } catch (error) {
    console.error("Error in getMarketPrices action:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Failed to fetch market prices.");
  }
}
