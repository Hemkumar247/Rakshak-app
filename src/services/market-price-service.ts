/**
 * @fileOverview A mock service to simulate fetching crop market price data.
 * In a real-world application, this service would connect to a live government
 * or commodity market API to get real-time and historical price data.
 */

export interface PriceData {
    day: string; // e.g., 'Today', 'Tomorrow', 'Yesterday'
    price: number; // Price per quintal
}

// Simple hashing function to generate pseudo-random but deterministic data from a crop name
function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Fetches mock market price data for a given crop.
 * @param cropName The name of the crop.
 * @returns A promise that resolves to an array of price data for the last 5 days.
 */
export async function getMarketPriceData(cropName: string): Promise<PriceData[]> {
    console.log(`Fetching mock market data for: ${cropName}`);

    // This is a mock implementation.
    // We generate deterministic "random" data based on the crop name.
    const baseHash = simpleHash(cropName.toLowerCase());
    const basePrice = (baseHash % 3000) + 1500; // Base price between 1500 and 4500

    const priceData: PriceData[] = [];
    const today = new Date();
    
    // Generate data for the last 5 days
    for (let i = 4; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        // Create some pseudo-random fluctuation
        const fluctuation = ((simpleHash(cropName + i) % 200) - 100); // Fluctuation between -100 and 100
        const price = Math.round(basePrice + fluctuation);

        const dayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
        
        priceData.push({
            day: i === 0 ? 'Today' : dayLabel,
            price: price,
        });
    }

    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return priceData;
}
