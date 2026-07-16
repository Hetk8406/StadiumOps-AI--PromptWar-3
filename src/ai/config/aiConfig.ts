/**
 * AI Configuration Layer
 * Centralizes all Gemini AI model configuration, request parameters, safety settings,
 * and timeout/retry policies. Single source of truth for the entire AI layer.
 */

// ---------------------------------------------------------------------------
// Safety Settings
// ---------------------------------------------------------------------------

export enum HarmCategory {
  HARASSMENT = 'HARM_CATEGORY_HARASSMENT',
  HATE_SPEECH = 'HARM_CATEGORY_HATE_SPEECH',
  SEXUALLY_EXPLICIT = 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
  DANGEROUS_CONTENT = 'HARM_CATEGORY_DANGEROUS_CONTENT',
}

export enum HarmBlockThreshold {
  BLOCK_NONE = 'BLOCK_NONE',
  BLOCK_ONLY_HIGH = 'BLOCK_ONLY_HIGH',
  BLOCK_MEDIUM_AND_ABOVE = 'BLOCK_MEDIUM_AND_ABOVE',
  BLOCK_LOW_AND_ABOVE = 'BLOCK_LOW_AND_ABOVE',
}

export interface SafetySetting {
  readonly category: HarmCategory;
  readonly threshold: HarmBlockThreshold;
}

// ---------------------------------------------------------------------------
// Generation Configuration
// ---------------------------------------------------------------------------

export interface GenerationConfig {
  readonly temperature: number;
  readonly topP: number;
  readonly topK: number;
  readonly maxOutputTokens: number;
  readonly candidateCount: number;
  readonly responseMimeType: string;
}

// ---------------------------------------------------------------------------
// Full AI Config
// ---------------------------------------------------------------------------

export interface AIConfig {
  readonly modelName: string;
  readonly generation: GenerationConfig;
  readonly safetySettings: readonly SafetySetting[];
  readonly timeoutMs: number;
  readonly maxRetries: number;
  readonly retryDelayMs: number;
  readonly streamingEnabled: boolean;
}

// ---------------------------------------------------------------------------
// Runtime Config Resolved from Environment Variables
// ---------------------------------------------------------------------------

function resolveString(key: string, fallback: string): string {
  const env = (import.meta as unknown as { env: Record<string, string> }).env;
  const val = env?.[key];
  return typeof val === 'string' && val.length > 0 ? val : fallback;
}

function resolveNumber(key: string, fallback: number): number {
  const env = (import.meta as unknown as { env: Record<string, string> }).env;
  const val = env?.[key];
  const parsed = Number(val);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const AI_CONFIG: AIConfig = {
  modelName: resolveString('VITE_GEMINI_MODEL', 'gemini-2.0-flash'),
  generation: {
    temperature: 0.4,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: resolveNumber('VITE_AI_MAX_TOKENS', 1024),
    candidateCount: 1,
    responseMimeType: 'application/json',
  },
  safetySettings: [
    { category: HarmCategory.HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  ],
  timeoutMs: resolveNumber('VITE_AI_TIMEOUT', 15000),
  maxRetries: resolveNumber('VITE_AI_RETRY_COUNT', 3),
  retryDelayMs: 1000,
  streamingEnabled: false,
};

/** Retrieve the API key from VITE environment — never embed in source. */
export function getApiKey(): string {
  return resolveString('VITE_GEMINI_API_KEY', '');
}
