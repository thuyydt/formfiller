// fillInputs.ts
import { faker } from '../helpers/fakerLocale';
import { getElmType, getElmJapanType } from '../helpers/typeDetection';
import { generateInputValue, setInputFillerContext } from './inputFillers';
import { matchCustomField } from '../helpers/customFieldMatcher';
// import { findClosestLabel } from '../helpers/labelFinder';
import { getAllInputs } from '../helpers/domHelpers';
import { logger } from '../helpers/logger';
import { fillFileInput, getAllFileInputs } from '../helpers/fileInputHelper';
import type { FormFillerSettings } from '../types';

// Helper to check if current domain should be ignored
const shouldIgnoreDomain = (ignoreDomains = ''): boolean => {
  const domains = (ignoreDomains || '')
    .split(/\n|,/)
    .map(s => s.trim())
    .filter(Boolean);
  const currentDomain = window.location.hostname;
  return domains.some(domain => currentDomain.endsWith(domain));
};

const fillInputs = async (settings: FormFillerSettings = {}): Promise<void> => {
  await Promise.resolve(); // Satisfy require-await rule
  if (shouldIgnoreDomain(settings.ignoreDomains)) {
    return;
  }

  // Set context for date generation with min/max age
  setInputFillerContext({
    minAge: settings.minAge ?? 18,
    maxAge: settings.maxAge ?? 65
  });

  // Handle file inputs if enabled
  if (settings.enableFileInput !== false) {
    const fileInputs = getAllFileInputs();
    for (const fileInput of fileInputs) {
      if (!fileInput.disabled && !fileInput.hasAttribute('readonly')) {
        fillFileInput(fileInput);
      }
    }
  }

  // Get inputs including those in Vue modals, shadow DOM, and iframes
  const inputs = getAllInputs();
  if (!inputs.length) {
    return;
  }
  const ignoreKeywords = (settings.ignoreFields || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  for (const input of inputs) {
    // Log field detection
    // const labelText = settings.enableLabelMatching ? findClosestLabel(input) : '';

    // Ignore by type
    if (
      !input.type ||
      input.type.toLowerCase() === 'hidden' ||
      input.type.toLowerCase() === 'file' ||
      input.type.toLowerCase() === 'submit' ||
      input.type.toLowerCase() === 'button' ||
      input.type.toLowerCase() === 'reset' ||
      input.type.toLowerCase() === 'radio' ||
      input.type.toLowerCase() === 'checkbox'
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      continue;
    }
    if (input.inputMode && input.inputMode.toLowerCase() === 'none') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      continue;
    }
    // Ignore readonly
    if (input.hasAttribute('readonly')) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      continue;
    }
    // Ignore hidden/invisible fields
    if (
      settings.ignoreHidden &&
      (input.offsetParent === null ||
        input.offsetWidth === 0 ||
        input.offsetHeight === 0 ||
        window.getComputedStyle(input).visibility === 'hidden')
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      continue;
    }
    // Ignore fields with existing content
    if (settings.ignoreFilled && input.value && input.value.trim() !== '') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      continue;
    }
    // Ignore by keyword
    const name = (input.name || '').toLowerCase();
    const id = (input.id || '').toLowerCase();
    const placeholder = (input.placeholder || '').toLowerCase();
    const matchedKeyword = ignoreKeywords.find(
      k => name.includes(k) || id.includes(k) || placeholder.includes(k)
    );
    if (matchedKeyword) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      continue;
    }

    // PRIORITY 1: Custom fields override
    const customField = matchCustomField(
      input,
      settings.customFields,
      settings.enableLabelMatching
    );
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        } else {
          const values = customField.value
            .split(',')
            .map(v => v.trim())
            .filter(Boolean);
          if (values.length) {
            const selectedValue = values[Math.floor(Math.random() * values.length)];
            if (selectedValue) {
              input.value = selectedValue;
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            }
          }
        }
      } else if (customField.type === 'regex') {
        if (faker.helpers && typeof faker.helpers.fromRegExp === 'function') {
          const regexValue = faker.helpers.fromRegExp(customField.value);
          if (regexValue) {
            input.value = regexValue;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
          }
        } else {
          const label = getElmType(input);
          const japanLabel = getElmJapanType(input);

          // Check if it's a password field and defaultPassword is set
          let value: string;
          if (
            label === 'password' &&
            settings.defaultPassword &&
            settings.defaultPassword.trim() !== ''
          ) {
            value = settings.defaultPassword;
          } else {
            value = generateInputValue(label, input, japanLabel);
          }

          input.value = String(value);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        }
      } else if (customField.type === 'faker' && customField.faker) {
        // Handle Faker.js data type
        // First check if this is a password field and defaultPassword is set
        const detectedType = getElmType(input);
        if (
          detectedType === 'password' &&
          settings.defaultPassword &&
          settings.defaultPassword.trim() !== ''
        ) {
          input.value = settings.defaultPassword;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        } else {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            const fakerPath = customField.faker.split('.');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let fakerValue: any = faker;

            // Navigate through the faker object path (e.g., 'person.firstName')
            for (const part of fakerPath) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              fakerValue = fakerValue[part];
            }

            // Call the faker function if it exists
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if (typeof fakerValue === 'function') {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
              const generatedValue = fakerValue();
              input.value = String(generatedValue);
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            } else {
              // Fallback if path is invalid
              const label = getElmType(input);
              const japanLabel = getElmJapanType(input);

              // Check if it's a password field and defaultPassword is set
              let value: string;
              if (
                label === 'password' &&
                settings.defaultPassword &&
                settings.defaultPassword.trim() !== ''
              ) {
                value = settings.defaultPassword;
              } else {
                value = generateInputValue(label, input, japanLabel);
              }

              input.value = String(value);
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            }
          } catch (error) {
            // Fallback on error
            logger.warn('Error using Faker path:', customField.faker, error);
            const label = getElmType(input);
            const japanLabel = getElmJapanType(input);

            // Check if it's a password field and defaultPassword is set
            let value: string;
            if (
              label === 'password' &&
              settings.defaultPassword &&
              settings.defaultPassword.trim() !== ''
            ) {
              value = settings.defaultPassword;
            } else {
              value = generateInputValue(label, input, japanLabel);
            }

            input.value = value;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
          }
        }
      }
    } else {
      // PRIORITY 2: Standard detection (AI or rule-based)
      const label = getElmType(input);
      const japanLabel = getElmJapanType(input);

      // Check if it's a password field and defaultPassword is set
      let value: string;
      if (
        label === 'password' &&
        settings.defaultPassword &&
        settings.defaultPassword.trim() !== ''
      ) {
        value = settings.defaultPassword;
      } else {
        value = generateInputValue(label, input, japanLabel);
      }

      input.value = String(value);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    }

    // Mark this field as filled by the extension
    input.setAttribute('data-form-filler-filled', 'true');

    // Trigger events for JavaScript-based forms (React, Vue, Angular, etc.)
    triggerInputEvents(input);
  }
};

// Helper function to trigger all necessary events for JS frameworks
const triggerInputEvents = (element: HTMLInputElement): void => {
  // For React: trigger native setter
  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
  const nativeInputValueSetter = descriptor?.set?.bind(element);
  if (nativeInputValueSetter) {
    nativeInputValueSetter(element.value);
  }

  // Dispatch events in the correct order
  // Note: NOT using cancelable on most events to avoid blocking form submission
  element.dispatchEvent(new Event('focus', { bubbles: true }));
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));

  // For frameworks that listen to keyboard events
  // Using try-catch to prevent errors from breaking the flow
  try {
    element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  } catch {
    // Silently ignore keyboard event errors
  }
};

export { fillInputs };
