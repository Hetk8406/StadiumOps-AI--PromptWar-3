export interface Volunteer {
  id: string;
  name: string;
  languages: string[]; // ISO codes like 'en', 'es'
  currentZoneId: string;
  status: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY';
  activeWorkloadCount: number;
  contactNumber: string;
  skills: string[]; // e.g. 'First Aid', 'Translation'
}
