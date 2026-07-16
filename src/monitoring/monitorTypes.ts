/**
 * Observability Core Abstractions
 * Defines structured log levels, metric collection interfaces, health states, and trace context.
 */

export type Severity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export interface StructuredLog {
  readonly timestamp: string;
  readonly severity: Severity;
  readonly module: string;
  readonly eventName: string;
  readonly message: string;
  readonly correlationId: string;
  readonly traceId?: string;
  readonly metadata?: Record<string, unknown>;
}

export type HealthStatus = 'HEALTHY' | 'WARNING' | 'DEGRADED' | 'UNAVAILABLE';

export interface HealthCheckResult {
  readonly component: string;
  readonly status: HealthStatus;
  readonly latencyMs: number;
  readonly message?: string;
}

export interface MetricEntry {
  readonly name: string;
  readonly value: number;
  readonly timestamp: number;
  readonly tags?: Record<string, string>;
}

export interface TraceContext {
  readonly sessionId: string;
  readonly correlationId: string;
  readonly currentSpanId?: string;
}
