// helpers/fillSingleField.ts
// Fill a single field individually (for context menu right-click)

import { faker } from './fakerLocale.js';
import { getElmType, getElmJapanType } from './typeDetection.js';
import { generateInputValue } from '../forms/inputFillers.js';
import { matchCustomField } from './customFieldMatcher.js';
import type { FormFillerSettings } from '../types';
import { showNotification } from './visualFeedback.js';
import { logger } from './logger.js';

/**
 * Fill a single field with appropriate data
 * @param element - The field element to fill
 * @param settings - Form filler settings
 */
export const fillSingleField = (
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  settings: FormFillerSettings = {}
): void => {
  try {
    // Check if field is disabled or readonly
    const isReadOnly =
      element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
        ? element.readOnly
        : false;

    if (element instanceof HTMLElement && (element as HTMLInputElement).disabled) {
      showNotification('Field is disabled', 'warning');
      return;
    }

    if (isReadOnly) {
      showNotification('Field is read-only', 'warning');
      return;
    }

    // Handle different element types
    if (element instanceof HTMLInputElement) {
      fillInputField(element, settings);
    } else if (element instanceof HTMLTextAreaElement) {
      fillTextareaField(element, settings);
    } else if (element instanceof HTMLSelectElement) {
      fillSelectField(element);
    }

    // Trigger events for JS frameworks
    triggerFieldEvents(element);

    // Show success notification
    const placeholder = element instanceof HTMLSelectElement ? '' : element.placeholder;
    const fieldName = element.name || element.id || placeholder || 'Field';
    showNotification(`Filled: ${fieldName}`, 'success');
  } catch (error) {
    logger.error('Error filling single field', error as Error);
    showNotification('Failed to fill field', 'error');
  }
};

/**
 * Fill a single input field
 */
const fillInputField = (input: HTMLInputElement, settings: FormFillerSettings): void => {
  const inputType = input.type?.toLowerCase() || 'text';

  // Skip certain input types
  if (['hidden', 'submit', 'button', 'reset', 'file', 'image'].includes(inputType)) {
    showNotification(`Cannot fill ${inputType} fields`, 'warning');
    return;
  }

  // Handle checkboxes and radios
  if (inputType === 'checkbox') {
    input.checked = Math.random() > 0.5;
    return;
  }

  if (inputType === 'radio') {
    input.checked = true;
    return;
  }

  // Check for custom field match
  const customField = matchCustomField(input, settings.customFields, settings.enableLabelMatching);

  if (customField) {
    if (customField.type === 'list') {
      // Check if this is a password field and defaultPassword is set
      const detectedType = getElmType(input);
      if (
        detectedType === 'password' &&
        settings.defaultPassword &&
        settings.defaultPassword.trim() !== ''
      ) {
        input.value = settings.defaultPassword;
        return;
      }
      const values = customField.value
        .split(',')
        .map(v => v.trim())
        .filter(Boolean);
      if (values.length) {
        const selectedValue = values[Math.floor(Math.random() * values.length)];
        input.value = selectedValue ?? '';
        return;
      }
    } else if (customField.type === 'regex') {
      if (faker.helpers && typeof faker.helpers.fromRegExp === 'function') {
        input.value = faker.helpers.fromRegExp(customField.value);
        return;
      }
    } else if (customField.type === 'faker' && customField.faker) {
      try {
        const fakerPath = customField.faker.split('.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let fakerValue: any = faker;
        for (const part of fakerPath) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          fakerValue = fakerValue[part];
        }
        if (typeof fakerValue === 'function') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          const generatedValue = fakerValue();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          input.value = String(generatedValue);
          return;
        }
      } catch (error) {
        logger.warn(`Error using Faker path: ${customField.faker}`, error as Error);
      }
    }
  }

  // Detect field type and generate value
  const fieldType = getElmType(input);
  const japanType = getElmJapanType(input);

  // Check if it's a password field and defaultPassword is set
  let value: string;
  if (
    fieldType === 'password' &&
    settings.defaultPassword &&
    settings.defaultPassword.trim() !== ''
  ) {
    value = settings.defaultPassword;
  } else {
    value = generateInputValue(fieldType, input, japanType);
  }

  input.value = String(value);
};

/**
 * Fill a single textarea field
 */
const fillTextareaField = (textarea: HTMLTextAreaElement, settings: FormFillerSettings): void => {
  // Check for custom field match
  const customField = matchCustomField(
    textarea as unknown as HTMLInputElement,
    settings.customFields,
    settings.enableLabelMatching
  );

  if (customField && customField.type === 'list') {
    const values = customField.value
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);
    if (values.length) {
      const selectedValue = values[Math.floor(Math.random() * values.length)];
      textarea.value = selectedValue ?? '';
      return;
    }
  }

  // Generate appropriate content
  const name = textarea.name?.toLowerCase() ?? '';
  const placeholder = textarea.placeholder?.toLowerCase() ?? '';

  if (name.includes('address') || placeholder.includes('address')) {
    textarea.value = faker.location.streetAddress();
  } else if (name.includes('bio') || name.includes('description') || name.includes('comment')) {
    textarea.value = faker.lorem.paragraph();
  } else {
    textarea.value = faker.lorem.lines({ min: 1, max: 3 });
  }
};

/**
 * Fill a single select field
 */
const fillSelectField = (select: HTMLSelectElement): void => {
  const options = Array.from(select.options).filter(opt => opt.value && opt.value !== '');

  if (options.length === 0) {
    showNotification('No valid options in select', 'warning');
    return;
  }

  // Select a random option (excluding the first empty option)
  const randomIndex = Math.floor(Math.random() * options.length);
  const selectedOption = options[randomIndex];

  if (selectedOption && selectedOption.value) {
    select.value = selectedOption.value;
    selectedOption.selected = true;
  }
};

/**
 * Trigger events for JavaScript frameworks
 */
const triggerFieldEvents = (
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
): void => {
  // For React: trigger native setter
  const proto =
    element instanceof HTMLTextAreaElement
      ? window.HTMLTextAreaElement.prototype
      : element instanceof HTMLSelectElement
        ? window.HTMLSelectElement.prototype
        : window.HTMLInputElement.prototype;

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const nativeSetter = descriptor?.set;

  if (nativeSetter) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    nativeSetter.call(element, element.value);
  }

  // Dispatch events
  element.dispatchEvent(new Event('focus', { bubbles: true }));
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));

  // Keyboard events for frameworks
  try {
    element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  } catch (error) {
    // Log keyboard event errors for debugging but don't break the flow
    logger.debug('Keyboard event dispatch failed in fillSingleField:', error);
  }
};
