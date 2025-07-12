'use server';

import {
  getUserIntent,
  type GetUserIntentInput,
  type GetUserIntentOutput,
} from '@/ai/flows/get-user-intent';

export async function getUserIntent(
  input: GetUserIntentInput
): Promise<GetUserIntentOutput> {
  try {
    const result = await getUserIntent(input);
    return result;
  } catch (error) {
    console.error('Error in getUserIntent action:', error);
    throw new Error('Failed to get user intent from AI.');
  }
}
