// src/ai/flows/market-analysis-flow.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing market analysis and selling advice for crops.
 * It uses a tool to fetch simulated market price data and then analyzes it to give a recommendation.
 *
 * @exports marketAnalysis - The main function to trigger the market analysis flow.
 * @exports MarketAnalysisInput - The input type for the function.
 * @exports MarketAnalysisOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { getMarketPriceData, type PriceData } from '@/services/market-price-service';
import { z } from 'genkit';

// Define Zod schemas for input and output
const MarketAnalysisInputSchema = z.object({
  cropName: z.string().describe('The name of the crop to be analyzed.'),
  harvestTime: z.string().describe("When the crop was harvested (e.g., 'just_now', '2_days_ago', '4_days_ago')."),
  cropCondition: z.string().describe("The current condition of the harvested crop (e.g., 'perfect', 'good', 'average', 'poor')."),
  language: z.string().describe("The language for the response (e.g., 'en' for English, 'hi' for Hindi)."),
});
export type MarketAnalysisInput = z.infer<typeof MarketAnalysisInputSchema>;

const MarketAnalysisOutputSchema = z.object({
  cropName: z.string(),
  harvestTime: z.string(),
  cropCondition: z.string(),
  recommendation: z.enum(['Sell Now', 'Wait']).describe("The AI's final recommendation."),
  translatedRecommendation: z.string().describe('The recommendation translated into the requested language.'),
  reasoning: z.string().describe('A concise explanation for the recommendation, considering market trends and crop condition.'),
  priceData: z.array(z.object({
    day: z.string(),
    price: z.number(),
  })).describe('Historical and predicted price data.'),
});
export type MarketAnalysisOutput = z.infer<typeof MarketAnalysisOutputSchema>;


// Define a Genkit Tool to fetch market price data.
// The LLM will decide to use this tool to get the necessary data.
const fetchMarketDataTool = ai.defineTool(
  {
    name: 'fetchMarketPriceData',
    description: 'Retrieves historical and current market price data for a specific crop.',
    inputSchema: z.object({ crop: z.string() }),
    outputSchema: z.array(z.object({
      day: z.string(),
      price: z.number(),
    })),
  },
  async (input) => await getMarketPriceData(input.crop)
);


// Define the main prompt for the analysis
const marketAnalysisPrompt = ai.definePrompt({
  name: 'marketAnalysisPrompt',
  tools: [fetchMarketDataTool],
  input: { schema: z.object({
      ...MarketAnalysisInputSchema.shape,
      historicalPriceData: z.any(),
  }) },
  output: { schema: z.object({
      recommendation: z.enum(['Sell Now', 'Wait']),
      translatedRecommendation: z.string(),
      reasoning: z.string(),
      predictedPriceToday: z.number(),
      predictedPriceTomorrow: z.number(),
  }) },
  prompt: `You are an expert agricultural market analyst. Your goal is to advise a farmer on the best time to sell their harvested crops.

  Analyze the provided data:
  1.  **Price Trend**: Analyze the historical price data to identify a trend (upward, downward, or stable).
  2.  **Crop Urgency**: Assess the urgency to sell based on the crop's condition and harvest time. A 'poor' condition or older harvest requires a faster sale, even if the market trend is unfavorable. A 'perfect' condition crop can afford to wait for a better price.
  3.  **Prediction**: Based on the trend, predict the prices for 'Today' and 'Tomorrow'.
  4.  **Recommendation**: Make a clear recommendation: 'Sell Now' or 'Wait'.
      -   Recommend 'Sell Now' if the price is high and might drop, or if the crop condition is poor and risks spoilage.
      -   Recommend 'Wait' if the price trend is upward and the crop condition is good enough to last.
  5.  **Reasoning**: Provide a short, clear justification for your recommendation in a single paragraph.

  All text output (reasoning, recommendation) must be in the requested language: {{language}}.

  Crop Details:
  - Name: {{cropName}}
  - Harvested: {{harvestTime}}
  - Condition: {{cropCondition}}
  
  Historical Price Data:
  {{jsonStringify historicalPriceData}}
  `,
});

// Define the main Genkit Flow
export const marketAnalysis = ai.defineFlow(
  {
    name: 'marketAnalysisFlow',
    inputSchema: MarketAnalysisInputSchema,
    outputSchema: MarketAnalysisOutputSchema,
  },
  async (input) => {
    // Manually call the tool to get historical data
    const historicalPriceData = await fetchMarketDataTool({ crop: input.cropName });

    // Call the prompt with the historical data in the input
    const llmResponse = await marketAnalysisPrompt({
      ...input,
      historicalPriceData: historicalPriceData.slice(0, historicalPriceData.length -1) // Exclude today's mock price
    });
    const analysis = llmResponse.output!;
    
    // Combine historical data with AI predictions
    const combinedPriceData: PriceData[] = historicalPriceData.slice(0, historicalPriceData.length - 1);
    combinedPriceData.push({ day: 'Today', price: analysis.predictedPriceToday });
    combinedPriceData.push({ day: 'Tomorrow', price: analysis.predictedPriceTomorrow });
    
    // Map internal values to user-friendly text
    const harvestTimeText = {
        'just_now': 'Just now harvested',
        '2_days_ago': 'Harvested 2 days ago',
        '4_days_ago': 'Harvested 4 days ago',
    }[input.harvestTime] || input.harvestTime;

    const conditionText = {
        'perfect': 'Perfectly alright',
        'good': 'Good',
        'average': 'Average',
        'poor': 'At risk of spoiling soon',
    }[input.cropCondition] || input.cropCondition;


    return {
      cropName: input.cropName,
      harvestTime: harvestTimeText,
      cropCondition: conditionText,
      recommendation: analysis.recommendation,
      translatedRecommendation: analysis.translatedRecommendation,
      reasoning: analysis.reasoning,
      priceData: combinedPriceData,
    };
  }
);
