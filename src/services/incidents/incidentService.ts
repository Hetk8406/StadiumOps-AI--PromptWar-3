import { IIncidentRepository } from '../../repositories/interfaces/incidentRepository';
import { Incident } from '../../domain/models';
import { IncidentSeverity, IncidentStatus } from '../../domain/enums';
import { calculatePercentage } from '../shared/serviceUtils';

export interface IncidentStatistics {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  active: number;
  resolved: number;
  resolutionRate: number; // percentage
}

/**
 * Incident Monitoring Business Service
 */
export class IncidentService {
  constructor(private incidentRepo: IIncidentRepository) {}

  async getAllIncidents(): Promise<Incident[]> {
    return this.incidentRepo.getAll();
  }

  async getIncidentById(id: string): Promise<Incident | null> {
    return this.incidentRepo.getById(id);
  }

  async getIncidentStatistics(): Promise<IncidentStatistics> {
    const list = await this.incidentRepo.getAll();
    const total = list.length;
    const critical = list.filter((i) => i.severity === IncidentSeverity.CRITICAL).length;
    const high = list.filter((i) => i.severity === IncidentSeverity.HIGH).length;
    const medium = list.filter((i) => i.severity === IncidentSeverity.MEDIUM).length;
    const low = list.filter((i) => i.severity === IncidentSeverity.LOW).length;
    const resolved = list.filter((i) => i.status === IncidentStatus.RESOLVED).length;
    const active = total - resolved;

    return {
      total,
      critical,
      high,
      medium,
      low,
      active,
      resolved,
      resolutionRate: calculatePercentage(resolved, total),
    };
  }

  async filterAndSearchIncidents(
    query?: string,
    status?: IncidentStatus,
    severity?: IncidentSeverity
  ): Promise<Incident[]> {
    let list = await this.incidentRepo.getAll();

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q)
      );
    }

    if (status) {
      list = list.filter((i) => i.status === status);
    }

    if (severity) {
      list = list.filter((i) => i.severity === severity);
    }

    return list;
  }
}
