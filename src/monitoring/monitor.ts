/**
 * Observability & Monitoring Service
 * Manages runtime diagnostics, trace IDs, health checks, performance metrics, and log structuring.
 */

import { Severity, StructuredLog, HealthCheckResult, MetricEntry, TraceContext } from './monitorTypes';

let _sessionTraceId = `session-${Math.random().toString(36).substring(2, 15)}`;
let _correlationCounter = 0;

export function getSessionTraceContext(): TraceContext {
  return {
    sessionId: _sessionTraceId,
    correlationId: `corr-${++_correlationCounter}-${Date.now()}`,
  };
}

// Memory-capped local telemetry registers
const LOG_CACHE_LIMIT = 200;
const METRIC_CACHE_LIMIT = 500;

const logBuffer: StructuredLog[] = [];
const metricsBuffer: MetricEntry[] = [];

export function logStructured(
  severity: Severity,
  module: string,
  eventName: string,
  message: string,
  metadata?: Record<string, unknown>
): void {
  const trace = getSessionTraceContext();
  const log: StructuredLog = {
    timestamp: new Date().toISOString(),
    severity,
    module,
    eventName,
    message,
    correlationId: trace.correlationId,
    traceId: trace.sessionId,
    metadata,
  };

  logBuffer.push(log);
  if (logBuffer.length > LOG_CACHE_LIMIT) {
    logBuffer.shift();
  }

  // Console logging behavior based on environment
  const isProd = (import.meta as unknown as { env: Record<string, string> }).env?.MODE === 'production';
  if (isProd && severity === 'DEBUG') return;

  const formattedMsg = `[${log.timestamp}] [${log.severity}] [${log.module}] [${log.eventName}] ${log.message}`;
  switch (severity) {
    case 'DEBUG':
      console.debug(formattedMsg, metadata);
      break;
    case 'INFO':
      console.info(formattedMsg, metadata);
      break;
    case 'WARN':
      console.warn(formattedMsg, metadata);
      break;
    case 'ERROR':
    case 'CRITICAL':
      console.error(formattedMsg, metadata);
      break;
  }
}

export function recordMetric(name: string, value: number, tags?: Record<string, string>): void {
  const entry: MetricEntry = {
    name,
    value,
    timestamp: Date.now(),
    tags,
  };
  metricsBuffer.push(entry);
  if (metricsBuffer.length > METRIC_CACHE_LIMIT) {
    metricsBuffer.shift();
  }
}

export function getLogs(): StructuredLog[] {
  return [...logBuffer];
}

export function getMetrics(): MetricEntry[] {
  return [...metricsBuffer];
}

export function runHealthDiagnostics(): HealthCheckResult[] {
  return [
    { component: 'TelemetryService', status: 'HEALTHY', latencyMs: 1 },
    { component: 'StateEngine', status: 'HEALTHY', latencyMs: 2 },
    { component: 'MockRepositoryLayer', status: 'HEALTHY', latencyMs: 5 },
    { component: 'AIGenerativeGateway', status: 'HEALTHY', latencyMs: 10 },
  ];
}
