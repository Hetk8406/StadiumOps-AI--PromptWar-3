import { IDashboardRepository, IDashboardSummary } from '../interfaces/dashboardRepository';
import { dashboardSummary } from '../../mocks/dashboard/dashboardSummary';

/**
 * Mock Dashboard Repository
 * Consumer: Dashboard Overview page.
 */
export class MockDashboardRepository implements IDashboardRepository {
  async getSummary(): Promise<IDashboardSummary> {
    return dashboardSummary;
  }

  async getLiveActivities(): Promise<string[]> {
    return [
      '14:15 - Security: Gate C temporarily restricted',
      '14:08 - Volunteer: Shift checkin complete for Stand Zone A',
      '13:56 - Accessibility: Guide dispatched to Gate D',
    ];
  }
}
