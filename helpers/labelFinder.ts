// helpers/labelFinder.ts

// Interface for elements with cached properties
interface ElementWithCache extends HTMLElement {
  _cachedRect?: DOMRect;
  _cachedStyle?: CSSStyleDeclaration;
}

/**
 * Find the closest label element to an input on the same level
 */
export const findClosestLabel = (input: HTMLElement | null): string => {
  if (!input) return '';

  // First check if the input has an associated label via the labels property
  const inputElement = input as HTMLInputElement;
  if (inputElement.labels && inputElement.labels.length > 0) {
    const firstLabel = inputElement.labels[0];
    return firstLabel?.textContent?.trim() ?? '';
  }

  // Find the closest label by traversing siblings and parent elements
  let closestLabel = '';
  let minDistance = Infinity;

  // Helper function to calculate distance between two elements
  const calculateDistance = (el1: HTMLElement, el2: HTMLElement): number => {
    // Use cached position if available to avoid reflow
    const el1Cache = el1 as ElementWithCache;
    const el2Cache = el2 as ElementWithCache;

    if (!el1Cache._cachedRect) {
      el1Cache._cachedRect = el1.getBoundingClientRect();
    }
    if (!el2Cache._cachedRect) {
      el2Cache._cachedRect = el2.getBoundingClientRect();
    }

    const rect1 = el1Cache._cachedRect;
    const rect2 = el2Cache._cachedRect;

    const centerX1 = rect1.left + rect1.width / 2;
    const centerY1 = rect1.top + rect1.height / 2;
    const centerX2 = rect2.left + rect2.width / 2;
    const centerY2 = rect2.top + rect2.height / 2;

    return Math.sqrt(
      Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2)
    );
  };

  // Helper function to check if an element is a label-like element
  const isLabelLike = (element: HTMLElement): boolean => {
    if (!element || !element.tagName) return false;

    const tagName = element.tagName.toLowerCase();

    // Direct label elements
    if (tagName === 'label') return true;

    // Elements that commonly contain label text
    const labelTags = ['span', 'div', 'p', 'td', 'th', 'legend', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (labelTags.includes(tagName)) {
      // Check if the element has text content and is not too long
      const text = element.textContent?.trim() || '';
      if (text.length > 0 && text.length < 100) {
        // Avoid elements that are purely structural (no visible text)
        // Cache computed style to avoid redundant calculations
        const elementCache = element as ElementWithCache;
        if (!elementCache._cachedStyle) {
          elementCache._cachedStyle = window.getComputedStyle(element);
        }
        const style = elementCache._cachedStyle;
        return style.display !== 'none' && style.visibility !== 'hidden';
      }
    }

    return false;
  };

  // Search for label-like elements near the input
  let currentElement: HTMLElement | null = input.parentElement;
  let searchDepth = 0;
  const maxDepth = 3;

  while (currentElement && searchDepth < maxDepth) {
    // Check all children of current element
    const children = Array.from(currentElement.children) as HTMLElement[];
    for (const child of children) {
      if (child !== input && isLabelLike(child)) {
        const distance = calculateDistance(input, child);
        if (distance < minDistance) {
          minDistance = distance;
          closestLabel = child.textContent?.trim() || '';
        }
      }
    }

    currentElement = currentElement.parentElement;
    searchDepth++;
  }

  return closestLabel;
};

/**
 * Get all possible label texts for an input element
 */
export const getAllPossibleLabels = (input: HTMLElement | null): string[] => {
  if (!input) return [];

  const labels: string[] = [];

  const inputElement = input as HTMLInputElement;

  // Built-in label association
  if (inputElement.labels && inputElement.labels.length > 0) {
    labels.push(
      ...Array.from(inputElement.labels).map((label) => label.textContent?.trim() || '')
    );
  }

  // Aria label
  const ariaLabel = input.getAttribute('aria-label');
  if (ariaLabel) {
    labels.push(ariaLabel.trim());
  }

  // Placeholder text
  if (inputElement.placeholder) {
    labels.push(inputElement.placeholder.trim());
  }

  // Title attribute
  if (inputElement.title) {
    labels.push(inputElement.title.trim());
  }

  // Closest label on the same level
  const closestLabel = findClosestLabel(input);
  if (closestLabel) {
    labels.push(closestLabel);
  }

  // Filter out empty strings and duplicates
  return Array.from(new Set(labels.filter((label) => label.length > 0)));
};
