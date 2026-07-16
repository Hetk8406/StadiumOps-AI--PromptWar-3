/**
 * Prompt Builder
 * Composable, reusable utilities for constructing AI prompt payloads
 * from strongly typed domain context objects.
 * No React imports. Framework-independent.
 */

import { STADIUM_OPS_SYSTEM_PROMPT } from './systemPrompt';
import type { AIPromptPayload, AIMessage, AIRequestContext } from '../shared/aiTypes';
import { truncatePromptContext, buildRequestContext } from '../shared/aiUtils';

// ---------------------------------------------------------------------------
// Builder Class
// ---------------------------------------------------------------------------

export class PromptBuilder {
  private _systemInstruction: string;
  private _messages: AIMessage[] = [];
  private _context: AIRequestContext;

  constructor(feature: string, systemInstruction?: string) {
    this._systemInstruction = systemInstruction ?? STADIUM_OPS_SYSTEM_PROMPT;
    this._context = buildRequestContext(feature);
  }

  /** Injects structured domain data as JSON context into the prompt. */
  withContext<T>(label: string, data: T): this {
    const serialized = JSON.stringify(data, null, 2);
    const truncated = truncatePromptContext(serialized);
    this._messages.push({
      role: 'user',
      text: `## ${label}\n\`\`\`json\n${truncated}\n\`\`\``,
    });
    return this;
  }

  /** Appends a plain text instruction or question to the prompt. */
  withInstruction(text: string): this {
    this._messages.push({ role: 'user', text });
    return this;
  }

  /** Appends an output schema specification so Gemini returns a matching JSON shape. */
  withOutputSchema(schema: string): this {
    this._messages.push({
      role: 'user',
      text: `## Required JSON Output Schema\n${schema}\n\nReturn ONLY valid JSON matching this schema.`,
    });
    return this;
  }

  /** Builds and returns the complete prompt payload ready for the AI client. */
  build(): AIPromptPayload {
    return {
      systemInstruction: this._systemInstruction,
      messages: this._messages,
      context: this._context,
    };
  }
}

// ---------------------------------------------------------------------------
// Pre-built Prompt Templates
// ---------------------------------------------------------------------------

/** Creates a prompt for incident risk analysis. */
export function buildIncidentAnalysisPrompt(incidentData: unknown): AIPromptPayload {
  return new PromptBuilder('INCIDENTS')
    .withContext('Incident Record', incidentData)
    .withInstruction(
      'Analyse this incident. Assess urgency level, recommend dispatch actions, and estimate resolution time.',
    )
    .withOutputSchema(`{
  "incidentId": "string",
  "classification": "string",
  "urgencyLevel": "LOW | MODERATE | HIGH | CRITICAL",
  "suggestedDispatches": ["string"],
  "estimatedResolutionMinutes": number,
  "confidence": number (0-1),
  "reasoning": "string",
  "generatedAt": "ISO-8601 string"
}`)
    .build();
}

/** Creates a prompt for crowd prediction. */
export function buildCrowdPredictionPrompt(crowdData: unknown): AIPromptPayload {
  return new PromptBuilder('CROWD')
    .withContext('Crowd Zone Data', crowdData)
    .withInstruction(
      'Predict near-term occupancy trends for each zone, identify congestion risks, and suggest redistribution actions.',
    )
    .withOutputSchema(`{
  "zoneId": "string",
  "predictedOccupancyPercent": number,
  "peakTimeEstimate": "ISO-8601 string",
  "confidence": number (0-1),
  "recommendedActions": ["string"],
  "generatedAt": "ISO-8601 string"
}`)
    .build();
}

/** Creates a prompt for operational risk assessment from dashboard summary data. */
export function buildOperationalRiskPrompt(summaryData: unknown): AIPromptPayload {
  return new PromptBuilder('DASHBOARD')
    .withContext('Operational Summary', summaryData)
    .withInstruction(
      'Assess overall stadium operational risk. Score it, identify contributing factors, and suggest mitigations.',
    )
    .withOutputSchema(`{
  "overallRisk": "LOW | MODERATE | HIGH | CRITICAL",
  "riskScore": number (0-100),
  "confidence": number (0-1),
  "factors": [{ "name": "string", "description": "string", "level": "LOW | MODERATE | HIGH | CRITICAL", "weight": number }],
  "mitigationSuggestions": ["string"],
  "nextReviewInMinutes": number,
  "generatedAt": "ISO-8601 string"
}`)
    .build();
}

/** Creates a prompt for a natural language operational summary. */
export function buildNaturalLanguageSummaryPrompt(data: unknown, module: string): AIPromptPayload {
  return new PromptBuilder(module)
    .withContext(`${module} Module Data`, data)
    .withInstruction(
      `Generate a concise natural language operational summary for the ${module} module. Use plain English suitable for a stadium operations manager.`,
    )
    .withOutputSchema(`{
  "headline": "string (max 80 chars)",
  "body": "string (max 400 chars)",
  "bulletPoints": ["string"],
  "confidence": number (0-1),
  "generatedAt": "ISO-8601 string"
}`)
    .build();
}
