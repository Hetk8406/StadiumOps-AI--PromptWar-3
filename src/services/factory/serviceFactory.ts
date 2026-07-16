import {
  dashboardRepository,
  incidentRepository,
  volunteerRepository,
  crowdRepository,
  communicationRepository,
  accessibilityRepository,
  reportRepository,
  settingsRepository,
} from '../../repositories';

import { DashboardService } from '../dashboard/dashboardService';
import { IncidentService } from '../incidents/incidentService';
import { VolunteerService } from '../volunteers/volunteerService';
import { CrowdService } from '../crowd/crowdService';
import { CommunicationService } from '../communications/communicationService';
import { AccessibilityService } from '../accessibility/accessibilityService';
import { ReportService } from '../reports/reportService';
import { SettingsService } from '../settings/settingsService';

/**
 * Centrally Managed Service Factory Singleton
 * Injects repositories and coordinates singletons for state consumption.
 */
class ServiceFactory {
  private dashboardServ = new DashboardService(dashboardRepository);
  private incidentServ = new IncidentService(incidentRepository);
  private volunteerServ = new VolunteerService(volunteerRepository);
  private crowdServ = new CrowdService(crowdRepository);
  private commsServ = new CommunicationService(communicationRepository);
  private accessServ = new AccessibilityService(accessibilityRepository);
  private reportServ = new ReportService(reportRepository);
  private settingsServ = new SettingsService(settingsRepository);

  getDashboardService(): DashboardService {
    return this.dashboardServ;
  }

  getIncidentService(): IncidentService {
    return this.incidentServ;
  }

  getVolunteerService(): VolunteerService {
    return this.volunteerServ;
  }

  getCrowdService(): CrowdService {
    return this.crowdServ;
  }

  getCommunicationService(): CommunicationService {
    return this.commsServ;
  }

  getAccessibilityService(): AccessibilityService {
    return this.accessServ;
  }

  getReportService(): ReportService {
    return this.reportServ;
  }

  getSettingsService(): SettingsService {
    return this.settingsServ;
  }
}

export const serviceFactory = new ServiceFactory();
