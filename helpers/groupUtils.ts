// helpers/groupUtils.ts
/**
 * Utility functions for grouping and managing input elements (checkboxes/radios).
 * Provides type-safe operations with support for JS frameworks (React, Vue, Angular).
 */

// ============ Constants ============

const DATA_FILLED_ATTR = 'data-form-filler-filled';
const DEFAULT_MIN_SELECTIONS = 1;
const DEFAULT_MAX_SELECTIONS = 1;

// ============ Type Definitions ============

/** Group of inputs keyed by name attribute */
type InputGroup = Record<string, HTMLInputElement[]>;

/** Options for random selection */
interface SelectionOptions {
  /** Minimum number of items to select (default: 1) */
  minSelections?: number;
  /** Maximum number of items to select (default: 1) */
  maxSelections?: number;
  /** Whether to include disabled inputs (default: false) */
  includeDisabled?: boolean;
  /** Whether to include hidden inputs (default: false) */
  includeHidden?: boolean;
  /** Custom filter function for inputs */
  filter?: (input: HTMLInputElement) => boolean;
}

/** Result of a group operation */
interface GroupOperationResult {
  /** Number of groups processed */
  groupsProcessed: number;
  /** Number of inputs affected */
  inputsAffected: number;
  /** Any errors encountered */
  errors: string[];
}

// ============ Input Validation ============

/**
 * Check if an input element is valid for selection
 */
const isValidInput = (input: HTMLInputElement, options: SelectionOptions = {}): boolean => {
  if (!input || !(input instanceof HTMLInputElement)) {
    return false;
  }

  // Check disabled state
  if (!options.includeDisabled && input.disabled) {
    return false;
  }

  // Check hidden state (via CSS or type)
  if (!options.includeHidden) {
    const style = window.getComputedStyle(input);
    if (style.display === 'none' || style.visibility === 'hidden' || input.type === 'hidden') {
      return false;
    }
  }

  // Apply custom filter if provided
  if (options.filter && !options.filter(input)) {
    return false;
  }

  return true;
};

/**
 * Filter valid inputs from a list
 */
const filterValidInputs = (
  inputs: HTMLInputElement[],
  options: SelectionOptions = {}
): HTMLInputElement[] => {
  return inputs.filter(input => isValidInput(input, options));
};

// ============ Event Triggering ============

/**
 * Trigger all necessary events for checkbox/radio state changes.
 * Supports React, Vue, Angular, and vanilla JS forms.
 */
const triggerCheckboxRadioEvents = (element: HTMLInputElement): void => {
  try {
    // For React: trigger native setter for checked property
    const descriptor = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'checked'
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const nativeCheckboxSetter = descriptor?.set;

    if (nativeCheckboxSetter) {
      nativeCheckboxSetter.call(element, element.checked);
    }

    // Dispatch events in the correct order
    // Note: NOT using cancelable to avoid blocking form submission
    const events = ['focus', 'input', 'change', 'blur'];

    for (const eventName of events) {
      element.dispatchEvent(new Event(eventName, { bubbles: true }));
    }
  } catch {
    // Silently fail - some browsers may restrict property access
  }
};

/**
 * Mark an input as filled by the extension
 */
const markAsFilled = (input: HTMLInputElement): void => {
  input.setAttribute(DATA_FILLED_ATTR, 'true');
};

/**
 * Check if an input was filled by the extension
 */
const isFilledByExtension = (input: HTMLInputElement): boolean => {
  return input.getAttribute(DATA_FILLED_ATTR) === 'true';
};

/**
 * Clear the filled marker from an input
 */
const clearFilledMarker = (input: HTMLInputElement): void => {
  input.removeAttribute(DATA_FILLED_ATTR);
};

// ============ Grouping Functions ============

/**
 * Group input elements by their name attribute.
 * Inputs without a name are grouped under empty string key.
 */
const groupInputsByName = (
  nodeList: NodeListOf<HTMLInputElement> | HTMLInputElement[],
  options: SelectionOptions = {}
): InputGroup => {
  const inputs = Array.isArray(nodeList) ? nodeList : Array.from(nodeList);

  return inputs.reduce<InputGroup>((groups, input) => {
    if (!isValidInput(input, options)) {
      return groups;
    }

    const name = input.name || '';

    if (!groups[name]) {
      groups[name] = [];
    }

    groups[name].push(input);
    return groups;
  }, {});
};

/**
 * Get all group names from an InputGroup
 */
const getGroupNames = (groups: InputGroup): string[] => {
  return Object.keys(groups);
};

/**
 * Get total number of inputs across all groups
 */
const getTotalInputCount = (groups: InputGroup): number => {
  return Object.values(groups).reduce((total, inputs) => total + inputs.length, 0);
};

// ============ Selection Functions ============

/**
 * Generate a random number of selections between min and max
 */
const getRandomSelectionCount = (
  availableCount: number,
  minSelections: number,
  maxSelections: number
): number => {
  const min = Math.max(0, Math.min(minSelections, availableCount));
  const max = Math.min(maxSelections, availableCount);

  if (min > max) {
    return min;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Randomly select items from an array using Fisher-Yates shuffle
 */
const selectRandomItems = <T>(items: T[], count: number): T[] => {
  if (count >= items.length) {
    return [...items];
  }

  if (count <= 0) {
    return [];
  }

  // Fisher-Yates partial shuffle for efficiency
  const result: T[] = [];
  const available = [...items];

  for (let i = 0; i < count && available.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    const [selected] = available.splice(randomIndex, 1);
    if (selected !== undefined) {
      result.push(selected);
    }
  }

  return result;
};

/**
 * Check a single input element
 */
const checkInput = (input: HTMLInputElement, triggerEvents = true): void => {
  input.checked = true;
  markAsFilled(input);

  if (triggerEvents) {
    triggerCheckboxRadioEvents(input);
  }
};

/**
 * Uncheck a single input element
 */
const uncheckInput = (input: HTMLInputElement, triggerEvents = true): void => {
  input.checked = false;
  clearFilledMarker(input);

  if (triggerEvents) {
    triggerCheckboxRadioEvents(input);
  }
};

/**
 * Randomly check one input in each group.
 * Useful for radio button groups.
 */
const randomlyCheckOneInEachGroup = (
  groups: InputGroup,
  options: SelectionOptions = {}
): GroupOperationResult => {
  const result: GroupOperationResult = {
    groupsProcessed: 0,
    inputsAffected: 0,
    errors: []
  };

  for (const [name, inputs] of Object.entries(groups)) {
    try {
      const validInputs = filterValidInputs(inputs, options);

      if (validInputs.length === 0) {
        continue;
      }

      const randomInput = validInputs[Math.floor(Math.random() * validInputs.length)];

      if (randomInput) {
        checkInput(randomInput);
        result.inputsAffected++;
      }

      result.groupsProcessed++;
    } catch (error) {
      result.errors.push(`Error processing group "${name}": ${String(error)}`);
    }
  }

  return result;
};

/**
 * Randomly check multiple inputs in each group.
 * Useful for checkbox groups where multiple selections are allowed.
 */
const randomlyCheckMultipleInEachGroup = (
  groups: InputGroup,
  options: SelectionOptions = {}
): GroupOperationResult => {
  const { minSelections = DEFAULT_MIN_SELECTIONS, maxSelections = DEFAULT_MAX_SELECTIONS } =
    options;

  const result: GroupOperationResult = {
    groupsProcessed: 0,
    inputsAffected: 0,
    errors: []
  };

  for (const [name, inputs] of Object.entries(groups)) {
    try {
      const validInputs = filterValidInputs(inputs, options);

      if (validInputs.length === 0) {
        continue;
      }

      const selectionCount = getRandomSelectionCount(
        validInputs.length,
        minSelections,
        maxSelections
      );

      const selectedInputs = selectRandomItems(validInputs, selectionCount);

      for (const input of selectedInputs) {
        checkInput(input);
        result.inputsAffected++;
      }

      result.groupsProcessed++;
    } catch (error) {
      result.errors.push(`Error processing group "${name}": ${String(error)}`);
    }
  }

  return result;
};

/**
 * Uncheck all inputs in all groups
 */
const uncheckAllInGroups = (
  groups: InputGroup,
  options: SelectionOptions = {}
): GroupOperationResult => {
  const result: GroupOperationResult = {
    groupsProcessed: 0,
    inputsAffected: 0,
    errors: []
  };

  for (const [name, inputs] of Object.entries(groups)) {
    try {
      const validInputs = filterValidInputs(inputs, options);

      for (const input of validInputs) {
        if (input.checked) {
          uncheckInput(input);
          result.inputsAffected++;
        }
      }

      result.groupsProcessed++;
    } catch (error) {
      result.errors.push(`Error processing group "${name}": ${String(error)}`);
    }
  }

  return result;
};

/**
 * Get all checked inputs from all groups
 */
const getCheckedInputsInGroups = (groups: InputGroup): HTMLInputElement[] => {
  const checkedInputs: HTMLInputElement[] = [];

  for (const inputs of Object.values(groups)) {
    for (const input of inputs) {
      if (input.checked) {
        checkedInputs.push(input);
      }
    }
  }

  return checkedInputs;
};

/**
 * Get checked inputs grouped by name
 */
const getCheckedInputsByGroup = (groups: InputGroup): InputGroup => {
  const result: InputGroup = {};

  for (const [name, inputs] of Object.entries(groups)) {
    const checkedInputs = inputs.filter(input => input.checked);

    if (checkedInputs.length > 0) {
      result[name] = checkedInputs;
    }
  }

  return result;
};

/**
 * Check if a group has at least one checked input
 */
const hasCheckedInput = (inputs: HTMLInputElement[]): boolean => {
  return inputs.some(input => input.checked);
};

/**
 * Get the count of checked inputs in a group
 */
const getCheckedCount = (inputs: HTMLInputElement[]): number => {
  return inputs.filter(input => input.checked).length;
};

// ============ Exports ============

export {
  // Constants
  DATA_FILLED_ATTR,

  // Types
  type InputGroup,
  type SelectionOptions,
  type GroupOperationResult,

  // Validation
  isValidInput,
  filterValidInputs,

  // Events
  triggerCheckboxRadioEvents,
  markAsFilled,
  isFilledByExtension,
  clearFilledMarker,

  // Grouping
  groupInputsByName,
  getGroupNames,
  getTotalInputCount,

  // Selection
  checkInput,
  uncheckInput,
  randomlyCheckOneInEachGroup,
  randomlyCheckMultipleInEachGroup,
  uncheckAllInGroups,

  // Query
  getCheckedInputsInGroups,
  getCheckedInputsByGroup,
  hasCheckedInput,
  getCheckedCount
};
