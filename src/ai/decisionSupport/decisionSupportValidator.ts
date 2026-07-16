/**
 * Decision Support Response Validator
 * Asserts the fields on the structured executive JSON payload.
 */

import { DecisionSupportAIResult } from './decisionSupportTypes';
import { AIValidationError } from '../shared/aiErrors';

export function validateDecisionSupportAIResult(data: unknown): DecisionSupportAIResult {
  const d = data as Record<string, unknown>;

  if (typeof d.executiveSummary !== 'string' || d.executiveSummary.trim().length === 0) {
    throw new AIValidationError('executiveSummary is missing or invalid', 'executiveSummary');
  }

  const status = d.overallStatus as string;
  if (!['GREEN', 'YELLOW', 'ORANGE', 'RED'].includes(status)) {
    throw new AIValidationError(`overallStatus is invalid: ${status}`, 'overallStatus');
  }

  if (!Array.isArray(d.coordinatedRecommendations)) {
    throw new AIValidationError('coordinatedRecommendations must be an array', 'coordinatedRecommendations');
  }

  if (typeof d.confidence !== 'number' || d.confidence < 0 || d.confidence > 1) {
    throw new AIValidationError('confidence must be a number between 0 and 1', 'confidence');
  }

  const confCategory = d.confidenceCategory as string;
  if (!['High', 'Medium', 'Low'].includes(confCategory)) {
    throw new AIValidationError(`confidenceCategory is invalid: ${confCategory}`, 'confidenceCategory');
  }

  if (typeof d.generatedAt !== 'string') {
    throw new AIValidationError('generatedAt is missing or invalid', 'generatedAt');
  }

  return data as DecisionSupportAIResult;
}
