import { IDashboardRepository } from '../interfaces/dashboardRepository';
import { IIncidentRepository } from '../interfaces/incidentRepository';
import { IVolunteerRepository } from '../interfaces/volunteerRepository';
import { ICrowdRepository } from '../interfaces/crowdRepository';
import { ICommunicationRepository } from '../interfaces/communicationRepository';
import { IAccessibilityRepository } from '../interfaces/accessibilityRepository';
import { IReportRepository } from '../interfaces/reportRepository';
import { ISettingsRepository } from '../interfaces/settingsRepository';

import { MockDashboardRepository } from '../implementations/dashboardRepository.mock';
import { MockIncidentRepository } from '../implementations/incidentRepository.mock';
import { MockVolunteerRepository } from '../implementations/volunteerRepository.mock';
import { MockCrowdRepository } from '../implementations/crowdRepository.mock';
import { MockCommunicationRepository } from '../implementations/communicationRepository.mock';
import { MockAccessibilityRepository } from '../implementations/accessibilityRepository.mock';
import { MockReportRepository } from '../implementations/reportRepository.mock';
import { MockSettingsRepository } from '../implementations/settingsRepository.mock';

/**
 * Centrally Managed Repository Factory Singleton
 * Orchestrates dependency bindings for data modules.
 */
class RepositoryFactory {
  private dashboardRepo = new MockDashboardRepository();
  private incidentRepo = new MockIncidentRepository();
  private volunteerRepo = new MockVolunteerRepository();
  private crowdRepo = new MockCrowdRepository();
  private communicationRepo = new MockCommunicationRepository();
  private accessibilityRepo = new MockAccessibilityRepository();
  private reportRepo = new MockReportRepository();
  private settingsRepo = new MockSettingsRepository();

  getDashboardRepository(): IDashboardRepository {
    return this.dashboardRepo;
  }

  getIncidentRepository(): IIncidentRepository {
    return this.incidentRepo;
  }

  getVolunteerRepository(): IVolunteerRepository {
    return this.volunteerRepo;
  }

  getCrowdRepository(): ICrowdRepository {
    return this.crowdRepo;
  }

  getCommunicationRepository(): ICommunicationRepository {
    return this.communicationRepo;
  }

  getAccessibilityRepository(): IAccessibilityRepository {
    return this.accessibilityRepo;
  }

  getReportRepository(): IReportRepository {
    return this.reportRepo;
  }

  getSettingsRepository(): ISettingsRepository {
    return this.settingsRepo;
  }
}

export const repositoryFactory = new RepositoryFactory();
