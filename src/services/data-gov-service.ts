/**
 * @fileOverview A service to fetch real-time crop market price data from data.gov.in.
 */

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export interface PriceData {
    day: string; // e.g., 'Today', 'Tomorrow', 'Yesterday'
    price: number; // Price per quintal
}

interface CommodityPriceInput {
    commodity: string;
    state: string;
    market: string;
}

interface DataGovRecord {
    state: string;
    district: string;
    market: string;
    commodity: string;
    variety: string;
    arrival_date: string; // DD/MM/YYYY
    min_price: string;
    max_price: string;
    modal_price: string;
}

const getCommodityPriceDataTool = ai.defineTool(
  {
    name: 'getCommodityPriceData',
    inputSchema: z.object({
        commodity: z.string(),
        state: z.string(),
        market: z.string(),
    }),
    outputSchema: z.array(z.object({
        day: z.string(),
        price: z.number(),
    })),
  },
  async ({ commodity, state, market }) => {
    const apiKey = process.env.DATA_GOV_IN_API_KEY;
    if (!apiKey) {
      throw new Error("data.gov.in API key is not configured.");
    }
  
    const url = new URL('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070');
    url.searchParams.append('api-key', apiKey);
    url.searchParams.append('format', 'json');
    url.searchParams.append('limit', '5'); // Get the last 5 entries
    url.searchParams.append('filters[state]', state);
    url.searchParams.append('filters[market]', market);
    url.searchParams.append('filters[commodity]', commodity);
    // Sort by arrival date descending to get the most recent data
    url.searchParams.append('sort[arrival_date]', 'desc');
  
    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      const data = await response.json();
  
      if (!data.records || data.records.length === 0) {
        return [];
      }
  
      // The API returns records sorted descending, so we reverse to get chronological order for charting
      const priceData = data.records.reverse().map((record: DataGovRecord) => {
        const date = new Date(record.arrival_date.split('/').reverse().join('-'));
        const dayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
        return {
          day: dayLabel,
          price: parseFloat(record.modal_price)
        };
      });
  
      return priceData;
    } catch (error) {
      console.error("Failed to fetch market data from data.gov.in:", error);
      throw new Error("Could not fetch live market data.");
    }
  }
);


export async function getCommodityPriceData(input: CommodityPriceInput): Promise<PriceData[]> {
    return getCommodityPriceDataTool(input);
}
