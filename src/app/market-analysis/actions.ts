// src/app/market-analysis/actions.ts
"use server";

import { getCommodityPriceData, type PriceData } from "@/services/data-gov-service";

export interface MarketPriceData {
    commodity: string;
    state: string;
    market: string;
    priceData: PriceData[];
}

// Default to a major market if only state is provided.
const stateToDefaultMarket: Record<string, string> = {
    "Maharashtra": "Pune",
    "Uttar Pradesh": "Lucknow",
    "Karnataka": "Bangalore",
    "Tamil Nadu": "Chennai",
    "Andhra Pradesh": "Hyderabad",
    "Gujarat": "Ahmedabad",
    // Add more states and default markets as needed
};

export async function getMarketPrices(commodity: string, state: string, market?: string): Promise<MarketPriceData> {
  
  const targetMarket = market || stateToDefaultMarket[state] || state; // Fallback to state name if no default market found

  if (!targetMarket) {
    throw new Error(`Could not determine a market for the state: ${state}. Please specify one.`);
  }
  
  try {
    const prices = await getCommodityPriceData({ commodity, state, market: targetMarket });
    
    if (prices.length === 0) {
        throw new Error(`No market data found for ${commodity} in ${targetMarket}, ${state}. Please check your inputs or try a different location.`);
    }
    
    return {
        commodity,
        state,
        market: targetMarket,
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
