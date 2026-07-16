import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AsyncState, createInitialAsyncState } from '../shared/asyncState';
import { StadiumZone, Gate, CrowdMetrics } from '../../domain/models';
import { crowdService } from '../../services';

interface CrowdState {
  zones: AsyncState<StadiumZone[]>;
  gates: AsyncState<Gate[]>;
  metrics: AsyncState<CrowdMetrics[]>;
  selectedZone: StadiumZone | null;
}

type CrowdAction =
  | { type: 'START_FETCH_ZONES' }
  | { type: 'FETCH_ZONES_SUCCESS'; payload: StadiumZone[] }
  | { type: 'FETCH_ZONES_FAILURE'; payload: string }
  | { type: 'START_FETCH_GATES' }
  | { type: 'FETCH_GATES_SUCCESS'; payload: Gate[] }
  | { type: 'FETCH_GATES_FAILURE'; payload: string }
  | { type: 'SELECT_ZONE'; payload: StadiumZone | null };

const initialState: CrowdState = {
  zones: createInitialAsyncState<StadiumZone[]>([]),
  gates: createInitialAsyncState<Gate[]>([]),
  metrics: createInitialAsyncState<CrowdMetrics[]>([]),
  selectedZone: null,
};

function crowdReducer(state: CrowdState, action: CrowdAction): CrowdState {
  switch (action.type) {
    case 'START_FETCH_ZONES':
      return { ...state, zones: { ...state.zones, loading: true, error: null } };
    case 'FETCH_ZONES_SUCCESS':
      return { ...state, zones: { data: action.payload, loading: false, error: null } };
    case 'FETCH_ZONES_FAILURE':
      return { ...state, zones: { data: [], loading: false, error: action.payload } };
    case 'START_FETCH_GATES':
      return { ...state, gates: { ...state.gates, loading: true, error: null } };
    case 'FETCH_GATES_SUCCESS':
      return { ...state, gates: { data: action.payload, loading: false, error: null } };
    case 'FETCH_GATES_FAILURE':
      return { ...state, gates: { data: [], loading: false, error: action.payload } };
    case 'SELECT_ZONE':
      return { ...state, selectedZone: action.payload };
    default:
      return state;
  }
}

interface CrowdContextProps extends CrowdState {
  fetchZonesAndGates: () => Promise<void>;
  selectZone: (zone: StadiumZone | null) => void;
}

const CrowdContext = createContext<CrowdContextProps | undefined>(undefined);

export const CrowdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(crowdReducer, initialState);

  const fetchZonesAndGates = useCallback(async () => {
    dispatch({ type: 'START_FETCH_ZONES' });
    dispatch({ type: 'START_FETCH_GATES' });
    try {
      const zonesList = await crowdService.getStadiumZones();
      const gatesList = await crowdService.getGates();
      
      dispatch({ type: 'FETCH_ZONES_SUCCESS', payload: zonesList });
      dispatch({ type: 'FETCH_GATES_SUCCESS', payload: gatesList });

      if (zonesList.length > 0 && !state.selectedZone) {
        dispatch({ type: 'SELECT_ZONE', payload: zonesList[0] });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      dispatch({ type: 'FETCH_ZONES_FAILURE', payload: msg });
      dispatch({ type: 'FETCH_GATES_FAILURE', payload: msg });
    }
  }, [state.selectedZone]);

  const selectZone = useCallback((zone: StadiumZone | null) => {
    dispatch({ type: 'SELECT_ZONE', payload: zone });
  }, []);

  return (
    <CrowdContext.Provider value={{ ...state, fetchZonesAndGates, selectZone }}>
      {children}
    </CrowdContext.Provider>
  );
};

export function useCrowd(): CrowdContextProps {
  const context = useContext(CrowdContext);
  if (!context) {
    throw new Error('useCrowd must be used within a CrowdProvider');
  }
  return context;
}
