import { ICrowdRepository } from '../interfaces/crowdRepository';
import { StadiumZone, Gate, CrowdMetrics } from '../../domain/models';
import { stadiumZones, gates, crowdMetricsList } from '../../mocks/crowd/crowdZones';

/**
 * Mock Crowd Repository
 * Consumer: Crowd Operations page.
 */
export class MockCrowdRepository implements ICrowdRepository {
  async getAllZones(): Promise<StadiumZone[]> {
    return stadiumZones;
  }

  async getZoneById(id: string): Promise<StadiumZone | null> {
    const item = stadiumZones.find((z) => z.id === id);
    return item || null;
  }

  async getAllGates(): Promise<Gate[]> {
    return gates;
  }

  async getMetrics(): Promise<CrowdMetrics[]> {
    return crowdMetricsList;
  }
}
