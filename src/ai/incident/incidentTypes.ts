/**
 * Incident AI Strongly Typed Interfaces
 * Defines the models used for storing analyzed incident recommendations.
 */

import { AIRiskLevel } from '../models/aiModels';

export interface IncidentAIAnalysis {
  readonly incidentId: string;
  readonly classification: string;
  readonly urgencyLevel: AIRiskLevel;
  readonly suggestedDispatches: readonly string[];
  readonly estimatedResolutionMinutes: number;
  readonly confidence: number;
  readonly confidenceCategory: 'High' | 'Medium' | 'Low';
  readonly reasoning: string;
  readonly mitigationSuggestions: readonly string[];
  readonly generatedAt: string;
}
