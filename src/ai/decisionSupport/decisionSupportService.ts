/**
 * Decision Support AI Service
 * Resolves aggregated sub-module data inputs, triggers the prompt build pipeline,
 * and handles execution boundaries with validation schemas.
 */

import { DecisionSupportAIResult } from './decisionSupportTypes';
import { buildDecisionSupportPrompt } from './decisionSupportPromptBuilder';
import { sendToGemini, extractTextFromResult } from '../client/geminiClient';
import { parseRawJSON } from '../parsers/responseParser';
import { validateDecisionSupportAIResult } from './decisionSupportValidator';
import { classifyAIError } from '../shared/aiErrors';

export async function generateDecisionSupport(aggregatedInsights: {
  incidentRisk?: unknown;
  volunteerAllocations?: unknown;
  crowdCongestion?: unknown;
  accessibilityIssues?: unknown;
}): Promise<DecisionSupportAIResult> {
  try {
    const promptPayload = buildDecisionSupportPrompt(aggregatedInsights);
    const result = await sendToGemini(promptPayload);
    const rawText = extractTextFromResult(result);
    const rawJson = parseRawJSON<unknown>(rawText);
    const validated = validateDecisionSupportAIResult(rawJson);
    return validated;
  } catch (err: unknown) {
    throw classifyAIError(err);
  }
}
