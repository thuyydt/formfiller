// forms/fillTextareas.ts
import type { FormFillerSettings } from '../types';
import { faker } from '../helpers/fakerLocale.js';
import { getElmType, isFieldType } from '../helpers/typeDetection.js';
import { matchCustomField } from '../helpers/customFieldMatcher.js';
// import { findClosestLabel } from '../helpers/labelFinder.js';
import { getAllTextareas } from '../helpers/domHelpers.js';
import { logger } from '../helpers/logger.js';
import { shouldIgnoreDomain } from '../helpers/domainUtils.js';
import { cachedParseIgnoreKeywords } from '../helpers/computedCache.js';

export const fillTextareas = (settings: FormFillerSettings = {}): void => {
  if (shouldIgnoreDomain(settings.ignoreDomains)) {
    return;
  }

  // Get textareas including those in Vue modals and shadow DOM
  const textareas = getAllTextareas();
  if (!textareas.length) {
    return;
  }

  const ignoreKeywords = cachedParseIgnoreKeywords(settings.ignoreFields || '');

  textareas.forEach(textarea => {
    // const labelText = settings.enableLabelMatching ? findClosestLabel(textarea) : '';

    if (textarea.hasAttribute('readonly')) {
      return;
    }
    if (
      settings.ignoreHidden &&
      (textarea.offsetParent === null ||
        textarea.offsetWidth === 0 ||
        textarea.offsetHeight === 0 ||
        window.getComputedStyle(textarea).visibility === 'hidden')
    ) {
      return;
    }
    if (settings.ignoreFilled && textarea.value && textarea.value.trim() !== '') {
      return;
    }

    const name = (textarea.name || '').toLowerCase();
    const id = (textarea.id || '').toLowerCase();
    const placeholder = (textarea.placeholder || '').toLowerCase();

    const matchedKeyword = ignoreKeywords.find(
      k => name.includes(k) || id.includes(k) || placeholder.includes(k)
    );
    if (matchedKeyword) {
      return;
    }

    const customField = matchCustomField(
      textarea,
      settings.customFields,
      settings.enableLabelMatching
    );
    if (customField) {
      if (customField.type === 'list') {
        const values = customField.value
          .split(',')
          .map(v => v.trim())
          .filter(Boolean);
        if (values.length) {
          const selectedValue = values[Math.floor(Math.random() * values.length)];
          if (selectedValue) {
            textarea.value = selectedValue;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
          }
        }
      } else if (customField.type === 'regex') {
        textarea.value = customField.value;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      const label = getElmType(textarea as any);
      let value = '';
      if (isFieldType(label, ['address', 'address1', 'address_1', 'addressline', 'address_line'])) {
        value = faker.location.streetAddress();
      } else {
        value = faker.lorem.lines({ min: 1, max: 3 });
      }
      textarea.value = value;
    }

    // Mark this field as filled by the extension
    textarea.setAttribute('data-form-filler-filled', 'true');

    // Trigger events for JavaScript-based forms (React, Vue, Angular, etc.)
    triggerTextareaEvents(textarea);
  });
};

// Helper function to trigger all necessary events for JS frameworks
const triggerTextareaEvents = (element: HTMLTextAreaElement): void => {
  // For React: trigger native setter
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const nativeTextAreaValueSetter = descriptor?.set;
  if (nativeTextAreaValueSetter) {
    nativeTextAreaValueSetter.call(element, element.value);
  }

  // Dispatch events in the correct order
  // Note: NOT using cancelable on most events to avoid blocking form submission
  element.dispatchEvent(new Event('focus', { bubbles: true }));
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));

  // For frameworks that listen to keyboard events
  try {
    element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  } catch (error) {
    // Log keyboard event errors for debugging but don't break the flow
    logger.debug('Keyboard event dispatch failed in textarea:', error);
  }
};
