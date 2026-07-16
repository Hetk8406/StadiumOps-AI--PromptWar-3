/**
 * Crowd AI Service
 * Resolves prompts, sends them through the client pipeline, and validates responses.
 * Provides the single boundary logic for the crowd context reducer.
 */

import { Gate } from '../../domain/models';
import { CrowdAIRecommendations } from './crowdTypes';
import { buildCrowdRecommendationPrompt } from './crowdPromptBuilder';
import { sendToGemini, extractTextFromResult } from '../client/geminiClient';
import { parseRawJSON } from '../parsers/responseParser';
import { validateCrowdAIRecommendations } from './crowdValidator';
import { classifyAIError } from '../shared/aiErrors';

export async function generateCrowdRecommendations(
  gates: readonly Gate[],
  standsContext?: unknown
): Promise<CrowdAIRecommendations> {
  try {
    const promptPayload = buildCrowdRecommendationPrompt(gates, standsContext);
    const result = await sendToGemini(promptPayload);
    const rawText = extractTextFromResult(result);
    const rawJson = parseRawJSON<unknown>(rawText);
    const validated = validateCrowdAIRecommendations(rawJson);
    return validated;
  } catch (err: unknown) {
    throw classifyAIError(err);
  }
}
