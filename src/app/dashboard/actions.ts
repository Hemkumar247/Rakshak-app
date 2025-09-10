// src/app/dashboard/actions.ts
"use server";

import { getCommodityPriceData } from "@/services/data-gov-service";

export interface MarketCardDataItem {
  crop: string;
  change: number;
  status: 'up' | 'down' | 'stable';
}

// Fetches price data for a few key commodities to display on the dashboard market card.
export async function getMarketCardData(): Promise<MarketCardDataItem[]> {
  // For demo purposes, we are returning a hardcoded dataset with translation keys.
  // This avoids issues with the live API not having recent data.
  const fakeData: MarketCardDataItem[] = [
    { crop: 'wheat', change: 1.5, status: 'up' },
    { crop: 'potato', change: -0.8, status: 'down' },
    { crop: 'onion', change: 2.1, status: 'up' },
    { crop: 'tomato', change: -0.2, status: 'down' },
    { crop: 'soybean', change: 0.5, status: 'up' },
    { crop: 'cotton', change: -1.2, status: 'down' },
  ];

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return fakeData;
}
