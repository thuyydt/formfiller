// helpers/clearUndo.ts
// Provides functionality to clear filled data or undo the last fill operation

interface FieldState {
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  value: string;
  type: string;
  checked: boolean | null;
}

interface FormState {
  timestamp: number;
  fields: FieldState[];
}

interface UndoResult {
  success: boolean;
  message: string;
  count?: number;
}

// Store the original form state before filling
let formStateHistory: FormState[] = [];

// Time-to-live for saved states (5 minutes)
const STATE_TTL = 5 * 60 * 1000;

// Cleanup old states to prevent memory leaks
const cleanupOldStates = (): void => {
  const now = Date.now();
  formStateHistory = formStateHistory.filter(state => {
    const isExpired = now - state.timestamp > STATE_TTL;
    if (isExpired) {
      // Clear DOM references before removing
      state.fields.forEach(field => {
        // @ts-expect-error - Explicitly clearing reference
        field.element = null;
      });
    }
    return !isExpired;
  });
};

// Save current form state before filling
export const saveFormState = (): FormState => {
  // Clean up old states first
  cleanupOldStates();
  const state: FormState = {
    timestamp: Date.now(),
    fields: []
  };

  // Collect all fillable fields and their current values
  const fields = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select'
  );

  fields.forEach(field => {
    const isReadOnly = field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement
      ? field.readOnly
      : false;
    if (!field.disabled && !isReadOnly) {
      const fieldState: FieldState = {
        element: field,
        value: field.value,
        type: (field as HTMLInputElement).type || field.tagName.toLowerCase(),
        checked: (field as HTMLInputElement).type === 'checkbox' || (field as HTMLInputElement).type === 'radio'
          ? (field as HTMLInputElement).checked
          : null
      };
      state.fields.push(fieldState);
    }
  });

  // Keep only the most recent state
  formStateHistory = [state];

  return state;
};

// Restore form to previous state (undo)
export const undoFill = (): UndoResult => {
  if (formStateHistory.length === 0) {
    return { success: false, message: 'No history available to undo' };
  }

  const previousState = formStateHistory[0];
  if (!previousState) {
    return { success: false, message: 'No history available to undo' };
  }
  let restoredCount = 0;

  previousState.fields.forEach(fieldState => {
    try {
      const element = fieldState.element;
      if (element && document.body.contains(element)) {
        // Restore value
        element.value = fieldState.value;

        // Restore checked state for radio/checkbox
        if (fieldState.checked !== null && element instanceof HTMLInputElement) {
          element.checked = fieldState.checked;
        }

        // Trigger events for JS frameworks
        triggerFieldEvents(element);
        restoredCount++;
      }
    } catch {
      // Silently ignore errors for individual fields
    }
  });

  // Clear history after undo
  formStateHistory = [];

  return {
    success: true,
    message: `Restored ${restoredCount} fields`,
    count: restoredCount
  };
};

// Clear all filled fields (reset to empty)
export const clearAllFields = (): UndoResult => {
  const fields = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]), textarea, select'
  );

  let clearedCount = 0;

  fields.forEach(field => {
    const isReadOnly = field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement
      ? field.readOnly
      : false;
    if (!field.disabled && !isReadOnly && field.value && field.value.trim() !== '') {
      try {
        // Clear the value
        if (field instanceof HTMLInputElement && (field.type === 'checkbox' || field.type === 'radio')) {
          field.checked = false;
        } else if (field instanceof HTMLSelectElement) {
          // Reset select to first option or empty
          field.selectedIndex = 0;
        } else {
          field.value = '';
        }

        // Trigger events for JS frameworks
        triggerFieldEvents(field);
        clearedCount++;
      } catch {
        // Silently ignore errors
      }
    }
  });

  return {
    success: true,
    message: `Cleared ${clearedCount} fields`,
    count: clearedCount
  };
};

// Trigger events for JavaScript frameworks
const triggerFieldEvents = (element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void => {
  // For React and other frameworks
  const proto = element instanceof HTMLTextAreaElement
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
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
};

// Check if undo is available
export const canUndo = (): boolean => {
  return formStateHistory.length > 0;
};

// Get the number of fields that can be cleared
export const getClearableFieldsCount = (): number => {
  const fields = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"]), textarea, select'
  );

  let count = 0;
  fields.forEach(field => {
    const isReadOnly = field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement
      ? field.readOnly
      : false;
    if (!field.disabled && !isReadOnly && field.value && field.value.trim() !== '') {
      count++;
    }
  });

  return count;
};

// Memory cleanup: Clear all DOM references from saved states
export const clearUndoMemory = (): void => {
  formStateHistory.forEach(state => {
    state.fields.forEach(field => {
      // @ts-expect-error - Explicitly clearing reference
      field.element = null;
    });
  });
  formStateHistory = [];
};
