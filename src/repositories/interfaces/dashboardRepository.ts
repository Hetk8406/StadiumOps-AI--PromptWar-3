

export interface IDashboardSummary {
  attendance: {
    total: number;
    capacity: number;
    occupancyRate: number;
  };
  incidents: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    active: number;
    resolvedToday: number;
  };
  volunteers: {
    total: number;
    onDuty: number;
    available: number;
    break: number;
  };
  accessibility: {
    activeRequests: number;
    pendingWheelchairs: number;
    assignedTeams: number;
  };
  broadcasts: {
    sentToday: number;
    activeAlerts: number;
  };
  matchContext: {
    matchName: string;
    stage: string;
    countdownMinutes: number;
    status: string;
  };
  weather: {
    tempCelsius: number;
    condition: string;
    humidity: string;
    windSpeed: string;
  };
  systemStatus: {
    meshNetwork: string;
    sensorGrid: string;
    translationEngine: string;
    dispatchQueue: string;
  };
}

export interface IDashboardRepository {
  getSummary(): Promise<IDashboardSummary>;
  getLiveActivities(): Promise<string[]>;
}
