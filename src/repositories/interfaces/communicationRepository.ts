import { Broadcast } from '../../domain/models';
import { BroadcastPriority } from '../../domain/enums';

export interface ICommunicationRepository {
  getAll(): Promise<Broadcast[]>;
  getById(id: string): Promise<Broadcast | null>;
  getByPriority(priority: BroadcastPriority): Promise<Broadcast[]>;
  search(query: string): Promise<Broadcast[]>;
}
