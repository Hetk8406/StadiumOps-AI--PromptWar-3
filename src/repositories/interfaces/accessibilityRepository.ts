import { AccessibilityRequest } from '../../domain/models';
import { AccessibilityCategory, AccessibilityRequestStatus } from '../../domain/enums';

export interface IAccessibilityRepository {
  getAllRequests(): Promise<AccessibilityRequest[]>;
  getRequestById(id: string): Promise<AccessibilityRequest | null>;
  getRequestsByStatus(status: AccessibilityRequestStatus): Promise<AccessibilityRequest[]>;
  getRequestsByCategory(category: AccessibilityCategory): Promise<AccessibilityRequest[]>;
}
