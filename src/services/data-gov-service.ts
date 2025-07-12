/**
 * @fileOverview A service to fetch real-time crop market price data from data.gov.in.
 */

'use server';

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

// Note: This is now just a direct function call, not a Genkit tool.
export async function getCommodityPriceData(input: CommodityPriceInput): Promise<PriceData[]> {
    const { commodity, state, market } = input;
    const apiKey = process.env.DATA_GOV_IN_API_KEY;
    if (!apiKey) {
      throw new Error("data.gov.in API key is not configured.");
    }
  
    const url = new URL('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070');
    url.searchParams.append('api-key', apiKey);
    url.searchParams.append('format', 'json');
    url.searchParams.append('limit', '5'); // Get the last 5 entries for a simple trend
    // The API seems to work better with broader filters.
    // We will filter by state and commodity, and then manually filter by market if needed.
    url.searchParams.append('filters[state]', state);
    url.searchParams.append('filters[commodity]', commodity);
    // It's often better to let the client-side filter by market if the API is inconsistent with it.
    // For now, we will filter by market on the API side.
    url.searchParams.append('filters[market]', market);

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
