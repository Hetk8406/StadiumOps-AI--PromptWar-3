import { ICommunicationRepository } from '../interfaces/communicationRepository';
import { Broadcast } from '../../domain/models';
import { BroadcastPriority } from '../../domain/enums';
import { communications } from '../../mocks/communications/communications';

/**
 * Mock Communication Repository
 * Consumer: Communications page.
 */
export class MockCommunicationRepository implements ICommunicationRepository {
  async getAll(): Promise<Broadcast[]> {
    return communications;
  }

  async getById(id: string): Promise<Broadcast | null> {
    const item = communications.find((c) => c.id === id);
    return item || null;
  }

  async getByPriority(priority: BroadcastPriority): Promise<Broadcast[]> {
    return communications.filter((c) => c.priority === priority);
  }

  async search(query: string): Promise<Broadcast[]> {
    const q = query.toLowerCase();
    return communications.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }
}
