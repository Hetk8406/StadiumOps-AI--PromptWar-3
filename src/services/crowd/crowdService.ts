import { ICrowdRepository } from '../../repositories/interfaces/crowdRepository';
import { StadiumZone, Gate, CrowdMetrics } from '../../domain/models';
import { calculatePercentage, calculateAverage } from '../shared/serviceUtils';

export interface CrowdSummary {
  overallOccupancyRate: number;
  averageWaitTimeMinutes: number;
  criticalGatesCount: number;
  highestRiskZone: string;
}

/**
 * Crowd Density Metrics Service
 */
export class CrowdService {
  constructor(private crowdRepo: ICrowdRepository) {}

  async getStadiumZones(): Promise<StadiumZone[]> {
    return this.crowdRepo.getAllZones();
  }

  async getGates(): Promise<Gate[]> {
    return this.crowdRepo.getAllGates();
  }

  async getCrowdMetrics(): Promise<CrowdMetrics[]> {
    return this.crowdRepo.getMetrics();
  }

  async getCrowdSummary(): Promise<CrowdSummary> {
    const zones = await this.crowdRepo.getAllZones();
    const gatesList = await this.crowdRepo.getAllGates();

    const totalCapacity = zones.reduce((acc, z) => acc + z.capacity, 0);
    const totalOccupancy = zones.reduce((acc, z) => acc + z.currentOccupancy, 0);
    const overallOccupancyRate = calculatePercentage(totalOccupancy, totalCapacity);

    const waitTimes = gatesList.map((g) => g.estimatedWaitTime);
    const averageWaitTimeMinutes = calculateAverage(waitTimes);

    const criticalGatesCount = gatesList.filter((g) => g.occupancy > 90).length;

    // Find highest risk zone based on density percentage
    let highestRiskZone = 'None';
    let maxDensity = 0;
    zones.forEach((z) => {
      const density = calculatePercentage(z.currentOccupancy, z.capacity);
      if (density > maxDensity) {
        maxDensity = density;
        highestRiskZone = z.name;
      }
    });

    return {
      overallOccupancyRate,
      averageWaitTimeMinutes,
      criticalGatesCount,
      highestRiskZone,
    };
  }
}
