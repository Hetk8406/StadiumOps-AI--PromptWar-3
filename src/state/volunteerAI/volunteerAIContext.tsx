import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { VolunteerAIRecommendations } from '../../ai/volunteer/volunteerTypes';
import { generateVolunteerRecommendations } from '../../ai/volunteer/volunteerAIService';
import { Volunteer } from '../../domain/models';

interface VolunteerAIState {
  analyzing: boolean;
  recommendations: VolunteerAIRecommendations | null;
  error: string | null;
}

type VolunteerAIAction =
  | { type: 'START_RECOMMENDATIONS' }
  | { type: 'RECOMMENDATIONS_SUCCESS'; payload: VolunteerAIRecommendations }
  | { type: 'RECOMMENDATIONS_FAILURE'; payload: string }
  | { type: 'CLEAR_RECOMMENDATIONS' };

const initialState: VolunteerAIState = {
  analyzing: false,
  recommendations: null,
  error: null,
};

function volunteerAIReducer(state: VolunteerAIState, action: VolunteerAIAction): VolunteerAIState {
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

interface VolunteerAIContextProps extends VolunteerAIState {
  recommendAssignments: (volunteer: Volunteer, operationalContext?: string) => Promise<void>;
  clearRecommendations: () => void;
}

const VolunteerAIContext = createContext<VolunteerAIContextProps | undefined>(undefined);

export const VolunteerAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(volunteerAIReducer, initialState);

  const recommendAssignments = useCallback(async (volunteer: Volunteer, operationalContext?: string) => {
    dispatch({ type: 'START_RECOMMENDATIONS' });
    try {
      const res = await generateVolunteerRecommendations(volunteer, operationalContext);
      dispatch({ type: 'RECOMMENDATIONS_SUCCESS', payload: res });
    } catch (err: unknown) {
      dispatch({ type: 'RECOMMENDATIONS_FAILURE', payload: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, []);

  const clearRecommendations = useCallback(() => {
    dispatch({ type: 'CLEAR_RECOMMENDATIONS' });
  }, []);

  return (
    <VolunteerAIContext.Provider value={{ ...state, recommendAssignments, clearRecommendations }}>
      {children}
    </VolunteerAIContext.Provider>
  );
};

export function useVolunteerAI(): VolunteerAIContextProps {
  const context = useContext(VolunteerAIContext);
  if (!context) {
    throw new Error('useVolunteerAI must be used within a VolunteerAIProvider');
  }
  return context;
}
