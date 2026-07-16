import { Report } from '../../domain/models';
import { ReportType } from '../../domain/enums';
import { getRelativeTime } from '../utils';

/**
 * Deterministic Report Logs
 * Consumer: Reports & Analytics module.
 */

export const reports: Report[] = [
  { id: 'REP-26-401', title: 'Daily Operations Summary', type: ReportType.OPERATIONS, generatedAt: getRelativeTime(0), generatedBy: 'Lead Ops Manager', format: 'PDF', status: 'Completed' },
  { id: 'REP-26-402', title: 'Incident Triage Log', type: ReportType.INCIDENT, generatedAt: getRelativeTime(-60), generatedBy: 'Safety Supervisor', format: 'Excel', status: 'Completed' },
  { id: 'REP-26-403', title: 'Volunteer Performance Stats', type: ReportType.VOLUNTEER, generatedAt: getRelativeTime(-120), generatedBy: 'HR Coordinator', format: 'CSV', status: 'Completed' },
  { id: 'REP-26-404', title: 'Crowd Gate Flow Analytics', type: ReportType.CROWD, generatedAt: getRelativeTime(-180), generatedBy: 'Transit Lead', format: 'PDF', status: 'Processing' },
  { id: 'REP-26-405', title: 'Accessibility Ramp Audit', type: ReportType.ACCESSIBILITY, generatedAt: getRelativeTime(-240), generatedBy: 'Accessibility Inspector', format: 'PDF', status: 'Completed' },
  { id: 'REP-26-406', title: 'Medical Station Logs', type: ReportType.MEDICAL, generatedAt: getRelativeTime(-300), generatedBy: 'Medical Chief', format: 'Excel', status: 'Completed' },
];
