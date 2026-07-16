import { StadiumZone, Gate, CrowdMetrics } from '../../domain/models';
import { CrowdStatus, GateStatus } from '../../domain/enums';
import { getRelativeTime } from '../utils';

/**
 * Crowd Monitoring Stadium Zones & Gates Telemetry Data
 * Consumer: Crowd Operations module.
 */

export const stadiumZones: StadiumZone[] = [
  { id: 'zone-north', name: 'North Stand', capacity: 22000, currentOccupancy: 17600, status: CrowdStatus.HIGH, priority: 2 },
  { id: 'zone-south', name: 'South Stand', capacity: 22000, currentOccupancy: 19800, status: CrowdStatus.CRITICAL, priority: 1 },
  { id: 'zone-east', name: 'East Stand', capacity: 18000, currentOccupancy: 11700, status: CrowdStatus.MODERATE, priority: 3 },
  { id: 'zone-west', name: 'West Stand', capacity: 18000, currentOccupancy: 9000, status: CrowdStatus.LOW, priority: 4 },
  { id: 'zone-vip', name: 'VIP Block A/B', capacity: 5000, currentOccupancy: 4100, status: CrowdStatus.HIGH, priority: 2 },
  { id: 'zone-parking', name: 'Parking Lot 1', capacity: 8000, currentOccupancy: 6400, status: CrowdStatus.MODERATE, priority: 3 },
  { id: 'zone-fanzone', name: 'Fan Festival Zone', capacity: 15000, currentOccupancy: 13500, status: CrowdStatus.HIGH, priority: 2 },
  { id: 'zone-media', name: 'Press Box', capacity: 2000, currentOccupancy: 1600, status: CrowdStatus.MODERATE, priority: 4 },
];

export const gates: Gate[] = [
  { id: 'gate-a', name: 'Gate A (Main North)', zoneId: 'zone-north', status: GateStatus.OPEN, queueLength: 42, occupancy: 82, estimatedWaitTime: 8 },
  { id: 'gate-b', name: 'Gate B (North East)', zoneId: 'zone-north', status: GateStatus.OPEN, queueLength: 24, occupancy: 65, estimatedWaitTime: 4 },
  { id: 'gate-c', name: 'Gate C (South Main)', zoneId: 'zone-south', status: GateStatus.RESTRICTED, queueLength: 85, occupancy: 95, estimatedWaitTime: 18 },
  { id: 'gate-d', name: 'Gate D (South East)', zoneId: 'zone-south', status: GateStatus.OPEN, queueLength: 38, occupancy: 78, estimatedWaitTime: 6 },
  { id: 'gate-e', name: 'Gate E (West VIP)', zoneId: 'zone-vip', status: GateStatus.OPEN, queueLength: 12, occupancy: 40, estimatedWaitTime: 2 },
  { id: 'gate-f', name: 'Gate F (Press Entrance)', zoneId: 'zone-media', status: GateStatus.OPEN, queueLength: 8, occupancy: 55, estimatedWaitTime: 3 },
];

export const crowdMetricsList: CrowdMetrics[] = stadiumZones.map((z, idx) => ({
  id: `metrics-${idx + 100}`,
  zoneId: z.id,
  density: Math.round((z.currentOccupancy / z.capacity) * 100),
  occupancy: z.currentOccupancy,
  trend: idx % 3 === 0 ? 'INCREASING' : idx % 3 === 1 ? 'DECREASING' : 'STABLE',
  lastUpdated: getRelativeTime(-5),
}));
