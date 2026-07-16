import { IAccessibilityRepository } from '../../repositories/interfaces/accessibilityRepository';
import { AccessibilityRequest } from '../../domain/models';
import { AccessibilityCategory, AccessibilityRequestStatus } from '../../domain/enums';

export interface AccessibilityMetrics {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  assistanceDistribution: Record<AccessibilityCategory, number>;
}

/**
 * Accessibility Assistance Orchestrator Service
 */
export class AccessibilityService {
  constructor(private accessRepo: IAccessibilityRepository) {}

  async getAllRequests(): Promise<AccessibilityRequest[]> {
    return this.accessRepo.getAllRequests();
  }

  async getRequestById(id: string): Promise<AccessibilityRequest | null> {
    return this.accessRepo.getRequestById(id);
  }

  async getAccessibilityMetrics(): Promise<AccessibilityMetrics> {
    const list = await this.accessRepo.getAllRequests();
    
    const pending = list.filter((r) => r.status === AccessibilityRequestStatus.WAITING || r.status === AccessibilityRequestStatus.ASSIGNED).length;
    const completed = list.filter((r) => r.status === AccessibilityRequestStatus.COMPLETED).length;

    const distribution: Record<AccessibilityCategory, number> = {
      [AccessibilityCategory.WHEELCHAIR]: list.filter((r) => r.category === AccessibilityCategory.WHEELCHAIR).length,
      [AccessibilityCategory.MEDICAL]: list.filter((r) => r.category === AccessibilityCategory.MEDICAL).length,
      [AccessibilityCategory.VISUAL]: list.filter((r) => r.category === AccessibilityCategory.VISUAL).length,
      [AccessibilityCategory.HEARING]: list.filter((r) => r.category === AccessibilityCategory.HEARING).length,
      [AccessibilityCategory.SENIOR_SUPPORT]: list.filter((r) => r.category === AccessibilityCategory.SENIOR_SUPPORT).length,
      [AccessibilityCategory.FAMILY_ASSISTANCE]: list.filter((r) => r.category === AccessibilityCategory.FAMILY_ASSISTANCE).length,
      [AccessibilityCategory.EMERGENCY]: list.filter((r) => r.category === AccessibilityCategory.EMERGENCY).length,
    };

    return {
      totalRequests: list.length,
      pendingRequests: pending,
      completedRequests: completed,
      assistanceDistribution: distribution,
    };
  }

  async filterRequests(query?: string, category?: AccessibilityCategory, status?: AccessibilityRequestStatus): Promise<AccessibilityRequest[]> {
    let list = await this.accessRepo.getAllRequests();

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.visitorName?.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.zoneId.toLowerCase().includes(q)
      );
    }

    if (category) {
      list = list.filter((r) => r.category === category);
    }

    if (status) {
      list = list.filter((r) => r.status === status);
    }

    return list;
  }
}
