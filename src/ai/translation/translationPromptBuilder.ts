/**
 * Translation Prompt Builder
 * Composes prompt contexts for multilingual translation, message refinement, and tone adaptation.
 * Ensures vital stadium codes (gates, zones, incident IDs) remain unchanged.
 */

import { STADIUM_OPS_SYSTEM_PROMPT } from '../prompts/systemPrompt';
import type { AIPromptPayload } from '../shared/aiTypes';
import { PromptBuilder } from '../prompts/promptBuilder';

export function buildTranslationPrompt(
  text: string,
  targetLanguage: string,
  audience: string
): AIPromptPayload {
  const structuredData = {
    messageText: text,
    targetLanguage,
    intendedAudience: audience,
  };

  return new PromptBuilder('COMMUNICATIONS', STADIUM_OPS_SYSTEM_PROMPT)
    .withContext('Input Message details', structuredData)
    .withInstruction(
      'Translate the message to the target language, adapt its tone for the intended audience, and produce a concise summary. Crucially, preserve all gate codes, zones, and incident references in their original forms.'
    )
    .withOutputSchema(`{
  "originalMessage": "string",
  "detectedLanguage": "string",
  "targetLanguage": "string",
  "translatedMessage": "string",
  "refinedVersion": "string",
  "suggestedTone": "string",
  "summary": "string",
  "terminologyNotes": ["string"],
  "confidence": number,
  "confidenceCategory": "High | Medium | Low",
  "translationWarnings": ["string"],
  "generatedAt": "ISO-8601 string"
}`)
    .build();
}
