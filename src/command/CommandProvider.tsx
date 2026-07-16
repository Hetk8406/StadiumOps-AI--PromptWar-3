/**
 * Command Provider
 * Registers all global application commands on mount.
 * Consumes react-router navigation and notification service.
 * Must be mounted inside the Router context.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  Activity,
  Radio,
  Accessibility,
  FileText,
  Settings,
  RefreshCw,
  Sparkles,
  Keyboard,
} from 'lucide-react';
import { registerCommand, unregisterCommand } from './commandRegistry';
import { ROUTES } from '../config/constants';
import { notify } from '../notifications/notificationService';

interface CommandProviderProps {
  readonly openPalette: () => void;
  readonly openHelp: () => void;
  readonly children: React.ReactNode;
}

export const CommandProvider: React.FC<CommandProviderProps> = ({ openPalette, openHelp, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const commands = [
      // ── Navigation ───────────────────────────────
      {
        id: 'nav.dashboard',
        label: 'Go to Dashboard',
        description: 'Open the Operations Command Center',
        category: 'navigation' as const,
        icon: LayoutDashboard,
        shortcut: { key: '1', modifiers: { alt: true }, label: 'Alt + 1' },
        execute: () => navigate(ROUTES.DASHBOARD),
      },
      {
        id: 'nav.incidents',
        label: 'Go to Incidents',
        description: 'Open Incident Monitoring module',
        category: 'navigation' as const,
        icon: AlertTriangle,
        shortcut: { key: '2', modifiers: { alt: true }, label: 'Alt + 2' },
        execute: () => navigate(ROUTES.INCIDENTS),
      },
      {
        id: 'nav.volunteers',
        label: 'Go to Volunteers',
        description: 'Open Volunteer Operations module',
        category: 'navigation' as const,
        icon: Users,
        shortcut: { key: '3', modifiers: { alt: true }, label: 'Alt + 3' },
        execute: () => navigate(ROUTES.VOLUNTEERS),
      },
      {
        id: 'nav.crowd',
        label: 'Go to Crowd Operations',
        description: 'Open Crowd Intelligence module',
        category: 'navigation' as const,
        icon: Activity,
        shortcut: { key: '4', modifiers: { alt: true }, label: 'Alt + 4' },
        execute: () => navigate(ROUTES.CROWD),
      },
      {
        id: 'nav.communications',
        label: 'Go to Communications',
        description: 'Open Multilingual Comms Hub',
        category: 'navigation' as const,
        icon: Radio,
        shortcut: { key: '5', modifiers: { alt: true }, label: 'Alt + 5' },
        execute: () => navigate(ROUTES.COMMUNICATIONS),
      },
      {
        id: 'nav.accessibility',
        label: 'Go to Accessibility',
        description: 'Open Accessibility Operations module',
        category: 'navigation' as const,
        icon: Accessibility,
        shortcut: { key: '6', modifiers: { alt: true }, label: 'Alt + 6' },
        execute: () => navigate(ROUTES.ACCESSIBILITY),
      },
      {
        id: 'nav.reports',
        label: 'Go to Reports',
        description: 'Open Incident Logs & Reports module',
        category: 'navigation' as const,
        icon: FileText,
        shortcut: { key: '7', modifiers: { alt: true }, label: 'Alt + 7' },
        execute: () => navigate('/reports'),
      },
      {
        id: 'nav.settings',
        label: 'Go to Settings',
        description: 'Open Console Settings',
        category: 'navigation' as const,
        icon: Settings,
        shortcut: { key: '8', modifiers: { alt: true }, label: 'Alt + 8' },
        execute: () => navigate(ROUTES.SETTINGS),
      },
      // ── Actions ──────────────────────────────────
      {
        id: 'action.refresh',
        label: 'Refresh Current View',
        description: 'Reload the active module data',
        category: 'actions' as const,
        icon: RefreshCw,
        shortcut: { key: 'r', modifiers: { alt: true }, label: 'Alt + R' },
        execute: () => {
          window.dispatchEvent(new CustomEvent('stadiumops:refresh'));
          notify.info('View Refreshed', 'Reloading current module data...');
        },
      },
      {
        id: 'action.command-palette',
        label: 'Open Command Palette',
        description: 'Search commands, navigation and AI tools',
        category: 'actions' as const,
        icon: Sparkles,
        shortcut: { key: 'k', modifiers: { ctrl: true }, label: 'Ctrl + K' },
        execute: openPalette,
        hidden: true,
      },
      {
        id: 'action.help',
        label: 'Keyboard Shortcuts Reference',
        description: 'View all available keyboard shortcuts',
        category: 'accessibility' as const,
        icon: Keyboard,
        shortcut: { key: '?', modifiers: { shift: true }, label: 'Shift + ?' },
        execute: openHelp,
      },
      // ── AI ───────────────────────────────────────
      {
        id: 'ai.dashboard-summary',
        label: 'Generate Executive Summary',
        description: 'Trigger Gemini AI Decision Support briefing on dashboard',
        category: 'ai' as const,
        icon: Sparkles,
        execute: () => {
          navigate(ROUTES.DASHBOARD);
          notify.ai('AI Briefing', 'Navigate to Dashboard and click Synthesize to generate your summary.');
        },
      },
    ];

    commands.forEach(registerCommand);
    return () => commands.forEach((c) => unregisterCommand(c.id));
  }, [navigate, openPalette, openHelp]);

  return <>{children}</>;
};
