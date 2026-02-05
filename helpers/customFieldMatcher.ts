// helpers/customFieldMatcher.ts
import type { CustomField } from '../types';
import { getAllPossibleLabels } from './labelFinder';

// ============ Types ============

interface MatchResult {
  field: CustomField;
  score: number;
  matchedBy: string;
}

// ============ Cache ============

// WeakMap cache for element matching results
const matchCache = new WeakMap<HTMLElement, Map<string, CustomField | null>>();

/**
 * Generate cache key from custom fields
 */
const generateCacheKey = (customFields: CustomField[]): string => {
  return customFields.map(f => `${f.field}:${f.value}`).join('|');
};

/**
 * Clear match cache for an element
 */
export const clearMatchCache = (element?: HTMLElement): void => {
  if (element) {
    matchCache.delete(element);
  }
  // WeakMap auto-cleans when elements are GC'd
};

// ============ Pattern Matching ============

/**
 * Escape special regex characters in a string
 */
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Check if a pattern matches a value
 * Supports: exact match, wildcard (*), regex (/pattern/)
 */
const matchesPattern = (pattern: string, value: string): boolean => {
  if (!pattern || !value) return false;

  const lowerValue = value.toLowerCase();

  // Regex pattern: /pattern/flags
  if (pattern.startsWith('/') && pattern.lastIndexOf('/') > 0) {
    try {
      const lastSlash = pattern.lastIndexOf('/');
      const regexBody = pattern.slice(1, lastSlash);
      const flags = pattern.slice(lastSlash + 1) || 'i';
      const regex = new RegExp(regexBody, flags);
      return regex.test(value);
    } catch {
      // Invalid regex, fall back to literal match
      return lowerValue.includes(pattern.toLowerCase());
    }
  }

  const lowerPattern = pattern.toLowerCase();

  // Wildcard patterns
  if (lowerPattern.includes('*')) {
    // Convert wildcard to regex
    const regexPattern = lowerPattern.split('*').map(escapeRegex).join('.*');
    const regex = new RegExp(`^${regexPattern}$`, 'i');
    return regex.test(lowerValue);
  }

  // Exact match (case-insensitive)
  return lowerPattern === lowerValue;
};

/**
 * Calculate match score based on specificity
 * Higher score = more specific match
 */
const calculateMatchScore = (pattern: string, matchedAttribute: string): number => {
  let score = 1;

  // Exact matches score higher
  if (!pattern.includes('*') && !pattern.startsWith('/')) {
    score += 2;
  }

  // Matches on name/id score higher than class/placeholder
  if (matchedAttribute === 'name' || matchedAttribute === 'id') {
    score += 2;
  } else if (matchedAttribute === 'type') {
    score += 1;
  }

  // Longer patterns are more specific
  const patternLength = pattern.replace(/[*\/]/g, '').length;
  score += Math.min(patternLength / 10, 1);

  return score;
};

// ============ Selector Parsing ============

interface ParsedSelector {
  type: 'class' | 'attribute' | 'field';
  selector: string;
  attrName?: string;
  attrValue?: string;
  operator?: 'exact' | 'contains' | 'starts' | 'ends';
}

/**
 * Parse a selector string into its components
 */
const parseSelector = (selector: string): ParsedSelector => {
  // Class selector: .className
  if (selector.startsWith('.')) {
    return {
      type: 'class',
      selector: selector.slice(1)
    };
  }

  // Attribute selector: [attr="value"], [attr*="value"], [attr^="value"], [attr$="value"]
  const attrMatch = selector.match(/^\[([^\]=*^$]+)([\*\^\$])?="?([^"\]]*)"?\]$/);
  if (attrMatch) {
    const [, attrName, operatorChar, attrValue] = attrMatch;
    let operator: ParsedSelector['operator'] = 'exact';
    if (operatorChar === '*') operator = 'contains';
    else if (operatorChar === '^') operator = 'starts';
    else if (operatorChar === '$') operator = 'ends';

    return {
      type: 'attribute',
      selector,
      attrName: attrName ?? '',
      attrValue: attrValue ?? '',
      operator
    };
  }

  // Field pattern (name, id, type, etc.)
  return {
    type: 'field',
    selector
  };
};

/**
 * Match element against a parsed selector
 */
const matchSelector = (
  element: HTMLElement,
  parsed: ParsedSelector,
  enableLabelMatching: boolean
): { matched: boolean; matchedBy: string } => {
  if (parsed.type === 'class') {
    if (!element.classList) return { matched: false, matchedBy: '' };

    const classNames = Array.from(element.classList);
    for (const cls of classNames) {
      if (matchesPattern(parsed.selector, cls)) {
        return { matched: true, matchedBy: 'class' };
      }
    }
    return { matched: false, matchedBy: '' };
  }

  if (parsed.type === 'attribute' && parsed.attrName) {
    const attrValue = element.getAttribute(parsed.attrName);
    if (!attrValue) return { matched: false, matchedBy: '' };

    let matched = false;
    const searchValue = parsed.attrValue ?? '';

    switch (parsed.operator) {
      case 'contains':
        matched = attrValue.toLowerCase().includes(searchValue.toLowerCase());
        break;
      case 'starts':
        matched = attrValue.toLowerCase().startsWith(searchValue.toLowerCase());
        break;
      case 'ends':
        matched = attrValue.toLowerCase().endsWith(searchValue.toLowerCase());
        break;
      default:
        matched = matchesPattern(searchValue, attrValue);
    }

    return { matched, matchedBy: `attr:${parsed.attrName}` };
  }

  // Field pattern matching
  const inputElement = element as HTMLInputElement;
  const fieldPattern = parsed.selector;

  // Attributes to check with priority order
  const attributesToCheck: Array<{ name: string; value: string }> = [
    { name: 'name', value: inputElement.name ?? '' },
    { name: 'id', value: element.id ?? '' },
    { name: 'type', value: inputElement.type ?? '' }
  ];

  // Add label matching if enabled
  if (enableLabelMatching) {
    const labels = getAllPossibleLabels(element);
    labels.forEach(label => {
      attributesToCheck.push({ name: 'label', value: label });
    });
  }

  // Add class names
  if (element.className) {
    element.className.split(/\s+/).forEach(cls => {
      if (cls) attributesToCheck.push({ name: 'class', value: cls });
    });
  }

  // Add data attributes
  for (const attr of Array.from(element.attributes)) {
    if (attr.name.startsWith('data-') && attr.value) {
      attributesToCheck.push({ name: attr.name, value: attr.value });
    }
  }

  // Test pattern against all attributes
  for (const { name, value } of attributesToCheck) {
    if (value && matchesPattern(fieldPattern, value)) {
      return { matched: true, matchedBy: name };
    }
  }

  return { matched: false, matchedBy: '' };
};

// ============ Main Functions ============

/**
 * Enhanced custom field matching with wildcard/regex support, caching, and scoring
 * @param element - The form element to match
 * @param customFields - Array of custom field definitions
 * @param enableLabelMatching - Whether to include label text in matching
 * @returns Best matching CustomField or null
 */
export const matchCustomField = (
  element: HTMLElement,
  customFields: CustomField[] | undefined,
  enableLabelMatching: boolean = true
): CustomField | null => {
  if (!customFields || !Array.isArray(customFields) || customFields.length === 0) {
    return null;
  }

  // Check cache
  const cacheKey = generateCacheKey(customFields);
  const elementCache = matchCache.get(element);
  if (elementCache?.has(cacheKey)) {
    return elementCache.get(cacheKey) ?? null;
  }

  // Find all matches with scores
  const matches: MatchResult[] = [];

  for (const field of customFields) {
    if (!field.field) continue;

    const parsed = parseSelector(field.field);
    const { matched, matchedBy } = matchSelector(element, parsed, enableLabelMatching);

    if (matched) {
      const score = calculateMatchScore(field.field, matchedBy);
      matches.push({ field, score, matchedBy });
    }
  }

  // Return best match (highest score)
  let result: CustomField | null = null;
  if (matches.length > 0) {
    matches.sort((a, b) => b.score - a.score);
    result = matches[0]?.field ?? null;
  }

  // Cache result
  if (!elementCache) {
    matchCache.set(element, new Map([[cacheKey, result]]));
  } else {
    elementCache.set(cacheKey, result);
  }

  return result;
};

/**
 * Get all matching custom fields for an element (not just the best one)
 */
export const getAllMatchingFields = (
  element: HTMLElement,
  customFields: CustomField[] | undefined,
  enableLabelMatching: boolean = true
): MatchResult[] => {
  if (!customFields || !Array.isArray(customFields) || customFields.length === 0) {
    return [];
  }

  const matches: MatchResult[] = [];

  for (const field of customFields) {
    if (!field.field) continue;

    const parsed = parseSelector(field.field);
    const { matched, matchedBy } = matchSelector(element, parsed, enableLabelMatching);

    if (matched) {
      const score = calculateMatchScore(field.field, matchedBy);
      matches.push({ field, score, matchedBy });
    }
  }

  return matches.sort((a, b) => b.score - a.score);
};
