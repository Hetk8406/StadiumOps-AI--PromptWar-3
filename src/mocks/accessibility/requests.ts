import { AccessibilityRequest } from '../../domain/models';
import { AccessibilityCategory, AccessibilityRequestStatus, IncidentSeverity } from '../../domain/enums';
import { pickRandom, getRelativeTime } from '../utils';

/**
 * 25 Deterministic Accessibility Assistance Requests
 * Consumer: Accessibility Operations module.
 */

const NAMES = ['Emma Watson', 'James Miller', 'Sofia Rossi', 'Aiden Clark', 'Kenji Sato', 'Elena Rostova', 'Lucas Martinez', 'Li Wei'];
const EQUIPMENTS = ['Wheelchair WC-04', 'ALS Medical Kit', 'Golf Cart GC-02', 'Hearing Loop Headset', 'None'];

const CATEGORIES = [
  AccessibilityCategory.WHEELCHAIR,
  AccessibilityCategory.MEDICAL,
  AccessibilityCategory.VISUAL,
  AccessibilityCategory.HEARING,
  AccessibilityCategory.SENIOR_SUPPORT,
  AccessibilityCategory.FAMILY_ASSISTANCE,
];

const STATUSES = [
  AccessibilityRequestStatus.WAITING,
  AccessibilityRequestStatus.ASSIGNED,
  AccessibilityRequestStatus.IN_PROGRESS,
  AccessibilityRequestStatus.COMPLETED,
];

const SEVERITIES = [IncidentSeverity.CRITICAL, IncidentSeverity.HIGH, IncidentSeverity.MEDIUM, IncidentSeverity.LOW];
const ZONES = ['North Stand Section 102', 'South Stand Elevator Lobby', 'East Entrance Main Gate', 'VIP Entrance Corridor', 'Press Media Center', 'Parking Lot 1'];

export const accessibilityRequests: AccessibilityRequest[] = Array.from({ length: 25 }, (_, idx) => {
  const category = pickRandom(CATEGORIES);
  const priority = pickRandom(SEVERITIES);
  const status = pickRandom(STATUSES);
  const offset = -90 + idx * 3;

  return {
    id: `REQ-26-${(idx + 901).toString()}`,
    category,
    priority,
    status,
    zoneId: pickRandom(ZONES),
    visitorName: idx % 3 === 0 ? pickRandom(NAMES) : undefined,
    requestedAt: getRelativeTime(offset),
    assignedTeam: status !== AccessibilityRequestStatus.WAITING ? `A11y Squad-${(idx % 4) + 1}` : undefined,
    equipment: pickRandom(EQUIPMENTS),
    notes: idx % 2 === 0 ? 'Spectator requested priority fast-track entry.' : undefined,
  };
});
