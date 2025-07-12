// src/app/market-analysis/actions.ts
"use server";

import { getCommodityPriceData, getDistinctStates, getMarketsForState, type PriceData } from "@/services/data-gov-service";

export interface MarketPriceData {
    commodity: string;
    state: string;
    market: string;
    minPrice: number;
    maxPrice: number;
    arrivalDate: string;
}

export interface MarketMetadata {
    [state: string]: string[];
}

export async function fetchStates(): Promise<string[]> {
    try {
        const states = await getDistinctStates();
        return states;
    } catch (error) {
        console.error("Error fetching states:", error);
        throw new Error("Failed to fetch states from data.gov.in");
    }
}

export async function fetchMarkets(state: string): Promise<string[]> {
    if (!state) return [];
    try {
        const markets = await getMarketsForState(state);
        return markets;
    } catch (error) {
        console.error(`Error fetching markets for state ${state}:`, error);
        throw new Error(`Failed to fetch markets for state ${state}`);
    }
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
    
    // Get the latest record
    const latestRecord = prices[prices.length - 1];

    return {
        commodity,
        state,
        market,
        minPrice: latestRecord.min_price,
        maxPrice: latestRecord.max_price,
        arrivalDate: latestRecord.arrival_date,
    };
  } catch (error) {
    console.error("Error in getMarketPrices action:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Failed to fetch market prices.");
  }
}
