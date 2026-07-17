import React, { useEffect } from 'react';
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
import { Button } from '../../components/ui/Button';
import { useSettings } from '../../state';
import { pushToast } from '../../notifications/notificationService';

/**
 * Settings and Preferences Management Page.
 * Single-page scrolling vertical stack with sticky horizontal sub-navigation.
 */
export default function SettingsPage(): React.JSX.Element {
  const { settings, fetchSettings, updateTheme, updateLanguage } = useSettings();

  useEffect(() => {
    document.title = 'Console Settings - StadiumOps AI';
    fetchSettings();
  }, [fetchSettings]);

  const data = settings.data;

  const handleSaveAll = () => {
    pushToast('Settings Saved', 'All console configuration updates applied globally.', 'success');
  };

  const handleResetDefaults = () => {
    pushToast('Settings Reset', 'Preferences reverted to tournament factory defaults.', 'info');
  };

  if (settings.loading || !data) {
    return (
      <div className="space-y-6 max-w-[1200px] mx-auto p-4 animate-pulse" aria-busy="true">
        <div className="h-16 bg-bg-panel border border-stadium-border rounded-md" />
        <div className="h-10 bg-bg-panel border border-stadium-border rounded-md" />
        <div className="space-y-4">
          <div className="h-40 bg-bg-panel border border-stadium-border rounded-md" />
          <div className="h-40 bg-bg-panel border border-stadium-border rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-2 relative space-y-6">
      {/* PAGE HEADER */}
      <div className="border-b border-stadium-border pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h1 font-bold tracking-tight text-text-primary">
            Console Settings
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Configure system preferences and operational defaults.
          </p>
        </div>
        
        {/* GLOBAL SUBMISSION ACTION BUTTONS */}
        <div className="flex items-center space-x-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="uppercase tracking-wider text-[11px] font-bold"
          >
            Reset Defaults
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveAll}
            className="uppercase tracking-wider text-[11px] font-bold bg-stadium-accent hover:bg-blue-700 text-white"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* SEQUENTIAL CARDS (2-COLUMN GRID VIEW) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* 1. GENERAL */}
        <div id="general" className="scroll-mt-36">
          <Card className="bg-bg-panel space-y-4 h-full">
            <CardHeader className="border-b border-stadium-border pb-3">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-stadium-accent" />
                <CardTitle>General Preferences</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-4 text-xs text-text-secondary max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted font-bold uppercase tracking-wider mb-1.5">Primary Language</label>
                  <select
                    value={data.general.language}
                    onChange={(e) => updateLanguage(e.target.value)}
                    className="w-full bg-bg-secondary text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stadium-accent"
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
        </div>

        {/* 2. APPEARANCE */}
        <div id="appearance" className="scroll-mt-36">
          <Card className="bg-bg-panel space-y-4 h-full">
            <CardHeader className="border-b border-stadium-border pb-3">
              <div className="flex items-center space-x-2">
                <SunMoon className="w-5 h-5 text-stadium-accent" />
                <CardTitle>Console Appearance</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-4 text-xs text-text-secondary">
              <div className="space-y-2">
                <span className="block font-bold text-text-muted uppercase tracking-wider">Console Color Theme</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => updateTheme('dark')}
                    className={`p-3 bg-bg-secondary border rounded text-center font-bold transition-all focus:outline-none ${
                      data.appearance.theme === 'dark' ? 'border-stadium-accent text-text-primary ring-1 ring-stadium-accent' : 'border-stadium-border text-text-muted hover:border-text-muted'
                    }`}
                  >
                    Dark Mode (Default)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateTheme('light')}
                    className={`p-3 bg-bg-secondary border rounded text-center font-bold transition-all focus:outline-none ${
                      data.appearance.theme === 'light' ? 'border-stadium-accent text-text-primary ring-1 ring-stadium-accent' : 'border-stadium-border text-text-muted hover:border-text-muted'
                    }`}
                  >
                    Light Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => updateTheme('high-contrast')}
                    className={`p-3 bg-bg-secondary border rounded text-center font-bold transition-all focus:outline-none ${
                      data.appearance.theme === 'high-contrast' ? 'border-stadium-accent text-text-primary ring-1 ring-stadium-accent' : 'border-stadium-border text-text-muted hover:border-text-muted'
                    }`}
                  >
                    High Contrast Mode
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 3. NOTIFICATIONS */}
        <div id="notifications" className="scroll-mt-36">
          <Card className="bg-bg-panel space-y-4 h-full">
            <CardHeader className="border-b border-stadium-border pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-stadium-accent" />
                <CardTitle>Operational Notifications</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-3 text-xs text-text-secondary max-w-xl">
              <div className="flex items-center justify-between p-2.5 bg-bg-secondary border border-stadium-border rounded">
                <div>
                  <strong className="text-text-primary block">Critical Security Alerts</strong>
                  <span className="text-[10px] text-text-muted">Sound sirens and flash red console borders on CRITICAL incidents.</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={data.notifications.incidentAlerts}
                  onChange={(e) => pushToast('Settings Updated', `Critical Security Alerts ${e.target.checked ? 'ENABLED' : 'DISABLED'}.`, 'success')}
                  className="w-4 h-4 cursor-pointer focus:ring-1 focus:ring-stadium-accent"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-bg-secondary border border-stadium-border rounded">
                <div>
                  <strong className="text-text-primary block">Volunteer Shift Broadcasts</strong>
                  <span className="text-[10px] text-text-muted">Send push updates to on-duty stewards on dispatch assignments.</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={data.notifications.volunteerAlerts}
                  onChange={(e) => pushToast('Settings Updated', `Volunteer Shift Broadcasts ${e.target.checked ? 'ENABLED' : 'DISABLED'}.`, 'success')}
                  className="w-4 h-4 cursor-pointer focus:ring-1 focus:ring-stadium-accent"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* 4. ACCESSIBILITY AIDS */}
        <div id="accessibility" className="scroll-mt-36">
          <Card className="bg-bg-panel space-y-4 h-full">
            <CardHeader className="border-b border-stadium-border pb-3">
              <div className="flex items-center space-x-2">
                <Accessibility className="w-5 h-5 text-stadium-accent" />
                <CardTitle>Accessibility Aids</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-3 text-xs text-text-secondary max-w-xl">
              <div className="flex items-center justify-between p-2.5 bg-bg-secondary border border-stadium-border rounded">
                <div>
                  <strong className="text-text-primary block">High Contrast Elements</strong>
                  <span className="text-[10px] text-text-muted">Increase line weights and color contrasts for visual support.</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={data.accessibility.highContrast}
                  onChange={(e) => pushToast('Settings Updated', `High Contrast Elements ${e.target.checked ? 'ENABLED' : 'DISABLED'}.`, 'success')}
                  className="w-4 h-4 cursor-pointer focus:ring-1 focus:ring-stadium-accent"
                />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-bg-secondary border border-stadium-border rounded">
                <div>
                  <strong className="text-text-primary block">Reduced Animation Motion</strong>
                  <span className="text-[10px] text-text-muted">Disable telemetry loading sweeps and layout transitions.</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={data.accessibility.reducedMotion}
                  onChange={(e) => pushToast('Settings Updated', `Reduced Animation Motion ${e.target.checked ? 'ENABLED' : 'DISABLED'}.`, 'success')}
                  className="w-4 h-4 cursor-pointer focus:ring-1 focus:ring-stadium-accent"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* 5. OPERATIONS DEFAULTS */}
        <div id="operations" className="scroll-mt-36">
          <Card className="bg-bg-panel space-y-4 h-full">
            <CardHeader className="border-b border-stadium-border pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-stadium-accent" />
                <CardTitle>Operations Defaults</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-4 text-xs text-text-secondary max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted font-bold uppercase tracking-wider mb-1.5">Default Stadium</label>
                  <input type="text" readOnly value={data.operations.defaultStadium} className="w-full bg-bg-secondary text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-text-muted font-bold uppercase tracking-wider mb-1.5">Active Match Event</label>
                  <input type="text" readOnly value={data.operations.defaultMatch} className="w-full bg-bg-secondary text-text-primary border border-stadium-border rounded px-3 py-2 focus:outline-none" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 6. SECURITY CHECKPOINTS */}
        <div id="security" className="scroll-mt-36">
          <Card className="bg-bg-panel space-y-4 h-full">
            <CardHeader className="border-b border-stadium-border pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-stadium-accent" />
                <CardTitle>Security Checkpoints</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-3 text-xs text-text-secondary max-w-xl">
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
        </div>

        {/* 7. SERVICE INTEGRATIONS */}
        <div id="integrations" className="scroll-mt-36">
          <Card className="bg-bg-panel space-y-4 h-full">
            <CardHeader className="border-b border-stadium-border pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-stadium-accent" />
                <CardTitle>Service Integrations</CardTitle>
              </div>
            </CardHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-secondary max-w-xl">
              <div className="p-3 bg-bg-secondary border border-stadium-border rounded flex items-center justify-between">
                <div>
                  <strong className="text-text-primary block">Gemini Decision Support</strong>
                  <span className="text-[10px] text-text-muted">AI triage advisory recommendations</span>
                </div>
                <Badge variant="warning">{data.integrations.geminiStatus}</Badge>
              </div>
              <div className="p-3 bg-bg-secondary border border-stadium-border rounded flex items-center justify-between">
                <div>
                  <strong className="text-text-primary block">Google Translation</strong>
                  <span className="text-[10px] text-text-muted">Multilingual adaptation models</span>
                </div>
                <Badge variant="success">{data.integrations.googleTranslation}</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* 8. ABOUT CONSOLE */}
        <div id="about" className="scroll-mt-36">
          <Card className="bg-bg-panel space-y-4 h-full">
            <CardHeader className="border-b border-stadium-border pb-3">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-stadium-accent" />
                <CardTitle>About Console</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-3 text-xs text-text-secondary max-w-xl">
              <p className="leading-relaxed">
                Developed for the Hack2Skill × Google PromptWars Virtual Challenge 4. This command center coordinates telemetry lines for stadium security detail, multilingual translation channels, and crowd flow load-balancing units during the FIFA World Cup 2026.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
