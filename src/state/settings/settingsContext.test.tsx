// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { SettingsProvider, useSettings } from './settingsContext';

// Mock the settingsService
vi.mock('../../services', () => {
  return {
    settingsService: {
      getSystemSettings: vi.fn(() => Promise.resolve({
        general: { appName: 'StadiumOps AI', version: '1.0.0', environment: 'STAGING', language: 'English', timezone: 'UTC' },
        appearance: { theme: 'DARK', accessibilityOverlay: false, highContrastMode: false, fontSize: 'MEDIUM' }
      }))
    }
  };
});

import { settingsService } from '../../services';

const TestComponent = () => {
  const { settings, fetchSettings, updateTheme, updateLanguage } = useSettings();
  return (
    <div>
      <div data-testid="loading">{settings.loading ? 'loading' : 'idle'}</div>
      <div data-testid="theme">{settings.data?.appearance.theme || 'none'}</div>
      <div data-testid="lang">{settings.data?.general.language || 'none'}</div>
      <button onClick={() => fetchSettings()} data-testid="btn-fetch">Fetch</button>
      <button onClick={() => updateTheme('LIGHT')} data-testid="btn-update-theme">Update Theme</button>
      <button onClick={() => updateLanguage('Spanish')} data-testid="btn-update-lang">Update Lang</button>
    </div>
  );
};

describe('useSettings Context and Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('provides default settings context values', () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    expect(screen.getByTestId('loading').textContent).toBe('idle');
    expect(screen.getByTestId('theme').textContent).toBe('none');
    expect(screen.getByTestId('lang').textContent).toBe('none');
  });

  it('fetches settings successfully', async () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-fetch'));
    });

    expect(settingsService.getSystemSettings).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('theme').textContent).toBe('DARK');
    expect(screen.getByTestId('lang').textContent).toBe('English');
  });

  it('updates theme and language in state', async () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    // Initial fetch to load data
    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-fetch'));
    });

    // Update theme
    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-update-theme'));
    });
    expect(screen.getByTestId('theme').textContent).toBe('LIGHT');

    // Update language
    await act(async () => {
      fireEvent.click(screen.getByTestId('btn-update-lang'));
    });
    expect(screen.getByTestId('lang').textContent).toBe('Spanish');
  });

  it('throws error when used outside of SettingsProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<TestComponent />)).toThrow('useSettings must be used within a SettingsProvider');
    
    consoleError.mockRestore();
  });
});
