// forms/fillSelects.ts
import type { FormFillerSettings } from '../types';
import { matchCustomField } from '../helpers/customFieldMatcher.js';
// import { findClosestLabel } from '../helpers/labelFinder.js';
import { getAllSelects } from '../helpers/domHelpers.js';

// Helper to check if current domain should be ignored
const shouldIgnoreDomain = (ignoreDomains = ''): boolean => {
  const domains = (ignoreDomains || '')
    .split(/\n|,/)
    .map(s => s.trim())
    .filter(Boolean);
  const currentDomain = window.location.hostname;
  return domains.some(domain => currentDomain.endsWith(domain));
};

export const fillSelects = (settings: FormFillerSettings = {}): void => {
  if (shouldIgnoreDomain(settings.ignoreDomains)) {
    return;
  }

  // Get selects including those in Vue modals and shadow DOM
  const selects = getAllSelects();
  if (!selects.length) {
    return;
  }

  const ignoreKeywords = (settings.ignoreFields || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

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
      // Default behavior for selects
      if (select.options.length > 1) {
        let validOptions = Array.from(select.options).filter(
          opt =>
            !opt.disabled &&
            opt.value &&
            opt.value !== '' &&
            !opt.label.toLowerCase().includes('select')
        );
        if (validOptions.length === 0)
          validOptions = Array.from(select.options).filter(opt => !opt.disabled);
        const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)];
        if (randomOption) {
          select.value = randomOption.value;
        }
      }
    }

    // Mark this field as filled by the extension
    select.setAttribute('data-form-filler-filled', 'true');

    // Trigger events for JavaScript-based forms (React, Vue, Angular, etc.)
    triggerSelectEvents(select);
  });
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
  } catch {
    // Silently ignore click event errors
  }
};

// Automatically observe and fill selects when their options change
document.addEventListener('DOMContentLoaded', () => {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && (mutation.target as Element).tagName === 'SELECT') {
        fillSelects();
      }
    });
  });

  document.querySelectorAll('select').forEach(select => {
    observer.observe(select, { childList: true });
  });

  // Also observe for new selects added to the DOM
  const bodyObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1 && (node as Element).tagName === 'SELECT') {
          observer.observe(node as HTMLSelectElement, { childList: true });
        }
      });
    });
  });
  bodyObserver.observe(document.body, { childList: true, subtree: true });
});
