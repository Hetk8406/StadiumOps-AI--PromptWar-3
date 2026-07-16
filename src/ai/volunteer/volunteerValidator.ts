/**
 * Volunteer Response Validator
 * Asserts the fields on the structured JSON recommendations payload.
 */

import { VolunteerAIRecommendations } from './volunteerTypes';
import { AIValidationError } from '../shared/aiErrors';

export function validateVolunteerAIRecommendations(data: unknown): VolunteerAIRecommendations {
  const d = data as Record<string, unknown>;

  if (typeof d.volunteerId !== 'string' || d.volunteerId.trim().length === 0) {
    throw new AIValidationError('volunteerId is missing or invalid', 'volunteerId');
  }

  if (typeof d.recommendedZone !== 'string' || d.recommendedZone.trim().length === 0) {
    throw new AIValidationError('recommendedZone is missing or empty', 'recommendedZone');
  }

  if (typeof d.recommendedTask !== 'string' || d.recommendedTask.trim().length === 0) {
    throw new AIValidationError('recommendedTask is missing or empty', 'recommendedTask');
  }

  const priority = d.priority as string;
  if (!['LOW', 'MEDIUM', 'HIGH', 'IMMEDIATE'].includes(priority)) {
    throw new AIValidationError(`priority is invalid: ${priority}`, 'priority');
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

  if (!Array.isArray(d.alternativeRecommendations)) {
    throw new AIValidationError('alternativeRecommendations must be an array', 'alternativeRecommendations');
  }

  return data as VolunteerAIRecommendations;
}
