/**
 * AI Response Validation
 * Validates structured AI responses against expected shapes before
 * they are exposed to the application layer.
 * Prevents malformed AI output from affecting the UI.
 */

import { AIValidationError } from '../shared/aiErrors';
import type {
  AIIncidentAnalysis,
  AIRiskAssessment,
  AICrowdPrediction,
  AINaturalLanguageSummary,
} from '../models/aiModels';

// ---------------------------------------------------------------------------
// Primitive Validators
// ---------------------------------------------------------------------------

function assertString(obj: Record<string, unknown>, field: string): void {
  if (typeof obj[field] !== 'string' || (obj[field] as string).trim().length === 0) {
    throw new AIValidationError(`Required field "${field}" is missing or empty.`, field);
  }
}

function assertNumber(obj: Record<string, unknown>, field: string): void {
  if (typeof obj[field] !== 'number' || !Number.isFinite(obj[field] as number)) {
    throw new AIValidationError(`Required field "${field}" must be a finite number.`, field);
  }
}

function assertArray(obj: Record<string, unknown>, field: string): void {
  if (!Array.isArray(obj[field])) {
    throw new AIValidationError(`Required field "${field}" must be an array.`, field);
  }
}

function assertConfidence(score: unknown, field = 'confidence'): void {
  if (typeof score !== 'number' || score < 0 || score > 1) {
    throw new AIValidationError(
      `"${field}" must be a number between 0 and 1. Received: ${score}`,
      field,
    );
  }
}

const VALID_RISK_LEVELS = new Set(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']);

function assertRiskLevel(obj: Record<string, unknown>, field: string): void {
  if (!VALID_RISK_LEVELS.has(obj[field] as string)) {
    throw new AIValidationError(
      `"${field}" must be one of LOW | MODERATE | HIGH | CRITICAL. Received: ${obj[field]}`,
      field,
    );
  }
}

// ---------------------------------------------------------------------------
// Domain-Specific Validators
// ---------------------------------------------------------------------------

export function validateIncidentAnalysis(data: unknown): AIIncidentAnalysis {
  const d = data as Record<string, unknown>;
  assertString(d, 'incidentId');
  assertString(d, 'classification');
  assertRiskLevel(d, 'urgencyLevel');
  assertArray(d, 'suggestedDispatches');
  assertNumber(d, 'estimatedResolutionMinutes');
  assertConfidence(d.confidence);
  assertString(d, 'reasoning');
  assertString(d, 'generatedAt');
  return data as AIIncidentAnalysis;
}

export function validateRiskAssessment(data: unknown): AIRiskAssessment {
  const d = data as Record<string, unknown>;
  assertRiskLevel(d, 'overallRisk');
  assertNumber(d, 'riskScore');
  assertConfidence(d.confidence);
  assertArray(d, 'factors');
  assertArray(d, 'mitigationSuggestions');
  assertNumber(d, 'nextReviewInMinutes');
  assertString(d, 'generatedAt');
  const score = d.riskScore as number;
  if (score < 0 || score > 100) {
    throw new AIValidationError('riskScore must be between 0 and 100.', 'riskScore');
  }
  return data as AIRiskAssessment;
}

export function validateCrowdPrediction(data: unknown): AICrowdPrediction {
  const d = data as Record<string, unknown>;
  assertString(d, 'zoneId');
  assertNumber(d, 'predictedOccupancyPercent');
  assertString(d, 'peakTimeEstimate');
  assertConfidence(d.confidence);
  assertArray(d, 'recommendedActions');
  assertString(d, 'generatedAt');
  const occ = d.predictedOccupancyPercent as number;
  if (occ < 0 || occ > 100) {
    throw new AIValidationError(
      'predictedOccupancyPercent must be between 0 and 100.',
      'predictedOccupancyPercent',
    );
  }
  return data as AICrowdPrediction;
}

export function validateNaturalLanguageSummary(data: unknown): AINaturalLanguageSummary {
  const d = data as Record<string, unknown>;
  assertString(d, 'headline');
  assertString(d, 'body');
  assertArray(d, 'bulletPoints');
  assertConfidence(d.confidence);
  assertString(d, 'generatedAt');
  return data as AINaturalLanguageSummary;
}
