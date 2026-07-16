/**
 * Business Logic Service Layer Barrel Exports
 * Consumer: React Components, state hooks, or event emitters.
 */

import { serviceFactory } from './factory/serviceFactory';

export const dashboardService = serviceFactory.getDashboardService();
export const incidentService = serviceFactory.getIncidentService();
export const volunteerService = serviceFactory.getVolunteerService();
export const crowdService = serviceFactory.getCrowdService();
export const communicationService = serviceFactory.getCommunicationService();
export const accessibilityService = serviceFactory.getAccessibilityService();
export const reportService = serviceFactory.getReportService();
export const settingsService = serviceFactory.getSettingsService();

export { serviceFactory };
export * from './shared/serviceErrors';
export * from './shared/serviceUtils';
export * from './dashboard/dashboardService';
export * from './incidents/incidentService';
export * from './volunteers/volunteerService';
export * from './crowd/crowdService';
export * from './communications/communicationService';
export * from './accessibility/accessibilityService';
export * from './reports/reportService';
export * from './settings/settingsService';
