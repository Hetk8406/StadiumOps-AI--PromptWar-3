/**
 * Domain Enums for Stadium Operations Command Center
 */

export enum IncidentSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum IncidentStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  ASSIGNED = 'ASSIGNED',
  RESOLVED = 'RESOLVED',
  ESCALATED = 'ESCALATED',
}

export enum VolunteerStatus {
  AVAILABLE = 'AVAILABLE',
  ASSIGNED = 'ASSIGNED',
  BUSY = 'BUSY',
  BREAK = 'BREAK',
  OFFLINE = 'OFFLINE',
}

export enum VolunteerRole {
  MEDICAL = 'MEDICAL',
  SECURITY = 'SECURITY',
  ACCESSIBILITY = 'ACCESSIBILITY',
  TRANSPORT = 'TRANSPORT',
  INFORMATION = 'INFORMATION',
  MEDIA = 'MEDIA',
  EMERGENCY = 'EMERGENCY',
  OPERATIONS = 'OPERATIONS',
}

export enum CrowdStatus {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum GateStatus {
  OPEN = 'OPEN',
  RESTRICTED = 'RESTRICTED',
  CLOSED = 'CLOSED',
  EMERGENCY = 'EMERGENCY',
}

export enum AccessibilityRequestStatus {
  WAITING = 'WAITING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum AccessibilityCategory {
  WHEELCHAIR = 'WHEELCHAIR',
  MEDICAL = 'MEDICAL',
  VISUAL = 'VISUAL',
  HEARING = 'HEARING',
  SENIOR_SUPPORT = 'SENIOR_SUPPORT',
  FAMILY_ASSISTANCE = 'FAMILY_ASSISTANCE',
  EMERGENCY = 'EMERGENCY',
}

export enum BroadcastPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum BroadcastStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export enum ReportType {
  INCIDENT = 'INCIDENT',
  VOLUNTEER = 'VOLUNTEER',
  CROWD = 'CROWD',
  ACCESSIBILITY = 'ACCESSIBILITY',
  COMMUNICATION = 'COMMUNICATION',
  MEDICAL = 'MEDICAL',
  OPERATIONS = 'OPERATIONS',
}

export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}
