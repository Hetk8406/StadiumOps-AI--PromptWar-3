/**
 * Incident Prompt Builder
 * Specialised builder for creating structured prompts tailored to analysing incidents.
 * Converts raw domain incident entities into clean context structures.
 */

import { STADIUM_OPS_SYSTEM_PROMPT } from '../prompts/systemPrompt';
import type { AIPromptPayload } from '../shared/aiTypes';
import { PromptBuilder } from '../prompts/promptBuilder';
import { Incident } from '../../domain/models';

export function buildIncidentAnalysisPrompt(incident: Incident): AIPromptPayload {
  const structuredData = {
    id: incident.id,
    title: incident.title,
    description: incident.description,
    severity: incident.severity,
    status: incident.status,
    zoneId: incident.zoneId,
    reportedAt: incident.reportedAt,
    assignedTeam: incident.assignedTeam || 'UNASSIGNED',
    reportedBy: incident.reportedBy,
  };

  return new PromptBuilder('INCIDENTS', STADIUM_OPS_SYSTEM_PROMPT)
    .withContext('Incident Details', structuredData)
    .withInstruction(
      'Analyse this incident. Formulate a comprehensive operational risk assessment and suggest 3-5 advisory action guidelines.'
    )
    .withOutputSchema(`{
  "incidentId": "string",
  "classification": "string",
  "urgencyLevel": "LOW | MODERATE | HIGH | CRITICAL",
  "suggestedDispatches": ["string"],
  "estimatedResolutionMinutes": number,
  "confidence": number,
  "confidenceCategory": "High | Medium | Low",
  "reasoning": "string",
  "mitigationSuggestions": ["string"],
  "generatedAt": "ISO-8601 string"
}`)
    .build();
}
