/**
 * Gemini AI Client
 * Singleton wrapper around the Google Generative AI SDK.
 * Centralises model selection, safety settings, generation config, and API key access.
 * No component or React dependency. Pure infrastructure layer.
 */

import { GoogleGenerativeAI, GenerativeModel, GenerateContentResult } from '@google/generative-ai';
import { AI_CONFIG, getApiKey } from '../config/aiConfig';
import type { AIPromptPayload } from '../shared/aiTypes';
import {
  classifyAIError,
  AIAuthenticationError,
  AITimeoutError,
  AIError,
} from '../shared/aiErrors';
import { delay } from '../shared/aiUtils';

// ---------------------------------------------------------------------------
// Internal Client State
// ---------------------------------------------------------------------------

let _sdk: GoogleGenerativeAI | null = null;
let _model: GenerativeModel | null = null;

/** Lazily initialises the SDK and model singleton. */
function getModel(): GenerativeModel {
  if (_model) return _model;

  const key = getApiKey();
  if (!key) {
    throw new AIAuthenticationError('VITE_GEMINI_API_KEY is not set in the environment.');
  }

  _sdk = new GoogleGenerativeAI(key);
  _model = _sdk.getGenerativeModel({
    model: AI_CONFIG.modelName,
    generationConfig: {
      temperature: AI_CONFIG.generation.temperature,
      topP: AI_CONFIG.generation.topP,
      topK: AI_CONFIG.generation.topK,
      maxOutputTokens: AI_CONFIG.generation.maxOutputTokens,
      candidateCount: AI_CONFIG.generation.candidateCount,
    },
    safetySettings: AI_CONFIG.safetySettings.map((s) => ({
      category: s.category as string,
      threshold: s.threshold as string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any,
  });

  return _model;
}

// ---------------------------------------------------------------------------
// Public Client API
// ---------------------------------------------------------------------------

/**
 * Sends a structured prompt to Gemini and returns the raw API result.
 * Implements retry logic with exponential back-off for transient failures.
 */
export async function sendToGemini(payload: AIPromptPayload): Promise<GenerateContentResult> {
  const model = getModel();
  const userMessage = payload.messages.map((m) => m.text).join('\n');

  const contents = [
    {
      role: 'user' as const,
      parts: [{ text: `${payload.systemInstruction}\n\n${userMessage}` }],
    },
  ];

  let lastError: AIError = new AIAuthenticationError();
  let attempt = 0;

  while (attempt < AI_CONFIG.maxRetries) {
    attempt += 1;
    try {
      const result = await Promise.race([
        model.generateContent({ contents }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new AITimeoutError()), AI_CONFIG.timeoutMs),
        ),
      ]);
      return result as GenerateContentResult;
    } catch (err: unknown) {
      const classified = classifyAIError(err);
      lastError = classified;
      if (!classified.retryable || attempt >= AI_CONFIG.maxRetries) break;
      await delay(AI_CONFIG.retryDelayMs * attempt);
    }
  }

  throw lastError;
}

/** Extracts raw text from a GenerateContentResult safely. */
export function extractTextFromResult(result: GenerateContentResult): string {
  try {
    return result.response.text();
  } catch {
    throw new AIError('AI response text extraction failed.', 'AI_EXTRACTION_ERROR', false);
  }
}
