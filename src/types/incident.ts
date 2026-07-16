import { IncidentSeverity } from '../config/constants';

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  zoneId: string;
  status: 'REPORTED' | 'DISPATCHED' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  reporterId: string;
  assignedVolunteerIds: string[];
  aiTriageAdvice?: {
    severityAssessment: IncidentSeverity;
    suggestedAction: string;
    reasoning: string;
    confidenceScore: number;
  };
}
