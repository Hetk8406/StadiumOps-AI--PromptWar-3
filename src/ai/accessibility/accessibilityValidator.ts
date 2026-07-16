/**
 * Accessibility Response Validator
 * Performs validation checks on structured accessibility JSON returned by Gemini API.
 */

import { AccessibilityAIRecommendations } from './accessibilityTypes';
import { AIValidationError } from '../shared/aiErrors';

export function validateAccessibilityAIRecommendations(data: unknown): AccessibilityAIRecommendations {
  const d = data as Record<string, unknown>;

  if (typeof d.requestId !== 'string' || d.requestId.trim().length === 0) {
    throw new AIValidationError('requestId is missing or invalid', 'requestId');
  }

  if (typeof d.recommendedAssistance !== 'string' || d.recommendedAssistance.trim().length === 0) {
    throw new AIValidationError('recommendedAssistance is missing or empty', 'recommendedAssistance');
  }

  const priority = d.priorityAssessment as string;
  if (!['LOW', 'MEDIUM', 'HIGH', 'IMMEDIATE'].includes(priority)) {
    throw new AIValidationError(`priorityAssessment is invalid: ${priority}`, 'priorityAssessment');
  }

  if (typeof d.suggestedRoute !== 'string' || d.suggestedRoute.trim().length === 0) {
    throw new AIValidationError('suggestedRoute is missing or empty', 'suggestedRoute');
  }

  if (typeof d.confidence !== 'number' || d.confidence < 0 || d.confidence > 1) {
    throw new AIValidationError('confidence must be a number between 0 and 1', 'confidence');
  }

  const confCategory = d.confidenceCategory as string;
  if (!['High', 'Medium', 'Low'].includes(confCategory)) {
    throw new AIValidationError(`confidenceCategory is invalid: ${confCategory}`, 'confidenceCategory');
  }

  if (typeof d.explanation !== 'string' || d.explanation.trim().length === 0) {
    throw new AIValidationError('explanation is missing or empty', 'explanation');
  }

  if (!Array.isArray(d.mitigationConsiderations)) {
    throw new AIValidationError('mitigationConsiderations must be an array', 'mitigationConsiderations');
  }

  if (typeof d.generatedAt !== 'string') {
    throw new AIValidationError('generatedAt is missing or invalid', 'generatedAt');
  }

  return data as AccessibilityAIRecommendations;
}
