import { describe, it, expect, vi } from 'vitest';
import { generateDecisionSupport } from './decisionSupportService';

describe('Decision Support AI Service', () => {
  it('should return a valid simulated decision support briefing when no API key is provided', async () => {
    // Force empty API key config
    vi.stubEnv('VITE_GEMINI_API_KEY', '');

    const start = Date.now();
    const result = await generateDecisionSupport({
      incidentRisk: {},
      volunteerAllocations: {},
      crowdCongestion: {},
      accessibilityIssues: {},
    });
    const duration = Date.now() - start;

    expect(result).toBeDefined();
    expect(result.overallStatus).toBe('ORANGE');
    expect(result.executiveSummary).toContain('North Tier');
    expect(result.coordinatedRecommendations).toHaveLength(3);
    expect(result.confidence).toBe(0.95);
    // Should wait at least 800ms for simulated delay
    expect(duration).toBeGreaterThanOrEqual(700);
  });
});
