import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { pingAIService } from '../services/aiService';
import { getApiKey } from '../config/aiConfig';
import type { AIConnectionStatus, AIFeatureStatus } from '../shared/aiTypes';

/**
 * AI Provider
 * Manages AI availability state independently of all domain state providers.
 * Exposes connection status, readiness flag, and error messages to the UI layer.
 * Does NOT own any domain data — only AI infrastructure status.
 */

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface AIProviderState {
  readonly status: AIConnectionStatus;
  readonly available: boolean;
  readonly lastCheckAt: string | null;
  readonly errorMessage: string | null;
  readonly apiKeyPresent: boolean;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type AIProviderAction =
  | { type: 'SET_INITIALIZING' }
  | { type: 'SET_ONLINE'; payload: string }
  | { type: 'SET_OFFLINE'; payload: { message: string; checkAt: string } }
  | { type: 'SET_DEGRADED'; payload: { message: string; checkAt: string } };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function aiProviderReducer(state: AIProviderState, action: AIProviderAction): AIProviderState {
  switch (action.type) {
    case 'SET_INITIALIZING':
      return { ...state, status: 'INITIALIZING', available: false, errorMessage: null };
    case 'SET_ONLINE':
      return {
        ...state,
        status: 'ONLINE',
        available: true,
        lastCheckAt: action.payload,
        errorMessage: null,
      };
    case 'SET_OFFLINE':
      return {
        ...state,
        status: 'OFFLINE',
        available: false,
        lastCheckAt: action.payload.checkAt,
        errorMessage: action.payload.message,
      };
    case 'SET_DEGRADED':
      return {
        ...state,
        status: 'DEGRADED',
        available: false,
        lastCheckAt: action.payload.checkAt,
        errorMessage: action.payload.message,
      };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface AIProviderContextValue extends AIProviderState {
  readonly featureStatus: AIFeatureStatus;
  recheckAI: () => Promise<void>;
}

const AIProviderContext = createContext<AIProviderContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const apiKeyPresent = Boolean(getApiKey());

  const [state, dispatch] = useReducer(aiProviderReducer, {
    status: 'INITIALIZING',
    available: false,
    lastCheckAt: null,
    errorMessage: null,
    apiKeyPresent,
  });

  const recheckAI = useCallback(async (): Promise<void> => {
    if (!apiKeyPresent) {
      dispatch({
        type: 'SET_OFFLINE',
        payload: { message: 'VITE_GEMINI_API_KEY not configured.', checkAt: new Date().toISOString() },
      });
      return;
    }

    dispatch({ type: 'SET_INITIALIZING' });
    try {
      const reachable = await pingAIService();
      const now = new Date().toISOString();
      if (reachable) {
        dispatch({ type: 'SET_ONLINE', payload: now });
      } else {
        dispatch({
          type: 'SET_DEGRADED',
          payload: { message: 'AI health check returned an unexpected response.', checkAt: now },
        });
      }
    } catch {
      dispatch({
        type: 'SET_OFFLINE',
        payload: { message: 'Unable to reach the Gemini API.', checkAt: new Date().toISOString() },
      });
    }
  }, [apiKeyPresent]);

  // Run initial check on mount (gracefully skipped if no API key in dev)
  useEffect(() => {
    recheckAI().catch(() => {
      /* silently degrade */
    });
  }, [recheckAI]);

  const featureStatus: AIFeatureStatus = {
    available: state.available,
    status: state.status,
    lastCheckAt: state.lastCheckAt ?? new Date().toISOString(),
    message: state.errorMessage ?? undefined,
  };

  return (
    <AIProviderContext.Provider value={{ ...state, featureStatus, recheckAI }}>
      {children}
    </AIProviderContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAI(): AIProviderContextValue {
  const ctx = useContext(AIProviderContext);
  if (!ctx) {
    throw new Error('useAI must be used within an AIProvider.');
  }
  return ctx;
}
