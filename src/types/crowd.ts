import { CrowdStatus } from '../config/constants';

export interface GateCongestionInfo {
  gateId: string;
  gateName: string;
  currentThroughput: number; // People per minute
  maxCapacity: number;
  status: CrowdStatus;
  estimatedWaitMinutes: number;
  aiRouteAdvice?: {
    suggestedAlternateGateId: string;
    redirectionActionPlan: string;
    confidenceScore: number;
  };
}
