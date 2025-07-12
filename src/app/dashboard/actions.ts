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
  const commodities = ['Wheat', 'Potato', 'Onion', 'Tomato'];
  const state = 'NCT of Delhi';
  const market = 'Azadpur';

  const dataPromises = commodities.map(async (commodity) => {
    try {
      const priceHistory = await getCommodityPriceData({ commodity, state, market });
      
      if (priceHistory.length < 2) {
        // Not enough data to calculate change
        return { crop: commodity, change: 0, status: 'stable' as const };
      }

      // Get the last two available records
      const latestPrice = priceHistory[priceHistory.length - 1].modal_price;
      const previousPrice = priceHistory[priceHistory.length - 2].modal_price;
      
      if (previousPrice === 0) {
        return { crop: commodity, change: 0, status: 'stable' as const };
      }

      const change = ((latestPrice - previousPrice) / previousPrice) * 100;
      let status: 'up' | 'down' | 'stable' = 'stable';
      if (change > 0) status = 'up';
      if (change < 0) status = 'down';

      return { crop: commodity, change, status };
    } catch (error) {
      console.error(`Failed to fetch data for ${commodity} in dashboard card:`, error);
      // Return a stable state on error to avoid breaking the UI
      return { crop: commodity, change: 0, status: 'stable' as const };
    }
  });

  const results = await Promise.all(dataPromises);
  return results;
}
