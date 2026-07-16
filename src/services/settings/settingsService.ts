import { ISettingsRepository, ISettings } from '../../repositories/interfaces/settingsRepository';

/**
 * Console General Preferences Service
 */
export class SettingsService {
  constructor(private settingsRepo: ISettingsRepository) {}

  async getSystemSettings(): Promise<ISettings> {
    return this.settingsRepo.getSettings();
  }
}
