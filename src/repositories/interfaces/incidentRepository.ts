import { Incident } from '../../domain/models';
import { IncidentSeverity, IncidentStatus } from '../../domain/enums';

export interface IIncidentRepository {
  getAll(): Promise<Incident[]>;
  getById(id: string): Promise<Incident | null>;
  getByStatus(status: IncidentStatus): Promise<Incident[]>;
  getBySeverity(severity: IncidentSeverity): Promise<Incident[]>;
  search(query: string): Promise<Incident[]>;
}
