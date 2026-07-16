/**
 * Volunteer AI Strongly Typed Interfaces
 * Defines the models representing Gemini's staffing allocation suggestions.
 */

export interface AlternativeRecommendation {
  readonly recommendedZone: string;
  readonly recommendedTask: string;
  readonly priority: 'LOW' | 'MEDIUM' | 'HIGH';
  readonly confidence: number;
  readonly explanation: string;
}

export interface VolunteerAIRecommendations {
  readonly volunteerId: string;
  readonly recommendedZone: string;
  readonly recommendedTask: string;
  readonly priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE';
  readonly confidence: number;
  readonly confidenceCategory: 'High' | 'Medium' | 'Low';
  readonly explanation: string;
  readonly alternativeRecommendations: readonly AlternativeRecommendation[];
  readonly generatedAt: string;
}
