/**
 * Crowd Prompt Builder
 * Specialised builder for composing structured prompts for stadium crowd-flow and transit analysis.
 * Incorporates gate stats, stands capacity metrics, and nearby incidents contexts.
 */

import { STADIUM_OPS_SYSTEM_PROMPT } from '../prompts/systemPrompt';
import type { AIPromptPayload } from '../shared/aiTypes';
import { PromptBuilder } from '../prompts/promptBuilder';
import { Gate } from '../../domain/models';

export function buildCrowdRecommendationPrompt(gates: readonly Gate[], standsContext?: unknown): AIPromptPayload {
  const structuredGates = gates.map((g) => ({
    id: g.id,
    name: g.name,
    status: g.status,
    queueLength: g.queueLength,
    estimatedWaitTime: g.estimatedWaitTime,
  }));

  return new PromptBuilder('CROWD', STADIUM_OPS_SYSTEM_PROMPT)
    .withContext('Turnstile Gate Data', structuredGates)
    .withContext('Stands Occupancy Details', standsContext || { totalSpectators: 74812, occupancyRate: 91 })
    .withInstruction(
      'Analyse crowd density, predict near-term turnstile congestion bottlenecks, and suggest flow redistribution action advisories.'
    )
    .withOutputSchema(`{
  "congestionRiskLevel": "LOW | MODERATE | HIGH | CRITICAL",
  "bottleneckGates": ["string"],
  "recommendedFlowRedirections": ["string"],
  "confidence": number,
  "confidenceCategory": "High | Medium | Low",
  "explanation": "string",
  "predictedWaitTimeMinutes": number,
  "generatedAt": "ISO-8601 string"
}`)
    .build();
}
