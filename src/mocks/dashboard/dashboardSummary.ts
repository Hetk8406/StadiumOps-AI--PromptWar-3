/**
 * Dashboard Operations Consolidated Summary
 * Consumer: Dashboard / Overview page.
 */

export const dashboardSummary = {
  attendance: {
    total: 74812,
    capacity: 82500,
    occupancyRate: 91, // percentage
  },
  incidents: {
    total: 34,
    critical: 2,
    high: 8,
    medium: 14,
    low: 10,
    active: 12,
    resolvedToday: 22,
  },
  volunteers: {
    total: 284,
    onDuty: 142,
    available: 54,
    break: 18,
  },
  accessibility: {
    activeRequests: 18,
    pendingWheelchairs: 5,
    assignedTeams: 12,
  },
  broadcasts: {
    sentToday: 42,
    activeAlerts: 3,
  },
  matchContext: {
    matchName: 'Argentina vs Germany',
    stage: 'Group Stage - Match 14',
    countdownMinutes: 45, // kickoff
    status: 'LIVE_SECOND_HALF',
  },
  weather: {
    tempCelsius: 24,
    condition: 'Overcast',
    humidity: '65%',
    windSpeed: '12 km/h',
  },
  systemStatus: {
    meshNetwork: 'Healthy',
    sensorGrid: 'Operational',
    translationEngine: 'Active',
    dispatchQueue: 'Healthy',
  },
};
