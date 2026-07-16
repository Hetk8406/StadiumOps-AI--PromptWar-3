/**
 * AI Utility Helpers
 * Pure utility functions shared across the AI layer.
 * No React imports. Framework-independent.
 */

import { v4 as uuidv4 } from 'uuid';
import type { AIRequestContext } from './aiTypes';

// ---------------------------------------------------------------------------
// ID Generation
// ---------------------------------------------------------------------------

/** Generates a unique request ID for AI call traceability. */
export function generateRequestId(): string {
  return `ai-req-${uuidv4()}`;
}

// ---------------------------------------------------------------------------
// Sanitization
// ---------------------------------------------------------------------------

/**
 * Strips HTML tags and limits length of AI-generated text before
 * exposing it to the UI. Prevents XSS from AI output.
 */
export function sanitizeAIText(raw: string, maxLength = 2000): string {
  return raw
    .replace(/<[^>]*>/g, '')        // strip HTML tags
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F]/g, '') // strip control chars
    .trim()
    .slice(0, maxLength);
}

// ---------------------------------------------------------------------------
// Truncation
// ---------------------------------------------------------------------------

/** Truncates a prompt to a safe character budget to prevent token overflow. */
export function truncatePromptContext(text: string, maxChars = 3000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '... [truncated]';
}

// ---------------------------------------------------------------------------
// Request Context Builder
// ---------------------------------------------------------------------------

/** Builds a standard AIRequestContext for a given feature call. */
export function buildRequestContext(feature: string): AIRequestContext {
  return {
    requestId: generateRequestId(),
    feature,
    timestamp: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Confidence Formatting
// ---------------------------------------------------------------------------

/** Converts a 0-1 confidence score to a percentage string. */
export function formatConfidence(score: number): string {
  const clamped = Math.max(0, Math.min(1, score));
  return `${Math.round(clamped * 100)}%`;
}

// ---------------------------------------------------------------------------
// Delay Utility for Retry Logic
// ---------------------------------------------------------------------------

/** Returns a promise that resolves after `ms` milliseconds. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// ISO Timestamp
// ---------------------------------------------------------------------------

/** Returns the current UTC time as an ISO-8601 string. */
export function nowISO(): string {
  return new Date().toISOString();
}
