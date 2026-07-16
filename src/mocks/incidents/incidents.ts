import { Incident } from '../../domain/models';
import { IncidentSeverity, IncidentStatus } from '../../domain/enums';
import { randomInt, pickRandom, getRelativeTime } from '../utils';

/**
 * 30 Deterministic Incidents Logs
 * Consumer: Incident Monitoring module.
 */

const INCIDENT_TEMPLATES = [
  { title: 'Medical Assistance', desc: 'Spectator reported severe chest discomfort and dizziness near the main steps concourse.' },
  { title: 'Lost Child Support', desc: 'A child wearing an Argentina jersey separated from parents near Section 102 turnstile entrance.' },
  { title: 'Suspicious Package', desc: 'Abandoned backpack discovered under seat row 14 of North Stand east side.' },
  { title: 'Queue Congestion Gate D', desc: 'Heavy ingress bottleneck blocking elevator access corridors.' },
  { title: 'Gate C Malfunction', desc: 'Barcode reader failure blocking entry scanning for lane 4.' },
  { title: 'Equipment Dispatch', desc: 'Accessibility volunteer reports battery failure on transport cart GC-03.' },
  { title: 'Minor Slip Injury', desc: 'Fan slipped on spilt refreshment near Section 204 restroom entranceway.' },
  { title: 'Crowd Overflow VIP Block', desc: 'Unauthorized group attempting ticket bypass access at VIP concourse.' },
];

const SEVERITIES = [IncidentSeverity.CRITICAL, IncidentSeverity.HIGH, IncidentSeverity.MEDIUM, IncidentSeverity.LOW];
const STATUSES = [IncidentStatus.OPEN, IncidentStatus.INVESTIGATING, IncidentStatus.ASSIGNED, IncidentStatus.RESOLVED];
const ZONES = ['North Stand', 'South Stand', 'East Stand', 'West Stand', 'VIP Area', 'Parking Zone A', 'Fan Zone B'];
const TEAM_NAMES = ['Medical Squad A', 'Security Detail 4', 'Guest Relations Lead', 'Tech Support Team B', 'Response Detail 2'];

export const incidents: Incident[] = Array.from({ length: 30 }, (_, idx) => {
  const template = pickRandom(INCIDENT_TEMPLATES);
  const severity = pickRandom(SEVERITIES);
  const status = pickRandom(STATUSES);
  const offset = -120 + idx * 4; // Spanning over 2 hours ago to now

  return {
    id: `INC-2026-${(idx + 100).toString()}`,
    title: `${template.title} #${idx + 1}`,
    description: template.desc,
    severity,
    status,
    zoneId: pickRandom(ZONES),
    reportedBy: `Steward-${randomInt(300, 499)}`,
    assignedTeam: status !== IncidentStatus.OPEN ? pickRandom(TEAM_NAMES) : undefined,
    reportedAt: getRelativeTime(offset),
    updatedAt: getRelativeTime(offset + 10),
    estimatedResponseTime: severity === IncidentSeverity.CRITICAL ? '2 min' : '8 min',
    resolvedAt: status === IncidentStatus.RESOLVED ? getRelativeTime(offset + 30) : undefined,
    notes: [`Steward logged reports. Checked queue telemetry.`],
    attachments: idx % 4 === 0 ? ['spectator-card.jpg'] : [],
  };
});
