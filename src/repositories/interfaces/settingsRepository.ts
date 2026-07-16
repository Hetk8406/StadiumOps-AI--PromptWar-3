export interface ISettings {
  general: {
    appName: string;
    version: string;
    environment: string;
    language: string;
    timezone: string;
  };
  appearance: {
    theme: string;
    fontSize: string;
    compactMode: boolean;
  };
  notifications: {
    incidentAlerts: boolean;
    volunteerAlerts: boolean;
    emergencyAlerts: boolean;
    transportAlerts: boolean;
    accessibilityAlerts: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReaderSupport: boolean;
  };
  operations: {
    defaultStadium: string;
    defaultMatch: string;
    priorityRules: string;
  };
  security: {
    authentication2FA: boolean;
    sessionTimeoutMinutes: number;
    encryptionProtocol: string;
  };
  integrations: {
    geminiStatus: string;
    googleTranslation: string;
    smsGateway: string;
  };
}

export interface ISettingsRepository {
  getSettings(): Promise<ISettings>;
}
