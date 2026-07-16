import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { DecisionSupportAIResult } from '../../ai/decisionSupport/decisionSupportTypes';
import { generateDecisionSupport } from '../../ai/decisionSupport/decisionSupportService';

interface DecisionSupportAIState {
  loading: boolean;
  briefing: DecisionSupportAIResult | null;
  error: string | null;
}

type DecisionSupportAIAction =
  | { type: 'START_BRIEFING' }
  | { type: 'BRIEFING_SUCCESS'; payload: DecisionSupportAIResult }
  | { type: 'BRIEFING_FAILURE'; payload: string }
  | { type: 'CLEAR_BRIEFING' };

const initialState: DecisionSupportAIState = {
  loading: false,
  briefing: null,
  error: null,
};

function decisionSupportAIReducer(
  state: DecisionSupportAIState,
  action: DecisionSupportAIAction
): DecisionSupportAIState {
  switch (action.type) {
    case 'START_BRIEFING':
      return { ...state, loading: true, error: null };
    case 'BRIEFING_SUCCESS':
      return { ...state, loading: false, briefing: action.payload, error: null };
    case 'BRIEFING_FAILURE':
      return { ...state, loading: false, briefing: null, error: action.payload };
    case 'CLEAR_BRIEFING':
      return { ...state, loading: false, briefing: null, error: null };
    default:
      return state;
  }
}

interface DecisionSupportAIContextProps extends DecisionSupportAIState {
  generateBriefing: (insights: {
    incidentRisk?: unknown;
    volunteerAllocations?: unknown;
    crowdCongestion?: unknown;
    accessibilityIssues?: unknown;
  }) => Promise<void>;
  clearBriefing: () => void;
}

const DecisionSupportAIContext = createContext<DecisionSupportAIContextProps | undefined>(undefined);

export const DecisionSupportAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(decisionSupportAIReducer, initialState);

  const generateBriefing = useCallback(
    async (insights: {
      incidentRisk?: unknown;
      volunteerAllocations?: unknown;
      crowdCongestion?: unknown;
      accessibilityIssues?: unknown;
    }) => {
      dispatch({ type: 'START_BRIEFING' });
      try {
        const res = await generateDecisionSupport(insights);
        dispatch({ type: 'BRIEFING_SUCCESS', payload: res });
      } catch (err: unknown) {
        dispatch({
          type: 'BRIEFING_FAILURE',
          payload: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    },
    []
  );

  const clearBriefing = useCallback(() => {
    dispatch({ type: 'CLEAR_BRIEFING' });
  }, []);

  return (
    <DecisionSupportAIContext.Provider value={{ ...state, generateBriefing, clearBriefing }}>
      {children}
    </DecisionSupportAIContext.Provider>
  );
};

export function useDecisionSupportAI(): DecisionSupportAIContextProps {
  const context = useContext(DecisionSupportAIContext);
  if (!context) {
    throw new Error('useDecisionSupportAI must be used within a DecisionSupportAIProvider');
  }
  return context;
}
