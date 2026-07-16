import { IVolunteerRepository } from '../../repositories/interfaces/volunteerRepository';
import { Volunteer } from '../../domain/models';
import { VolunteerStatus, VolunteerRole } from '../../domain/enums';
import { calculatePercentage } from '../shared/serviceUtils';

export interface VolunteerStatistics {
  total: number;
  available: number;
  assigned: number;
  busy: number;
  break: number;
  offline: number;
  utilizationRate: number; // percentage of (assigned + busy) / total
}

/**
 * Volunteer Roster Deployment Service
 */
export class VolunteerService {
  constructor(private volunteerRepo: IVolunteerRepository) {}

  async getAllVolunteers(): Promise<Volunteer[]> {
    return this.volunteerRepo.getAll();
  }

  async getVolunteerById(id: string): Promise<Volunteer | null> {
    return this.volunteerRepo.getById(id);
  }

  async getStatistics(): Promise<VolunteerStatistics> {
    const list = await this.volunteerRepo.getAll();
    const total = list.length;
    const available = list.filter((v) => v.status === VolunteerStatus.AVAILABLE).length;
    const assigned = list.filter((v) => v.status === VolunteerStatus.ASSIGNED).length;
    const busy = list.filter((v) => v.status === VolunteerStatus.BUSY).length;
    const onBreak = list.filter((v) => v.status === VolunteerStatus.BREAK).length;
    const offline = list.filter((v) => v.status === VolunteerStatus.OFFLINE).length;

    const deployed = assigned + busy;

    return {
      total,
      available,
      assigned,
      busy,
      break: onBreak,
      offline,
      utilizationRate: calculatePercentage(deployed, total),
    };
  }

  async filterAndSearchVolunteers(
    query?: string,
    role?: VolunteerRole,
    status?: VolunteerStatus
  ): Promise<Volunteer[]> {
    let list = await this.volunteerRepo.getAll();

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (v) =>
          v.firstName.toLowerCase().includes(q) ||
          v.lastName.toLowerCase().includes(q) ||
          v.id.toLowerCase().includes(q)
      );
    }

    if (role) {
      list = list.filter((v) => v.role === role);
    }

    if (status) {
      list = list.filter((v) => v.status === status);
    }

    return list;
  }
}
