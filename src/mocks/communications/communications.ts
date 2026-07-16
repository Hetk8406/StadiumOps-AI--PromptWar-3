import { Broadcast } from '../../domain/models';
import { BroadcastPriority, BroadcastStatus } from '../../domain/enums';
import { pickRandom, getRelativeTime } from '../utils';

/**
 * 45 Deterministic Communications Records
 * Consumer: Communications Center module.
 */

const TEMPLATES = [
  { title: 'Security Advisory', msg: 'Gate C temporarily closed due to ingress load. Spectators redirected to East Stand entry gates.' },
  { title: 'Medical Reminder', msg: 'First Aid responders are active near Concourse South 202. Stay hydrated during high temperatures.' },
  { title: 'Transit Update', msg: 'Metro Train delays reported at Central Station. Shuttle buses boarding now outside gate A.' },
  { title: 'Severe Rain Forecast', msg: 'Rain expected. Canopy roof is fully active. Spectators advised to keep seats.' },
  { title: 'Lost Item Claim', msg: 'Lost item retrieval point relocated to Info Kiosk Gate E.' },
  { title: 'Volunteer Assignment', msg: 'All Stand stewards report to team leaders for post-match egress briefing.' },
];

const AUDIENCES = ['All Visitors', 'All Stewards', 'Medical Personnel', 'Public Fan Zone', 'Transit Commuters', 'Volunteer Teams'];
const LANGUAGES = [['en'], ['en', 'es'], ['en', 'es', 'fr'], ['en', 'ar']];

export const communications: Broadcast[] = Array.from({ length: 45 }, (_, idx) => {
  const template = pickRandom(TEMPLATES);
  const priority = pickRandom([BroadcastPriority.CRITICAL, BroadcastPriority.HIGH, BroadcastPriority.MEDIUM, BroadcastPriority.LOW]);
  const status = pickRandom([BroadcastStatus.DRAFT, BroadcastStatus.SCHEDULED, BroadcastStatus.SENT, BroadcastStatus.DELIVERED]);
  const offset = -180 + idx * 4;

  return {
    id: `BC-2026-${(idx + 100).toString()}`,
    title: `${template.title} #${idx + 1}`,
    message: template.msg,
    priority,
    audience: pickRandom(AUDIENCES),
    languages: pickRandom(LANGUAGES),
    status,
    createdAt: getRelativeTime(offset),
    scheduledAt: status === BroadcastStatus.SCHEDULED ? getRelativeTime(offset + 10) : undefined,
    publishedAt: status === BroadcastStatus.SENT || status === BroadcastStatus.DELIVERED ? getRelativeTime(offset + 5) : undefined,
  };
});
