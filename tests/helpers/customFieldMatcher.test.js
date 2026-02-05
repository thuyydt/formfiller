// customFieldMatcher.test.js
import { matchCustomField } from '../../helpers/customFieldMatcher';

describe('customFieldMatcher', () => {
  let mockElement;

  beforeEach(() => {
    // Create a mock input element
    mockElement = document.createElement('input');
    mockElement.type = 'text';
    mockElement.name = 'user_email';
    mockElement.id = 'email-input';
    mockElement.className = 'form-control email-field';
  });

  describe('Wildcard Pattern Matching', () => {
    test('should match *suffix pattern', () => {
      const customFields = [{ field: '*email', type: 'faker', value: 'internet.email' }];

      const result = matchCustomField(mockElement, customFields, false);
      expect(result).not.toBeNull();
      expect(result.field).toBe('*email');
    });

    test('should match prefix* pattern', () => {
      mockElement.name = 'email_address';
      const customFields = [{ field: 'email*', type: 'faker', value: 'internet.email' }];

      const result = matchCustomField(mockElement, customFields, false);
      expect(result).not.toBeNull();
      expect(result.field).toBe('email*');
    });

    test('should match *infix* pattern', () => {
      const customFields = [{ field: '*mail*', type: 'faker', value: 'internet.email' }];

      const result = matchCustomField(mockElement, customFields, false);
      expect(result).not.toBeNull();
      expect(result.field).toBe('*mail*');
    });

    test('should match exact pattern (case-insensitive)', () => {
      mockElement.name = 'EMAIL';
      const customFields = [{ field: 'email', type: 'faker', value: 'internet.email' }];

      const result = matchCustomField(mockElement, customFields, false);
      expect(result).not.toBeNull();
    });

    test('should not match when pattern does not match', () => {
      const customFields = [{ field: '*phone*', type: 'faker', value: 'phone.number' }];

      const result = matchCustomField(mockElement, customFields, false);
      expect(result).toBeNull();
    });
  });

  describe('Class Selector Matching', () => {
    test('should match class selector without wildcard', () => {
      const customFields = [{ field: '.email-field', type: 'faker', value: 'internet.email' }];

      const result = matchCustomField(mockElement, customFields, false);
      expect(result).not.toBeNull();
      expect(result.field).toBe('.email-field');
    });

    test('should match class selector with wildcard', () => {
      const customFields = [{ field: '.*-field', type: 'faker', value: 'internet.email' }];

      const result = matchCustomField(mockElement, customFields, false);
      expect(result).not.toBeNull();
    });
  });

  describe('Attribute Selector Matching', () => {
    test('should match attribute selector', () => {
      mockElement.setAttribute('data-type', 'email');
      const customFields = [
        { field: '[data-type="email"]', type: 'faker', value: 'internet.email' }
      ];

      const result = matchCustomField(mockElement, customFields, false);
      expect(result).not.toBeNull();
    });

    test('should match attribute selector with wildcard', () => {
      mockElement.setAttribute('data-field', 'user_email_primary');
      const customFields = [
        { field: '[data-field="*email*"]', type: 'faker', value: 'internet.email' }
      ];

      const result = matchCustomField(mockElement, customFields, false);
      expect(result).not.toBeNull();
    });
  });

  describe('Priority and Multiple Rules', () => {
    test('should return first matching rule', () => {
      const customFields = [
        { field: '*email*', type: 'list', value: 'test1@example.com' },
        { field: '*mail*', type: 'list', value: 'test2@example.com' }
      ];

      const result = matchCustomField(mockElement, customFields, false);
      expect(result).not.toBeNull();
      expect(result.value).toBe('test1@example.com');
    });
  });

  describe('Edge Cases', () => {
    test('should return null when customFields is null', () => {
      const result = matchCustomField(mockElement, null, false);
      expect(result).toBeNull();
    });

    test('should return null when customFields is empty array', () => {
      const result = matchCustomField(mockElement, [], false);
      expect(result).toBeNull();
    });

    test('should skip fields without field property', () => {
      const customFields = [{ type: 'faker', value: 'internet.email' }];

      const result = matchCustomField(mockElement, customFields, false);
      expect(result).toBeNull();
    });

    test('should handle elements without attributes', () => {
      const minimalElement = document.createElement('input');
      const customFields = [{ field: '*test*', type: 'list', value: 'test' }];

      const result = matchCustomField(minimalElement, customFields, false);
      expect(result).toBeNull();
    });
  });

  describe('Label-Based Matching', () => {
    test('should match using label when enabled', () => {
      // Create a label for the input
      const label = document.createElement('label');
      label.textContent = 'Email Address';
      label.htmlFor = mockElement.id;
      document.body.appendChild(label);
      document.body.appendChild(mockElement);

      mockElement.name = 'field123'; // Non-descriptive name

      const customFields = [{ field: '*email*', type: 'faker', value: 'internet.email' }];

      const result = matchCustomField(mockElement, customFields, true);

      // Clean up
      document.body.removeChild(label);
      document.body.removeChild(mockElement);

      expect(result).not.toBeNull();
    });
  });
});
