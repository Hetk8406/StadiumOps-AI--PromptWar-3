/**
 * Translation AI Strongly Typed Interfaces
 * Defines the models representing Gemini's multilingual translations and summaries.
 */

export interface TranslationAIResult {
  readonly originalMessage: string;
  readonly detectedLanguage: string;
  readonly targetLanguage: string;
  readonly translatedMessage: string;
  readonly refinedVersion: string;
  readonly suggestedTone: string;
  readonly summary: string;
  readonly terminologyNotes: readonly string[];
  readonly confidence: number;
  readonly confidenceCategory: 'High' | 'Medium' | 'Low';
  readonly translationWarnings: readonly string[];
  readonly generatedAt: string;
}
