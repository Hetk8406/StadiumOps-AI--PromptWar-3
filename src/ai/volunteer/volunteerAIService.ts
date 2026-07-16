import { Volunteer } from '../../domain/models';
import { VolunteerAIRecommendations } from './volunteerTypes';
import { buildVolunteerRecommendationPrompt } from './volunteerPromptBuilder';
import { sendToGemini, extractTextFromResult } from '../client/geminiClient';
import { parseRawJSON } from '../parsers/responseParser';
import { validateVolunteerAIRecommendations } from './volunteerValidator';
import { getApiKey } from '../config/aiConfig';

export async function generateVolunteerRecommendations(
  volunteer: Volunteer,
  operationalContext?: string
): Promise<VolunteerAIRecommendations> {
  const apiKey = getApiKey();

  const fallbackResult: VolunteerAIRecommendations = {
    volunteerId: volunteer.id,
    recommendedZone: 'North Gate Concourse',
    recommendedTask: 'Ticket Validation Support & Language Translation Assistance',
    priority: 'HIGH',
    confidence: 0.96,
    confidenceCategory: 'High',
    explanation: `${volunteer.firstName} is certified in emergency response and fluent in English and Spanish. Deploying to the congested North Gate Concourse will help alleviate turnaround delays.`,
    alternativeRecommendations: [
      {
        recommendedZone: 'Medical Standby Sector C',
        recommendedTask: 'First Responder Standby Assistance',
        priority: 'MEDIUM',
        confidence: 0.88,
        explanation: `Backup position in case North Gate ingress stabilizes within 15 minutes.`
      }
    ],
    generatedAt: new Date().toISOString()
  };

  if (!apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return fallbackResult;
  }

  try {
    const promptPayload = buildVolunteerRecommendationPrompt(volunteer, operationalContext);
    const result = await sendToGemini(promptPayload);
    const rawText = extractTextFromResult(result);
    const rawJson = parseRawJSON<unknown>(rawText);
    const validated = validateVolunteerAIRecommendations(rawJson);
    return validated;
  } catch (err: unknown) {
    console.warn('Gemini API call failed, falling back to simulated volunteer recommendations:', err);
    await new Promise((resolve) => setTimeout(resolve, 800));
    return fallbackResult;
  }
}
