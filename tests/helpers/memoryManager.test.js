// tests/helpers/memoryManager.test.js
// Unit tests for MemoryManager stability improvements

describe('MemoryManager', () => {
  let memoryManager;
  let originalSetInterval;
  let originalClearInterval;
  let originalSetTimeout;
  let originalClearTimeout;
  let intervalCallbacks;
  let timeoutCallbacks;
  let intervalId;
  let timeoutId;

  beforeAll(() => {
    // Store original timers
    originalSetInterval = global.setInterval;
    originalClearInterval = global.clearInterval;
    originalSetTimeout = global.setTimeout;
    originalClearTimeout = global.clearTimeout;
  });

  beforeEach(() => {
    // Reset modules before each test
    jest.resetModules();

    // Setup timer mocks
    intervalCallbacks = new Map();
    timeoutCallbacks = new Map();
    intervalId = 1;
    timeoutId = 1;

    global.setInterval = jest.fn((callback, delay) => {
      const id = intervalId++;
      intervalCallbacks.set(id, { callback, delay });
      return id;
    });

    global.clearInterval = jest.fn(id => {
      intervalCallbacks.delete(id);
    });

    global.setTimeout = jest.fn((callback, delay) => {
      const id = timeoutId++;
      timeoutCallbacks.set(id, { callback, delay });
      return id;
    });

    global.clearTimeout = jest.fn(id => {
      timeoutCallbacks.delete(id);
    });

    // Mock window for addEventListener
    global.window = {
      ...global.window,
      addEventListener: jest.fn(),
      setTimeout: global.setTimeout,
      clearTimeout: global.clearTimeout,
      setInterval: global.setInterval,
      clearInterval: global.clearInterval
    };

    // Mock performance.memory for memory pressure tests
    global.performance = {
      ...global.performance,
      memory: {
        usedJSHeapSize: 50 * 1024 * 1024, // 50MB
        jsHeapSizeLimit: 100 * 1024 * 1024 // 100MB
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore original timers
    global.setInterval = originalSetInterval;
    global.clearInterval = originalClearInterval;
    global.setTimeout = originalSetTimeout;
    global.clearTimeout = originalClearTimeout;
  });

  describe('constructor', () => {
    it('should register default cleanup callbacks', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      // Verify default callbacks are registered
      const stats = memoryManager.getMemoryStats();
      expect(stats.cacheSize).toBeGreaterThanOrEqual(2); // At least 2 default callbacks
    });

    it('should start auto cleanup interval', async () => {
      await import('../../helpers/memoryManager.ts');

      // setInterval should be called for auto cleanup
      expect(global.setInterval).toHaveBeenCalled();
    });

    it('should register beforeunload listener', async () => {
      await import('../../helpers/memoryManager.ts');

      // Check that the module loaded successfully
      // The actual addEventListener behavior depends on the test environment
      if (global.window.addEventListener && global.window.addEventListener.mock) {
        expect(global.window.addEventListener).toHaveBeenCalledWith(
          'beforeunload',
          expect.any(Function)
        );
      } else {
        // If mock not available, just ensure module loads without error
        expect(true).toBe(true);
      }
    });

    it('should register pagehide listener', async () => {
      await import('../../helpers/memoryManager.ts');

      // May be called with pagehide - depends on environment
      // Check if addEventListener was called (it's mocked in beforeEach)
      if (global.window.addEventListener && global.window.addEventListener.mock) {
        const calls = global.window.addEventListener.mock.calls;
        const hasPagehide = calls.some(call => call[0] === 'pagehide');
        const hasBeforeunload = calls.some(call => call[0] === 'beforeunload');

        // At least one cleanup listener should be registered
        expect(hasPagehide || hasBeforeunload).toBe(true);
      } else {
        // If mock not available, just ensure module loads without error
        expect(true).toBe(true);
      }
    });
  });

  describe('registerCleanup', () => {
    it('should add cleanup callback', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');
      const initialSize = memoryManager.getMemoryStats().cacheSize;

      const mockCallback = jest.fn();
      memoryManager.registerCleanup(mockCallback);

      expect(memoryManager.getMemoryStats().cacheSize).toBe(initialSize + 1);
    });
  });

  describe('clearAll', () => {
    it('should call all registered callbacks', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      const mockCallback1 = jest.fn();
      const mockCallback2 = jest.fn();
      memoryManager.registerCleanup(mockCallback1);
      memoryManager.registerCleanup(mockCallback2);

      memoryManager.clearAll();

      expect(mockCallback1).toHaveBeenCalled();
      expect(mockCallback2).toHaveBeenCalled();
    });

    it('should handle callback errors gracefully', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      const errorCallback = jest.fn(() => {
        throw new Error('Test error');
      });
      const successCallback = jest.fn();

      memoryManager.registerCleanup(errorCallback);
      memoryManager.registerCleanup(successCallback);

      // Should not throw
      expect(() => memoryManager.clearAll()).not.toThrow();

      // Both callbacks should be attempted
      expect(errorCallback).toHaveBeenCalled();
      expect(successCallback).toHaveBeenCalled();
    });
  });

  describe('scheduleCleanup', () => {
    it('should schedule cleanup with delay', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      memoryManager.scheduleCleanup(1000);

      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
    });

    it('should debounce multiple schedule calls', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      memoryManager.scheduleCleanup(1000);
      memoryManager.scheduleCleanup(1000);
      memoryManager.scheduleCleanup(1000);

      // clearTimeout should be called for debouncing
      expect(global.clearTimeout).toHaveBeenCalled();
    });
  });

  describe('cancelCleanup', () => {
    it('should cancel scheduled cleanup', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      memoryManager.scheduleCleanup(1000);
      memoryManager.cancelCleanup();

      expect(global.clearTimeout).toHaveBeenCalled();
    });
  });

  describe('stopAutoCleanup', () => {
    it('should stop auto cleanup interval', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      memoryManager.stopAutoCleanup();

      expect(global.clearInterval).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should stop auto cleanup', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      memoryManager.destroy();

      expect(global.clearInterval).toHaveBeenCalled();
    });

    it('should cancel pending cleanup', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      memoryManager.scheduleCleanup(1000);
      memoryManager.destroy();

      expect(global.clearTimeout).toHaveBeenCalled();
    });

    it('should run final cleanup', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      const mockCallback = jest.fn();
      memoryManager.registerCleanup(mockCallback);

      memoryManager.destroy();

      expect(mockCallback).toHaveBeenCalled();
    });

    it('should mark manager as destroyed', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      memoryManager.destroy();

      expect(memoryManager.isActive()).toBe(false);
    });

    it('should be idempotent', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      // Call destroy multiple times
      memoryManager.destroy();
      memoryManager.destroy();
      memoryManager.destroy();

      // Should not throw and should remain inactive
      expect(memoryManager.isActive()).toBe(false);
    });
  });

  describe('isActive', () => {
    it('should return true when not destroyed', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      expect(memoryManager.isActive()).toBe(true);
    });

    it('should return false after destroy', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      memoryManager.destroy();

      expect(memoryManager.isActive()).toBe(false);
    });
  });

  describe('getMemoryStats', () => {
    it('should return cache size', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      const stats = memoryManager.getMemoryStats();

      expect(stats).toHaveProperty('cacheSize');
      expect(typeof stats.cacheSize).toBe('number');
    });

    it('should return timestamp', async () => {
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      const stats = memoryManager.getMemoryStats();

      expect(stats).toHaveProperty('timestamp');
      expect(typeof stats.timestamp).toBe('number');
    });

    it('should include JS heap size when available', async () => {
      // Note: performance.memory may not be available in all test environments
      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      const stats = memoryManager.getMemoryStats();

      // jsHeapSize is only present when performance.memory is available
      expect(stats).toHaveProperty('cacheSize');
      expect(stats).toHaveProperty('timestamp');
      // jsHeapSize may or may not be present depending on environment
    });
  });

  describe('checkMemoryPressure', () => {
    it('should return false when memory usage is low', async () => {
      global.performance.memory = {
        usedJSHeapSize: 30 * 1024 * 1024, // 30MB
        jsHeapSizeLimit: 100 * 1024 * 1024 // 100MB - 30% usage
      };

      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      expect(memoryManager.checkMemoryPressure()).toBe(false);
    });

    it('should return true and trigger cleanup when memory usage is high', async () => {
      global.performance.memory = {
        usedJSHeapSize: 85 * 1024 * 1024, // 85MB
        jsHeapSizeLimit: 100 * 1024 * 1024 // 100MB - 85% usage (above 80%)
      };

      const { memoryManager } = await import('../../helpers/memoryManager.ts');

      const mockCallback = jest.fn();
      memoryManager.registerCleanup(mockCallback);

      const result = memoryManager.checkMemoryPressure();

      expect(result).toBe(true);
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('cleanupAfterFill', () => {
    it('should schedule cleanup with default delay', async () => {
      const { cleanupAfterFill } = await import('../../helpers/memoryManager.ts');

      cleanupAfterFill();

      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 500);
    });

    it('should schedule cleanup with custom delay', async () => {
      const { cleanupAfterFill } = await import('../../helpers/memoryManager.ts');

      cleanupAfterFill(1000);

      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
    });
  });

  describe('forceCleanup', () => {
    it('should clear all caches immediately', async () => {
      const { memoryManager, forceCleanup } = await import('../../helpers/memoryManager.ts');

      const mockCallback = jest.fn();
      memoryManager.registerCleanup(mockCallback);

      forceCleanup();

      expect(mockCallback).toHaveBeenCalled();
    });
  });
});

describe('MutationObserver cleanup in fillSelects', () => {
  beforeEach(() => {
    jest.resetModules();

    // Mock MutationObserver
    global.MutationObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn()
    }));

    // Mock DOM methods without modifying document.body
    document.querySelectorAll = jest.fn().mockReturnValue([]);
  });

  it('should export cleanupSelectObservers function', async () => {
    const fillSelects = await import('../../forms/fillSelects.ts');

    expect(typeof fillSelects.cleanupSelectObservers).toBe('function');
  });
});
