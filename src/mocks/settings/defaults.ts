/**
 * Default System Configurations
 * Consumer: Settings module.
 */

export const settingsDefaults = {
  general: {
    appName: 'StadiumOps AI',
    version: '1.0.0',
    environment: 'PROD-SIMULATOR (MetLife Stadium, NJ)',
    language: 'English (US)',
    timezone: 'UTC -04:00 (Eastern Time)',
  },
  appearance: {
    theme: 'dark', // 'light' | 'dark' | 'high-contrast'
    fontSize: 'Standard (14px base)',
    compactMode: true,
  },
  notifications: {
    incidentAlerts: true,
    volunteerAlerts: true,
    emergencyAlerts: true,
    transportAlerts: true,
    accessibilityAlerts: true,
  },
  accessibility: {
    highContrast: false,
    reducedMotion: true,
    screenReaderSupport: true,
  },
  operations: {
    defaultStadium: 'MetLife Stadium',
    defaultMatch: 'Argentina vs Germany',
    priorityRules: 'Standard FIFA Guidelines',
  },
  security: {
    authentication2FA: true,
    sessionTimeoutMinutes: 30,
    encryptionProtocol: 'AES-256 GCM',
  },
  integrations: {
    geminiStatus: 'STANDBY',
    googleTranslation: 'CONNECTED',
    smsGateway: 'CONNECTED',
  },
};
