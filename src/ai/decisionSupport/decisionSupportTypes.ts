/**
 * Decision Support AI Strongly Typed Interfaces
 * Represents unified cross-module executive recommendation payloads.
 */

export interface CoordinatedRecommendation {
  readonly title: string;
  readonly action: string;
  readonly rationalExplanation: string;
  readonly priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE';
}

export interface DecisionSupportAIResult {
  readonly executiveSummary: string;
  readonly overallStatus: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  readonly coordinatedRecommendations: readonly CoordinatedRecommendation[];
  readonly confidence: number;
  readonly confidenceCategory: 'High' | 'Medium' | 'Low';
  readonly generatedAt: string;
}
