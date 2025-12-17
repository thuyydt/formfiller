// Test setup file
// Mock Chrome APIs
global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn()
    },
    sendMessage: jest.fn()
  },
  storage: {
    local: {
      get: jest.fn((keys, callback) => {
        callback({});
      }),
      set: jest.fn((data, callback) => {
        if (callback) callback();
      })
    }
  },
  contextMenus: {
    create: jest.fn(),
    removeAll: jest.fn()
  },
  commands: {
    onCommand: {
      addListener: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn()
  },
  action: {
    onClicked: {
      addListener: jest.fn()
    }
  }
};

// Mock window.getComputedStyle
global.window.getComputedStyle = jest.fn(() => ({
  display: 'block',
  visibility: 'visible',
  opacity: '1'
}));

// Setup DOM
document.body.innerHTML = '';
