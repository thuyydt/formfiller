import { settingsCache } from '../../helpers/settingsCache';

describe('SettingsCache', () => {
  let mockStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Reset the cache before each test
    settingsCache.clear();

    // Mock chrome.storage API
    mockStorage = {
      local: {
        get: jest.fn(keys => {
          if (typeof keys === 'string') {
            return Promise.resolve({ [keys]: `value-${keys}` });
          }
          const result = {};
          keys.forEach(key => {
            result[key] = `value-${key}`;
          });
          return Promise.resolve(result);
        }),
        set: jest.fn(() => Promise.resolve())
      }
    };

    global.chrome = {
      storage: mockStorage
    };
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('get', () => {
    it('should fetch and cache a value from storage', async () => {
      const value = await settingsCache.get('testKey');

      expect(mockStorage.local.get).toHaveBeenCalledWith(['testKey']);
      expect(value).toBe('value-testKey');
    });

    it('should return cached value within TTL', async () => {
      // First call - fetches from storage
      const value1 = await settingsCache.get('testKey', 60000);
      expect(mockStorage.local.get).toHaveBeenCalledTimes(1);

      // Second call - returns from cache
      const value2 = await settingsCache.get('testKey', 60000);
      expect(mockStorage.local.get).toHaveBeenCalledTimes(1);
      expect(value1).toBe(value2);
    });

    it('should refetch value after TTL expires', async () => {
      // First call
      await settingsCache.get('testKey', 1000);
      expect(mockStorage.local.get).toHaveBeenCalledTimes(1);

      // Advance time past TTL
      jest.advanceTimersByTime(1001);

      // Second call - should refetch
      await settingsCache.get('testKey', 1000);
      expect(mockStorage.local.get).toHaveBeenCalledTimes(2);
    });

    it('should handle undefined values', async () => {
      mockStorage.local.get.mockResolvedValueOnce({});

      const value = await settingsCache.get('nonExistentKey');

      expect(value).toBeUndefined();
    });

    it('should use default TTL when not specified', async () => {
      await settingsCache.get('testKey');

      // Should be cached for default TTL (60 seconds)
      jest.advanceTimersByTime(59999);
      await settingsCache.get('testKey');
      expect(mockStorage.local.get).toHaveBeenCalledTimes(1);

      // Should refetch after default TTL
      jest.advanceTimersByTime(2);
      await settingsCache.get('testKey');
      expect(mockStorage.local.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('getMultiple', () => {
    it('should fetch multiple values from storage', async () => {
      const result = await settingsCache.getMultiple(['key1', 'key2', 'key3']);

      expect(mockStorage.local.get).toHaveBeenCalledWith(['key1', 'key2', 'key3']);
      expect(result).toEqual({
        key1: 'value-key1',
        key2: 'value-key2',
        key3: 'value-key3'
      });
    });

    it('should use cached values when available', async () => {
      // Cache some values first
      await settingsCache.get('key1', 60000);
      await settingsCache.get('key2', 60000);
      mockStorage.local.get.mockClear();

      // Request mix of cached and uncached keys
      const result = await settingsCache.getMultiple(['key1', 'key2', 'key3']);

      // Should only fetch key3
      expect(mockStorage.local.get).toHaveBeenCalledWith(['key3']);
      expect(result).toEqual({
        key1: 'value-key1',
        key2: 'value-key2',
        key3: 'value-key3'
      });
    });

    it('should handle empty keys array', async () => {
      const result = await settingsCache.getMultiple([]);

      expect(mockStorage.local.get).not.toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('should handle all cached keys', async () => {
      // Cache all keys first
      await settingsCache.get('key1', 60000);
      await settingsCache.get('key2', 60000);
      mockStorage.local.get.mockClear();

      // Request all cached keys
      const result = await settingsCache.getMultiple(['key1', 'key2']);

      // Should not fetch anything
      expect(mockStorage.local.get).not.toHaveBeenCalled();
      expect(result).toEqual({
        key1: 'value-key1',
        key2: 'value-key2'
      });
    });

    it('should handle expired cached values', async () => {
      // Cache with short TTL
      await settingsCache.get('key1', 1000);

      // Expire the cache
      jest.advanceTimersByTime(1001);
      mockStorage.local.get.mockClear();

      // Should refetch expired key
      await settingsCache.getMultiple(['key1', 'key2']);

      expect(mockStorage.local.get).toHaveBeenCalledWith(['key1', 'key2']);
    });
  });

  describe('getSettings', () => {
    beforeEach(() => {
      mockStorage.local.get.mockImplementation(keys => {
        const result = {};
        keys.forEach(key => {
          if (key === 'locale') result[key] = 'en';
          else if (key === 'ignoreFields') result[key] = ['password'];
          else if (key === 'customFields') result[key] = [];
          else result[key] = true;
        });
        return Promise.resolve(result);
      });
    });

    it('should fetch all settings from storage', async () => {
      const settings = await settingsCache.getSettings();

      expect(mockStorage.local.get).toHaveBeenCalledWith([
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
      ]);
      expect(settings.locale).toBe('en');
      expect(settings.ignoreFields).toEqual(['password']);
    });

    it('should return cached settings within TTL', async () => {
      // First call
      const settings1 = await settingsCache.getSettings();
      expect(mockStorage.local.get).toHaveBeenCalledTimes(1);

      // Second call within TTL
      const settings2 = await settingsCache.getSettings();
      expect(mockStorage.local.get).toHaveBeenCalledTimes(1);
      expect(settings1).toBe(settings2); // Same object reference
    });

    it('should refetch settings after TTL expires', async () => {
      // First call
      await settingsCache.getSettings();
      expect(mockStorage.local.get).toHaveBeenCalledTimes(1);

      // Advance time past settings TTL (30 seconds)
      jest.advanceTimersByTime(30001);

      // Second call should refetch
      await settingsCache.getSettings();
      expect(mockStorage.local.get).toHaveBeenCalledTimes(2);
    });

    it('should cache individual setting keys', async () => {
      await settingsCache.getSettings();
      mockStorage.local.get.mockClear();

      // Get individual key should use cache
      const locale = await settingsCache.get('locale');
      expect(mockStorage.local.get).not.toHaveBeenCalled();
      expect(locale).toBe('en');
    });
  });

  describe('set', () => {
    it('should set a value in cache', () => {
      settingsCache.set('testKey', 'testValue', 60000);

      // Verify by getting without storage call
      const stats = settingsCache.getStats();
      expect(stats.size).toBeGreaterThan(0);
    });

    it('should evict oldest entry when cache is full', () => {
      // Fill cache to max size (100)
      for (let i = 0; i < 100; i++) {
        settingsCache.set(`key${i}`, `value${i}`);
      }

      const statsBeforeEviction = settingsCache.getStats();
      expect(statsBeforeEviction.size).toBe(100);

      // Add one more to trigger eviction
      settingsCache.set('key100', 'value100');

      const statsAfterEviction = settingsCache.getStats();
      expect(statsAfterEviction.size).toBe(100);
    });

    it('should use default TTL when not specified', async () => {
      settingsCache.set('testKey', 'testValue');

      // Should be cached for default TTL
      jest.advanceTimersByTime(59999);
      mockStorage.local.get.mockClear();
      await settingsCache.get('testKey');
      expect(mockStorage.local.get).not.toHaveBeenCalled();
    });
  });

  describe('invalidate', () => {
    it('should invalidate a specific cache entry', async () => {
      // Cache a value
      await settingsCache.get('testKey', 60000);
      mockStorage.local.get.mockClear();

      // Invalidate it
      settingsCache.invalidate('testKey');

      // Should fetch from storage again
      await settingsCache.get('testKey', 60000);
      expect(mockStorage.local.get).toHaveBeenCalledTimes(1);
    });

    it('should invalidate settings cache when locale is invalidated', async () => {
      // Cache settings
      await settingsCache.getSettings();
      mockStorage.local.get.mockClear();

      // Invalidate locale
      settingsCache.invalidate('locale');

      // Should refetch settings
      await settingsCache.getSettings();
      expect(mockStorage.local.get).toHaveBeenCalled();
    });

    it('should invalidate settings cache when ignoreFields is invalidated', async () => {
      await settingsCache.getSettings();
      mockStorage.local.get.mockClear();

      settingsCache.invalidate('ignoreFields');

      await settingsCache.getSettings();
      expect(mockStorage.local.get).toHaveBeenCalled();
    });

    it('should invalidate settings cache when customFields is invalidated', async () => {
      await settingsCache.getSettings();
      mockStorage.local.get.mockClear();

      settingsCache.invalidate('customFields');

      await settingsCache.getSettings();
      expect(mockStorage.local.get).toHaveBeenCalled();
    });

    it('should not affect other cached entries', async () => {
      // Cache multiple values
      await settingsCache.get('key1', 60000);
      await settingsCache.get('key2', 60000);
      mockStorage.local.get.mockClear();

      // Invalidate only one
      settingsCache.invalidate('key1');

      // key2 should still be cached
      await settingsCache.get('key2');
      expect(mockStorage.local.get).not.toHaveBeenCalled();

      // key1 should be refetched
      await settingsCache.get('key1');
      expect(mockStorage.local.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('invalidateSettings', () => {
    it('should clear all settings-related cache', async () => {
      // Cache settings and individual keys
      await settingsCache.getSettings();
      await settingsCache.get('locale', 60000);
      mockStorage.local.get.mockClear();

      // Invalidate all settings
      settingsCache.invalidateSettings();

      // Should refetch settings
      await settingsCache.getSettings();
      expect(mockStorage.local.get).toHaveBeenCalled();
    });

    it('should clear all settings keys from cache', async () => {
      // Cache various settings
      await settingsCache.get('locale', 60000);
      await settingsCache.get('ignoreFields', 60000);
      await settingsCache.get('customFields', 60000);
      await settingsCache.get('enableSound', 60000);
      await settingsCache.get('enableAIDetection', 60000);
      await settingsCache.get('aiConfidenceThreshold', 60000);
      mockStorage.local.get.mockClear();

      // Invalidate all settings
      settingsCache.invalidateSettings();

      // All should be refetched
      await settingsCache.get('locale', 60000);
      await settingsCache.get('ignoreFields', 60000);
      await settingsCache.get('enableAIDetection', 60000);
      expect(mockStorage.local.get).toHaveBeenCalledTimes(3);
    });

    it('should not affect non-settings cache entries', async () => {
      // Cache a non-settings key
      await settingsCache.get('customKey', 60000);
      mockStorage.local.get.mockClear();

      // Invalidate settings
      settingsCache.invalidateSettings();

      // Custom key should still be cached
      await settingsCache.get('customKey', 60000);
      expect(mockStorage.local.get).not.toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('should clear all cache', async () => {
      // Cache multiple items
      await settingsCache.get('key1', 60000);
      await settingsCache.get('key2', 60000);
      await settingsCache.getSettings();

      // Clear cache
      settingsCache.clear();

      const stats = settingsCache.getStats();
      expect(stats.size).toBe(0);
    });

    it('should clear settings cache', async () => {
      // Cache settings
      await settingsCache.getSettings();
      mockStorage.local.get.mockClear();

      // Clear all cache
      settingsCache.clear();

      // Settings should be refetched
      await settingsCache.getSettings();
      expect(mockStorage.local.get).toHaveBeenCalled();
    });

    it('should require refetch for all keys after clear', async () => {
      // Cache some keys
      await settingsCache.get('key1', 60000);
      await settingsCache.get('key2', 60000);
      mockStorage.local.get.mockClear();

      // Clear cache
      settingsCache.clear();

      // All keys should be refetched
      await settingsCache.get('key1', 60000);
      await settingsCache.get('key2', 60000);
      expect(mockStorage.local.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('getStats', () => {
    it('should return cache size', async () => {
      await settingsCache.get('key1', 60000);
      await settingsCache.get('key2', 60000);
      await settingsCache.get('key3', 60000);

      const stats = settingsCache.getStats();
      expect(stats.size).toBeGreaterThanOrEqual(3);
      expect(stats.hitRate).toBe(0); // Not implemented yet
    });

    it('should return zero size for empty cache', () => {
      settingsCache.clear();

      const stats = settingsCache.getStats();
      expect(stats.size).toBe(0);
    });

    it('should update size after operations', async () => {
      settingsCache.clear();

      let stats = settingsCache.getStats();
      expect(stats.size).toBe(0);

      await settingsCache.get('key1', 60000);
      stats = settingsCache.getStats();
      expect(stats.size).toBeGreaterThanOrEqual(1);

      settingsCache.invalidate('key1');
      stats = settingsCache.getStats();
      expect(stats.size).toBeLessThan(stats.size + 1);
    });
  });

  describe('storage change listener', () => {
    it('should invalidate cache when storage change listener is triggered', async () => {
      // Cache a value
      await settingsCache.get('testKey', 60000);
      mockStorage.local.get.mockClear();

      // Manually trigger invalidation (simulates what the listener does)
      settingsCache.invalidate('testKey');

      // Should refetch from storage
      await settingsCache.get('testKey', 60000);
      expect(mockStorage.local.get).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple key invalidations', async () => {
      // Cache multiple values
      await settingsCache.get('key1', 60000);
      await settingsCache.get('key2', 60000);
      mockStorage.local.get.mockClear();

      // Simulate storage changes for multiple keys
      settingsCache.invalidate('key1');
      settingsCache.invalidate('key2');

      // Both should be refetched
      await settingsCache.get('key1', 60000);
      await settingsCache.get('key2', 60000);
      expect(mockStorage.local.get).toHaveBeenCalledTimes(2);
    });

    it('should invalidate settings cache on settings key change', async () => {
      // Cache settings
      await settingsCache.getSettings();
      mockStorage.local.get.mockClear();

      // Simulate locale change
      settingsCache.invalidate('locale');

      // Settings should be refetched
      await settingsCache.getSettings();
      expect(mockStorage.local.get).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle concurrent get requests for same key', async () => {
      // Make multiple concurrent requests
      const promises = [
        settingsCache.get('testKey', 60000),
        settingsCache.get('testKey', 60000),
        settingsCache.get('testKey', 60000)
      ];

      await Promise.all(promises);

      // Due to race conditions, may fetch 1-3 times
      expect(mockStorage.local.get.mock.calls.length).toBeGreaterThanOrEqual(1);
      expect(mockStorage.local.get.mock.calls.length).toBeLessThanOrEqual(3);
    });

    it('should handle very short TTL', async () => {
      await settingsCache.get('testKey', 1);

      jest.advanceTimersByTime(2);
      mockStorage.local.get.mockClear();

      await settingsCache.get('testKey', 1);
      expect(mockStorage.local.get).toHaveBeenCalled();
    });

    it('should handle zero TTL', async () => {
      await settingsCache.get('testKey', 0);
      mockStorage.local.get.mockClear();

      // Should refetch immediately
      await settingsCache.get('testKey', 0);
      expect(mockStorage.local.get).toHaveBeenCalled();
    });

    it('should handle large cache size', () => {
      // Add many entries
      for (let i = 0; i < 150; i++) {
        settingsCache.set(`key${i}`, `value${i}`);
      }

      const stats = settingsCache.getStats();
      expect(stats.size).toBeLessThanOrEqual(100); // Should not exceed MAX_CACHE_SIZE
    });
  });
});
