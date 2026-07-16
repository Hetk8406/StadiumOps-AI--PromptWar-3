/**
 * AI Error Classes
 * Standardized, typed error hierarchy for the Gemini AI integration layer.
 * Consumers can catch specific error types to handle failures gracefully.
 */

// ---------------------------------------------------------------------------
// Base AI Error
// ---------------------------------------------------------------------------

export class AIError extends Error {
  public readonly code: string;
  public readonly retryable: boolean;

  constructor(message: string, code: string, retryable = false) {
    super(message);
    this.name = 'AIError';
    this.code = code;
    this.retryable = retryable;
    // Ensure prototype chain works correctly with transpiled code
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ---------------------------------------------------------------------------
// Specific Error Types
// ---------------------------------------------------------------------------

/** Gemini API key is missing or invalid. */
export class AIAuthenticationError extends AIError {
  constructor(message = 'Gemini API key is missing or invalid.') {
    super(message, 'AI_AUTH_ERROR', false);
    this.name = 'AIAuthenticationError';
  }
}

/** Network or connectivity failure when reaching Gemini API. */
export class AIConnectionError extends AIError {
  constructor(message = 'Failed to connect to the Gemini API.') {
    super(message, 'AI_CONNECTION_ERROR', true);
    this.name = 'AIConnectionError';
  }
}

/** Request timed out before a response was received. */
export class AITimeoutError extends AIError {
  constructor(message = 'Gemini AI request timed out.') {
    super(message, 'AI_TIMEOUT_ERROR', true);
    this.name = 'AITimeoutError';
  }
}

/** Gemini returned a response that could not be parsed. */
export class AIInvalidResponseError extends AIError {
  constructor(message = 'AI response could not be parsed into a valid structure.') {
    super(message, 'AI_INVALID_RESPONSE', false);
    this.name = 'AIInvalidResponseError';
  }
}

/** Gemini blocked the response due to safety policy. */
export class AISafetyBlockedError extends AIError {
  constructor(message = 'AI response was blocked by safety filters.') {
    super(message, 'AI_SAFETY_BLOCKED', false);
    this.name = 'AISafetyBlockedError';
  }
}

/** Gemini API rate limit exceeded. */
export class AIRateLimitError extends AIError {
  constructor(message = 'Gemini API rate limit exceeded. Please try again later.') {
    super(message, 'AI_RATE_LIMIT', true);
    this.name = 'AIRateLimitError';
  }
}

/** Response failed structured validation before being exposed to the UI. */
export class AIValidationError extends AIError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'AI_VALIDATION_ERROR', false);
    this.name = 'AIValidationError';
    this.field = field;
  }
}

/** Gemini AI feature is currently unavailable or disabled. */
export class AIUnavailableError extends AIError {
  constructor(message = 'AI features are currently unavailable.') {
    super(message, 'AI_UNAVAILABLE', false);
    this.name = 'AIUnavailableError';
  }
}

// ---------------------------------------------------------------------------
// Error Classification Utility
// ---------------------------------------------------------------------------

/**
 * Attempts to classify a raw caught error into a structured AIError.
 * Falls back to a generic AIConnectionError for unknown errors.
 */
export function classifyAIError(error: unknown): AIError {
  if (error instanceof AIError) return error;

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('api key') || msg.includes('unauthorized') || msg.includes('403')) {
      return new AIAuthenticationError(error.message);
    }
    if (msg.includes('timeout') || msg.includes('timed out')) {
      return new AITimeoutError(error.message);
    }
    if (msg.includes('rate limit') || msg.includes('429')) {
      return new AIRateLimitError(error.message);
    }
    if (msg.includes('safety') || msg.includes('blocked')) {
      return new AISafetyBlockedError(error.message);
    }
    return new AIConnectionError(error.message);
  }

  return new AIConnectionError('An unknown AI error occurred.');
}
