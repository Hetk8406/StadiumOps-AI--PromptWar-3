import { IDashboardRepository, IDashboardSummary } from '../../repositories/interfaces/dashboardRepository';

/**
 * Dashboard Operations Advisory Service
 * Orchestrates telemetry states and live counters.
 */
export class DashboardService {
  constructor(private dashboardRepo: IDashboardRepository) {}

  async getDashboardSummary(): Promise<IDashboardSummary> {
    return this.dashboardRepo.getSummary();
  }

  async getLiveActivities(): Promise<string[]> {
    return this.dashboardRepo.getLiveActivities();
  }
}
