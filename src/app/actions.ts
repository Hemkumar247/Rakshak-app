'use server';

import {
  getUserIntent as getUserIntentFlow,
  type GetUserIntentInput,
  type GetUserIntentOutput,
} from '@/ai/flows/get-user-intent';

export async function getUserIntent(
  input: GetUserIntentInput
): Promise<GetUserIntentOutput> {
  try {
    const result = await getUserIntentFlow(input);
    return result;
  } catch (error) {
    console.error('Error in getUserIntent action:', error);
    throw new Error('Failed to get user intent from AI.');
  }
}
