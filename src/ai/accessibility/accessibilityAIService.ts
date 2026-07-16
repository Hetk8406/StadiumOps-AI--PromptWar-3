import { AccessibilityRequest } from '../../domain/models';
import { AccessibilityAIRecommendations } from './accessibilityTypes';
import { buildAccessibilityPrompt } from './accessibilityPromptBuilder';
import { sendToGemini, extractTextFromResult } from '../client/geminiClient';
import { parseRawJSON } from '../parsers/responseParser';
import { validateAccessibilityAIRecommendations } from './accessibilityValidator';
import { getApiKey } from '../config/aiConfig';

export async function generateAccessibilityRecommendations(
  request: AccessibilityRequest,
  operationalContext?: string
): Promise<AccessibilityAIRecommendations> {
  const apiKey = getApiKey();

  const fallbackResult: AccessibilityAIRecommendations = {
    requestId: request.id,
    recommendedAssistance: 'Wheelchair Escort Dispatch & Level 1 Access Lift Route',
    priorityAssessment: 'HIGH',
    suggestedRoute: 'Use Lift 4A Concourse -> Corridor 2 -> Section F Gate Access',
    confidence: 0.95,
    confidenceCategory: 'High',
    explanation: 'Spectator requires assistance due to limited mobility near Section F. Directing staff to deploy Wheelchair Escort through Concourse Lift 4A will bypass heavy spectator stairwells.',
    mitigationConsiderations: [
      'Ensure lift keys are verified with Sector Marshal before dispatch.',
      'Maintain clear corridor zone access for escort transit.'
    ],
    generatedAt: new Date().toISOString()
  };

  if (!apiKey) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return fallbackResult;
  }

  try {
    const promptPayload = buildAccessibilityPrompt(request, operationalContext);
    const result = await sendToGemini(promptPayload);
    const rawText = extractTextFromResult(result);
    const rawJson = parseRawJSON<unknown>(rawText);
    const validated = validateAccessibilityAIRecommendations(rawJson);
    return validated;
  } catch (err: unknown) {
    console.warn('Gemini API call failed, falling back to simulated accessibility recommendations:', err);
    await new Promise((resolve) => setTimeout(resolve, 800));
    return fallbackResult;
  }
}
