// helpers/labelFinder.ts

/**
 * Label finding utilities for form fields
 * Finds associated labels using multiple strategies
 */

// WeakMap for caching to allow garbage collection
const rectCache = new WeakMap<HTMLElement, { rect: DOMRect; timestamp: number }>();
const styleCache = new WeakMap<HTMLElement, { style: CSSStyleDeclaration; timestamp: number }>();

const CACHE_TTL_MS = 5000; // 5 seconds cache TTL

/**
 * Get cached bounding rect or compute new one
 */
const getCachedRect = (element: HTMLElement): DOMRect => {
  const cached = rectCache.get(element);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.rect;
  }

  const rect = element.getBoundingClientRect();
  rectCache.set(element, { rect, timestamp: now });
  return rect;
};

/**
 * Get cached computed style or compute new one
 */
const getCachedStyle = (element: HTMLElement): CSSStyleDeclaration => {
  const cached = styleCache.get(element);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.style;
  }

  const style = window.getComputedStyle(element);
  styleCache.set(element, { style, timestamp: now });
  return style;
};

/**
 * Check if element is visible
 */
const isVisible = (element: HTMLElement): boolean => {
  const style = getCachedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
};

/**
 * Calculate weighted distance between two elements
 * Prefers labels above or to the left of the input (common convention)
 */
const calculateWeightedDistance = (
  input: HTMLElement,
  label: HTMLElement,
  isRTL: boolean = false
): number => {
  const inputRect = getCachedRect(input);
  const labelRect = getCachedRect(label);

  // Calculate center points
  const inputCenterX = inputRect.left + inputRect.width / 2;
  const inputCenterY = inputRect.top + inputRect.height / 2;
  const labelCenterX = labelRect.left + labelRect.width / 2;
  const labelCenterY = labelRect.top + labelRect.height / 2;

  // Basic Euclidean distance
  const dx = labelCenterX - inputCenterX;
  const dy = labelCenterY - inputCenterY;
  let distance = Math.sqrt(dx * dx + dy * dy);

  // Apply position-based weights
  // Labels above the input are preferred (weight: 0.8)
  if (labelCenterY < inputCenterY - 5) {
    distance *= 0.8;
  }

  // Labels to the left (or right for RTL) are preferred (weight: 0.9)
  const isPreferredSide = isRTL ? labelCenterX > inputCenterX : labelCenterX < inputCenterX;
  if (isPreferredSide && Math.abs(dy) < 30) {
    distance *= 0.9;
  }

  // Penalize labels that are far below or on wrong side
  if (labelCenterY > inputCenterY + inputRect.height) {
    distance *= 1.5;
  }

  return distance;
};

/**
 * Check if an element is a label-like element
 */
const isLabelLike = (element: HTMLElement, maxTextLength: number = 150): boolean => {
  if (!element?.tagName) return false;

  const tagName = element.tagName.toLowerCase();

  // Direct label elements
  if (tagName === 'label') return true;

  // Elements that commonly contain label text
  const labelTags = ['span', 'div', 'p', 'td', 'th', 'legend', 'dt', 'strong', 'em', 'b'];
  const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  if (labelTags.includes(tagName) || headingTags.includes(tagName)) {
    const text = element.textContent?.trim() || '';

    // Must have text content within reasonable length
    if (text.length === 0 || text.length > maxTextLength) return false;

    // Must be visible
    if (!isVisible(element)) return false;

    // Avoid elements with many child elements (likely containers)
    if (element.children.length > 3) return false;

    return true;
  }

  return false;
};

/**
 * Get label from aria-labelledby attribute
 */
const getAriaLabelledBy = (input: HTMLElement): string => {
  const labelledBy = input.getAttribute('aria-labelledby');
  if (!labelledBy) return '';

  const ids = labelledBy.split(/\s+/).filter(Boolean);
  const texts: string[] = [];

  for (const id of ids) {
    const element = document.getElementById(id);
    if (element) {
      const text = element.textContent?.trim();
      if (text) texts.push(text);
    }
  }

  return texts.join(' ');
};

/**
 * Get label using 'for' attribute fallback
 */
const getLabelByFor = (input: HTMLElement): string => {
  const id = input.id;
  if (!id) return '';

  const label = document.querySelector(`label[for="${CSS.escape(id)}"]`);
  return label?.textContent?.trim() || '';
};

/**
 * Find the closest label element to an input
 */
export const findClosestLabel = (
  input: HTMLElement | null,
  options: { maxDepth?: number; maxDistance?: number } = {}
): string => {
  if (!input) return '';

  const { maxDepth = 5, maxDistance = 300 } = options;

  const inputElement = input as HTMLInputElement;

  // Strategy 1: Built-in label association
  if (inputElement.labels && inputElement.labels.length > 0) {
    const firstLabel = inputElement.labels[0];
    const text = firstLabel?.textContent?.trim();
    if (text) return text;
  }

  // Strategy 2: aria-labelledby
  const ariaLabelledBy = getAriaLabelledBy(input);
  if (ariaLabelledBy) return ariaLabelledBy;

  // Strategy 3: label[for] fallback
  const labelFor = getLabelByFor(input);
  if (labelFor) return labelFor;

  // Strategy 4: Proximity-based search
  const isRTL = window.getComputedStyle(input).direction === 'rtl';
  let closestLabel = '';
  let minDistance = Infinity;

  // Collect all potential labels in ancestor tree
  let currentElement: HTMLElement | null = input.parentElement;
  let depth = 0;

  while (currentElement && depth < maxDepth) {
    // Check all descendants (not just direct children)
    const potentialLabels = currentElement.querySelectorAll(
      'label, span, div, p, td, th, legend, dt, strong, h1, h2, h3, h4, h5, h6'
    );

    for (const labelEl of potentialLabels) {
      const label = labelEl as HTMLElement;

      // Skip the input itself and its descendants
      if (label === input || label.contains(input) || input.contains(label)) continue;

      if (isLabelLike(label)) {
        const distance = calculateWeightedDistance(input, label, isRTL);

        if (distance < minDistance && distance < maxDistance) {
          minDistance = distance;
          closestLabel = label.textContent?.trim() || '';
        }
      }
    }

    currentElement = currentElement.parentElement;
    depth++;
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
    for (const label of inputElement.labels) {
      const text = label.textContent?.trim();
      if (text) labels.push(text);
    }
  }

  // aria-labelledby
  const ariaLabelledBy = getAriaLabelledBy(input);
  if (ariaLabelledBy) labels.push(ariaLabelledBy);

  // aria-label
  const ariaLabel = input.getAttribute('aria-label')?.trim();
  if (ariaLabel) labels.push(ariaLabel);

  // label[for] fallback
  const labelFor = getLabelByFor(input);
  if (labelFor) labels.push(labelFor);

  // Placeholder text
  if (inputElement.placeholder) {
    labels.push(inputElement.placeholder.trim());
  }

  // Title attribute
  if (inputElement.title) {
    labels.push(inputElement.title.trim());
  }

  // aria-describedby (supplementary description)
  const describedBy = input.getAttribute('aria-describedby');
  if (describedBy) {
    const ids = describedBy.split(/\s+/).filter(Boolean);
    for (const id of ids) {
      const element = document.getElementById(id);
      const text = element?.textContent?.trim();
      if (text) labels.push(text);
    }
  }

  // Closest proximity label
  const closestLabel = findClosestLabel(input);
  if (closestLabel) labels.push(closestLabel);

  // Filter out empty strings and duplicates
  return [...new Set(labels.filter(label => label.length > 0))];
};

/**
 * Clear the label finder caches
 */
export const clearLabelCache = (): void => {
  // WeakMaps auto-clean, but we can't clear them explicitly
  // This function exists for API consistency
};
