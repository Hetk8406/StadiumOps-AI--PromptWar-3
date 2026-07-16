import { describe, it, expect, vi } from 'vitest';
import { generateTranslation } from './translationAIService';

describe('Translation AI Service', () => {
  it('should return simulated translation and refined versions when API key is missing', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');

    const result = await generateTranslation(
      'Please clear Gate C immediately.',
      'French',
      'General Spectators'
    );

    expect(result).toBeDefined();
    expect(result.originalMessage).toBe('Please clear Gate C immediately.');
    expect(result.targetLanguage).toBe('French');
    expect(result.translatedMessage).toContain('French');
    expect(result.refinedVersion).toContain('General Spectators');
    expect(result.confidence).toBe(0.98);
  });
});
