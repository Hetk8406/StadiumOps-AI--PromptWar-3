/**
 * Crowd Response Validator
 * Asserts the fields on the structured JSON crowd intelligence recommendations payload.
 */

import { CrowdAIRecommendations } from './crowdTypes';
import { AIValidationError } from '../shared/aiErrors';

export function validateCrowdAIRecommendations(data: unknown): CrowdAIRecommendations {
  const d = data as Record<string, unknown>;

  const risk = d.congestionRiskLevel as string;
  if (!['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].includes(risk)) {
    throw new AIValidationError(`congestionRiskLevel is invalid: ${risk}`, 'congestionRiskLevel');
  }

  if (!Array.isArray(d.bottleneckGates)) {
    throw new AIValidationError('bottleneckGates must be an array', 'bottleneckGates');
  }

  if (!Array.isArray(d.recommendedFlowRedirections)) {
    throw new AIValidationError('recommendedFlowRedirections must be an array', 'recommendedFlowRedirections');
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

  if (typeof d.predictedWaitTimeMinutes !== 'number' || d.predictedWaitTimeMinutes < 0) {
    throw new AIValidationError('predictedWaitTimeMinutes must be a positive number', 'predictedWaitTimeMinutes');
  }

  if (typeof d.generatedAt !== 'string') {
    throw new AIValidationError('generatedAt is missing or invalid', 'generatedAt');
  }

  return data as CrowdAIRecommendations;
}
