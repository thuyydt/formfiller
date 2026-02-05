// typeDetectionCore.ts
// Core type detection functions - refactored to use centralized rules configuration
import {
  detectionRules,
  matchesAnyAttribute,
  matchesNegativeKeywords,
  getRulesByPriority
} from './typeDetectionRules';
import type { ElementAttributes } from './typeDetectionRules';
import { findClosestLabel } from './labelFinder';
import {
  predictFieldTypeEnhanced,
  isAIDetectionEnabled,
  getConfidenceThreshold
} from './aiFieldDetection';
import { logger } from './logger';
import { translateKeywords } from './locale';

// ============ Types ============

type SupportedElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

// ============ Cache Management ============

// Use WeakMap for automatic garbage collection
const attributeCache = new WeakMap<SupportedElement, ElementAttributes>();
const typeCache = new WeakMap<SupportedElement, string>();
const japanTypeCache = new WeakMap<SupportedElement, string>();

/**
 * Clear all detection caches
 * Should be called when settings change or after form filling is complete
 */
export const clearAttributeCache = (): void => {
  // WeakMaps auto-clean when elements are GC'd
  // This function exists for API consistency and can be used
  // to signal that caches should be invalidated
  logger.debug('Detection caches cleared (WeakMaps auto-clean on GC)');
};

// ============ Attribute Extraction ============

/**
 * Translate and lowercase text for consistent matching
 */
const translateAndLower = (text: string): string => {
  if (!text) return '';
  return translateKeywords(text).toLowerCase();
};

/**
 * Extract last part of a string after common separators
 */
const getLastPart = (str: string): string => {
  if (!str) return '';
  const parts = str.split(/[-._[\]]/);
  return parts[parts.length - 1] ?? '';
};

/**
 * Extract and cache element attributes for type detection
 */
const getElementAttributes = (element: SupportedElement): ElementAttributes => {
  // Check cache first
  const cached = attributeCache.get(element);
  if (cached) return cached;

  // Get input type (only for input elements)
  const type =
    element.tagName === 'INPUT'
      ? ((element as HTMLInputElement).type?.toLowerCase() ?? 'text')
      : element.tagName.toLowerCase();

  // Extract and translate attributes
  const placeholder = translateAndLower(element.getAttribute('placeholder') ?? '');
  const ariaLabel = translateAndLower(element.getAttribute('aria-label') ?? '');
  const name = translateAndLower(element.getAttribute('name') ?? '');
  const id = translateAndLower(element.id ?? '');

  // Get label text
  let label = '';
  if ('labels' in element && element.labels && element.labels.length > 0) {
    label = translateAndLower(element.labels[0]?.textContent ?? '');
  }

  // Fallback to closest label finder
  if (!label) {
    const closestLabel = findClosestLabel(element);
    if (closestLabel) {
      label = translateAndLower(closestLabel);
    }
  }

  // Process class list
  const classList = Array.from(element.classList)
    .map(cls => translateAndLower(cls))
    .join(' ');

  // Process data attributes
  const dataAttributes = Array.from(element.attributes)
    .filter(attr => attr.name.startsWith('data-'))
    .map(attr => `${attr.name.toLowerCase()}: ${translateAndLower(attr.value)}`)
    .join(' ');

  const attrs: ElementAttributes = {
    type,
    placeholder,
    ariaLabel,
    label,
    name,
    id,
    classList,
    dataAttributes,
    // Last parts for partial matching
    namePart: getLastPart(name),
    idPart: getLastPart(id),
    classPart: classList.split(' ').pop() ?? '',
    placeholderPart: placeholder.split(' ').pop() ?? '',
    ariaLabelPart: ariaLabel.split(' ').pop() ?? '',
    labelPart: label.split(' ').pop() ?? '',
    dataAttributesPart: dataAttributes.split(' ').pop() ?? ''
  };

  // Cache and return
  attributeCache.set(element, attrs);
  return attrs;
};

// ============ Japanese Type Detection ============

/**
 * Detect Japanese text type (hiragana, katakana, romaji) for text inputs
 * @param element - The form element to check
 * @returns Japanese text type or empty string
 */
export const getElmJapanType = (element: SupportedElement | null): string => {
  if (!element) return '';

  // Check cache
  const cached = japanTypeCache.get(element);
  if (cached !== undefined) return cached;

  const attrs = getElementAttributes(element);

  // Only check for text inputs
  if (attrs.type !== 'text') {
    japanTypeCache.set(element, '');
    return '';
  }

  // Check each Japanese type rule
  for (const rule of detectionRules.japaneseTypes) {
    if (matchesAnyAttribute(attrs, rule.keywords)) {
      japanTypeCache.set(element, rule.type);
      return rule.type;
    }
  }

  japanTypeCache.set(element, '');
  return '';
};

// ============ Main Type Detection ============

/**
 * Detect the type of a form element based on its attributes
 * Uses rule-based detection
 * @param element - The form element to check
 * @returns Detected field type or default type
 */
export const getElmType = (element: SupportedElement | null): string => {
  if (!element) return 'text';

  // Check cache
  const cached = typeCache.get(element);
  if (cached !== undefined) return cached;

  const attrs = getElementAttributes(element);

  // Handle native HTML5 input types
  if (detectionRules.nativeInputTypes.includes(attrs.type)) {
    const mappedType = detectionRules.nativeTypeMapping[attrs.type];
    const result = mappedType !== undefined ? mappedType : attrs.type;
    typeCache.set(element, result);
    return result;
  }

  // For text, number, and textarea, check against text input type rules
  const checkableTypes = ['text', 'number', 'textarea'];
  if (checkableTypes.includes(attrs.type)) {
    // Use rules sorted by priority for more accurate matching
    const sortedRules = getRulesByPriority();

    for (const rule of sortedRules) {
      // Check if attributes match keywords
      if (matchesAnyAttribute(attrs, rule.keywords)) {
        // Check negative keywords - skip if any negative pattern matches
        if (matchesNegativeKeywords(attrs, rule.negativeKeywords)) {
          continue;
        }

        // Check excludeTypes to avoid false positives
        if (rule.excludeTypes) {
          const hasExcludedMatch = rule.excludeTypes.some(excludedType => {
            const excludedRule = sortedRules.find(r => r.type === excludedType);
            return excludedRule && matchesAnyAttribute(attrs, excludedRule.keywords);
          });

          if (hasExcludedMatch) continue;
        }

        typeCache.set(element, rule.type);
        return rule.type;
      }
    }
  }

  // Default based on element type
  const defaultType = attrs.type || 'text';
  typeCache.set(element, defaultType);
  return defaultType;
};

/**
 * Detect field type with AI enhancement
 * Uses rule-based detection first, falls back to AI if no match
 * @param element - The form element to check
 * @returns Promise with detected field type
 */
export const getElmTypeWithAI = async (element: SupportedElement | null): Promise<string> => {
  if (!element) return 'text';

  // Get rule-based detection first
  const ruleBasedType = getElmType(element);

  // Check if AI detection is enabled
  const aiEnabled = await isAIDetectionEnabled();
  if (!aiEnabled) return ruleBasedType;

  // If rule-based got a confident match (not default), use it
  if (ruleBasedType !== 'text' && ruleBasedType !== 'textarea') {
    return ruleBasedType;
  }

  // Try AI detection as fallback for generic text fields
  try {
    const threshold = await getConfidenceThreshold();

    // Only HTMLInputElement is supported by AI detection currently
    if (element.tagName === 'INPUT') {
      const aiPrediction = predictFieldTypeEnhanced(element as HTMLInputElement, threshold);

      if (aiPrediction && aiPrediction.confidence >= threshold) {
        logger.debug(`AI detected: ${aiPrediction.type} (confidence: ${aiPrediction.confidence})`);
        return aiPrediction.type;
      }
    }
  } catch (error) {
    logger.warn('AI detection failed, using rule-based result:', error);
  }

  return ruleBasedType;
};

// ============ Exports ============

// Backward compatibility aliases
export const detectFieldType = getElmType;
export const detectFieldTypeWithAI = getElmTypeWithAI;
