// helpers/customFieldMatcher.ts
import type { CustomField } from '../types';
import { getAllPossibleLabels } from './labelFinder';

/**
 * Check if a pattern matches a field attribute value
 * Supports wildcard patterns: *suffix, prefix*, *infix*
 */
const matchesWildcardPattern = (pattern: string, value: string): boolean => {
  if (!pattern || !value) return false;

  // Convert both to lowercase for case-insensitive matching
  const lowerPattern = pattern.toLowerCase();
  const lowerValue = value.toLowerCase();

  // Check for wildcard patterns
  if (lowerPattern.startsWith('*') && lowerPattern.endsWith('*')) {
    // *infix* pattern - check if value contains the middle part
    const infix = lowerPattern.slice(1, -1);
    return infix.length > 0 && lowerValue.includes(infix);
  } else if (lowerPattern.startsWith('*')) {
    // *suffix pattern - check if value ends with the suffix
    const suffix = lowerPattern.slice(1);
    return suffix.length > 0 && lowerValue.endsWith(suffix);
  } else if (lowerPattern.endsWith('*')) {
    // prefix* pattern - check if value starts with the prefix
    const prefix = lowerPattern.slice(0, -1);
    return prefix.length > 0 && lowerValue.startsWith(prefix);
  } else {
    // Exact match (case-insensitive)
    return lowerPattern === lowerValue;
  }
};

/**
 * Enhanced custom field matching with wildcard support and label detection
 */
export const matchCustomField = (
  element: HTMLElement,
  customFields: CustomField[] | undefined,
  enableLabelMatching: boolean = true
): CustomField | null => {
  if (!customFields || !Array.isArray(customFields)) return null;

  for (const field of customFields) {
    if (!field.field) continue;

    let match = false;

    if (field.field.startsWith('.')) {
      // Class selector - check if element has the class
      const className = field.field.slice(1);
      if (element.classList) {
        // Check for wildcard patterns in class names
        if (className.includes('*')) {
          const classNames = Array.from(element.classList);
          match = classNames.some((cls) => matchesWildcardPattern(className, cls));
        } else {
          match = element.classList.contains(className);
        }
      }
    } else if (field.field.startsWith('[')) {
      // Attribute selector: [attr="value"] or [attr*="value"]
      // eslint-disable-next-line no-useless-escape
      const attrMatch = field.field.match(/\[(.+?)[\*]?=\"(.+?)\"\]/);
      if (attrMatch && attrMatch[1] && attrMatch[2]) {
        const attr = attrMatch[1];
        const val = attrMatch[2];
        const attrValue = element.getAttribute(attr);
        if (attrValue) {
          match = matchesWildcardPattern(val, attrValue);
        }
      }
    } else {
      // Match by type, name, id, or other attributes with wildcard support
      const fieldPattern = field.field;

      // Get various element attributes to check against
      const elementType = (element as HTMLInputElement).type ?? '';
      const elementName = (element as HTMLInputElement).name ?? '';
      const elementId = element.id ?? '';
      const elementClass = element.className ?? '';

      // Check against all relevant attributes
      const attributesToCheck: string[] = [
        elementType,
        elementName,
        elementId,
        elementClass
      ];

      // Add label-based matching if enabled
      if (enableLabelMatching) {
        const possibleLabels = getAllPossibleLabels(element);
        attributesToCheck.push(...possibleLabels);
      }

      // Also check any custom attributes
      if (element.attributes) {
        for (const attr of Array.from(element.attributes)) {
          if (attr.name && attr.value) {
            attributesToCheck.push(attr.value);
          }
        }
      }

      // Test the pattern against all attributes
      match = attributesToCheck.some((attrValue) =>
        matchesWildcardPattern(fieldPattern, attrValue)
      );
    }

    if (match) return field;
  }

  return null;
};
