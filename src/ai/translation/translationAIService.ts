/**
 * Translation AI Service
 * Resolves prompts, calls the Gemini Client, parses text, and validates schemas.
 */

import { TranslationAIResult } from './translationTypes';
import { buildTranslationPrompt } from './translationPromptBuilder';
import { sendToGemini, extractTextFromResult } from '../client/geminiClient';
import { parseRawJSON } from '../parsers/responseParser';
import { validateTranslationAIResult } from './translationValidator';
import { classifyAIError } from '../shared/aiErrors';

export async function generateTranslation(
  text: string,
  targetLanguage: string,
  audience: string
): Promise<TranslationAIResult> {
  try {
    const promptPayload = buildTranslationPrompt(text, targetLanguage, audience);
    const result = await sendToGemini(promptPayload);
    const rawText = extractTextFromResult(result);
    const rawJson = parseRawJSON<unknown>(rawText);
    const validated = validateTranslationAIResult(rawJson);
    return validated;
  } catch (err: unknown) {
    throw classifyAIError(err);
  }
}
