import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { IncidentAIAnalysis } from '../../ai/incident/incidentTypes';
import { generateIncidentAnalysis } from '../../ai/incident/incidentAIService';
import { Incident } from '../../domain/models';

interface IncidentAIState {
  analyzing: boolean;
  analysis: IncidentAIAnalysis | null;
  error: string | null;
}

type IncidentAIAction =
  | { type: 'START_ANALYSIS' }
  | { type: 'ANALYSIS_SUCCESS'; payload: IncidentAIAnalysis }
  | { type: 'ANALYSIS_FAILURE'; payload: string }
  | { type: 'CLEAR_ANALYSIS' };

const initialState: IncidentAIState = {
  analyzing: false,
  analysis: null,
  error: null,
};

function incidentAIReducer(state: IncidentAIState, action: IncidentAIAction): IncidentAIState {
  switch (action.type) {
    case 'START_ANALYSIS':
      return { ...state, analyzing: true, error: null };
    case 'ANALYSIS_SUCCESS':
      return { ...state, analyzing: false, analysis: action.payload, error: null };
    case 'ANALYSIS_FAILURE':
      return { ...state, analyzing: false, analysis: null, error: action.payload };
    case 'CLEAR_ANALYSIS':
      return { ...state, analyzing: false, analysis: null, error: null };
    default:
      return state;
  }
}

interface IncidentAIContextProps extends IncidentAIState {
  analyzeIncident: (incident: Incident) => Promise<void>;
  clearAnalysis: () => void;
}

const IncidentAIContext = createContext<IncidentAIContextProps | undefined>(undefined);

export const IncidentAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(incidentAIReducer, initialState);

  const analyzeIncident = useCallback(async (incident: Incident) => {
    dispatch({ type: 'START_ANALYSIS' });
    try {
      const res = await generateIncidentAnalysis(incident);
      dispatch({ type: 'ANALYSIS_SUCCESS', payload: res });
    } catch (err: unknown) {
      dispatch({ type: 'ANALYSIS_FAILURE', payload: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    dispatch({ type: 'CLEAR_ANALYSIS' });
  }, []);

  return (
    <IncidentAIContext.Provider value={{ ...state, analyzeIncident, clearAnalysis }}>
      {children}
    </IncidentAIContext.Provider>
  );
};

export function useIncidentAI(): IncidentAIContextProps {
  const context = useContext(IncidentAIContext);
  if (!context) {
    throw new Error('useIncidentAI must be used within an IncidentAIProvider');
  }
  return context;
}
