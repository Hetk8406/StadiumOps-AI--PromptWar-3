import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { TranslationAIResult } from '../../ai/translation/translationTypes';
import { generateTranslation } from '../../ai/translation/translationAIService';

interface TranslationAIState {
  loading: boolean;
  result: TranslationAIResult | null;
  error: string | null;
}

type TranslationAIAction =
  | { type: 'START_TRANSLATION' }
  | { type: 'TRANSLATION_SUCCESS'; payload: TranslationAIResult }
  | { type: 'TRANSLATION_FAILURE'; payload: string }
  | { type: 'CLEAR_TRANSLATION' };

const initialState: TranslationAIState = {
  loading: false,
  result: null,
  error: null,
};

function translationAIReducer(state: TranslationAIState, action: TranslationAIAction): TranslationAIState {
  switch (action.type) {
    case 'START_TRANSLATION':
      return { ...state, loading: true, error: null };
    case 'TRANSLATION_SUCCESS':
      return { ...state, loading: false, result: action.payload, error: null };
    case 'TRANSLATION_FAILURE':
      return { ...state, loading: false, result: null, error: action.payload };
    case 'CLEAR_TRANSLATION':
      return { ...state, loading: false, result: null, error: null };
    default:
      return state;
  }
}

interface TranslationAIContextProps extends TranslationAIState {
  translateMessage: (text: string, targetLanguage: string, audience: string) => Promise<void>;
  clearTranslation: () => void;
}

const TranslationAIContext = createContext<TranslationAIContextProps | undefined>(undefined);

export const TranslationAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(translationAIReducer, initialState);

  const translateMessage = useCallback(async (text: string, targetLanguage: string, audience: string) => {
    dispatch({ type: 'START_TRANSLATION' });
    try {
      const res = await generateTranslation(text, targetLanguage, audience);
      dispatch({ type: 'TRANSLATION_SUCCESS', payload: res });
    } catch (err: unknown) {
      dispatch({ type: 'TRANSLATION_FAILURE', payload: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, []);

  const clearTranslation = useCallback(() => {
    dispatch({ type: 'CLEAR_TRANSLATION' });
  }, []);

  return (
    <TranslationAIContext.Provider value={{ ...state, translateMessage, clearTranslation }}>
      {children}
    </TranslationAIContext.Provider>
  );
};

export function useTranslationAI(): TranslationAIContextProps {
  const context = useContext(TranslationAIContext);
  if (!context) {
    throw new Error('useTranslationAI must be used within a TranslationAIProvider');
  }
  return context;
}
