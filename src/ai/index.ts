/**
 * AI Layer Barrel Exports
 * Single import surface for the entire AI integration layer.
 * Feature services import from here — never from individual files directly.
 */

// Configuration
export { AI_CONFIG, getApiKey } from './config/aiConfig';
export type { AIConfig, GenerationConfig, SafetySetting } from './config/aiConfig';

// Models
export type {
  AIRecommendation,
  AIRiskAssessment,
  AIRiskFactor,
  AIOperationalInsight,
  AINaturalLanguageSummary,
  AICrowdPrediction,
  AIIncidentAnalysis,
  AISuggestedAction,
  AIResponseEnvelope,
  ConfidenceScore,
  AIRiskLevel,
  AIPriority,
} from './models/aiModels';

// Shared Types
export type {
  AIRequestContext,
  AIMessage,
  AIPromptPayload,
  AIConnectionStatus,
  AIFeatureStatus,
  AIRequestLog,
  AIResult,
} from './shared/aiTypes';

// Errors
export {
  AIError,
  AIAuthenticationError,
  AIConnectionError,
  AITimeoutError,
  AIInvalidResponseError,
  AISafetyBlockedError,
  AIRateLimitError,
  AIValidationError,
  AIUnavailableError,
  classifyAIError,
} from './shared/aiErrors';

// Utils
export {
  generateRequestId,
  sanitizeAIText,
  truncatePromptContext,
  buildRequestContext,
  formatConfidence,
  delay,
  nowISO,
} from './shared/aiUtils';

// Prompt Infrastructure
export { STADIUM_OPS_SYSTEM_PROMPT } from './prompts/systemPrompt';
export {
  PromptBuilder,
  buildIncidentAnalysisPrompt,
  buildCrowdPredictionPrompt,
  buildOperationalRiskPrompt,
  buildNaturalLanguageSummaryPrompt,
} from './prompts/promptBuilder';

// Parsers
export {
  parseRawJSON,
  parseIncidentAnalysis,
  parseRiskAssessment,
  parseCrowdPrediction,
  parseNaturalLanguageSummary,
} from './parsers/responseParser';

// Validation
export {
  validateIncidentAnalysis,
  validateRiskAssessment,
  validateCrowdPrediction,
  validateNaturalLanguageSummary,
} from './validation/responseValidation';

// AI Service
export {
  analyseIncident,
  assessOperationalRisk,
  predictCrowdDynamics,
  generateModuleSummary,
  pingAIService,
} from './services/aiService';

// AI Provider & Hook
export { AIProvider, useAI } from './providers/aiProvider';
