import { StadiumZone, Gate, CrowdMetrics } from '../../domain/models';

export interface ICrowdRepository {
  getAllZones(): Promise<StadiumZone[]>;
  getZoneById(id: string): Promise<StadiumZone | null>;
  getAllGates(): Promise<Gate[]>;
  getMetrics(): Promise<CrowdMetrics[]>;
}
