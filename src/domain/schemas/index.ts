import { z } from 'zod';
import {
  IncidentSeverity,
  IncidentStatus,
  VolunteerStatus,
  VolunteerRole,
  AccessibilityCategory,
  AccessibilityRequestStatus,
  BroadcastPriority,
  BroadcastStatus,
  ReportType,
  NotificationType,
} from '../enums';

export const IncidentSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  severity: z.nativeEnum(IncidentSeverity),
  status: z.nativeEnum(IncidentStatus),
  zoneId: z.string(),
  gateId: z.string().optional(),
  reportedBy: z.string(),
  assignedTeam: z.string().optional(),
  reportedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  estimatedResponseTime: z.string().optional(),
  resolvedAt: z.string().datetime().optional(),
  attachments: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional(),
});

export const VolunteerSchema = z.object({
  id: z.string(),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  role: z.nativeEnum(VolunteerRole),
  languages: z.array(z.string()),
  status: z.nativeEnum(VolunteerStatus),
  currentZone: z.string(),
  currentAssignment: z.string().optional(),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Team Leader']),
  certifications: z.array(z.string()),
  contact: z.string(),
  availability: z.boolean(),
  rating: z.number().min(0).max(5).optional(),
});

export const AccessibilityRequestSchema = z.object({
  id: z.string(),
  category: z.nativeEnum(AccessibilityCategory),
  priority: z.nativeEnum(IncidentSeverity),
  status: z.nativeEnum(AccessibilityRequestStatus),
  zoneId: z.string(),
  visitorName: z.string().optional(),
  requestedAt: z.string().datetime(),
  assignedTeam: z.string().optional(),
  equipment: z.string().optional(),
  notes: z.string().optional(),
});

export const BroadcastSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(100),
  message: z.string().min(5).max(500),
  priority: z.nativeEnum(BroadcastPriority),
  audience: z.string(),
  languages: z.array(z.string()),
  status: z.nativeEnum(BroadcastStatus),
  createdAt: z.string().datetime(),
  scheduledAt: z.string().datetime().optional(),
  publishedAt: z.string().datetime().optional(),
});

export const MatchSchema = z.object({
  id: z.string(),
  homeTeam: z.string(),
  awayTeam: z.string(),
  stadium: z.string(),
  matchDate: z.string().datetime(),
  kickoffTime: z.string(),
  status: z.enum(['UPCOMING', 'LIVE', 'COMPLETED', 'DELAYED']),
  attendance: z.number().optional(),
});

export const NotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.nativeEnum(NotificationType),
  read: z.boolean(),
  createdAt: z.string().datetime(),
});

export const ReportSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.nativeEnum(ReportType),
  generatedAt: z.string().datetime(),
  generatedBy: z.string(),
  format: z.enum(['PDF', 'Excel', 'CSV', 'JSON']),
  status: z.enum(['Completed', 'Processing', 'Failed']),
});
