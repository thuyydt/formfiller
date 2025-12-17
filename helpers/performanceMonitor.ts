/**
 * Performance Monitor
 * Track and report performance metrics for form filling operations
 */

import { logger } from './logger.js';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}

interface PerformanceReport {
  totalDuration: number;
  operations: PerformanceMetric[];
  slowOperations: PerformanceMetric[];
  avgDuration: number;
  memoryUsed?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private completed: PerformanceMetric[] = [];
  private readonly SLOW_THRESHOLD = 100; // ms
  private readonly MAX_HISTORY = 50;

  /**
   * Start timing an operation
   */
  start(name: string, metadata?: Record<string, unknown>): void {
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata
    };

    this.metrics.set(name, metric);
  }

  /**
   * End timing an operation
   */
  end(name: string): number | null {
    const metric = this.metrics.get(name);
    if (!metric) {
      logger.warn(`Performance: No metric found for "${name}"`);
      return null;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    // Move to completed
    this.completed.push(metric);
    this.metrics.delete(name);

    // Keep history limited
    if (this.completed.length > this.MAX_HISTORY) {
      this.completed.shift();
    }

    // Log slow operations
    if (metric.duration > this.SLOW_THRESHOLD) {
      logger.warn(
        `Performance: Slow operation detected - ${name} took ${metric.duration.toFixed(2)}ms`,
        metric.metadata
      );
    }

    return metric.duration;
  }

  /**
   * Measure a synchronous function
   */
  measure<T>(name: string, fn: () => T, metadata?: Record<string, unknown>): T {
    this.start(name, metadata);
    try {
      return fn();
    } finally {
      this.end(name);
    }
  }

  /**
   * Measure an async function
   */
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    this.start(name, metadata);
    try {
      return await fn();
    } finally {
      this.end(name);
    }
  }

  /**
   * Get performance report
   */
  getReport(): PerformanceReport {
    const totalDuration = this.completed.reduce((sum, m) => sum + (m.duration ?? 0), 0);
    const avgDuration = this.completed.length > 0 ? totalDuration / this.completed.length : 0;
    const slowOperations = this.completed.filter(m => (m.duration ?? 0) > this.SLOW_THRESHOLD);

    const report: PerformanceReport = {
      totalDuration,
      operations: [...this.completed],
      slowOperations,
      avgDuration
    };

    // Add memory info if available
    if ('memory' in performance && performance.memory) {
      const memory = performance.memory as { usedJSHeapSize?: number };
      report.memoryUsed = memory.usedJSHeapSize;
    }

    return report;
  }

  /**
   * Print performance report to console
   */
  printReport(): void {
    const report = this.getReport();

    logger.group('Performance Report', true);
    logger.info(`Total Duration: ${report.totalDuration.toFixed(2)}ms`);
    logger.info(`Average Duration: ${report.avgDuration.toFixed(2)}ms`);
    logger.info(`Operations: ${report.operations.length}`);
    logger.info(`Slow Operations: ${report.slowOperations.length}`);

    if (report.memoryUsed) {
      logger.info(`Memory Used: ${(report.memoryUsed / 1024 / 1024).toFixed(2)}MB`);
    }

    if (report.slowOperations.length > 0) {
      logger.group('Slow Operations', true);
      for (const op of report.slowOperations) {
        logger.warn(`${op.name}: ${op.duration?.toFixed(2)}ms`);
      }
      logger.groupEnd();
    }

    logger.groupEnd();
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
    this.completed = [];
  }

  /**
   * Get active metrics (not yet completed)
   */
  getActiveMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

/* Decorators commented out due to TypeScript strict mode limitations
 * Use measure() and measureAsync() directly instead
 *
 * Example:
 *   performanceMonitor.measure('myMethod', () => myMethod())
 */
