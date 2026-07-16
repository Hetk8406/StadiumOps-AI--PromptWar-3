/**
 * AI Response Domain Models
 * Strongly typed interfaces representing every possible structured response
 * returned by Gemini AI for stadium operations advisory workflows.
 * No `any` usage. All fields are explicitly typed.
 */

// ---------------------------------------------------------------------------
// Shared Primitives
// ---------------------------------------------------------------------------

/** Confidence score bounded between 0 (uncertain) and 1 (highly certain). */
export type ConfidenceScore = number;

/** Severity label aligned to operational risk tiers. */
export type AIRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

/** Priority label for recommended actions. */
export type AIPriority = 'IMMEDIATE' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';

// ---------------------------------------------------------------------------
// Suggested Action
// ---------------------------------------------------------------------------

export interface AISuggestedAction {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly priority: AIPriority;
  readonly estimatedImpactMinutes?: number;
  readonly affectedZones?: readonly string[];
}

// ---------------------------------------------------------------------------
// AI Recommendation
// ---------------------------------------------------------------------------

export interface AIRecommendation {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly rationale: string;
  readonly confidence: ConfidenceScore;
  readonly priority: AIPriority;
  readonly suggestedActions: readonly AISuggestedAction[];
  readonly generatedAt: string; // ISO-8601
  readonly modelVersion?: string;
}

// ---------------------------------------------------------------------------
// AI Risk Assessment
// ---------------------------------------------------------------------------

export interface AIRiskFactor {
  readonly name: string;
  readonly description: string;
  readonly level: AIRiskLevel;
  readonly weight: number; // 0–1, contribution to overall score
}

export interface AIRiskAssessment {
  readonly overallRisk: AIRiskLevel;
  readonly riskScore: number; // 0–100
  readonly confidence: ConfidenceScore;
  readonly factors: readonly AIRiskFactor[];
  readonly mitigationSuggestions: readonly string[];
  readonly nextReviewInMinutes: number;
  readonly generatedAt: string;
}

// ---------------------------------------------------------------------------
// AI Operational Insight
// ---------------------------------------------------------------------------

export interface AIOperationalInsight {
  readonly id: string;
  readonly module: string; // e.g., 'INCIDENTS' | 'CROWD' | 'VOLUNTEERS'
  readonly title: string;
  readonly description: string;
  readonly dataPoints: readonly string[];
  readonly confidence: ConfidenceScore;
  readonly priority: AIPriority;
  readonly generatedAt: string;
}

// ---------------------------------------------------------------------------
// AI Natural Language Summary
// ---------------------------------------------------------------------------

export interface AINaturalLanguageSummary {
  readonly headline: string;
  readonly body: string;
  readonly bulletPoints: readonly string[];
  readonly confidence: ConfidenceScore;
  readonly lengthTokens?: number;
  readonly generatedAt: string;
}

// ---------------------------------------------------------------------------
// AI Crowd Prediction
// ---------------------------------------------------------------------------

export interface AICrowdPrediction {
  readonly zoneId: string;
  readonly predictedOccupancyPercent: number;
  readonly peakTimeEstimate: string; // ISO-8601
  readonly confidence: ConfidenceScore;
  readonly recommendedActions: readonly string[];
  readonly generatedAt: string;
}

// ---------------------------------------------------------------------------
// AI Incident Analysis
// ---------------------------------------------------------------------------

export interface AIIncidentAnalysis {
  readonly incidentId: string;
  readonly classification: string;
  readonly urgencyLevel: AIRiskLevel;
  readonly suggestedDispatches: readonly string[];
  readonly estimatedResolutionMinutes: number;
  readonly confidence: ConfidenceScore;
  readonly reasoning: string;
  readonly generatedAt: string;
}

// ---------------------------------------------------------------------------
// Generic AI Response Envelope
// ---------------------------------------------------------------------------

/** Wraps any typed AI response with shared metadata. */
export interface AIResponseEnvelope<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly error: string | null;
  readonly latencyMs: number;
  readonly tokensUsed?: number;
  readonly model: string;
  readonly requestId: string;
}
