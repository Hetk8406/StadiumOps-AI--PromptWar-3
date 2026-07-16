import React, { useState, useEffect } from 'react';
import {
  SunMoon,
  Bell,
  Accessibility,
  Sliders,
  Shield,
  Layers,
  Info,
  Building,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useSettings } from '../../state';

/**
 * Settings and Preferences Management Page.
 * Integrates directly with useSettings() centralized state.
 */
export default function SettingsPage(): React.JSX.Element {
  const { settings, fetchSettings, updateTheme, updateLanguage } = useSettings();
  const [activeSection, setActiveSection] = useState<'general' | 'appearance' | 'notifications' | 'accessibility' | 'operations' | 'security' | 'integrations' | 'about'>('general');

  useEffect(() => {
    document.title = 'Console Settings - StadiumOps AI';
    fetchSettings();
  }, [fetchSettings]);

  const navItems = [
    { id: 'general', name: 'General Preferences', icon: Building },
    { id: 'appearance', name: 'Console Appearance', icon: SunMoon },
    { id: 'notifications', name: 'Operational Notifications', icon: Bell },
    { id: 'accessibility', name: 'Accessibility Aids', icon: Accessibility },
    { id: 'operations', name: 'Operations Defaults', icon: Sliders },
    { id: 'security', name: 'Security Checkpoints', icon: Shield },
    { id: 'integrations', name: 'Service Integrations', icon: Layers },
    { id: 'about', name: 'About Console', icon: Info },
  ] as const;

  const data = settings.data;

  if (settings.loading || !data) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto p-4 animate-pulse" aria-busy="true">
        <div className="h-16 bg-bg-panel border border-stadium-border rounded-md" />
        <div className="grid grid-cols-4 gap-6">
          <div className="h-60 bg-bg-panel border border-stadium-border rounded-md" />
          <div className="col-span-3 h-80 bg-bg-panel border border-stadium-border rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* PAGE HEADER */}
      <div className="border-b border-stadium-border pb-6">
        <h1 className="text-h1 font-bold tracking-tight text-text-primary">
          Console Settings
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Configure system preferences and operational defaults.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

        {/* SETTINGS SIDEBAR NAVIGATION */}
        <Card className="bg-bg-panel p-2 flex flex-col space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors focus:outline-none focus:ring-1 focus:ring-stadium-accent ${activeSection === item.id
                  ? 'bg-stadium-accent text-white font-bold'
                  : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </button>
          ))}
        </Card>

        {/* SETTINGS PANELS */}
        <div className="md:col-span-3 space-y-6">

          {/* 1. GENERAL */}
          {activeSection === 'general' && (
            <Card className="bg-bg-panel space-y-4">
              <CardHeader className="border-b border-stadium-border pb-3">
                <CardTitle>General Preferences</CardTitle>
              </CardHeader>

              <div className="space-y-4 text-xs text-text-secondary max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-muted font-bold uppercase tracking-wider mb-1.5">Application Name</label>
                    <input type="text" readOnly value={data.general.appName} className="w-full bg-bg-secondary text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-text-muted font-bold uppercase tracking-wider mb-1.5">Console Version</label>
                    <input type="text" readOnly value={data.general.version} className="w-full bg-bg-secondary text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-text-muted font-bold uppercase tracking-wider mb-1.5">Operational Environment</label>
                  <input type="text" readOnly value={data.general.environment} className="w-full bg-bg-secondary text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-muted font-bold uppercase tracking-wider mb-1.5">Primary Language</label>
                    <select
                      value={data.general.language}
                      onChange={(e) => updateLanguage(e.target.value)}
                      className="w-full bg-bg-secondary text-text-primary border border-stadium-border rounded px-3 py-2"
                    >
                      <option value="English (US)">English (US)</option>
                      <option value="Español">Español</option>
                      <option value="Français">Français</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-text-muted font-bold uppercase tracking-wider mb-1.5">Timezone Offset</label>
                    <input type="text" readOnly value={data.general.timezone} className="w-full bg-bg-secondary text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none" />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* 2. APPEARANCE */}
          {activeSection === 'appearance' && (
            <Card className="bg-bg-panel space-y-4">
              <CardHeader className="border-b border-stadium-border pb-3">
                <CardTitle>Console Appearance</CardTitle>
              </CardHeader>
              <div className="space-y-4 text-xs text-text-secondary">
                <div className="space-y-2">
                  <span className="block font-bold text-text-muted uppercase tracking-wider">Console Color Theme</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div
                      onClick={() => updateTheme('dark')}
                      className={`p-3 bg-bg-secondary border rounded text-center font-bold cursor-pointer ${data.appearance.theme === 'dark' ? 'border-stadium-accent text-text-primary' : 'border-stadium-border text-text-muted'
                        }`}
                    >
                      Dark Mode (Default)
                    </div>
                    <div
                      onClick={() => updateTheme('light')}
                      className={`p-3 bg-bg-secondary border rounded text-center cursor-pointer ${data.appearance.theme === 'light' ? 'border-stadium-accent text-text-primary' : 'border-stadium-border text-text-muted'
                        }`}
                    >
                      Light Mode
                    </div>
                    <div
                      onClick={() => updateTheme('high-contrast')}
                      className={`p-3 bg-bg-secondary border rounded text-center cursor-pointer ${data.appearance.theme === 'high-contrast' ? 'border-stadium-accent text-text-primary' : 'border-stadium-border text-text-muted'
                        }`}
                    >
                      High Contrast Mode
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* 3. NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <Card className="bg-bg-panel space-y-4">
              <CardHeader className="border-b border-stadium-border pb-3">
                <CardTitle>Operational Alerts & Notifications</CardTitle>
              </CardHeader>
              <div className="space-y-3 text-xs text-text-secondary">
                <div className="flex items-center justify-between p-2.5 bg-bg-secondary border border-stadium-border rounded">
                  <div>
                    <strong className="text-text-primary block">Critical Security Alerts</strong>
                    <span className="text-[10px] text-text-muted">Sound sirens and flash red console borders on CRITICAL incidents.</span>
                  </div>
                  <input type="checkbox" defaultChecked={data.notifications.incidentAlerts} disabled className="w-4 h-4 cursor-not-allowed" />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-bg-secondary border border-stadium-border rounded">
                  <div>
                    <strong className="text-text-primary block">Volunteer Shift Broadcasts</strong>
                    <span className="text-[10px] text-text-muted">Send push updates to on-duty stewards on dispatch assignments.</span>
                  </div>
                  <input type="checkbox" defaultChecked={data.notifications.volunteerAlerts} disabled className="w-4 h-4 cursor-not-allowed" />
                </div>
              </div>
            </Card>
          )}

          {/* 6. SECURITY */}
          {activeSection === 'security' && (
            <Card className="bg-bg-panel space-y-4">
              <CardHeader className="border-b border-stadium-border pb-3">
                <CardTitle>Console Security Protocols</CardTitle>
              </CardHeader>
              <div className="space-y-3 text-xs text-text-secondary">
                <div className="flex justify-between items-center p-2.5 bg-bg-secondary border border-stadium-border rounded">
                  <span className="font-semibold text-text-primary">Two-Factor Authentication</span>
                  <Badge variant="success">{data.security.authentication2FA ? 'ENABLED' : 'DISABLED'}</Badge>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-bg-secondary border border-stadium-border rounded">
                  <span className="font-semibold text-text-primary">Console Session Timeout</span>
                  <span className="font-bold text-text-muted">{data.security.sessionTimeoutMinutes} Minutes</span>
                </div>
              </div>
            </Card>
          )}

          {/* 7. INTEGRATIONS */}
          {activeSection === 'integrations' && (
            <Card className="bg-bg-panel space-y-4">
              <CardHeader className="border-b border-stadium-border pb-3">
                <CardTitle>Telemetry Integrations Hub</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-secondary">
                <div className="p-3 bg-bg-secondary border border-stadium-border rounded flex items-center justify-between">
                  <div>
                    <strong className="text-text-primary block">Gemini Decision Support</strong>
                    <span className="text-[10px] text-text-muted">AI triage advisory recommendations</span>
                  </div>
                  <Badge variant="warning">{data.integrations.geminiStatus}</Badge>
                </div>
              </div>
            </Card>
          )}

          {/* 8. ABOUT */}
          {activeSection === 'about' && (
            <Card className="bg-bg-panel space-y-4">
              <CardHeader className="border-b border-stadium-border pb-3">
                <CardTitle>About StadiumOps Console</CardTitle>
              </CardHeader>
              <div className="space-y-3 text-xs text-text-secondary">
                <p className="leading-relaxed">
                  Developed for the Hack2Skill × Google PromptWars Virtual Challenge 3. This command center coordinates telemetry lines for stadium security detail, multilingual translation channels, and crowd flow load-balancing units during the FIFA World Cup 2026.
                </p>
              </div>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
}
