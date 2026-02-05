/**
 * Memory Manager
 * Centralized memory management and cleanup for performance optimization
 */

import { clearAttributeCache } from './typeDetection.js';
import { clearTraversalCache } from './domHelpers.js';
import { logger } from './logger.js';

interface MemoryStats {
  cacheSize: number;
  timestamp: number;
  jsHeapSize?: number;
}

class MemoryManager {
  private cleanupCallbacks: Array<() => void> = [];
  private cleanupTimer: number | null = null;
  private autoCleanupIntervalId: number | null = null;
  private isDestroyed = false;
  private readonly CLEANUP_DELAY = 500; // ms
  private readonly AUTO_CLEANUP_INTERVAL = 300000; // 5 minutes

  constructor() {
    // Register default cleanup callbacks
    this.registerCleanup(() => clearAttributeCache());
    this.registerCleanup(() => clearTraversalCache());

    // Start auto cleanup for long-running pages
    this.startAutoCleanup();

    // Register cleanup on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.destroy());
      window.addEventListener('pagehide', () => this.destroy());
    }
  }

  /**
   * Register a cleanup callback
   */
  registerCleanup(callback: () => void): void {
    this.cleanupCallbacks.push(callback);
  }

  /**
   * Clear all registered caches immediately
   */
  clearAll(): void {
    logger.debug('Memory Manager: Clearing all caches');

    for (const callback of this.cleanupCallbacks) {
      try {
        callback();
      } catch (error) {
        logger.warn('Memory Manager: Cleanup callback failed', error);
      }
    }
  }

  /**
   * Schedule cleanup with delay (debounced)
   */
  scheduleCleanup(delay: number = this.CLEANUP_DELAY): void {
    if (this.cleanupTimer !== null) {
      clearTimeout(this.cleanupTimer);
    }

    this.cleanupTimer = window.setTimeout(() => {
      this.clearAll();
      this.cleanupTimer = null;
    }, delay);
  }

  /**
   * Cancel scheduled cleanup
   */
  cancelCleanup(): void {
    if (this.cleanupTimer !== null) {
      clearTimeout(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Start automatic periodic cleanup
   */
  private startAutoCleanup(): void {
    // Clear any existing interval
    if (this.autoCleanupIntervalId !== null) {
      clearInterval(this.autoCleanupIntervalId);
    }

    this.autoCleanupIntervalId = window.setInterval(() => {
      if (this.isDestroyed) return;
      logger.debug('Memory Manager: Running auto cleanup');
      this.clearAll();
    }, this.AUTO_CLEANUP_INTERVAL);
  }

  /**
   * Stop automatic cleanup
   */
  stopAutoCleanup(): void {
    if (this.autoCleanupIntervalId !== null) {
      clearInterval(this.autoCleanupIntervalId);
      this.autoCleanupIntervalId = null;
      logger.debug('Memory Manager: Auto cleanup stopped');
    }
  }

  /**
   * Destroy the memory manager and cleanup all resources
   */
  destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    logger.debug('Memory Manager: Destroying instance');

    // Stop auto cleanup
    this.stopAutoCleanup();

    // Cancel any pending cleanup
    this.cancelCleanup();

    // Run final cleanup
    this.clearAll();

    // Clear callbacks
    this.cleanupCallbacks = [];
  }

  /**
   * Check if the manager has been destroyed
   */
  isActive(): boolean {
    return !this.isDestroyed;
  }

  /**
   * Get memory statistics (if available)
   */
  getMemoryStats(): MemoryStats {
    const stats: MemoryStats = {
      cacheSize: this.cleanupCallbacks.length,
      timestamp: Date.now()
    };

    // Chrome-specific memory info
    if ('memory' in performance && performance.memory) {
      const memory = performance.memory as {
        usedJSHeapSize?: number;
        totalJSHeapSize?: number;
        jsHeapSizeLimit?: number;
      };
      stats.jsHeapSize = memory.usedJSHeapSize;
    }

    return stats;
  }

  /**
   * Check if memory usage is high and trigger cleanup if needed
   */
  checkMemoryPressure(): boolean {
    if ('memory' in performance && performance.memory) {
      const memory = performance.memory as {
        usedJSHeapSize?: number;
        jsHeapSizeLimit?: number;
      };

      const used = memory.usedJSHeapSize ?? 0;
      const limit = memory.jsHeapSizeLimit ?? Number.MAX_SAFE_INTEGER;
      const usageRatio = used / limit;

      // If using more than 80% of heap, trigger cleanup
      if (usageRatio > 0.8) {
        logger.warn(
          `Memory Manager: High memory usage detected (${(usageRatio * 100).toFixed(2)}%)`
        );
        this.clearAll();
        return true;
      }
    }

    return false;
  }
}

// Export singleton instance
export const memoryManager = new MemoryManager();

/**
 * Cleanup after form filling is complete
 */
export function cleanupAfterFill(delay = 500): void {
  memoryManager.scheduleCleanup(delay);
}

/**
 * Force immediate cleanup
 */
export function forceCleanup(): void {
  memoryManager.clearAll();
}
