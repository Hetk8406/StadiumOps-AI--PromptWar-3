/**
 * Accessibility AI Service
 * Resolves prompts, calls the Gemini Client, parses text, and validates schemas.
 */

import { AccessibilityRequest } from '../../domain/models';
import { AccessibilityAIRecommendations } from './accessibilityTypes';
import { buildAccessibilityPrompt } from './accessibilityPromptBuilder';
import { sendToGemini, extractTextFromResult } from '../client/geminiClient';
import { parseRawJSON } from '../parsers/responseParser';
import { validateAccessibilityAIRecommendations } from './accessibilityValidator';
import { classifyAIError } from '../shared/aiErrors';

export async function generateAccessibilityRecommendations(
  request: AccessibilityRequest,
  operationalContext?: string
): Promise<AccessibilityAIRecommendations> {
  try {
    const promptPayload = buildAccessibilityPrompt(request, operationalContext);
    const result = await sendToGemini(promptPayload);
    const rawText = extractTextFromResult(result);
    const rawJson = parseRawJSON<unknown>(rawText);
    const validated = validateAccessibilityAIRecommendations(rawJson);
    return validated;
  } catch (err: unknown) {
    throw classifyAIError(err);
  }
}
