/**
 * Accessibility Prompt Builder
 * Composes prompt contexts for evaluating spectator accessibility requests.
 * Factors in wheelchair requests, route navigation guidance, and sensory support needs.
 */

import { STADIUM_OPS_SYSTEM_PROMPT } from '../prompts/systemPrompt';
import type { AIPromptPayload } from '../shared/aiTypes';
import { PromptBuilder } from '../prompts/promptBuilder';
import { AccessibilityRequest } from '../../domain/models';

export function buildAccessibilityPrompt(request: AccessibilityRequest, operationalContext?: string): AIPromptPayload {
  const structuredData = {
    id: request.id,
    category: request.category,
    visitorName: request.visitorName || 'Anonymous',
    zoneId: request.zoneId,
    status: request.status,
    priority: request.priority,
    notes: request.notes || 'No description provided.',
    requestedAt: request.requestedAt,
  };

  return new PromptBuilder('ACCESSIBILITY', STADIUM_OPS_SYSTEM_PROMPT)
    .withContext('Accessibility Ticket Details', structuredData)
    .withContext('Stands & Transit Congestion Context', operationalContext || 'Concourse routes open, elevators operating normally.')
    .withInstruction(
      'Analyse this accessibility assistance ticket. Recommend safe routing pathing and advisory helper tasks for dispatch.'
    )
    .withOutputSchema(`{
  "requestId": "string",
  "recommendedAssistance": "string",
  "priorityAssessment": "LOW | MEDIUM | HIGH | IMMEDIATE",
  "suggestedRoute": "string",
  "confidence": number,
  "confidenceCategory": "High | Medium | Low",
  "explanation": "string",
  "mitigationConsiderations": ["string"],
  "generatedAt": "ISO-8601 string"
}`)
    .build();
}
