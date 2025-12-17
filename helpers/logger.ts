/**
 * Centralized Logging Utility
 * Provides controlled logging with levels and production mode filtering
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

interface LoggerConfig {
  level: LogLevel;
  prefix: string;
  enableInProduction: boolean;
  enableTimestamp: boolean;
}

class Logger {
  private config: LoggerConfig = {
    level: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
    prefix: '[Form Filler]',
    enableInProduction: false,
    enableTimestamp: true
  };

  private shouldLog(level: LogLevel): boolean {
    if (process.env.NODE_ENV === 'production' && !this.config.enableInProduction) {
      return level >= LogLevel.ERROR;
    }
    return level >= this.config.level;
  }

  private formatMessage(level: string, message: string, ...args: unknown[]): unknown[] {
    const timestamp = this.config.enableTimestamp ? `[${new Date().toISOString()}]` : '';
    const prefix = `${timestamp} ${this.config.prefix} ${level}:`;
    return [prefix, message, ...args];
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      // eslint-disable-next-line no-console
      console.debug(...this.formatMessage('DEBUG', message, ...args));
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      // eslint-disable-next-line no-console
      console.info(...this.formatMessage('INFO', message, ...args));
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      // eslint-disable-next-line no-console
      console.warn(...this.formatMessage('WARN', message, ...args));
    }
  }

  error(message: string, error?: Error, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      // eslint-disable-next-line no-console
      console.error(...this.formatMessage('ERROR', message, ...args));
      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.error('Stack:', error.stack);
      } else if (error) {
        // eslint-disable-next-line no-console
        console.error('Details:', error);
      }
    }
  }

  /**
   * Styled console log for reports (only in development)
   */
  report(message: string, style?: string): void {
    if (process.env.NODE_ENV !== 'production' && this.shouldLog(LogLevel.INFO)) {
      if (style) {
        // eslint-disable-next-line no-console
        console.log(`%c${message}`, style);
      } else {
        // eslint-disable-next-line no-console
        console.log(message);
      }
    }
  }

  /**
   * Group logs together
   */
  group(label: string, collapsed = false): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      if (collapsed) {
        // eslint-disable-next-line no-console
        console.groupCollapsed(label);
      } else {
        // eslint-disable-next-line no-console
        console.group(label);
      }
    }
  }

  groupEnd(): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      // eslint-disable-next-line no-console
      console.groupEnd();
    }
  }

  /**
   * Update logger configuration
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience methods
export const debug = logger.debug.bind(logger);
export const info = logger.info.bind(logger);
export const warn = logger.warn.bind(logger);
export const error = logger.error.bind(logger);
export const report = logger.report.bind(logger);
export const group = logger.group.bind(logger);
export const groupEnd = logger.groupEnd.bind(logger);
