import { describe, it, expect, vi } from 'vitest';
import { generateVolunteerRecommendations } from './volunteerAIService';
import { VolunteerRole, VolunteerStatus } from '../../domain/enums';
import { Volunteer } from '../../domain/models';

describe('Volunteer AI Service', () => {
  it('should return simulated volunteer recommendations when API key is missing', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');

    const mockVolunteer: Volunteer = {
      id: 'VOL-702',
      firstName: 'John',
      lastName: 'Doe',
      role: VolunteerRole.SECURITY,
      languages: ['en', 'es'],
      status: VolunteerStatus.AVAILABLE,
      currentZone: 'ZONE_A',
      experienceLevel: 'Advanced',
      certifications: ['First Aid'],
      contact: '+1234567890',
      availability: true,
    };

    const result = await generateVolunteerRecommendations(mockVolunteer, 'Congestion at Gate A');

    expect(result).toBeDefined();
    expect(result.volunteerId).toBe('VOL-702');
    expect(result.recommendedZone).toBe('North Gate Concourse');
    expect(result.recommendedTask).toContain('Ticket Validation');
    expect(result.priority).toBe('HIGH');
    expect(result.confidenceCategory).toBe('High');
    expect(result.alternativeRecommendations).toHaveLength(1);
  });
});
