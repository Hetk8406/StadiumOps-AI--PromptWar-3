/**
 * AI Shared Type Aliases
 * Common input/output type contracts for all AI service calls.
 * Framework-independent — contains no React imports.
 */

import type { AIResponseEnvelope } from '../models/aiModels';

// ---------------------------------------------------------------------------
// AI Request Context
// ---------------------------------------------------------------------------

/** Contextual metadata attached to every AI request for traceability. */
export interface AIRequestContext {
  readonly requestId: string;
  readonly feature: string;         // e.g., 'INCIDENTS', 'CROWD', 'VOLUNTEERS'
  readonly operatorId?: string;     // Future: who triggered the AI request
  readonly sessionId?: string;
  readonly timestamp: string;       // ISO-8601
}

// ---------------------------------------------------------------------------
// Prompt Input
// ---------------------------------------------------------------------------

/** A single structured message for the Gemini conversation turn. */
export interface AIMessage {
  readonly role: 'user' | 'model';
  readonly text: string;
}

/** Full prompt payload sent to GeminiClient. */
export interface AIPromptPayload {
  readonly systemInstruction: string;
  readonly messages: readonly AIMessage[];
  readonly context?: AIRequestContext;
}

// ---------------------------------------------------------------------------
// AI Feature Status
// ---------------------------------------------------------------------------

export type AIConnectionStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'INITIALIZING';

export interface AIFeatureStatus {
  readonly available: boolean;
  readonly status: AIConnectionStatus;
  readonly lastCheckAt: string;       // ISO-8601
  readonly message?: string;
}

// ---------------------------------------------------------------------------
// Logging Hook Payload
// ---------------------------------------------------------------------------

/** Emitted after every AI request for optional future logging integration. */
export interface AIRequestLog {
  readonly requestId: string;
  readonly feature: string;
  readonly promptTokens?: number;
  readonly responseTokens?: number;
  readonly latencyMs: number;
  readonly success: boolean;
  readonly errorCode?: string;
  readonly timestamp: string;
}

// ---------------------------------------------------------------------------
// Generic Convenience Alias
// ---------------------------------------------------------------------------

/** Convenience alias for a wrapped async AI call return type. */
export type AIResult<T> = Promise<AIResponseEnvelope<T>>;
