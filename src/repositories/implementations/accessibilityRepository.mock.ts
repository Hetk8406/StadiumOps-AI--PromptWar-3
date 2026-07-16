import { IAccessibilityRepository } from '../interfaces/accessibilityRepository';
import { AccessibilityRequest } from '../../domain/models';
import { AccessibilityCategory, AccessibilityRequestStatus } from '../../domain/enums';
import { accessibilityRequests } from '../../mocks/accessibility/requests';

/**
 * Mock Accessibility Repository
 * Consumer: Accessibility Operations page.
 */
export class MockAccessibilityRepository implements IAccessibilityRepository {
  async getAllRequests(): Promise<AccessibilityRequest[]> {
    return accessibilityRequests;
  }

  async getRequestById(id: string): Promise<AccessibilityRequest | null> {
    const item = accessibilityRequests.find((req) => req.id === id);
    return item || null;
  }

  async getRequestsByStatus(status: AccessibilityRequestStatus): Promise<AccessibilityRequest[]> {
    return accessibilityRequests.filter((req) => req.status === status);
  }

  async getRequestsByCategory(category: AccessibilityCategory): Promise<AccessibilityRequest[]> {
    return accessibilityRequests.filter((req) => req.category === category);
  }
}
