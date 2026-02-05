// helpers/domHelpers.ts
// Helper functions for DOM traversal including shadow DOM and dynamically loaded content

// Cache for traversal results to avoid redundant DOM queries
const traversalCache = new Map<string, HTMLElement[]>();
const shadowRootCache = new WeakMap<Element, ShadowRoot>();
let cacheTimestamp = 0;
let mutationObserver: MutationObserver | null = null;
const CACHE_TTL = 100; // Cache valid for 100ms during form filling

// Global setting to disable iframe fill
let disableIframeFillSetting = false;

/**
 * Set whether to disable filling fields in iframes
 */
export const setDisableIframeFill = (disable: boolean): void => {
  disableIframeFillSetting = disable;
  // Invalidate cache when setting changes
  traversalCache.clear();
  cacheTimestamp = 0;
};

/**
 * Get current iframe fill setting
 */
export const getDisableIframeFill = (): boolean => disableIframeFillSetting;

/**
 * Initialize DOM mutation observer for automatic cache invalidation
 */
const initMutationObserver = (): void => {
  if (mutationObserver) return;

  mutationObserver = new MutationObserver(() => {
    // Invalidate cache when DOM changes
    traversalCache.clear();
    cacheTimestamp = 0;
  });

  // Watch for changes in the entire document
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false // Don't care about attribute changes
  });
};

/**
 * Clear traversal cache to free memory and disconnect observer
 */
export const clearTraversalCache = (): void => {
  traversalCache.clear();
  cacheTimestamp = 0;

  // Disconnect observer to free resources
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }
};

/**
 * Get cached result or compute if expired/invalid
 */
const getCached = <T extends HTMLElement>(cacheKey: string, computeFn: () => T[]): T[] => {
  const now = Date.now();

  // Initialize mutation observer on first use
  if (!mutationObserver) {
    initMutationObserver();
  }

  // Check if cache is still valid
  if (now - cacheTimestamp < CACHE_TTL && traversalCache.has(cacheKey)) {
    return traversalCache.get(cacheKey) as T[];
  }

  // Compute new result
  const result = computeFn();
  traversalCache.set(cacheKey, result);
  cacheTimestamp = now;

  return result;
};

/**
 * Generic traversal function to reduce code duplication
 * Traverses document, shadow DOM, and accessible iframes
 */
const traverseDOM = <T extends HTMLElement>(selector: string, resultArray: T[]): void => {
  // Pre-compile selector for better performance
  const traverseNode = (node: Document | ShadowRoot | Element): void => {
    // Batch query for better performance
    const elements = node.querySelectorAll<T>(selector);
    if (elements.length > 0) {
      resultArray.push(...Array.from(elements));
    }

    // Cache and traverse shadow roots
    const shadowHosts = Array.from(node.querySelectorAll<Element>('*'));
    for (const element of shadowHosts) {
      // Use WeakMap cache for shadow roots
      let shadowRoot = shadowRootCache.get(element);
      if (!shadowRoot && element.shadowRoot) {
        shadowRoot = element.shadowRoot;
        shadowRootCache.set(element, shadowRoot);
      }

      if (shadowRoot) {
        traverseNode(shadowRoot);
      }
    }
  };

  // Start from main document
  traverseNode(document);

  // Check accessible iframes (only if not disabled)
  if (!disableIframeFillSetting) {
    try {
      const iframes = Array.from(document.querySelectorAll<HTMLIFrameElement>('iframe'));
      if (iframes.length > 0) {
        for (const iframe of iframes) {
          try {
            if (iframe.contentDocument) {
              traverseNode(iframe.contentDocument);
            }
          } catch {
            // Cross-origin iframe, skip silently
          }
        }
      }
    } catch {
      // Error accessing iframes, skip
    }
  }
}; /**
 * Get all input elements including those in shadow DOM and iframes
 * This is crucial for Vue/React modals and web components
 */
export const getAllInputs = (): HTMLInputElement[] => {
  return getCached('inputs', () => {
    const inputs: HTMLInputElement[] = [];
    traverseDOM<HTMLInputElement>('input:not([disabled])', inputs);
    return inputs;
  });
};

/**
 * Get all textarea elements including those in shadow DOM
 */
export const getAllTextareas = (): HTMLTextAreaElement[] => {
  return getCached('textareas', () => {
    const textareas: HTMLTextAreaElement[] = [];
    traverseDOM<HTMLTextAreaElement>('textarea:not([disabled])', textareas);
    return textareas;
  });
};

/**
 * Get all select elements including those in shadow DOM
 */
export const getAllSelects = (): HTMLSelectElement[] => {
  return getCached('selects', () => {
    const selects: HTMLSelectElement[] = [];
    traverseDOM<HTMLSelectElement>('select:not([disabled])', selects);
    return selects;
  });
};

/**
 * Get all radio inputs including those in shadow DOM
 */
export const getAllRadios = (): HTMLInputElement[] => {
  return getCached('radios', () => {
    const radios: HTMLInputElement[] = [];
    traverseDOM<HTMLInputElement>('input[type="radio"]:not([disabled])', radios);
    return radios;
  });
};

/**
 * Get all checkbox inputs including those in shadow DOM
 */
export const getAllCheckboxes = (): HTMLInputElement[] => {
  return getCached('checkboxes', () => {
    const checkboxes: HTMLInputElement[] = [];
    traverseDOM<HTMLInputElement>('input[type="checkbox"]:not([disabled])', checkboxes);
    return checkboxes;
  });
};

/**
 * Wait for elements to be available in DOM (useful for SPAs and modals)
 * Uses MutationObserver for efficient detection instead of polling
 * @param selector - CSS selector to wait for
 * @param timeout - Maximum time to wait in milliseconds
 * @returns Promise that resolves when elements are found
 */
export const waitForElements = async (selector: string, timeout = 5000): Promise<boolean> => {
  // Check if elements already exist
  const existingElements = document.querySelectorAll(selector);
  if (existingElements.length > 0) {
    return true;
  }

  return new Promise<boolean>(resolve => {
    let resolved = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // Create MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      if (resolved) return;

      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        resolved = true;
        observer.disconnect();
        if (timeoutId) clearTimeout(timeoutId);
        resolve(true);
      }
    });

    // Start observing the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false // Only care about DOM structure changes
    });

    // Fallback timeout - ensures cleanup even if observer misses something
    timeoutId = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      observer.disconnect();
      const elements = document.querySelectorAll(selector);
      resolve(elements.length > 0);
    }, timeout);
  });
};

/**
 * Check if an element is visible (for modal detection)
 */
export const isElementVisible = (element: HTMLElement): boolean => {
  if (!element) return false;

  // Check if element or any parent has display: none
  if (element.offsetParent === null) return false;

  // Check computed style
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }

  // Check if element is in viewport (for modals)
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;

  return true;
};
