/**
 * AI Response Parser
 * Safely deserialises raw Gemini text output into typed domain objects.
 * Applies sanitisation before returning data to the application.
 */

import { AIInvalidResponseError } from '../shared/aiErrors';
import { sanitizeAIText } from '../shared/aiUtils';
import type {
  AIIncidentAnalysis,
  AIRiskAssessment,
  AICrowdPrediction,
  AINaturalLanguageSummary,
} from '../models/aiModels';

// ---------------------------------------------------------------------------
// Core JSON Parser
// ---------------------------------------------------------------------------

/**
 * Strips markdown code fences if Gemini wraps its JSON output,
 * then attempts JSON.parse.
 */
export function parseRawJSON<T>(raw: string): T {
  // Remove ```json ... ``` fences if present
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new AIInvalidResponseError(
      `Failed to parse AI JSON response. Raw content: ${sanitizeAIText(raw, 200)}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Typed Parsers
// ---------------------------------------------------------------------------

/** Parses a raw Gemini response into an AIIncidentAnalysis object. */
export function parseIncidentAnalysis(raw: string): AIIncidentAnalysis {
  return parseRawJSON<AIIncidentAnalysis>(raw);
}

/** Parses a raw Gemini response into an AIRiskAssessment object. */
export function parseRiskAssessment(raw: string): AIRiskAssessment {
  return parseRawJSON<AIRiskAssessment>(raw);
}

/** Parses a raw Gemini response into an AICrowdPrediction object. */
export function parseCrowdPrediction(raw: string): AICrowdPrediction {
  return parseRawJSON<AICrowdPrediction>(raw);
}

/** Parses a raw Gemini response into an AINaturalLanguageSummary object. */
export function parseNaturalLanguageSummary(raw: string): AINaturalLanguageSummary {
  const parsed = parseRawJSON<AINaturalLanguageSummary>(raw);
  // Sanitise free-text fields before returning
  return {
    ...parsed,
    headline: sanitizeAIText(parsed.headline, 120),
    body: sanitizeAIText(parsed.body, 600),
    bulletPoints: parsed.bulletPoints.map((bp) => sanitizeAIText(bp, 200)),
  };
}
