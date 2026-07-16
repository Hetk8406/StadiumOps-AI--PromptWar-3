/**
 * AI Service
 * Centralized orchestration layer for all AI requests.
 * Sends prompts → receives raw responses → parses → validates → returns typed data.
 * The only entry point the rest of the application uses to interact with Gemini.
 */

import { sendToGemini, extractTextFromResult } from '../client/geminiClient';
import {
  parseIncidentAnalysis,
  parseRiskAssessment,
  parseCrowdPrediction,
  parseNaturalLanguageSummary,
} from '../parsers/responseParser';
import {
  validateIncidentAnalysis,
  validateRiskAssessment,
  validateCrowdPrediction,
  validateNaturalLanguageSummary,
} from '../validation/responseValidation';
import {
  buildIncidentAnalysisPrompt,
  buildCrowdPredictionPrompt,
  buildOperationalRiskPrompt,
  buildNaturalLanguageSummaryPrompt,
} from '../prompts/promptBuilder';
import { classifyAIError } from '../shared/aiErrors';
import { generateRequestId, nowISO } from '../shared/aiUtils';
import { AI_CONFIG } from '../config/aiConfig';
import type { AIResult } from '../shared/aiTypes';
import type {
  AIIncidentAnalysis,
  AIRiskAssessment,
  AICrowdPrediction,
  AINaturalLanguageSummary,
  AIResponseEnvelope,
} from '../models/aiModels';

// ---------------------------------------------------------------------------
// Internal Helper: Envelope Builder
// ---------------------------------------------------------------------------

function buildEnvelope<T>(
  data: T | null,
  error: string | null,
  latencyMs: number,
  requestId: string,
): AIResponseEnvelope<T> {
  return {
    success: data !== null && error === null,
    data,
    error,
    latencyMs,
    model: AI_CONFIG.modelName,
    requestId,
  };
}

// ---------------------------------------------------------------------------
// Core Request Executor
// ---------------------------------------------------------------------------

async function executeAIRequest<T>(
  promptPayload: ReturnType<typeof buildIncidentAnalysisPrompt>,
  parse: (raw: string) => T,
  validate: (data: unknown) => T,
): Promise<AIResponseEnvelope<T>> {
  const requestId = generateRequestId();
  const start = performance.now();

  try {
    const result = await sendToGemini(promptPayload);
    const raw = extractTextFromResult(result);
    const parsed = parse(raw);
    const validated = validate(parsed);
    const latencyMs = Math.round(performance.now() - start);
    return buildEnvelope<T>(validated, null, latencyMs, requestId);
  } catch (err: unknown) {
    const classified = classifyAIError(err);
    const latencyMs = Math.round(performance.now() - start);
    return buildEnvelope<T>(null, classified.message, latencyMs, requestId);
  }
}

// ---------------------------------------------------------------------------
// Public AI Service API
// ---------------------------------------------------------------------------

/** Analyses a single incident record and returns structured intelligence. */
export async function analyseIncident(incidentData: unknown): AIResult<AIIncidentAnalysis> {
  return executeAIRequest(
    buildIncidentAnalysisPrompt(incidentData),
    parseIncidentAnalysis,
    validateIncidentAnalysis,
  );
}

/** Assesses overall stadium operational risk from dashboard summary data. */
export async function assessOperationalRisk(summaryData: unknown): AIResult<AIRiskAssessment> {
  return executeAIRequest(
    buildOperationalRiskPrompt(summaryData),
    parseRiskAssessment,
    validateRiskAssessment,
  );
}

/** Predicts near-term crowd behaviour for a given zone dataset. */
export async function predictCrowdDynamics(crowdData: unknown): AIResult<AICrowdPrediction> {
  return executeAIRequest(
    buildCrowdPredictionPrompt(crowdData),
    parseCrowdPrediction,
    validateCrowdPrediction,
  );
}

/** Generates a natural language operational summary for any module. */
export async function generateModuleSummary(
  data: unknown,
  module: string,
): AIResult<AINaturalLanguageSummary> {
  return executeAIRequest(
    buildNaturalLanguageSummaryPrompt(data, module),
    parseNaturalLanguageSummary,
    validateNaturalLanguageSummary,
  );
}

/** Checks Gemini reachability by sending a lightweight health-check prompt. */
export async function pingAIService(): Promise<boolean> {
  try {
    const result = await sendToGemini({
      systemInstruction: 'You are a health check service.',
      messages: [{ role: 'user', text: 'Respond with {"status":"ok"}' }],
      context: {
        requestId: generateRequestId(),
        feature: 'HEALTHCHECK',
        timestamp: nowISO(),
      },
    });
    const raw = extractTextFromResult(result);
    return raw.includes('ok');
  } catch {
    return false;
  }
}
