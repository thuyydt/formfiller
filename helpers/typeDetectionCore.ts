// typeDetectionCore.ts
// Core type detection functions - refactored to use centralized rules configuration
import { detectionRules, matchesAnyAttribute } from './typeDetectionRules';
import type { ElementAttributes } from './typeDetectionRules';
import { findClosestLabel } from './labelFinder';
import {
  predictFieldTypeEnhanced,
  isAIDetectionEnabled,
  getConfidenceThreshold
} from './aiFieldDetection';
import { logger } from './logger';
import { translateKeywords } from './locale';

// Extend HTMLInputElement to include cache
interface CachedHTMLInputElement extends HTMLInputElement {
  _attrCache?: ElementAttributes;
}

// Cache for element attributes to avoid redundant DOM access and string operations
const getElementAttributes = (input: HTMLInputElement): ElementAttributes => {
  const cachedInput = input as CachedHTMLInputElement;

  // Check if already cached
  if (cachedInput._attrCache) return cachedInput._attrCache;

  // Translate keywords (Japanese, Vietnamese, etc.) BEFORE lowercasing
  const translateAndLower = (text: string): string => {
    return translateKeywords(text).toLowerCase();
  };

  const type = input.type ? input.type.toLowerCase() : '';
  const placeholder = input.placeholder ? translateAndLower(input.placeholder) : '';
  const ariaLabel = input.getAttribute('aria-label')
    ? translateAndLower(input.getAttribute('aria-label')!)
    : '';

  let label =
    input.labels && input.labels.length > 0
      ? translateAndLower(input.labels[0]?.textContent ?? '')
      : '';

  // If no label found through standard methods, try to find the closest label
  if (!label) {
    const closestLabel = findClosestLabel(input);
    if (closestLabel) {
      label = translateAndLower(closestLabel);
    }
  }

  const name = input.name ? translateAndLower(input.name) : '';
  const id = input.id ? translateAndLower(input.id) : '';
  const classList = Array.from(input.classList)
    .map(cls => translateAndLower(cls))
    .join(' ');
  const dataAttributes = Array.from(input.attributes)
    .filter(attr => attr.name.startsWith('data-'))
    .map(attr => `${attr.name.toLowerCase()}: ${translateAndLower(attr.value)}`)
    .join(' ');

  // Helper to get last part of a string (used multiple times below)
  const getLastPart = (str: string): string => {
    const parts = str.split(/[-.[]/);
    return parts[parts.length - 1] ?? '';
  };

  const cache: ElementAttributes = {
    type,
    placeholder,
    ariaLabel,
    label,
    name,
    id,
    classList,
    dataAttributes,
    namePart: getLastPart(name),
    idPart: getLastPart(id),
    classPart: classList.split(' ').pop() ?? '',
    placeholderPart: placeholder.split(' ').pop() ?? '',
    ariaLabelPart: ariaLabel.split(' ').pop() ?? '',
    labelPart: label.split(' ').pop() ?? '',
    dataAttributesPart: dataAttributes.split(' ').pop() ?? ''
  };

  // Cache on element for reuse (cleared on next form fill)
  cachedInput._attrCache = cache;
  return cache;
};

/**
 * Detect Japanese text type (hiragana, katakana, romaji) for text inputs
 * @param input - The input element to check
 * @returns Japanese text type or empty string
 */
const getElmJapanType = (input: HTMLInputElement | null): string => {
  if (!input) {
    return '';
  }

  const attrs = getElementAttributes(input);

  // Only check for text inputs
  if (attrs.type !== 'text') {
    return '';
  }

  // Check each Japanese type rule
  for (const rule of detectionRules.japaneseTypes) {
    if (matchesAnyAttribute(attrs, rule.keywords)) {
      return rule.type;
    }
  }

  return '';
};

/**
 * Detect the type of an input element based on its attributes
 * Uses rule-based detection first, with AI-powered fallback
 * @param input - The input element to check
 * @returns Detected field type or empty string
 */
const getElmType = (input: HTMLInputElement | null): string => {
  // Handle null input gracefully
  if (!input) {
    return 'text';
  }

  const attrs = getElementAttributes(input);

  // Check if it's a native HTML5 input type that maps directly
  if (detectionRules.nativeInputTypes.includes(attrs.type)) {
    // Use mapped type if available, otherwise use the type as-is
    const mappedType = detectionRules.nativeTypeMapping[attrs.type];
    return mappedType !== undefined ? mappedType : attrs.type;
  }

  // For text and number inputs, check against all text input type rules
  if (attrs.type === 'text' || attrs.type === 'number') {
    // Iterate through rules and check if any match
    for (const rule of detectionRules.textInputTypes) {
      // Check if any attribute matches the keywords
      if (matchesAnyAttribute(attrs, rule.keywords)) {
        // If this rule has excludeTypes, make sure none of those types match
        if (rule.excludeTypes) {
          const hasExcludedMatch = rule.excludeTypes.some(excludedType => {
            const excludedRule = detectionRules.textInputTypes.find(r => r.type === excludedType);
            return excludedRule && matchesAnyAttribute(attrs, excludedRule.keywords);
          });

          // Skip this rule if an excluded type matched
          if (hasExcludedMatch) {
            continue;
          }
        }

        return rule.type;
      }
    }
  }

  // Return 'text' as default for unrecognized fields or 'number' if type is number
  return attrs.type === 'number' ? 'number' : attrs.type || 'text';
};

/**
 * Detect field type with AI enhancement
 * Uses rule-based detection first, falls back to AI if no match or low confidence
 * @param input - The input element to check
 * @param useAI - Whether to use AI detection (async check if undefined)
 * @returns Promise with detected field type
 */
const getElmTypeWithAI = async (input: HTMLInputElement | null): Promise<string> => {
  if (!input) {
    return 'text';
  }

  // Get rule-based detection first
  const ruleBasedType = getElmType(input);

  // Check if AI detection is enabled
  const aiEnabled = await isAIDetectionEnabled();
  if (!aiEnabled) {
    return ruleBasedType;
  }

  // If rule-based got a confident match (not just 'text' default), use it
  if (ruleBasedType !== 'text') {
    return ruleBasedType;
  }

  // Try AI detection as fallback for generic 'text' fields
  try {
    const threshold = await getConfidenceThreshold();
    const aiPrediction = predictFieldTypeEnhanced(input, threshold);

    if (aiPrediction && aiPrediction.confidence >= threshold) {
      // AI found a better match with sufficient confidence
      return aiPrediction.type;
    }
  } catch (error) {
    logger.warn('AI detection failed, using rule-based result:', error);
  }

  return ruleBasedType;
};

/**
 * Clear cached attributes from all elements to prevent memory leaks
 * Should be called after form filling is complete
 */
const clearAttributeCache = (): void => {
  const fields = document.querySelectorAll<HTMLInputElement>('input');
  fields.forEach(field => {
    const cachedField = field as CachedHTMLInputElement;
    if (cachedField._attrCache) {
      delete cachedField._attrCache;
    }
  });
};

export { getElmType, getElmTypeWithAI, getElmJapanType, clearAttributeCache };

// Backward compatibility alias
export const detectFieldType = getElmType;
export const detectFieldTypeWithAI = getElmTypeWithAI;
