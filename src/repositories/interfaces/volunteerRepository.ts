import { Volunteer } from '../../domain/models';
import { VolunteerStatus, VolunteerRole } from '../../domain/enums';

export interface IVolunteerRepository {
  getAll(): Promise<Volunteer[]>;
  getById(id: string): Promise<Volunteer | null>;
  getAvailable(): Promise<Volunteer[]>;
  getByRole(role: VolunteerRole): Promise<Volunteer[]>;
  getByStatus(status: VolunteerStatus): Promise<Volunteer[]>;
  search(query: string): Promise<Volunteer[]>;
}
