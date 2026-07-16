import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AccessibilityAIRecommendations } from '../../ai/accessibility/accessibilityTypes';
import { generateAccessibilityRecommendations } from '../../ai/accessibility/accessibilityAIService';
import { AccessibilityRequest } from '../../domain/models';

interface AccessibilityAIState {
  analyzing: boolean;
  recommendations: AccessibilityAIRecommendations | null;
  error: string | null;
}

type AccessibilityAIAction =
  | { type: 'START_RECOMMENDATIONS' }
  | { type: 'RECOMMENDATIONS_SUCCESS'; payload: AccessibilityAIRecommendations }
  | { type: 'RECOMMENDATIONS_FAILURE'; payload: string }
  | { type: 'CLEAR_RECOMMENDATIONS' };

const initialState: AccessibilityAIState = {
  analyzing: false,
  recommendations: null,
  error: null,
};

function accessibilityAIReducer(state: AccessibilityAIState, action: AccessibilityAIAction): AccessibilityAIState {
  switch (action.type) {
    case 'START_RECOMMENDATIONS':
      return { ...state, analyzing: true, error: null };
    case 'RECOMMENDATIONS_SUCCESS':
      return { ...state, analyzing: false, recommendations: action.payload, error: null };
    case 'RECOMMENDATIONS_FAILURE':
      return { ...state, analyzing: false, recommendations: null, error: action.payload };
    case 'CLEAR_RECOMMENDATIONS':
      return { ...state, analyzing: false, recommendations: null, error: null };
    default:
      return state;
  }
}

interface AccessibilityAIContextProps extends AccessibilityAIState {
  recommendAccessibilitySupport: (request: AccessibilityRequest, operationalContext?: string) => Promise<void>;
  clearRecommendations: () => void;
}

const AccessibilityAIContext = createContext<AccessibilityAIContextProps | undefined>(undefined);

export const AccessibilityAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(accessibilityAIReducer, initialState);

  const recommendAccessibilitySupport = useCallback(async (request: AccessibilityRequest, operationalContext?: string) => {
    dispatch({ type: 'START_RECOMMENDATIONS' });
    try {
      const res = await generateAccessibilityRecommendations(request, operationalContext);
      dispatch({ type: 'RECOMMENDATIONS_SUCCESS', payload: res });
    } catch (err: unknown) {
      dispatch({ type: 'RECOMMENDATIONS_FAILURE', payload: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, []);

  const clearRecommendations = useCallback(() => {
    dispatch({ type: 'CLEAR_RECOMMENDATIONS' });
  }, []);

  return (
    <AccessibilityAIContext.Provider value={{ ...state, recommendAccessibilitySupport, clearRecommendations }}>
      {children}
    </AccessibilityAIContext.Provider>
  );
};

export function useAccessibilityAI(): AccessibilityAIContextProps {
  const context = useContext(AccessibilityAIContext);
  if (!context) {
    throw new Error('useAccessibilityAI must be used within an AccessibilityAIProvider');
  }
  return context;
}
