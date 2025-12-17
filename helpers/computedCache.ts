/**
 * Computed Values Cache
 * Caches results of expensive computations like regex parsing, DOM queries, etc.
 */

interface ComputedCacheEntry<T> {
  value: T;
  timestamp: number;
}

class ComputedCache {
  private cache: Map<string, ComputedCacheEntry<unknown>> = new Map();
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
   * Async version of getOrCompute
   */
  async getOrComputeAsync<T>(
    key: string,
    computeFn: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < ttl) {
      return cached.value as T;
    }

    const value = await computeFn();

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
  }

  /**
   * Clear all cached values
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
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
