import { describe, it, expect, vi } from 'vitest';
import { generateAccessibilityRecommendations } from './accessibilityAIService';
import { IncidentSeverity, AccessibilityCategory, AccessibilityRequestStatus } from '../../domain/enums';
import { AccessibilityRequest } from '../../domain/models';

describe('Accessibility AI Service', () => {
  it('should return simulated accessibility recommendations when API key is missing', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');

    const mockRequest: AccessibilityRequest = {
      id: 'ast-102',
      category: AccessibilityCategory.WHEELCHAIR,
      priority: IncidentSeverity.HIGH,
      status: AccessibilityRequestStatus.WAITING,
      zoneId: 'ZONE_F',
      visitorName: 'Jane Smith',
      requestedAt: new Date().toISOString(),
      equipment: 'Wheelchair',
      notes: 'Needs assistance from ticket line to accessible seating.',
    };

    const result = await generateAccessibilityRecommendations(mockRequest);

    expect(result).toBeDefined();
    expect(result.requestId).toBe('ast-102');
    expect(result.recommendedAssistance).toContain('Wheelchair Escort');
    expect(result.priorityAssessment).toBe('HIGH');
    expect(result.suggestedRoute).toContain('Lift 4A');
    expect(result.confidence).toBe(0.95);
    expect(result.mitigationConsiderations).toHaveLength(2);
  });
});
