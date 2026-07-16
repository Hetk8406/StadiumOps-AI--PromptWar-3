/**
 * Volunteer AI Service
 * Feeds structured prompt request payloads to the Gemini API Client
 * and runs output validation blocks before returning options to consumers.
 */

import { Volunteer } from '../../domain/models';
import { VolunteerAIRecommendations } from './volunteerTypes';
import { buildVolunteerRecommendationPrompt } from './volunteerPromptBuilder';
import { sendToGemini, extractTextFromResult } from '../client/geminiClient';
import { parseRawJSON } from '../parsers/responseParser';
import { validateVolunteerAIRecommendations } from './volunteerValidator';
import { classifyAIError } from '../shared/aiErrors';

export async function generateVolunteerRecommendations(
  volunteer: Volunteer,
  operationalContext?: string
): Promise<VolunteerAIRecommendations> {
  try {
    const promptPayload = buildVolunteerRecommendationPrompt(volunteer, operationalContext);
    const result = await sendToGemini(promptPayload);
    const rawText = extractTextFromResult(result);
    const rawJson = parseRawJSON<unknown>(rawText);
    const validated = validateVolunteerAIRecommendations(rawJson);
    return validated;
  } catch (err: unknown) {
    throw classifyAIError(err);
  }
}
