// forms/fillSelects.ts
import type { FormFillerSettings } from '../types';
import { matchCustomField } from '../helpers/customFieldMatcher.js';
// import { findClosestLabel } from '../helpers/labelFinder.js';
import { getAllSelects } from '../helpers/domHelpers.js';
import { logger } from '../helpers/logger.js';
import { shouldIgnoreDomain } from '../helpers/domainUtils.js';
import { cachedParseIgnoreKeywords } from '../helpers/computedCache.js';
import {
  detectSelectType,
  selectSmartOption,
  getDetectionConfidence
} from '../helpers/selectTypeDetection.js';

export const fillSelects = (settings: FormFillerSettings = {}): void => {
  if (shouldIgnoreDomain(settings.ignoreDomains)) {
    return;
  }

  // Get selects including those in Vue modals and shadow DOM
  const selects = getAllSelects();
  if (!selects.length) {
    return;
  }

  const ignoreKeywords = cachedParseIgnoreKeywords(settings.ignoreFields || '');

  selects.forEach(select => {
    // const labelText = settings.enableLabelMatching ? findClosestLabel(select) : '';

    if (select.hasAttribute('readonly')) {
      return;
    }
    if (
      settings.ignoreHidden &&
      (select.offsetParent === null ||
        select.offsetWidth === 0 ||
        select.offsetHeight === 0 ||
        window.getComputedStyle(select).visibility === 'hidden')
    ) {
      return;
    }

    // Check if select has meaningful content (not empty, not "0", not first option if it's a placeholder)
    if (settings.ignoreFilled) {
      const currentValue = select.value;
      const hasValue = currentValue && currentValue.trim() !== '';

      // Check if first option is a placeholder (common patterns: "Select...", "Choose...", empty text, value="0" or empty)
      const firstOption = select.options[0];
      const isFirstOptionPlaceholder =
        firstOption &&
        (!firstOption.value ||
          firstOption.value === '0' ||
          firstOption.value.trim() === '' ||
          firstOption.disabled ||
          /^(select|choose|pick|--)/i.test(firstOption.text.trim()));

      // Consider field filled only if it has a value AND it's not the placeholder option
      const isActuallyFilled =
        hasValue && !(isFirstOptionPlaceholder && currentValue === firstOption.value);

      if (isActuallyFilled) {
        return;
      }
    }

    const name = (select.name || '').toLowerCase();
    const id = (select.id || '').toLowerCase();
    const placeholder =
      (select as HTMLSelectElement & { placeholder?: string }).placeholder?.toLowerCase() || '';

    const matchedKeyword = ignoreKeywords.find(
      k => name.includes(k) || id.includes(k) || placeholder.includes(k)
    );
    if (matchedKeyword) {
      return;
    }

    // Check for custom field matching
    const customField = matchCustomField(
      select,
      settings.customFields,
      settings.enableLabelMatching
    );
    if (customField) {
      // For selects, custom fields with list type can specify which options to prefer
      if (customField.type === 'list') {
        const preferredValues = customField.value
          .split(',')
          .map(v => v.trim().toLowerCase())
          .filter(Boolean);
        const matchingOptions = Array.from(select.options).filter(opt =>
          preferredValues.some(
            pv => opt.value.toLowerCase().includes(pv) || opt.text.toLowerCase().includes(pv)
          )
        );
        if (matchingOptions.length > 0) {
          const randomOption = matchingOptions[Math.floor(Math.random() * matchingOptions.length)];
          if (randomOption) {
            select.value = randomOption.value;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
          }
        }
      }
      // Skip default behavior for custom fields
    } else {
      // Smart select filling based on detected field type
      if (select.options.length > 1) {
        // Detect the type of this select field
        const detectedType = detectSelectType(select, settings.enableLabelMatching);
        const confidence = getDetectionConfidence(
          select,
          detectedType,
          settings.enableLabelMatching
        );

        let selectedOption: HTMLOptionElement | null = null;
        let selectionReason = '';

        // Use smart selection if type was detected with high confidence
        if (detectedType !== 'unknown' && confidence >= 0.5) {
          const smartResult = selectSmartOption(
            select,
            detectedType,
            settings.minAge,
            settings.maxAge
          );

          if (smartResult) {
            selectedOption = smartResult.option;
            selectionReason = `smart: ${detectedType} - ${smartResult.reason}`;
          }
        }

        // Fallback to improved random selection if smart selection didn't work
        if (!selectedOption) {
          selectedOption = selectRandomValidOption(select);
          selectionReason = 'random valid option';
        }

        if (selectedOption) {
          select.value = selectedOption.value;
          logger.debug(`Selected option for ${select.name || select.id}:`, {
            value: selectedOption.value,
            text: selectedOption.text,
            detectedType,
            confidence,
            reason: selectionReason
          });
        }
      }
    }

    // Mark this field as filled by the extension
    select.setAttribute('data-form-filler-filled', 'true');

    // Trigger events for JavaScript-based forms (React, Vue, Angular, etc.)
    triggerSelectEvents(select);
  });
};

/**
 * Select a random valid option from a select element
 * Filters out placeholder options, disabled options, and common placeholder patterns
 */
const selectRandomValidOption = (select: HTMLSelectElement): HTMLOptionElement | null => {
  const options = Array.from(select.options);

  // First pass: filter out obviously invalid options
  let validOptions = options.filter(opt => {
    // Skip disabled options
    if (opt.disabled) return false;

    // Skip empty value options (often placeholders)
    if (!opt.value || opt.value.trim() === '') return false;

    // Skip value "0" which is often a placeholder
    if (opt.value === '0') return false;

    const text = opt.text.toLowerCase().trim();
    const label = opt.label?.toLowerCase() || '';

    // Skip common placeholder patterns
    const placeholderPatterns = [
      /^(select|choose|pick|--|please|none|\*|---).*$/i,
      /^(selecciona|elegir|choisir|wählen|選択|选择).*$/i, // Multi-language placeholders
      /^-+$/, // Just dashes
      /^\s*$/ // Empty or whitespace
    ];

    for (const pattern of placeholderPatterns) {
      if (pattern.test(text) || pattern.test(label)) {
        return false;
      }
    }

    return true;
  });

  // If no valid options found, try with less strict filtering
  if (validOptions.length === 0) {
    validOptions = options.filter(opt => !opt.disabled && opt.value);
  }

  // Still no options? Just get any non-disabled option
  if (validOptions.length === 0) {
    validOptions = options.filter(opt => !opt.disabled);
  }

  if (validOptions.length === 0) {
    return null;
  }

  // Select random option from valid ones
  return validOptions[Math.floor(Math.random() * validOptions.length)] ?? null;
};

// Helper function to trigger all necessary events for JS frameworks
const triggerSelectEvents = (element: HTMLSelectElement): void => {
  // For React: trigger native setter
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value');
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const nativeSelectValueSetter = descriptor?.set;
  if (nativeSelectValueSetter) {
    nativeSelectValueSetter.call(element, element.value);
  }

  // Dispatch events in the correct order
  // Note: NOT using cancelable to avoid blocking form submission
  element.dispatchEvent(new Event('focus', { bubbles: true }));
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));

  // For click-based interactions
  try {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  } catch (error) {
    // Log click event errors for debugging but don't break the flow
    logger.debug('Click event dispatch failed:', error);
  }
};

// Store observers for cleanup
let selectOptionsObserver: MutationObserver | null = null;
let bodySelectObserver: MutationObserver | null = null;

/**
 * Cleanup observers when no longer needed
 */
export const cleanupSelectObservers = (): void => {
  if (selectOptionsObserver) {
    selectOptionsObserver.disconnect();
    selectOptionsObserver = null;
    logger.debug('Select options observer disconnected');
  }
  if (bodySelectObserver) {
    bodySelectObserver.disconnect();
    bodySelectObserver = null;
    logger.debug('Body observer for selects disconnected');
  }
};

// Automatically observe and fill selects when their options change
document.addEventListener('DOMContentLoaded', () => {
  // Cleanup any existing observers first
  cleanupSelectObservers();

  selectOptionsObserver = new MutationObserver(mutations => {
    try {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && (mutation.target as Element).tagName === 'SELECT') {
          fillSelects();
        }
      });
    } catch (error) {
      logger.warn('Error in select options observer:', error);
    }
  });

  document.querySelectorAll('select').forEach(select => {
    selectOptionsObserver?.observe(select, { childList: true });
  });

  // Also observe for new selects added to the DOM
  bodySelectObserver = new MutationObserver(mutations => {
    try {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && (node as Element).tagName === 'SELECT') {
            selectOptionsObserver?.observe(node as HTMLSelectElement, { childList: true });
          }
        });
      });
    } catch (error) {
      logger.warn('Error in body observer for selects:', error);
    }
  });
  bodySelectObserver.observe(document.body, { childList: true, subtree: true });
});

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanupSelectObservers);
  window.addEventListener('pagehide', cleanupSelectObservers);
}
