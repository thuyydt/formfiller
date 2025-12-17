// tests/helpers/fillSingleField.test.js
import { fillSingleField } from '../../helpers/fillSingleField';
import * as visualFeedback from '../../helpers/visualFeedback';
import * as logger from '../../helpers/logger';

// Mock dependencies
jest.mock('../../helpers/visualFeedback');
jest.mock('../../helpers/logger');

// Mock faker
jest.mock('../../helpers/fakerLocale', () => ({
  faker: {
    helpers: {
      fromRegExp: jest.fn(pattern => {
        // Simple regex mock - return a matching pattern
        if (pattern.includes('[A-Z]{3}-[0-9]{4}')) {
          return 'ABC-1234';
        }
        return 'MOCK-VALUE';
      })
    },
    location: {
      streetAddress: jest.fn(() => '123 Main St')
    },
    lorem: {
      paragraph: jest.fn(() => 'Lorem ipsum dolor sit amet'),
      lines: jest.fn(() => 'Line 1\nLine 2\nLine 3')
    },
    person: {
      firstName: jest.fn(() => 'John')
    }
  }
}));

jest.mock('../../helpers/typeDetection', () => ({
  getElmType: jest.fn(input => {
    if (input.type === 'password') return 'password';
    if (input.name?.includes('email')) return 'email';
    if (input.name?.includes('phone')) return 'phone';
    return 'text';
  }),
  getElmJapanType: jest.fn(() => null)
}));

jest.mock('../../helpers/customFieldMatcher', () => ({
  matchCustomField: jest.fn(() => null)
}));

jest.mock('../../forms/inputFillers', () => ({
  generateInputValue: jest.fn(type => {
    if (type === 'email') return 'test@example.com';
    if (type === 'phone') return '123-456-7890';
    if (type === 'password') return 'P@ssw0rd123';
    return 'test value';
  })
}));

describe('fillSingleField', () => {
  let mockInput;
  let mockTextarea;
  let mockSelect;

  beforeEach(() => {
    // Create mock elements
    mockInput = document.createElement('input');
    mockInput.type = 'text';
    mockInput.name = 'testField';

    mockTextarea = document.createElement('textarea');
    mockTextarea.name = 'testTextarea';

    mockSelect = document.createElement('select');
    const option1 = document.createElement('option');
    option1.value = 'option1';
    option1.text = 'Option 1';
    const option2 = document.createElement('option');
    option2.value = 'option2';
    option2.text = 'Option 2';
    mockSelect.appendChild(option1);
    mockSelect.appendChild(option2);

    // Clear mocks
    jest.clearAllMocks();
  });

  describe('Input Fields', () => {
    it('should fill a text input successfully', () => {
      fillSingleField(mockInput);
      expect(mockInput.value).toBeTruthy();
      expect(visualFeedback.showNotification).toHaveBeenCalledWith(
        expect.stringContaining('Filled:'),
        'success'
      );
    });

    it('should not fill disabled input', () => {
      mockInput.disabled = true;
      fillSingleField(mockInput);
      expect(visualFeedback.showNotification).toHaveBeenCalledWith('Field is disabled', 'warning');
    });

    it('should not fill readonly input', () => {
      mockInput.readOnly = true;
      fillSingleField(mockInput);
      expect(visualFeedback.showNotification).toHaveBeenCalledWith('Field is read-only', 'warning');
    });

    it('should skip hidden input type', () => {
      mockInput.type = 'hidden';
      fillSingleField(mockInput);
      expect(visualFeedback.showNotification).toHaveBeenCalledWith(
        'Cannot fill hidden fields',
        'warning'
      );
    });

    it('should skip submit input type', () => {
      mockInput.type = 'submit';
      fillSingleField(mockInput);
      expect(visualFeedback.showNotification).toHaveBeenCalledWith(
        'Cannot fill submit fields',
        'warning'
      );
    });

    it('should skip button input type', () => {
      mockInput.type = 'button';
      fillSingleField(mockInput);
      expect(visualFeedback.showNotification).toHaveBeenCalledWith(
        'Cannot fill button fields',
        'warning'
      );
    });

    it('should skip file input type', () => {
      mockInput.type = 'file';
      fillSingleField(mockInput);
      expect(visualFeedback.showNotification).toHaveBeenCalledWith(
        'Cannot fill file fields',
        'warning'
      );
    });

    it('should handle checkbox input', () => {
      mockInput.type = 'checkbox';
      fillSingleField(mockInput);
      expect(typeof mockInput.checked).toBe('boolean');
    });

    it('should handle radio input', () => {
      mockInput.type = 'radio';
      fillSingleField(mockInput);
      expect(mockInput.checked).toBe(true);
    });

    it('should use defaultPassword for password fields', () => {
      const { getElmType } = require('../../helpers/typeDetection');
      getElmType.mockReturnValue('password');

      mockInput.type = 'password';
      const settings = { defaultPassword: 'MySecretPass123' };
      fillSingleField(mockInput, settings);
      expect(mockInput.value).toBe('MySecretPass123');
    });

    it('should not use empty defaultPassword', () => {
      const { getElmType } = require('../../helpers/typeDetection');
      getElmType.mockReturnValue('password');

      mockInput.type = 'password';
      const settings = { defaultPassword: '   ' };
      fillSingleField(mockInput, settings);
      expect(mockInput.value).toBe('P@ssw0rd123'); // Falls back to generated
    });

    it('should handle custom field with list type', () => {
      const { matchCustomField } = require('../../helpers/customFieldMatcher');
      matchCustomField.mockReturnValue({
        type: 'list',
        value: 'value1, value2, value3',
        field: 'testField'
      });

      fillSingleField(mockInput);
      expect(['value1', 'value2', 'value3']).toContain(mockInput.value);
    });

    it('should handle custom field list with defaultPassword for password', () => {
      const { matchCustomField } = require('../../helpers/customFieldMatcher');
      const { getElmType } = require('../../helpers/typeDetection');

      matchCustomField.mockReturnValue({
        type: 'list',
        value: 'pass1, pass2, pass3',
        field: 'password'
      });
      getElmType.mockReturnValue('password');

      mockInput.type = 'password';
      const settings = { defaultPassword: 'DefaultPass' };
      fillSingleField(mockInput, settings);
      expect(mockInput.value).toBe('DefaultPass');
    });

    it('should handle custom field with regex type', () => {
      const { matchCustomField } = require('../../helpers/customFieldMatcher');
      matchCustomField.mockReturnValue({
        type: 'regex',
        value: '[A-Z]{3}-[0-9]{4}',
        field: 'testField'
      });

      fillSingleField(mockInput);
      expect(mockInput.value).toMatch(/[A-Z]{3}-[0-9]{4}/);
    });

    it('should handle custom field with faker type', () => {
      const { matchCustomField } = require('../../helpers/customFieldMatcher');
      matchCustomField.mockReturnValue({
        type: 'faker',
        faker: 'person.firstName',
        field: 'testField',
        value: ''
      });

      fillSingleField(mockInput);
      expect(mockInput.value).toBeTruthy();
    });

    it('should handle invalid faker path gracefully', () => {
      const { matchCustomField } = require('../../helpers/customFieldMatcher');
      matchCustomField.mockReturnValue({
        type: 'faker',
        faker: 'invalid.path.that.doesnt.exist',
        field: 'testField',
        value: ''
      });

      fillSingleField(mockInput);
      // Should fall back to normal generation
      expect(mockInput.value).toBeTruthy();
    });

    it('should handle custom field list with empty values', () => {
      const { matchCustomField } = require('../../helpers/customFieldMatcher');
      matchCustomField.mockReturnValue({
        type: 'list',
        value: ',,, ,',
        field: 'testField'
      });

      fillSingleField(mockInput);
      // Should fall back to normal generation since no valid values
      expect(mockInput.value).toBeTruthy();
    });

    it('should use field name in success notification', () => {
      mockInput.name = 'emailField';
      fillSingleField(mockInput);
      expect(visualFeedback.showNotification).toHaveBeenCalledWith('Filled: emailField', 'success');
    });

    it('should use field id if name is not available', () => {
      mockInput.name = '';
      mockInput.id = 'emailId';
      fillSingleField(mockInput);
      expect(visualFeedback.showNotification).toHaveBeenCalledWith('Filled: emailId', 'success');
    });

    it('should use placeholder if name and id are not available', () => {
      mockInput.name = '';
      mockInput.id = '';
      mockInput.placeholder = 'Enter email';
      fillSingleField(mockInput);
      expect(visualFeedback.showNotification).toHaveBeenCalledWith(
        'Filled: Enter email',
        'success'
      );
    });

    it('should use "Field" as fallback name', () => {
      mockInput.name = '';
      mockInput.id = '';
      mockInput.placeholder = '';
      fillSingleField(mockInput);
      expect(visualFeedback.showNotification).toHaveBeenCalledWith('Filled: Field', 'success');
    });
  });

  describe('Textarea Fields', () => {
    it('should fill a textarea successfully', () => {
      fillSingleField(mockTextarea);
      expect(mockTextarea.value).toBeTruthy();
      expect(visualFeedback.showNotification).toHaveBeenCalledWith(
        expect.stringContaining('Filled:'),
        'success'
      );
    });

    it('should not fill readonly textarea', () => {
      mockTextarea.readOnly = true;
      fillSingleField(mockTextarea);
      expect(visualFeedback.showNotification).toHaveBeenCalledWith('Field is read-only', 'warning');
    });

    it('should fill address textarea appropriately', () => {
      mockTextarea.name = 'shipping_address';
      fillSingleField(mockTextarea);
      expect(mockTextarea.value).toBeTruthy();
    });

    it('should fill bio textarea with paragraph', () => {
      mockTextarea.name = 'user_bio';
      fillSingleField(mockTextarea);
      expect(mockTextarea.value).toBeTruthy();
    });

    it('should fill description textarea with paragraph', () => {
      mockTextarea.name = 'product_description';
      fillSingleField(mockTextarea);
      expect(mockTextarea.value).toBeTruthy();
    });

    it('should fill comment textarea with paragraph', () => {
      mockTextarea.name = 'user_comment';
      fillSingleField(mockTextarea);
      expect(mockTextarea.value).toBeTruthy();
    });

    it('should fill generic textarea with lines', () => {
      mockTextarea.name = 'notes';
      fillSingleField(mockTextarea);
      expect(mockTextarea.value).toBeTruthy();
    });

    it('should handle custom field for textarea', () => {
      const { matchCustomField } = require('../../helpers/customFieldMatcher');
      matchCustomField.mockReturnValue({
        type: 'list',
        value: 'text1, text2, text3',
        field: 'testTextarea'
      });

      fillSingleField(mockTextarea);
      expect(['text1', 'text2', 'text3']).toContain(mockTextarea.value);
    });

    it('should handle textarea with placeholder for address detection', () => {
      mockTextarea.name = '';
      mockTextarea.placeholder = 'Enter your address';
      fillSingleField(mockTextarea);
      expect(mockTextarea.value).toBeTruthy();
    });
  });

  describe('Select Fields', () => {
    it('should fill a select field successfully', () => {
      fillSingleField(mockSelect);
      expect(['option1', 'option2']).toContain(mockSelect.value);
      expect(visualFeedback.showNotification).toHaveBeenCalledWith(
        expect.stringContaining('Filled:'),
        'success'
      );
    });

    it('should not fill disabled select', () => {
      mockSelect.disabled = true;
      fillSingleField(mockSelect);
      expect(visualFeedback.showNotification).toHaveBeenCalledWith('Field is disabled', 'warning');
    });

    it('should handle select with no valid options', () => {
      const emptySelect = document.createElement('select');
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptySelect.appendChild(emptyOption);

      fillSingleField(emptySelect);
      expect(visualFeedback.showNotification).toHaveBeenCalledWith(
        'No valid options in select',
        'warning'
      );
    });

    it('should mark selected option as selected', () => {
      fillSingleField(mockSelect);
      const selectedOption = Array.from(mockSelect.options).find(opt => opt.selected);
      expect(selectedOption).toBeTruthy();
      expect(selectedOption.value).toBe(mockSelect.value);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully', () => {
      const errorInput = {
        type: 'text',
        disabled: false,
        readOnly: false,
        get value() {
          throw new Error('Test error');
        },
        set value(v) {
          throw new Error('Test error');
        }
      };

      fillSingleField(errorInput);
      expect(logger.logger.error).toHaveBeenCalled();
      expect(visualFeedback.showNotification).toHaveBeenCalledWith('Failed to fill field', 'error');
    });
  });

  describe('Event Triggering', () => {
    it('should trigger events on input field', () => {
      const eventSpy = jest.spyOn(mockInput, 'dispatchEvent');
      fillSingleField(mockInput);

      expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'focus' }));
      expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'input' }));
      expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'change' }));
      expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'blur' }));
    });

    it('should trigger keyboard events', () => {
      const eventSpy = jest.spyOn(mockInput, 'dispatchEvent');
      fillSingleField(mockInput);

      const keyboardEvents = eventSpy.mock.calls
        .map(call => call[0])
        .filter(event => event instanceof KeyboardEvent);

      expect(keyboardEvents.length).toBeGreaterThan(0);
    });

    it('should handle keyboard event errors gracefully', () => {
      const originalKeyboardEvent = window.KeyboardEvent;
      window.KeyboardEvent = function () {
        throw new Error('KeyboardEvent error');
      };

      fillSingleField(mockInput);
      // Should not throw error

      window.KeyboardEvent = originalKeyboardEvent;
    });

    it('should trigger events on textarea', () => {
      const eventSpy = jest.spyOn(mockTextarea, 'dispatchEvent');
      fillSingleField(mockTextarea);

      expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'input' }));
      expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'change' }));
    });

    it('should trigger events on select', () => {
      const eventSpy = jest.spyOn(mockSelect, 'dispatchEvent');
      fillSingleField(mockSelect);

      expect(eventSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'change' }));
    });
  });

  describe('Edge Cases', () => {
    it('should handle input with undefined type', () => {
      const inputNoType = document.createElement('input');
      delete inputNoType.type;
      inputNoType.name = 'test';

      fillSingleField(inputNoType);
      expect(visualFeedback.showNotification).toHaveBeenCalledWith(
        expect.stringContaining('Filled:'),
        'success'
      );
    });

    it('should handle settings without customFields', () => {
      fillSingleField(mockInput, {});
      expect(mockInput.value).toBeTruthy();
    });

    it('should handle settings with enableLabelMatching', () => {
      fillSingleField(mockInput, { enableLabelMatching: true });
      expect(mockInput.value).toBeTruthy();
    });

    it('should handle textarea without name', () => {
      mockTextarea.name = '';
      fillSingleField(mockTextarea);
      expect(mockTextarea.value).toBeTruthy();
    });

    it('should handle select with multiple empty options', () => {
      const selectWithEmpties = document.createElement('select');
      const empty1 = document.createElement('option');
      empty1.value = '';
      const empty2 = document.createElement('option');
      empty2.value = '';
      const valid = document.createElement('option');
      valid.value = 'valid';

      selectWithEmpties.appendChild(empty1);
      selectWithEmpties.appendChild(empty2);
      selectWithEmpties.appendChild(valid);

      fillSingleField(selectWithEmpties);
      expect(selectWithEmpties.value).toBe('valid');
    });
  });
});
