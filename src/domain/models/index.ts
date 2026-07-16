import {
  IncidentSeverity,
  IncidentStatus,
  VolunteerStatus,
  VolunteerRole,
  CrowdStatus,
  GateStatus,
  AccessibilityRequestStatus,
  AccessibilityCategory,
  BroadcastPriority,
  BroadcastStatus,
  ReportType,
  NotificationType,
} from '../enums';
import {
  UUID,
  ISODate,
  PhoneNumber,
  LanguageCode,
  ZoneId,
  GateId,
  VolunteerId,
  IncidentId,
  BroadcastId,
  ReportId,
  NotificationId,
} from '../types';

export interface Incident {
  id: IncidentId;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  zoneId: ZoneId;
  gateId?: GateId;
  reportedBy: string;
  assignedTeam?: string;
  reportedAt: ISODate;
  updatedAt: ISODate;
  estimatedResponseTime?: string;
  resolvedAt?: ISODate;
  attachments?: string[];
  notes?: string[];
}

export interface Volunteer {
  id: VolunteerId;
  firstName: string;
  lastName: string;
  role: VolunteerRole;
  languages: LanguageCode[];
  status: VolunteerStatus;
  currentZone: ZoneId;
  currentAssignment?: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Team Leader';
  certifications: string[];
  contact: PhoneNumber;
  availability: boolean;
  rating?: number;
}

export interface StadiumZone {
  id: ZoneId;
  name: string;
  capacity: number;
  currentOccupancy: number;
  status: CrowdStatus;
  priority: number; // 1 (highest) to 5 (lowest)
  coordinates?: { x: number; y: number }[];
}

export interface Gate {
  id: GateId;
  name: string;
  zoneId: ZoneId;
  status: GateStatus;
  queueLength: number;
  occupancy: number;
  estimatedWaitTime: number; // in minutes
}

export interface CrowdMetrics {
  id: UUID;
  zoneId: ZoneId;
  density: number; // percentage
  occupancy: number;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  lastUpdated: ISODate;
}

export interface AccessibilityRequest {
  id: UUID;
  category: AccessibilityCategory;
  priority: IncidentSeverity;
  status: AccessibilityRequestStatus;
  zoneId: ZoneId;
  visitorName?: string;
  requestedAt: ISODate;
  assignedTeam?: string;
  equipment?: string;
  notes?: string;
}

export interface Broadcast {
  id: BroadcastId;
  title: string;
  message: string;
  priority: BroadcastPriority;
  audience: string;
  languages: LanguageCode[];
  status: BroadcastStatus;
  createdAt: ISODate;
  scheduledAt?: ISODate;
  publishedAt?: ISODate;
}

export interface Match {
  id: UUID;
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  matchDate: ISODate;
  kickoffTime: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'DELAYED';
  attendance?: number;
}

export interface Report {
  id: ReportId;
  title: string;
  type: ReportType;
  generatedAt: ISODate;
  generatedBy: string;
  format: 'PDF' | 'Excel' | 'CSV' | 'JSON';
  status: 'Completed' | 'Processing' | 'Failed';
}

export interface Notification {
  id: NotificationId;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: ISODate;
}
