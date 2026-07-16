/**
 * Central Runtime Configuration and Environment Layer
 * Includes strong typing, safe defaults, feature flags, and prevents hardcoded secrets leakage.
 */

export interface RuntimeConfig {
  readonly env: 'development' | 'production' | 'test';
  readonly isDebugMode: boolean;
  readonly apiBaseUrl: string;
  readonly geminiApiKey: string | null;
  readonly timeoutMs: number;
}

export interface FeatureFlags {
  readonly aiAnalysisEnabled: boolean;
  readonly notificationsEnabled: boolean;
  readonly performanceTracing: boolean;
  readonly experimentalModes: boolean;
}

// Vite environments use VITE_ prefix. Resolve values safely without referencing global process.
const resolvedEnv = (import.meta as unknown as { env: Record<string, string> }).env || {};

const runtimeConfig: RuntimeConfig = {
  env: (resolvedEnv.MODE as 'development' | 'production' | 'test') || 'development',
  isDebugMode: resolvedEnv.VITE_DEBUG_MODE === 'true',
  apiBaseUrl: resolvedEnv.VITE_API_BASE_URL || '/api/v1',
  geminiApiKey: resolvedEnv.VITE_GEMINI_API_KEY || null,
  timeoutMs: Number(resolvedEnv.VITE_TIMEOUT_MS) || 10000,
};

const featureFlags: FeatureFlags = {
  aiAnalysisEnabled: resolvedEnv.VITE_AI_ANALYSIS_ENABLED !== 'false',
  notificationsEnabled: resolvedEnv.VITE_NOTIFICATIONS_ENABLED !== 'false',
  performanceTracing: resolvedEnv.VITE_PERFORMANCE_TRACING === 'true',
  experimentalModes: resolvedEnv.VITE_EXPERIMENTAL_MODES === 'true',
};

export const appConfig = {
  runtime: runtimeConfig,
  features: featureFlags,
} as const;
