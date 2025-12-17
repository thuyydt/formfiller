// helpers/groupUtils.ts
/**
 * Utility to group input elements (checkboxes/radios) by their name attribute.
 */
export const groupInputsByName = (
  nodeList: NodeListOf<HTMLInputElement>
): Record<string, HTMLInputElement[]> => {
  const groups: Record<string, HTMLInputElement[]> = {};
  for (const input of Array.from(nodeList)) {
    const name = input.name || '';
    if (!groups[name]) {
      groups[name] = [];
    }
    groups[name].push(input);
  }
  return groups;
};

/**
 * Utility to randomly check one input in each group (for radios/checkboxes).
 */
export const randomlyCheckOneInEachGroup = (groups: Record<string, HTMLInputElement[]>): void => {
  for (const [_name, inputs] of Object.entries(groups)) {
    if (inputs && inputs.length > 0) {
      const randomInput = inputs[Math.floor(Math.random() * inputs.length)];
      if (randomInput) {
        randomInput.checked = true;

        // Mark this field as filled by the extension
        randomInput.setAttribute('data-form-filler-filled', 'true');

        // Trigger events for JavaScript-based forms (React, Vue, Angular, etc.)
        triggerCheckboxRadioEvents(randomInput);
      }
    }
  }
};

// Helper function to trigger all necessary events for JS frameworks
const triggerCheckboxRadioEvents = (element: HTMLInputElement): void => {
  // For React: trigger native setter for checked property
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'checked');
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const nativeCheckboxSetter = descriptor?.set;
  if (nativeCheckboxSetter) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    nativeCheckboxSetter.call(element, element.checked);
  }

  // Dispatch events in the correct order
  // Note: NOT using cancelable to avoid blocking form submission
  element.dispatchEvent(new Event('focus', { bubbles: true }));
  // Removed click event dispatch to prevent toggling the checkbox state back
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
};
