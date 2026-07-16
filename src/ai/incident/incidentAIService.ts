/**
 * Incident AI Service
 * Resolves prompts, sends them through the client pipeline, and validates responses.
 * Provides the single boundary boundary service logic for the context reducer.
 */

import { Incident } from '../../domain/models';
import { IncidentAIAnalysis } from './incidentTypes';
import { buildIncidentAnalysisPrompt } from './incidentPromptBuilder';
import { sendToGemini, extractTextFromResult } from '../client/geminiClient';
import { parseRawJSON } from '../parsers/responseParser';
import { validateIncidentAIAnalysis } from './incidentValidator';
import { classifyAIError } from '../shared/aiErrors';

export async function generateIncidentAnalysis(incident: Incident): Promise<IncidentAIAnalysis> {
  try {
    const promptPayload = buildIncidentAnalysisPrompt(incident);
    const result = await sendToGemini(promptPayload);
    const rawText = extractTextFromResult(result);
    const rawJson = parseRawJSON<unknown>(rawText);
    const validated = validateIncidentAIAnalysis(rawJson);
    return validated;
  } catch (err: unknown) {
    throw classifyAIError(err);
  }
}
