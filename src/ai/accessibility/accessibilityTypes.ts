/**
 * Accessibility AI Strongly Typed Interfaces
 * Represents Gemini's inclusive support routes and dispatch advisory recommendations.
 */

export interface AccessibilityAIRecommendations {
  readonly requestId: string;
  readonly recommendedAssistance: string;
  readonly priorityAssessment: 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE';
  readonly suggestedRoute: string;
  readonly confidence: number;
  readonly confidenceCategory: 'High' | 'Medium' | 'Low';
  readonly explanation: string;
  readonly mitigationConsiderations: readonly string[];
  readonly generatedAt: string;
}
