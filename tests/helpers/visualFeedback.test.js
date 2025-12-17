// tests/helpers/visualFeedback.test.js
const {
  highlightFilledFields,
  showNotification,
  showFeedback
} = require('../../helpers/visualFeedback');
const { settingsCache } = require('../../helpers/settingsCache');

// Mock settingsCache
jest.mock('../../helpers/settingsCache', () => ({
  settingsCache: {
    get: jest.fn()
  }
}));

describe('visualFeedback', () => {
  beforeEach(() => {
    // Clear document
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('highlightFilledFields', () => {
    it('should return 0 when no fields are present', () => {
      const count = highlightFilledFields();
      expect(count).toBe(0);
    });

    it('should return 0 when fields are empty', () => {
      document.body.innerHTML = `
        <form>
          <input type="text" id="email" name="email" value="" />
          <input type="text" id="name" name="name" value="   " />
        </form>
      `;
      const count = highlightFilledFields();
      expect(count).toBe(0);
    });

    it('should count filled fields correctly', () => {
      document.body.innerHTML = `
        <form>
          <input type="text" id="email" name="email" value="test@example.com" data-form-filler-filled="true" />
          <input type="text" id="name" name="name" value="John Doe" data-form-filler-filled="true" />
          <input type="text" id="empty" name="empty" value="" />
        </form>
      `;
      const count = highlightFilledFields();
      expect(count).toBe(2);
    });

    it('should ignore hidden, submit, and button inputs', () => {
      document.body.innerHTML = `
        <form>
          <input type="hidden" value="secret" />
          <input type="submit" value="Submit" />
          <input type="button" value="Click me" />
          <input type="text" value="Visible" data-form-filler-filled="true" />
        </form>
      `;
      const count = highlightFilledFields();
      expect(count).toBe(1);
    });

    it('should ignore disabled fields', () => {
      document.body.innerHTML = `
        <form>
          <input type="text" value="Disabled" disabled />
          <input type="text" value="Enabled" data-form-filler-filled="true" />
        </form>
      `;
      const count = highlightFilledFields();
      expect(count).toBe(1);
    });

    it('should ignore readonly fields', () => {
      document.body.innerHTML = `
        <form>
          <input type="text" value="ReadOnly" readonly />
          <input type="text" value="Editable" data-form-filler-filled="true" />
        </form>
      `;
      const count = highlightFilledFields();
      expect(count).toBe(1);
    });

    it('should handle textareas and selects', () => {
      document.body.innerHTML = `
        <form>
          <textarea data-form-filler-filled="true">Some text</textarea>
          <select data-form-filler-filled="true">
            <option value="1" selected>Option 1</option>
          </select>
        </form>
      `;
      // Selects always have a value if an option is selected, so it counts
      const count = highlightFilledFields();
      expect(count).toBe(2);
    });

    it('should apply highlight animation to filled fields', () => {
      document.body.innerHTML = `
        <input type="text" id="test-input" value="Filled" data-form-filler-filled="true" />
      `;

      highlightFilledFields();

      const input = document.getElementById('test-input');
      expect(input.style.animation).toContain('formFillerHighlight');
      expect(input.style.transition).toContain('box-shadow');
    });

    it('should remove highlight animation after duration', () => {
      document.body.innerHTML = `
        <input type="text" id="test-input" value="Filled" data-form-filler-filled="true" />
      `;

      highlightFilledFields();

      const input = document.getElementById('test-input');
      expect(input.style.animation).toContain('formFillerHighlight');

      // Fast-forward time
      jest.advanceTimersByTime(1600); // HIGHLIGHT_DURATION is 1500

      expect(input.style.animation).toBe('');
    });

    it('should clean up observer if element is removed', () => {
      document.body.innerHTML = `
        <input type="text" id="test-input" value="Filled" data-form-filler-filled="true" />
      `;

      highlightFilledFields();

      const input = document.getElementById('test-input');
      input.remove();

      // Should not throw
      jest.advanceTimersByTime(1600);
    });
  });

  describe('showNotification', () => {
    it('should create notification element', () => {
      showNotification('Test message');
      const notification = document.getElementById('form-filler-notification');
      expect(notification).toBeTruthy();
      expect(notification.textContent).toContain('Test message');
    });

    it('should remove existing notification', () => {
      showNotification('First message');
      showNotification('Second message');

      const notifications = document.querySelectorAll('#form-filler-notification');
      expect(notifications.length).toBe(1);
      expect(notifications[0].textContent).toContain('Second message');
    });

    it('should apply correct styles for success', () => {
      showNotification('Success', 'success');
      const notification = document.getElementById('form-filler-notification');
      expect(notification.style.backgroundColor).toBe('rgb(16, 185, 129)'); // #10b981
    });

    it('should apply correct styles for warning', () => {
      showNotification('Warning', 'warning');
      const notification = document.getElementById('form-filler-notification');
      expect(notification.style.backgroundColor).toBe('rgb(245, 158, 11)'); // #f59e0b
    });

    it('should apply correct styles for error', () => {
      showNotification('Error', 'error');
      const notification = document.getElementById('form-filler-notification');
      expect(notification.style.backgroundColor).toBe('rgb(239, 68, 68)'); // #ef4444
    });

    it('should inject styles if not present', () => {
      expect(document.getElementById('form-filler-styles')).toBeNull();
      showNotification('Test');
      expect(document.getElementById('form-filler-styles')).toBeTruthy();
    });

    it('should remove notification after duration', () => {
      showNotification('Test');
      const notification = document.getElementById('form-filler-notification');
      expect(notification).toBeTruthy();

      // Fast-forward past NOTIFICATION_DURATION (3000) + animation (300)
      jest.advanceTimersByTime(3500);

      expect(document.getElementById('form-filler-notification')).toBeNull();
    });

    it('should handle removal if parent node is missing', () => {
      showNotification('Test');
      const notification = document.getElementById('form-filler-notification');

      // Manually remove it before timeout
      notification.remove();

      // Should not throw
      jest.advanceTimersByTime(3500);
    });
  });

  describe('showFeedback', () => {
    it('should show success notification when fields are filled', async () => {
      document.body.innerHTML = `
        <input type="text" value="Filled" data-form-filler-filled="true" />
      `;
      settingsCache.get.mockResolvedValue(false); // Disable sound for this test

      const count = await showFeedback();

      expect(count).toBe(1);
      const notification = document.getElementById('form-filler-notification');
      expect(notification.textContent).toContain('Filled 1 field');
      expect(notification.style.backgroundColor).toBe('rgb(16, 185, 129)');
    });

    it('should show plural message for multiple fields', async () => {
      document.body.innerHTML = `
        <input type="text" value="Filled 1" data-form-filler-filled="true" />
        <input type="text" value="Filled 2" data-form-filler-filled="true" />
      `;
      settingsCache.get.mockResolvedValue(false);

      const count = await showFeedback();

      expect(count).toBe(2);
      const notification = document.getElementById('form-filler-notification');
      expect(notification.textContent).toContain('Filled 2 fields');
    });

    it('should show warning notification when no fields are filled', async () => {
      document.body.innerHTML = '';
      settingsCache.get.mockResolvedValue(false);

      const count = await showFeedback();

      expect(count).toBe(0);
      const notification = document.getElementById('form-filler-notification');
      expect(notification.textContent).toContain('No fields found to fill');
      expect(notification.style.backgroundColor).toBe('rgb(245, 158, 11)');
    });

    it('should play sound if enabled and fields filled', async () => {
      document.body.innerHTML = `
        <input type="text" value="Filled" data-form-filler-filled="true" />
      `;
      settingsCache.get.mockResolvedValue(true);

      // Mock AudioContext
      const mockOscillator = {
        connect: jest.fn(),
        frequency: { value: 0 },
        type: '',
        start: jest.fn(),
        stop: jest.fn()
      };
      const mockGain = {
        connect: jest.fn(),
        gain: {
          setValueAtTime: jest.fn(),
          exponentialRampToValueAtTime: jest.fn()
        }
      };
      const mockAudioContext = {
        createOscillator: jest.fn(() => mockOscillator),
        createGain: jest.fn(() => mockGain),
        destination: {},
        currentTime: 0
      };

      window.AudioContext = jest.fn(() => mockAudioContext);

      await showFeedback();

      // Wait for promises to resolve
      await Promise.resolve();

      expect(settingsCache.get).toHaveBeenCalledWith('enableSound');
      expect(window.AudioContext).toHaveBeenCalled();
      expect(mockOscillator.start).toHaveBeenCalled();
      expect(mockOscillator.stop).toHaveBeenCalled();
    });

    it('should not play sound if disabled', async () => {
      document.body.innerHTML = `
        <input type="text" value="Filled" data-form-filler-filled="true" />
      `;
      settingsCache.get.mockResolvedValue(false);

      window.AudioContext = jest.fn();

      await showFeedback();

      expect(settingsCache.get).toHaveBeenCalledWith('enableSound');
      expect(window.AudioContext).not.toHaveBeenCalled();
    });

    it('should not play sound if no fields filled', async () => {
      document.body.innerHTML = '';
      settingsCache.get.mockResolvedValue(true);

      window.AudioContext = jest.fn();

      await showFeedback();

      expect(window.AudioContext).not.toHaveBeenCalled();
    });

    it('should handle missing AudioContext gracefully', async () => {
      document.body.innerHTML = `
        <input type="text" value="Filled" />
      `;
      settingsCache.get.mockResolvedValue(true);

      window.AudioContext = undefined;
      window.webkitAudioContext = undefined;

      await showFeedback();

      // Should not throw
    });

    it('should handle audio errors gracefully', async () => {
      document.body.innerHTML = `
        <input type="text" value="Filled" />
      `;
      settingsCache.get.mockResolvedValue(true);

      window.AudioContext = jest.fn(() => {
        throw new Error('Audio error');
      });

      await showFeedback();

      // Should not throw
    });
  });
});
