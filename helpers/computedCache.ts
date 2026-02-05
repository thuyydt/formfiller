/**
 * Computed Values Cache
 * Caches results of expensive computations like regex parsing, DOM queries, etc.
 */

interface ComputedCacheEntry<T> {
  value: T;
  timestamp: number;
}

// Store pending promises to prevent duplicate concurrent computations
type PendingPromise<T> = Promise<T>;

class ComputedCache {
  private cache: Map<string, ComputedCacheEntry<unknown>> = new Map();
  private pendingPromises: Map<string, PendingPromise<unknown>> = new Map();
  private readonly DEFAULT_TTL = 5000; // 5 seconds for computed values
  private readonly MAX_SIZE = 200;

  /**
   * Get or compute a value with caching
   */
  getOrCompute<T>(key: string, computeFn: () => T, ttl: number = this.DEFAULT_TTL): T {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < ttl) {
      return cached.value as T;
    }

    // Compute new value
    const value = computeFn();

    // Apply LRU eviction
    if (this.cache.size >= this.MAX_SIZE) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: now
    });

    return value;
  }

  /**
   * Async version of getOrCompute with race condition prevention
   * Uses pending promise pattern to avoid duplicate concurrent computations
   */
  async getOrComputeAsync<T>(
    key: string,
    computeFn: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    // Return cached value if valid
    if (cached && now - cached.timestamp < ttl) {
      return cached.value as T;
    }

    // Check if computation is already in progress
    const pendingPromise = this.pendingPromises.get(key);
    if (pendingPromise) {
      return pendingPromise as Promise<T>;
    }

    // Start new computation and store the promise
    const computePromise = (async () => {
      try {
        const value = await computeFn();

        // Apply LRU eviction
        if (this.cache.size >= this.MAX_SIZE) {
          const firstKey = this.cache.keys().next().value;
          if (firstKey) {
            this.cache.delete(firstKey);
          }
        }

        this.cache.set(key, {
          value,
          timestamp: Date.now()
        });

        return value;
      } finally {
        // Always remove from pending when done
        this.pendingPromises.delete(key);
      }
    })();

    this.pendingPromises.set(key, computePromise);
    return computePromise;
  }

  /**
   * Check if a key exists and is valid
   */
  has(key: string, ttl: number = this.DEFAULT_TTL): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;

    return Date.now() - cached.timestamp < ttl;
  }

  /**
   * Invalidate a specific entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    this.pendingPromises.delete(key);
  }

  /**
   * Clear all cached values
   */
  clear(): void {
    this.cache.clear();
    this.pendingPromises.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get number of pending computations
   */
  pendingCount(): number {
    return this.pendingPromises.size;
  }
}

// Export singleton
export const computedCache = new ComputedCache();

/**
 * Helper: Cache regex parsing results
 */
export function cachedRegexTest(pattern: string, text: string): boolean {
  const key = `regex:${pattern}:${text}`;
  return computedCache.getOrCompute(
    key,
    () => {
      try {
        return new RegExp(pattern, 'i').test(text);
      } catch {
        return false;
      }
    },
    60000
  ); // Cache regex results for 1 minute
}

/**
 * Helper: Cache custom field value splitting
 */
export function cachedSplitValues(value: string, delimiter = ','): string[] {
  const key = `split:${value}:${delimiter}`;
  return computedCache.getOrCompute(
    key,
    () => {
      return value
        .split(delimiter)
        .map(v => v.trim())
        .filter(Boolean);
    },
    30000
  ); // Cache for 30 seconds
}

/**
 * Helper: Cache ignore domains parsing
 */
export function cachedParseIgnoreDomains(ignoreDomains: string): string[] {
  const key = `domains:${ignoreDomains}`;
  return computedCache.getOrCompute(
    key,
    () => {
      return ignoreDomains
        .split(/\n|,/)
        .map(s => s.trim())
        .filter(Boolean);
    },
    60000
  ); // Cache for 1 minute
}

/**
 * Helper: Cache ignore keywords parsing
 * Used by form fillers to avoid re-parsing on each field
 */
export function cachedParseIgnoreKeywords(ignoreFields: string): string[] {
  if (!ignoreFields || ignoreFields.trim() === '') {
    return [];
  }

  const key = `keywords:${ignoreFields}`;
  return computedCache.getOrCompute(
    key,
    () => {
      return ignoreFields
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);
    },
    60000
  ); // Cache for 1 minute
}
