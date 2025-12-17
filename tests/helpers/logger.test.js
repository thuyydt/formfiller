// tests/helpers/logger.test.js
import {
  logger,
  LogLevel,
  debug,
  info,
  warn,
  error,
  report,
  group,
  groupEnd
} from '../../helpers/logger';

describe('Logger', () => {
  let consoleDebugSpy;
  let consoleInfoSpy;
  let consoleWarnSpy;
  let consoleErrorSpy;
  let consoleLogSpy;
  let consoleGroupSpy;
  let consoleGroupCollapsedSpy;
  let consoleGroupEndSpy;

  beforeEach(() => {
    // Spy on console methods
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();
    consoleGroupCollapsedSpy = jest.spyOn(console, 'groupCollapsed').mockImplementation();
    consoleGroupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation();

    // Reset logger config
    logger.configure({
      level: LogLevel.DEBUG,
      prefix: '[Form Filler]',
      enableInProduction: false,
      enableTimestamp: true
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('debug', () => {
    it('should log debug messages when level is DEBUG', () => {
      logger.configure({ level: LogLevel.DEBUG });
      logger.debug('Test debug message');
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should not log debug messages when level is INFO', () => {
      logger.configure({ level: LogLevel.INFO });
      logger.debug('Test debug message');
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should include prefix and timestamp', () => {
      logger.configure({ level: LogLevel.DEBUG, enableTimestamp: true });
      logger.debug('Test message');
      const call = consoleDebugSpy.mock.calls[0];
      expect(call[0]).toContain('[Form Filler]');
      expect(call[0]).toContain('DEBUG:');
    });

    it('should work with convenience function', () => {
      logger.configure({ level: LogLevel.DEBUG });
      debug('Test via convenience function');
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should handle additional arguments', () => {
      logger.configure({ level: LogLevel.DEBUG });
      const obj = { key: 'value' };
      logger.debug('Message with object', obj);
      expect(consoleDebugSpy).toHaveBeenCalled();
      expect(consoleDebugSpy.mock.calls[0]).toContain(obj);
    });
  });

  describe('info', () => {
    it('should log info messages when level is INFO', () => {
      logger.configure({ level: LogLevel.INFO });
      logger.info('Test info message');
      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it('should not log info messages when level is WARN', () => {
      logger.configure({ level: LogLevel.WARN });
      logger.info('Test info message');
      expect(consoleInfoSpy).not.toHaveBeenCalled();
    });

    it('should work with convenience function', () => {
      logger.configure({ level: LogLevel.INFO });
      info('Test via convenience function');
      expect(consoleInfoSpy).toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('should log warn messages when level is WARN', () => {
      logger.configure({ level: LogLevel.WARN });
      logger.warn('Test warn message');
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should not log warn messages when level is ERROR', () => {
      logger.configure({ level: LogLevel.ERROR });
      logger.warn('Test warn message');
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should work with convenience function', () => {
      logger.configure({ level: LogLevel.WARN });
      warn('Test via convenience function');
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      logger.error('Test error message');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should log error with Error object', () => {
      const err = new Error('Test error');
      logger.error('Error occurred', err);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      expect(consoleErrorSpy.mock.calls[1][0]).toBe('Stack:');
    });

    it('should log error with non-Error object', () => {
      const details = { code: 500, message: 'Server error' };
      logger.error('Error occurred', details);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      expect(consoleErrorSpy.mock.calls[1][0]).toBe('Details:');
    });

    it('should work with convenience function', () => {
      error('Test via convenience function');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle error without details', () => {
      logger.error('Simple error');
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('report', () => {
    it('should log report in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      logger.configure({ level: LogLevel.INFO });
      logger.report('Test report');
      expect(consoleLogSpy).toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });

    it('should log report with style', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      logger.configure({ level: LogLevel.INFO });
      logger.report('Test report', 'color: blue');
      expect(consoleLogSpy).toHaveBeenCalledWith('%cTest report', 'color: blue');

      process.env.NODE_ENV = originalEnv;
    });

    it('should not log report in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      logger.report('Test report');
      expect(consoleLogSpy).not.toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });

    it('should work with convenience function', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      logger.configure({ level: LogLevel.INFO });
      report('Test via convenience function');
      expect(consoleLogSpy).toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('group', () => {
    it('should create console group', () => {
      logger.configure({ level: LogLevel.DEBUG });
      logger.group('Test Group');
      expect(consoleGroupSpy).toHaveBeenCalledWith('Test Group');
    });

    it('should create collapsed group', () => {
      logger.configure({ level: LogLevel.DEBUG });
      logger.group('Test Group', true);
      expect(consoleGroupCollapsedSpy).toHaveBeenCalledWith('Test Group');
    });

    it('should not create group when level is too high', () => {
      logger.configure({ level: LogLevel.ERROR });
      logger.group('Test Group');
      expect(consoleGroupSpy).not.toHaveBeenCalled();
    });

    it('should work with convenience function', () => {
      logger.configure({ level: LogLevel.DEBUG });
      group('Test via convenience function');
      expect(consoleGroupSpy).toHaveBeenCalled();
    });
  });

  describe('groupEnd', () => {
    it('should end console group', () => {
      logger.configure({ level: LogLevel.DEBUG });
      logger.groupEnd();
      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });

    it('should not end group when level is too high', () => {
      logger.configure({ level: LogLevel.ERROR });
      logger.groupEnd();
      expect(consoleGroupEndSpy).not.toHaveBeenCalled();
    });

    it('should work with convenience function', () => {
      logger.configure({ level: LogLevel.DEBUG });
      groupEnd();
      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });
  });

  describe('configure', () => {
    it('should update logger configuration', () => {
      logger.configure({ level: LogLevel.ERROR, prefix: '[TEST]' });

      // Debug should not log with ERROR level
      logger.debug('Test');
      expect(consoleDebugSpy).not.toHaveBeenCalled();

      // Error should log
      logger.error('Error test');
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0];
      expect(call[0]).toContain('[TEST]');
    });

    it('should disable timestamp when configured', () => {
      logger.configure({ level: LogLevel.DEBUG, enableTimestamp: false });
      logger.debug('Test message');
      const call = consoleDebugSpy.mock.calls[0];
      expect(call[0]).not.toMatch(/\[\d{4}-\d{2}-\d{2}/);
    });

    it('should enable logging in production when configured', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      logger.configure({ level: LogLevel.DEBUG, enableInProduction: true });
      logger.debug('Test in production');
      expect(consoleDebugSpy).toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('production mode behavior', () => {
    it('should only log errors in production by default', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      logger.configure({ level: LogLevel.DEBUG, enableInProduction: false });

      logger.debug('Debug');
      logger.info('Info');
      logger.warn('Warn');
      logger.error('Error');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('LogLevel enum', () => {
    it('should export LogLevel enum', () => {
      expect(LogLevel.DEBUG).toBe(0);
      expect(LogLevel.INFO).toBe(1);
      expect(LogLevel.WARN).toBe(2);
      expect(LogLevel.ERROR).toBe(3);
      expect(LogLevel.NONE).toBe(4);
    });
  });

  describe('log level filtering', () => {
    it('should respect NONE level', () => {
      logger.configure({ level: LogLevel.NONE });

      logger.debug('Debug');
      logger.info('Info');
      logger.warn('Warn');
      logger.error('Error');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should allow all logs with DEBUG level', () => {
      logger.configure({ level: LogLevel.DEBUG });

      logger.debug('Debug');
      logger.info('Info');
      logger.warn('Warn');
      logger.error('Error');

      expect(consoleDebugSpy).toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
