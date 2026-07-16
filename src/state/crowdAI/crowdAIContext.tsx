import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { CrowdAIRecommendations } from '../../ai/crowd/crowdTypes';
import { generateCrowdRecommendations } from '../../ai/crowd/crowdAIService';
import { Gate } from '../../domain/models';

interface CrowdAIState {
  analyzing: boolean;
  recommendations: CrowdAIRecommendations | null;
  error: string | null;
}

type CrowdAIAction =
  | { type: 'START_RECOMMENDATIONS' }
  | { type: 'RECOMMENDATIONS_SUCCESS'; payload: CrowdAIRecommendations }
  | { type: 'RECOMMENDATIONS_FAILURE'; payload: string }
  | { type: 'CLEAR_RECOMMENDATIONS' };

const initialState: CrowdAIState = {
  analyzing: false,
  recommendations: null,
  error: null,
};

function crowdAIReducer(state: CrowdAIState, action: CrowdAIAction): CrowdAIState {
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

interface CrowdAIContextProps extends CrowdAIState {
  recommendCrowdFlow: (gates: readonly Gate[], standsContext?: unknown) => Promise<void>;
  clearRecommendations: () => void;
}

const CrowdAIContext = createContext<CrowdAIContextProps | undefined>(undefined);

export const CrowdAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(crowdAIReducer, initialState);

  const recommendCrowdFlow = useCallback(async (gates: readonly Gate[], standsContext?: unknown) => {
    dispatch({ type: 'START_RECOMMENDATIONS' });
    try {
      const res = await generateCrowdRecommendations(gates, standsContext);
      dispatch({ type: 'RECOMMENDATIONS_SUCCESS', payload: res });
    } catch (err: unknown) {
      dispatch({ type: 'RECOMMENDATIONS_FAILURE', payload: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, []);

  const clearRecommendations = useCallback(() => {
    dispatch({ type: 'CLEAR_RECOMMENDATIONS' });
  }, []);

  return (
    <CrowdAIContext.Provider value={{ ...state, recommendCrowdFlow, clearRecommendations }}>
      {children}
    </CrowdAIContext.Provider>
  );
};

export function useCrowdAI(): CrowdAIContextProps {
  const context = useContext(CrowdAIContext);
  if (!context) {
    throw new Error('useCrowdAI must be used within a CrowdAIProvider');
  }
  return context;
}
