/**
 * Decision Support Prompt Builder
 * Aggregates structured outputs from all independent AI modules (Incidents, Volunteers, Crowd, Accessibility)
 * to formulate a comprehensive executive-level stadium intelligence briefing prompt.
 */

import { STADIUM_OPS_SYSTEM_PROMPT } from '../prompts/systemPrompt';
import type { AIPromptPayload } from '../shared/aiTypes';
import { PromptBuilder } from '../prompts/promptBuilder';

export function buildDecisionSupportPrompt(aggregatedInsights: {
  incidentRisk?: unknown;
  volunteerAllocations?: unknown;
  crowdCongestion?: unknown;
  accessibilityIssues?: unknown;
}): AIPromptPayload {
  return new PromptBuilder('DASHBOARD', STADIUM_OPS_SYSTEM_PROMPT)
    .withContext('Composed Sub-module AI Assessments', aggregatedInsights)
    .withInstruction(
      'Formulate a unified command center operational intelligence briefing. Define a coordinated risk priority list and critical recommendations.'
    )
    .withOutputSchema(`{
  "executiveSummary": "string",
  "overallStatus": "GREEN | YELLOW | ORANGE | RED",
  "coordinatedRecommendations": [
    {
      "title": "string",
      "action": "string",
      "rationalExplanation": "string",
      "priority": "LOW | MEDIUM | HIGH | IMMEDIATE"
    }
  ],
  "confidence": number,
  "confidenceCategory": "High | Medium | Low",
  "generatedAt": "ISO-8601 string"
}`)
    .build();
}
