import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AsyncState, createInitialAsyncState } from '../shared/asyncState';
import { ISettings } from '../../repositories/interfaces/settingsRepository';
import { settingsService } from '../../services';

interface SettingsState {
  settings: AsyncState<ISettings>;
}

type SettingsAction =
  | { type: 'START_FETCH_SETTINGS' }
  | { type: 'FETCH_SETTINGS_SUCCESS'; payload: ISettings }
  | { type: 'FETCH_SETTINGS_FAILURE'; payload: string }
  | { type: 'UPDATE_THEME'; payload: string }
  | { type: 'UPDATE_LANGUAGE'; payload: string };

const initialState: SettingsState = {
  settings: createInitialAsyncState<ISettings>(),
};

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'START_FETCH_SETTINGS':
      return { ...state, settings: { ...state.settings, loading: true, error: null } };
    case 'FETCH_SETTINGS_SUCCESS':
      return { ...state, settings: { data: action.payload, loading: false, error: null } };
    case 'FETCH_SETTINGS_FAILURE':
      return { ...state, settings: { data: null, loading: false, error: action.payload } };
    case 'UPDATE_THEME':
      if (!state.settings.data) return state;
      return {
        ...state,
        settings: {
          ...state.settings,
          data: {
            ...state.settings.data,
            appearance: { ...state.settings.data.appearance, theme: action.payload },
          },
        },
      };
    case 'UPDATE_LANGUAGE':
      if (!state.settings.data) return state;
      return {
        ...state,
        settings: {
          ...state.settings,
          data: {
            ...state.settings.data,
            general: { ...state.settings.data.general, language: action.payload },
          },
        },
      };
    default:
      return state;
  }
}

interface SettingsContextProps extends SettingsState {
  fetchSettings: () => Promise<void>;
  updateTheme: (theme: string) => void;
  updateLanguage: (language: string) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  const fetchSettings = useCallback(async () => {
    dispatch({ type: 'START_FETCH_SETTINGS' });
    try {
      const res = await settingsService.getSystemSettings();
      dispatch({ type: 'FETCH_SETTINGS_SUCCESS', payload: res });
    } catch (err: unknown) {
      dispatch({ type: 'FETCH_SETTINGS_FAILURE', payload: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, []);

  const updateTheme = useCallback((theme: string) => {
    dispatch({ type: 'UPDATE_THEME', payload: theme });
  }, []);

  const updateLanguage = useCallback((language: string) => {
    dispatch({ type: 'UPDATE_LANGUAGE', payload: language });
  }, []);

  return (
    <SettingsContext.Provider value={{ ...state, fetchSettings, updateTheme, updateLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextProps {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
