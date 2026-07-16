import { Volunteer } from '../../domain/models';
import { VolunteerRole, VolunteerStatus } from '../../domain/enums';
import { randomInt, pickRandom } from '../utils';

/**
 * 100 Deterministic Volunteer Profiles
 * Consumer: Volunteer Operations module.
 */

const ROLES = [
  VolunteerRole.SECURITY,
  VolunteerRole.MEDICAL,
  VolunteerRole.ACCESSIBILITY,
  VolunteerRole.TRANSPORT,
  VolunteerRole.INFORMATION,
  VolunteerRole.MEDIA,
  VolunteerRole.OPERATIONS,
];

const LANGUAGES = ['en', 'es', 'fr', 'pt', 'ar', 'de', 'ja', 'ko'];
const ZONES = ['North Stand', 'South Stand', 'East Stand', 'West Stand', 'VIP Area', 'Parking Zone A', 'Fan Zone B', 'Media Center'];
const CERTIFICATIONS = ['First Aid CPR', 'Crowd Management Core', 'Multilingual Guide Cert', 'Crisis Evacuation Triage', 'Accessibility Escort Certified'];
const FIRST_NAMES = ['Hetal', 'John', 'Sarah', 'Carlos', 'Yuki', 'Aisha', 'Pierre', 'Maria', 'Ahmed', 'Elena', 'Hiro', 'Fatima', 'Liam', 'Olivia', 'Noah', 'Emma', 'Jacob', 'Sophia'];
const LAST_NAMES = ['Patel', 'Smith', 'Tanaka', 'Rodriguez', 'Al-Sayed', 'Dubois', 'Silva', 'Müller', 'Kim', 'Ivanov', 'Sato', 'Chen', 'Johnson', 'Brown', 'Davis', 'Wilson'];

export const volunteers: Volunteer[] = Array.from({ length: 100 }, (_, idx) => {
  const role = pickRandom(ROLES);
  const status = pickRandom([VolunteerStatus.AVAILABLE, VolunteerStatus.ASSIGNED, VolunteerStatus.BUSY, VolunteerStatus.BREAK]);
  
  const langs = ['en'];
  if (idx % 3 === 0) langs.push(pickRandom(LANGUAGES));
  if (idx % 5 === 0) langs.push(pickRandom(LANGUAGES));

  const certs = [pickRandom(CERTIFICATIONS)];
  if (idx % 4 === 0) certs.push(pickRandom(CERTIFICATIONS));

  return {
    id: `VOL-2026-${(idx + 100).toString()}`,
    firstName: pickRandom(FIRST_NAMES),
    lastName: pickRandom(LAST_NAMES),
    role,
    languages: Array.from(new Set(langs)),
    status,
    currentZone: pickRandom(ZONES),
    currentAssignment: status === VolunteerStatus.ASSIGNED || status === VolunteerStatus.BUSY 
      ? `Duty allocation checkpoint ${(idx % 5) + 1}` 
      : undefined,
    experienceLevel: pickRandom(['Beginner', 'Intermediate', 'Advanced', 'Team Leader'] as const),
    certifications: Array.from(new Set(certs)),
    contact: `+1-555-${randomInt(100, 999)}-${randomInt(1000, 9990)}`,
    availability: status === VolunteerStatus.AVAILABLE,
    rating: Number((3.5 + (idx % 15) * 0.1).toFixed(1)),
  };
});
