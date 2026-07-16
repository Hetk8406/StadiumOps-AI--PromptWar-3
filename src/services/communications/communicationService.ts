import { ICommunicationRepository } from '../../repositories/interfaces/communicationRepository';
import { Broadcast } from '../../domain/models';
import { BroadcastPriority } from '../../domain/enums';

export interface CommunicationSummary {
  totalSent: number;
  criticalAlerts: number;
  priorityDistribution: Record<BroadcastPriority, number>;
}

/**
 * Announcement & Operational Broadcast Service
 */
export class CommunicationService {
  constructor(private commsRepo: ICommunicationRepository) {}

  async getAllBroadcasts(): Promise<Broadcast[]> {
    return this.commsRepo.getAll();
  }

  async getBroadcastSummary(): Promise<CommunicationSummary> {
    const list = await this.commsRepo.getAll();
    
    const criticalAlerts = list.filter((b) => b.priority === BroadcastPriority.CRITICAL).length;
    const distribution: Record<BroadcastPriority, number> = {
      [BroadcastPriority.LOW]: list.filter((b) => b.priority === BroadcastPriority.LOW).length,
      [BroadcastPriority.MEDIUM]: list.filter((b) => b.priority === BroadcastPriority.MEDIUM).length,
      [BroadcastPriority.HIGH]: list.filter((b) => b.priority === BroadcastPriority.HIGH).length,
      [BroadcastPriority.CRITICAL]: criticalAlerts,
    };

    return {
      totalSent: list.length,
      criticalAlerts,
      priorityDistribution: distribution,
    };
  }

  async filterAndSearchBroadcasts(query?: string, priority?: BroadcastPriority): Promise<Broadcast[]> {
    let list = await this.commsRepo.getAll();

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.message.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q)
      );
    }

    if (priority) {
      list = list.filter((b) => b.priority === priority);
    }

    return list;
  }
}
