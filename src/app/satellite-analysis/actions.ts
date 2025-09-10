'use server';

import {
  satelliteFarmAnalysis,
  type SatelliteFarmAnalysisInput,
  type SatelliteFarmAnalysisOutput,
} from '@/ai/flows/satellite-farm-analysis';

export async function getSatelliteAnalysis(
  input: SatelliteFarmAnalysisInput
): Promise<SatelliteFarmAnalysisOutput> {
  try {
    const result = await satelliteFarmAnalysis(input);
    return result;
  } catch (error) {
    console.error('Error in getSatelliteAnalysis action:', error);
    throw new Error('Failed to fetch satellite analysis from AI.');
  }
}
