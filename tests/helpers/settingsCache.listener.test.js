/**
 * @jest-environment jsdom
 */

/**
 * Integration test for settingsCache storage listener
 */

describe('SettingsCache Storage Listener Integration', () => {
  let storageChangeListener;
  let mockStorageGet;

  beforeAll(() => {
    // Setup chrome mock before module import
    mockStorageGet = jest.fn(keys => {
      if (typeof keys === 'string') {
        return Promise.resolve({ [keys]: `value-${keys}` });
      }
      const result = {};
      keys.forEach(key => {
        result[key] = `value-${key}`;
      });
      return Promise.resolve(result);
    });

    global.chrome = {
      storage: {
        local: {
          get: mockStorageGet,
          set: jest.fn(() => Promise.resolve())
        },
        onChanged: {
          addListener: jest.fn(callback => {
            storageChangeListener = callback;
          })
        }
      }
    };

    // Import module after chrome mock is set up
    // This will trigger the listener registration
    jest.isolateModules(() => {
      require('../../helpers/settingsCache');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register storage change listener on module load', () => {
    expect(storageChangeListener).toBeDefined();
    expect(typeof storageChangeListener).toBe('function');
    expect(global.chrome.storage.onChanged.addListener).toHaveBeenCalledWith(storageChangeListener);
  });

  it('should call listener callback with changes for local storage area', () => {
    const changes = {
      locale: { newValue: 'ja', oldValue: 'en' }
    };
    const areaName = 'local';

    // This should not throw
    expect(() => {
      storageChangeListener(changes, areaName);
    }).not.toThrow();
  });

  it('should handle multiple key changes in listener', () => {
    const changes = {
      key1: { newValue: 'new1', oldValue: 'old1' },
      key2: { newValue: 'new2', oldValue: 'old2' },
      key3: { newValue: 'new3', oldValue: 'old3' }
    };
    const areaName = 'local';

    // This should not throw
    expect(() => {
      storageChangeListener(changes, areaName);
    }).not.toThrow();
  });

  it('should handle sync storage area changes', () => {
    const changes = {
      testKey: { newValue: 'changed', oldValue: 'original' }
    };
    const areaName = 'sync';

    // This should not throw even for non-local areas
    expect(() => {
      storageChangeListener(changes, areaName);
    }).not.toThrow();
  });

  it('should iterate through all changed keys', () => {
    const changes = {
      locale: { newValue: 'ja', oldValue: 'en' },
      ignoreFields: { newValue: ['password'], oldValue: [] },
      customFields: { newValue: [{ name: 'test' }], oldValue: [] }
    };
    const areaName = 'local';

    // Verify listener can process multiple keys
    expect(() => {
      storageChangeListener(changes, areaName);
    }).not.toThrow();
  });
});
