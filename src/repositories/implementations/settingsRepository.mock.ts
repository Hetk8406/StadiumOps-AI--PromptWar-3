import { ISettingsRepository, ISettings } from '../interfaces/settingsRepository';
import { settingsDefaults } from '../../mocks/settings/defaults';

/**
 * Mock Settings Repository
 * Consumer: Settings page.
 */
export class MockSettingsRepository implements ISettingsRepository {
  async getSettings(): Promise<ISettings> {
    return settingsDefaults;
  }
}
