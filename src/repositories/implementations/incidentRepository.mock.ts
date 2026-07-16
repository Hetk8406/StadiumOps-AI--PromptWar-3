import { IIncidentRepository } from '../interfaces/incidentRepository';
import { Incident } from '../../domain/models';
import { IncidentSeverity, IncidentStatus } from '../../domain/enums';
import { incidents } from '../../mocks/incidents/incidents';

/**
 * Mock Incident Repository
 * Consumer: Incident Monitoring page.
 */
export class MockIncidentRepository implements IIncidentRepository {
  async getAll(): Promise<Incident[]> {
    return incidents;
  }

  async getById(id: string): Promise<Incident | null> {
    const item = incidents.find((inc) => inc.id === id);
    return item || null;
  }

  async getByStatus(status: IncidentStatus): Promise<Incident[]> {
    return incidents.filter((inc) => inc.status === status);
  }

  async getBySeverity(severity: IncidentSeverity): Promise<Incident[]> {
    return incidents.filter((inc) => inc.severity === severity);
  }

  async search(query: string): Promise<Incident[]> {
    const q = query.toLowerCase();
    return incidents.filter(
      (inc) =>
        inc.title.toLowerCase().includes(q) ||
        inc.description.toLowerCase().includes(q) ||
        inc.id.toLowerCase().includes(q)
    );
  }
}
