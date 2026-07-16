/**
 * Translation Response Validator
 * Validates fields on parsed translation JSON returned from Gemini.
 */

import { TranslationAIResult } from './translationTypes';
import { AIValidationError } from '../shared/aiErrors';

export function validateTranslationAIResult(data: unknown): TranslationAIResult {
  const d = data as Record<string, unknown>;

  if (typeof d.originalMessage !== 'string' || d.originalMessage.trim().length === 0) {
    throw new AIValidationError('originalMessage is missing or invalid', 'originalMessage');
  }

  if (typeof d.detectedLanguage !== 'string' || d.detectedLanguage.trim().length === 0) {
    throw new AIValidationError('detectedLanguage is missing or empty', 'detectedLanguage');
  }

  if (typeof d.targetLanguage !== 'string' || d.targetLanguage.trim().length === 0) {
    throw new AIValidationError('targetLanguage is missing or empty', 'targetLanguage');
  }

  if (typeof d.translatedMessage !== 'string' || d.translatedMessage.trim().length === 0) {
    throw new AIValidationError('translatedMessage is missing or empty', 'translatedMessage');
  }

  if (typeof d.refinedVersion !== 'string') {
    throw new AIValidationError('refinedVersion is missing', 'refinedVersion');
  }

  if (typeof d.suggestedTone !== 'string') {
    throw new AIValidationError('suggestedTone is missing', 'suggestedTone');
  }

  if (typeof d.summary !== 'string') {
    throw new AIValidationError('summary is missing', 'summary');
  }

  if (!Array.isArray(d.terminologyNotes)) {
    throw new AIValidationError('terminologyNotes must be an array', 'terminologyNotes');
  }

  if (typeof d.confidence !== 'number' || d.confidence < 0 || d.confidence > 1) {
    throw new AIValidationError('confidence must be a number between 0 and 1', 'confidence');
  }

  const confCategory = d.confidenceCategory as string;
  if (!['High', 'Medium', 'Low'].includes(confCategory)) {
    throw new AIValidationError(`confidenceCategory is invalid: ${confCategory}`, 'confidenceCategory');
  }

  if (!Array.isArray(d.translationWarnings)) {
    throw new AIValidationError('translationWarnings must be an array', 'translationWarnings');
  }

  if (typeof d.generatedAt !== 'string') {
    throw new AIValidationError('generatedAt is missing or invalid', 'generatedAt');
  }

  return data as TranslationAIResult;
}
