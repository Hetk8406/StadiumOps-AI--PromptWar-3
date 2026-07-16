/**
 * Volunteer Prompt Builder
 * Formulates structured prompt payloads for volunteer resource allocation scenarios.
 * Converts volunteer profile details and operational requests into contextual instruction sets.
 */

import { STADIUM_OPS_SYSTEM_PROMPT } from '../prompts/systemPrompt';
import type { AIPromptPayload } from '../shared/aiTypes';
import { PromptBuilder } from '../prompts/promptBuilder';
import { Volunteer } from '../../domain/models';

export function buildVolunteerRecommendationPrompt(volunteer: Volunteer, operationalContext?: string): AIPromptPayload {
  const structuredData = {
    id: volunteer.id,
    firstName: volunteer.firstName,
    lastName: volunteer.lastName,
    role: volunteer.role,
    status: volunteer.status,
    currentZone: volunteer.currentZone,
    languages: volunteer.languages,
    certifications: volunteer.certifications,
    availability: volunteer.availability,
    rating: volunteer.rating,
    experienceLevel: volunteer.experienceLevel,
  };

  return new PromptBuilder('VOLUNTEERS', STADIUM_OPS_SYSTEM_PROMPT)
    .withContext('Volunteer Details', structuredData)
    .withContext('Operational Context Summary', operationalContext || 'No additional incident congestion alerts currently.')
    .withInstruction(
      'Recommend optimal stadium zone placement and dispatch tasks for this volunteer steward. Return 2-3 ranked advisory scenarios.'
    )
    .withOutputSchema(`{
  "volunteerId": "string",
  "recommendedZone": "string",
  "recommendedTask": "string",
  "priority": "LOW | MEDIUM | HIGH | IMMEDIATE",
  "confidence": number,
  "confidenceCategory": "High | Medium | Low",
  "explanation": "string",
  "alternativeRecommendations": [
    {
      "recommendedZone": "string",
      "recommendedTask": "string",
      "priority": "LOW | MEDIUM | HIGH",
      "confidence": number,
      "explanation": "string"
    }
  ],
  "generatedAt": "ISO-8601 string"
}`)
    .build();
}
