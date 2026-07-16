/**
 * Repository Layer Barrel Exports
 * Consumer: Services, hooks, or page controllers requiring domain entities.
 */

import { repositoryFactory } from './factory/repositoryFactory';

export const dashboardRepository = repositoryFactory.getDashboardRepository();
export const incidentRepository = repositoryFactory.getIncidentRepository();
export const volunteerRepository = repositoryFactory.getVolunteerRepository();
export const crowdRepository = repositoryFactory.getCrowdRepository();
export const communicationRepository = repositoryFactory.getCommunicationRepository();
export const accessibilityRepository = repositoryFactory.getAccessibilityRepository();
export const reportRepository = repositoryFactory.getReportRepository();
export const settingsRepository = repositoryFactory.getSettingsRepository();

export { repositoryFactory };
export * from './interfaces/dashboardRepository';
export * from './interfaces/incidentRepository';
export * from './interfaces/volunteerRepository';
export * from './interfaces/crowdRepository';
export * from './interfaces/communicationRepository';
export * from './interfaces/accessibilityRepository';
export * from './interfaces/reportRepository';
export * from './interfaces/settingsRepository';
