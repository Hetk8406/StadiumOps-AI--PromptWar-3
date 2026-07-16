/**
 * Central Logger Implementation
 * Enterprise-grade logging foundation supporting custom log levels and structured metadata format.
 * Prepares Command Center for future ingestion endpoints (e.g., Splunk, Datadog) without third-party libraries.
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  readonly timestamp: string;
  readonly level: LogLevel;
  readonly context: string;
  readonly message: string;
  readonly metadata?: Record<string, unknown>;
}

class Logger {
  private readonly isProduction = (import.meta as unknown as { env: Record<string, string> }).env?.MODE === 'production';

  private formatMessage(level: LogLevel, context: string, message: string, metadata?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      metadata,
    };
  }

  private write(entry: LogEntry): void {
    if (this.isProduction && entry.level === 'DEBUG') {
      return;
    }

    const consoleArgs = [
      `[${entry.timestamp}] [${entry.level}] [${entry.context}] ${entry.message}`,
    ];
    if (entry.metadata) {
      consoleArgs.push(JSON.stringify(entry.metadata));
    }

    switch (entry.level) {
      case 'DEBUG':
        console.debug(...consoleArgs);
        break;
      case 'INFO':
        console.info(...consoleArgs);
        break;
      case 'WARN':
        console.warn(...consoleArgs);
        break;
      case 'ERROR':
        console.error(...consoleArgs);
        break;
    }
  }

  public debug(context: string, message: string, metadata?: Record<string, unknown>): void {
    this.write(this.formatMessage('DEBUG', context, message, metadata));
  }

  public info(context: string, message: string, metadata?: Record<string, unknown>): void {
    this.write(this.formatMessage('INFO', context, message, metadata));
  }

  public warn(context: string, message: string, metadata?: Record<string, unknown>): void {
    this.write(this.formatMessage('WARN', context, message, metadata));
  }

  public error(context: string, message: string, metadata?: Record<string, unknown>): void {
    this.write(this.formatMessage('ERROR', context, message, metadata));
  }
}

export const logger = new Logger();
