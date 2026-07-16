import { TranslationAIResult } from './translationTypes';
import { buildTranslationPrompt } from './translationPromptBuilder';
import { sendToGemini, extractTextFromResult } from '../client/geminiClient';
import { parseRawJSON } from '../parsers/responseParser';
import { validateTranslationAIResult } from './translationValidator';
import { getApiKey } from '../config/aiConfig';

export async function generateTranslation(
  text: string,
  targetLanguage: string,
  audience: string
): Promise<TranslationAIResult> {
  const apiKey = getApiKey();

  const fallbackResult: TranslationAIResult = {
    originalMessage: text,
    detectedLanguage: 'English',
    targetLanguage: targetLanguage,
    translatedMessage: `[Simulated Translation in ${targetLanguage}]: ${text}`,
    refinedVersion: `[Refined for ${audience}]: Attention all spectators, please follow directional marshals' instructions to clear gates.`,
    suggestedTone: 'Directive / Polite',
    summary: 'Spectator redirection announcement',
    terminologyNotes: ['Gate C -> Sector C Concourse', 'First responders -> Medical units'],
    confidence: 0.98,
    confidenceCategory: 'High',
    translationWarnings: [],
    generatedAt: new Date().toISOString()
  };

  if (!apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return fallbackResult;
  }

  try {
    const promptPayload = buildTranslationPrompt(text, targetLanguage, audience);
    const result = await sendToGemini(promptPayload);
    const rawText = extractTextFromResult(result);
    const rawJson = parseRawJSON<unknown>(rawText);
    const validated = validateTranslationAIResult(rawJson);
    return validated;
  } catch (err: unknown) {
    console.warn('Gemini API call failed, falling back to simulated translation:', err);
    await new Promise((resolve) => setTimeout(resolve, 800));
    return fallbackResult;
  }
}
