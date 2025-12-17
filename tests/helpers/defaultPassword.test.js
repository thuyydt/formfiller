// tests/helpers/defaultPassword.test.js
import { fillSingleField } from '../../helpers/fillSingleField';

// Mock modules
jest.mock('../../helpers/fakerLocale', () => ({
  faker: {
    internet: {
      password: jest.fn(() => 'randomPassword123')
    },
    person: {
      firstName: jest.fn(() => 'John')
    },
    location: {
      streetAddress: jest.fn(() => '123 Main St')
    },
    lorem: {
      paragraph: jest.fn(() => 'Lorem ipsum'),
      lines: jest.fn(() => 'Line 1\nLine 2')
    }
  }
}));

jest.mock('../../helpers/typeDetection', () => ({
  getElmType: jest.fn(input => {
    if (input.type === 'password') return 'password';
    if (input.type === 'email') return 'email';
    return 'text';
  }),
  getElmJapanType: jest.fn(() => 'none')
}));

jest.mock('../../helpers/customFieldMatcher', () => ({
  matchCustomField: jest.fn((input, customFields) => {
    if (!customFields) return null;
    return (
      customFields.find(
        field => input.name?.includes(field.field) || input.id?.includes(field.field)
      ) || null
    );
  })
}));

jest.mock('../../helpers/visualFeedback', () => ({
  showNotification: jest.fn()
}));

jest.mock('../../helpers/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn()
  }
}));

describe('Default Password Priority', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('fillSingleField - Password field with defaultPassword', () => {
    test('should use defaultPassword when set for password field', () => {
      const input = document.createElement('input');
      input.type = 'password';
      input.name = 'password';
      container.appendChild(input);

      const settings = {
        defaultPassword: 'MyTestPassword123'
      };

      fillSingleField(input, settings);

      expect(input.value).toBe('MyTestPassword123');
    });

    test('should use random password when defaultPassword is not set', () => {
      const input = document.createElement('input');
      input.type = 'password';
      input.name = 'password';
      container.appendChild(input);

      const settings = {};

      fillSingleField(input, settings);

      expect(input.value).toBe('randomPassword123');
    });

    test('should use random password when defaultPassword is empty string', () => {
      const input = document.createElement('input');
      input.type = 'password';
      input.name = 'password';
      container.appendChild(input);

      const settings = {
        defaultPassword: ''
      };

      fillSingleField(input, settings);

      expect(input.value).toBe('randomPassword123');
    });

    test('should use defaultPassword even when custom field list is matched', () => {
      const input = document.createElement('input');
      input.type = 'password';
      input.name = 'user_password';
      container.appendChild(input);

      const settings = {
        defaultPassword: 'MyTestPassword123',
        customFields: [
          {
            field: 'user_password',
            type: 'list',
            value: 'pass1,pass2,pass3'
          }
        ]
      };

      fillSingleField(input, settings);

      // Should use defaultPassword, not values from the list
      expect(input.value).toBe('MyTestPassword123');
    });

    test('should not use defaultPassword for non-password fields', () => {
      const input = document.createElement('input');
      input.type = 'email';
      input.name = 'email';
      container.appendChild(input);

      const settings = {
        defaultPassword: 'MyTestPassword123',
        customFields: [
          {
            field: 'email',
            type: 'list',
            value: 'test1@test.com,test2@test.com'
          }
        ]
      };

      fillSingleField(input, settings);

      // Should use list value, not defaultPassword
      expect(['test1@test.com', 'test2@test.com']).toContain(input.value);
    });
  });

  describe('Priority order', () => {
    test('should prioritize defaultPassword over custom field list for password fields', () => {
      const input = document.createElement('input');
      input.type = 'password';
      input.name = 'pwd';
      container.appendChild(input);

      const settings = {
        defaultPassword: 'Priority123',
        customFields: [
          {
            field: 'pwd',
            type: 'list',
            value: 'weak1,weak2,weak3'
          }
        ]
      };

      fillSingleField(input, settings);

      expect(input.value).toBe('Priority123');
      expect(input.value).not.toBe('weak1');
      expect(input.value).not.toBe('weak2');
      expect(input.value).not.toBe('weak3');
    });

    test('should use custom field list for non-password fields', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'username';
      container.appendChild(input);

      const settings = {
        defaultPassword: 'ShouldNotBeUsed',
        customFields: [
          {
            field: 'username',
            type: 'list',
            value: 'user1,user2,user3'
          }
        ]
      };

      fillSingleField(input, settings);

      expect(['user1', 'user2', 'user3']).toContain(input.value);
      expect(input.value).not.toBe('ShouldNotBeUsed');
    });
  });

  describe('Edge cases', () => {
    test('should handle defaultPassword with only whitespace', () => {
      const input = document.createElement('input');
      input.type = 'password';
      input.name = 'password';
      container.appendChild(input);

      const settings = {
        defaultPassword: '   '
      };

      fillSingleField(input, settings);

      // Should use random password when defaultPassword is only whitespace
      expect(input.value).toBe('randomPassword123');
    });

    test('should work with special characters in defaultPassword', () => {
      const input = document.createElement('input');
      input.type = 'password';
      input.name = 'password';
      container.appendChild(input);

      const settings = {
        defaultPassword: 'P@ssw0rd!#$%^&*()'
      };

      fillSingleField(input, settings);

      expect(input.value).toBe('P@ssw0rd!#$%^&*()');
    });

    test('should work with unicode characters in defaultPassword', () => {
      const input = document.createElement('input');
      input.type = 'password';
      input.name = 'password';
      container.appendChild(input);

      const settings = {
        defaultPassword: 'パスワード123'
      };

      fillSingleField(input, settings);

      expect(input.value).toBe('パスワード123');
    });
  });
});
