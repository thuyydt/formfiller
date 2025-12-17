/**
 * Settings Cache Manager
 * Provides in-memory caching for Chrome storage settings to reduce I/O operations
 */

import type { FormFillerSettings } from '../types';

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SettingsCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly DEFAULT_TTL = 60000; // 1 minute default TTL
  private readonly MAX_CACHE_SIZE = 100;
  private settingsCache: FormFillerSettings | null = null;
  private settingsCacheTime = 0;
  private readonly SETTINGS_TTL = 30000; // 30 seconds for full settings

  /**
   * Get a single setting with caching
   */
  async get<T>(key: string, ttl: number = this.DEFAULT_TTL): Promise<T | undefined> {
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.value as T;
    }

    // Fetch from storage
    const result = await chrome.storage.local.get([key]);
    const value = result[key] as T | undefined;

    if (value !== undefined) {
      this.set(key, value, ttl);
    }

    return value;
  }

  /**
   * Get multiple settings with caching
   */
  async getMultiple<T extends Record<string, unknown>>(
    keys: string[],
    ttl: number = this.DEFAULT_TTL
  ): Promise<Partial<T>> {
    const result: Partial<T> = {};
    const keysToFetch: string[] = [];

    // Check cache first
    for (const key of keys) {
      const cached = this.cache.get(key);
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        (result as Record<string, unknown>)[key] = cached.value;
      } else {
        keysToFetch.push(key);
      }
    }

    // Fetch uncached keys
    if (keysToFetch.length > 0) {
      const storageResult = await chrome.storage.local.get(keysToFetch);

      for (const key of keysToFetch) {
        if (key in storageResult) {
          const value = storageResult[key];
          (result as Record<string, unknown>)[key] = value;
          this.set(key, value, ttl);
        }
      }
    }

    return result;
  }

  /**
   * Get all form filler settings with caching
   */
  async getSettings(): Promise<FormFillerSettings> {
    const now = Date.now();

    // Return cached settings if still valid
    if (this.settingsCache && now - this.settingsCacheTime < this.SETTINGS_TTL) {
      return this.settingsCache;
    }

    // Fetch fresh settings
    const keys: (keyof FormFillerSettings)[] = [
      'locale',
      'ignoreFields',
      'ignoreHidden',
      'ignoreFilled',
      'ignoreDomains',
      'customFields',
      'enableLabelMatching',
      'enableSound',
      'enableAIDetection',
      'aiConfidenceThreshold',
      'defaultPassword'
    ];

    const settings = await chrome.storage.local.get(keys);

    // Cache the full settings object
    this.settingsCache = settings;
    this.settingsCacheTime = now;

    // Also cache individual keys
    for (const [key, value] of Object.entries(settings)) {
      if (value !== undefined) {
        this.set(key, value, this.SETTINGS_TTL);
      }
    }

    return settings;
  }

  /**
   * Set a value in cache
   */
  set<T>(key: string, value: T, ttl: number = this.DEFAULT_TTL): void {
    // Implement LRU eviction if cache is too large
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Invalidate a specific cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);

    // Invalidate settings cache if a setting key is invalidated
    const settingsKeys = [
      'locale',
      'ignoreFields',
      'ignoreHidden',
      'ignoreFilled',
      'ignoreDomains',
      'customFields',
      'enableLabelMatching',
      'enableSound',
      'enableAIDetection',
      'aiConfidenceThreshold',
      'defaultPassword',
      'minAge',
      'maxAge',
      'enableFileInput',
      'fileInputTypes'
    ];

    if (settingsKeys.includes(key)) {
      this.settingsCache = null;
      this.settingsCacheTime = 0;
    }
  }

  /**
   * Invalidate all settings
   */
  invalidateSettings(): void {
    this.settingsCache = null;
    this.settingsCacheTime = 0;

    // Clear all settings-related cache entries
    const settingsKeys = [
      'locale',
      'ignoreFields',
      'ignoreHidden',
      'ignoreFilled',
      'ignoreDomains',
      'customFields',
      'enableLabelMatching',
      'enableSound',
      'enableAIDetection',
      'aiConfidenceThreshold',
      'defaultPassword',
      'minAge',
      'maxAge',
      'enableFileInput',
      'fileInputTypes'
    ];

    for (const key of settingsKeys) {
      this.cache.delete(key);
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.settingsCache = null;
    this.settingsCacheTime = 0;
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0 // Can be implemented with hit/miss counters if needed
    };
  }
}

// Export singleton instance
export const settingsCache = new SettingsCache();

/**
 * Listen for storage changes and invalidate cache
 */
if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      for (const key of Object.keys(changes)) {
        settingsCache.invalidate(key);
      }
    }
  });
}
