import { IVolunteerRepository } from '../interfaces/volunteerRepository';
import { Volunteer } from '../../domain/models';
import { VolunteerStatus, VolunteerRole } from '../../domain/enums';
import { volunteers } from '../../mocks/volunteers/volunteers';

/**
 * Mock Volunteer Repository
 * Consumer: Volunteer Operations page.
 */
export class MockVolunteerRepository implements IVolunteerRepository {
  async getAll(): Promise<Volunteer[]> {
    return volunteers;
  }

  async getById(id: string): Promise<Volunteer | null> {
    const item = volunteers.find((v) => v.id === id);
    return item || null;
  }

  async getAvailable(): Promise<Volunteer[]> {
    return volunteers.filter((v) => v.status === VolunteerStatus.AVAILABLE);
  }

  async getByRole(role: VolunteerRole): Promise<Volunteer[]> {
    return volunteers.filter((v) => v.role === role);
  }

  async getByStatus(status: VolunteerStatus): Promise<Volunteer[]> {
    return volunteers.filter((v) => v.status === status);
  }

  async search(query: string): Promise<Volunteer[]> {
    const q = query.toLowerCase();
    return volunteers.filter(
      (v) =>
        v.firstName.toLowerCase().includes(q) ||
        v.lastName.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q)
    );
  }
}
