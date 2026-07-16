/**
 * Crowd AI Strongly Typed Interfaces
 * Defines the models representing Gemini's crowd flow analysis and transit advisories.
 */

import { AIRiskLevel } from '../models/aiModels';

export interface CrowdAIRecommendations {
  readonly congestionRiskLevel: AIRiskLevel;
  readonly bottleneckGates: readonly string[];
  readonly recommendedFlowRedirections: readonly string[];
  readonly confidence: number;
  readonly confidenceCategory: 'High' | 'Medium' | 'Low';
  readonly explanation: string;
  readonly predictedWaitTimeMinutes: number;
  readonly generatedAt: string;
}
