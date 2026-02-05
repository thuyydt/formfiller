// helpers/aiFieldDetection.ts
// AI-Powered Field Detection using Machine Learning-inspired scoring algorithm
// This provides intelligent field detection as a fallback/enhancement to rule-based detection

import type { FieldType } from '../types';
import { trainingData, type TrainingPattern } from '../data/fieldPatterns';
import { translateKeywords } from './locale';

// ============ Configuration Constants ============
// Centralized magic numbers for easier tuning

const SCORING_CONFIG = {
  // Primary token weights (name/id attributes - most reliable)
  PRIMARY_EXACT_MATCH: 1.5,
  PRIMARY_CONTAINS: 1.2,
  PRIMARY_SUBSTRING: 0.9,
  PRIMARY_MIN_SUBSTRING_LENGTH: 4,

  // Secondary token weights (placeholder, class, etc.)
  SECONDARY_EXACT_MATCH: 0.6,
  SECONDARY_CONTAINS: 0.5,
  SECONDARY_SUBSTRING: 0.3,
  SECONDARY_MIN_SUBSTRING_LENGTH: 4,

  // Context weights (labels, legends)
  CONTEXT_KEYWORD: 0.35,
  CONTEXT_EXACT_MATCH: 0.5,
  CONTEXT_CONTAINS: 0.4,
  CONTEXT_MIN_PATTERN_LENGTH: 3,

  // Structural bonuses
  STRUCT_EMAIL_TYPE: 0.5,
  STRUCT_PASSWORD_TYPE: 0.8,
  STRUCT_URL_TYPE: 0.5,
  STRUCT_DATE_TYPE: 0.5,
  STRUCT_NUMBER_TYPE: 0.4,
  STRUCT_TEL_TYPE: 0.5,

  // Required field multiplier
  REQUIRED_MULTIPLIER: 1.05,

  // Confidence calculation
  CONFIDENCE_DIVISOR: 1.8,
  CONFIDENCE_BOOST_THRESHOLD: 0.3,
  CONFIDENCE_BOOST_MULTIPLIER: 1.1,
  MAX_CONFIDENCE: 0.98,

  // Minimum confidence threshold
  DEFAULT_MIN_CONFIDENCE: 0.6
} as const;

// ============ Types ============

type SupportedElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

/**
 * Cache for AI predictions to improve performance
 */
interface CachedPrediction {
  prediction: AIPrediction | null;
  attributesSignature: string;
  timestamp: number;
}

// Cache TTL in milliseconds (30 seconds)
const CACHE_TTL_MS = 30000;

const predictionCache = new WeakMap<SupportedElement, CachedPrediction>();

/**
 * Generate a signature string based on element attributes
 * Used to invalidate cache if attributes change
 */
const generateAttributeSignature = (element: SupportedElement): string => {
  return [
    element.getAttribute('name'),
    element.id,
    element.getAttribute('placeholder'),
    element.className,
    element.getAttribute('type'),
    element.getAttribute('aria-label'),
    element.title,
    element.getAttribute('required'),
    element.getAttribute('maxlength'),
    element.getAttribute('autocomplete')
  ].join('|');
};

/**
 * Check if cached prediction is still valid
 */
const isCacheValid = (cached: CachedPrediction, signature: string): boolean => {
  if (cached.attributesSignature !== signature) return false;
  if (Date.now() - cached.timestamp > CACHE_TTL_MS) return false;
  return true;
};

/**
 * Clear prediction cache (useful when settings change)
 */
export const clearPredictionCache = (): void => {
  // WeakMap auto-cleans when elements are GC'd
  // Cache will be naturally cleared when elements are garbage collected
};

// ============ Negative Patterns ============
// Patterns that indicate a field is NOT of a certain type

const NEGATIVE_PATTERNS: Partial<Record<FieldType, string[]>> = {
  name: ['username', 'login', 'account', 'user_name', 'userid'],
  first_name: ['username', 'company', 'organization'],
  last_name: ['username', 'company', 'organization'],
  email: ['reply', 'forward', 'subject'],
  phone: ['extension', 'ext'],
  password: ['show', 'toggle', 'visibility'],
  address: ['email', 'ip', 'mac'],
  state: ['country', 'state_id'],
  zip: ['zip_file', 'zipcode_lookup'],
  date: ['update', 'updated']
};

// ============ Pattern Index for Fast Lookup ============

interface PatternIndex {
  patternToTypes: Map<string, Array<{ type: FieldType; weight: number }>>;
  typeToPatterns: Map<FieldType, TrainingPattern>;
}

let patternIndex: PatternIndex | null = null;

/**
 * Build index for faster pattern lookup (lazy initialization)
 */
const buildPatternIndex = (): PatternIndex => {
  if (patternIndex) return patternIndex;

  const patternToTypes = new Map<string, Array<{ type: FieldType; weight: number }>>();
  const typeToPatterns = new Map<FieldType, TrainingPattern>();

  trainingData.forEach(pattern => {
    typeToPatterns.set(pattern.type, pattern);

    pattern.patterns.forEach(p => {
      const existing = patternToTypes.get(p) || [];
      existing.push({ type: pattern.type, weight: pattern.weight });
      patternToTypes.set(p, existing);
    });
  });

  patternIndex = { patternToTypes, typeToPatterns };
  return patternIndex;
};

/**
 * Feature extraction result
 */
interface FieldFeatures {
  tokens: string[]; // All tokens extracted from field
  primaryTokens: string[]; // Tokens from name/id only (highest priority)
  contextTokens: string[]; // Tokens from surrounding elements
  negativeTokens: string[]; // Tokens that suggest this is NOT a certain type
  structuralFeatures: {
    hasLabel: boolean;
    hasPlaceholder: boolean;
    hasPattern: boolean;
    inputType: string;
    maxLength: number;
    minLength: number;
    required: boolean;
    autocomplete: string;
    tagName: string;
  };
}

/**
 * Prediction result with confidence score
 */
export interface AIPrediction {
  type: FieldType;
  confidence: number; // 0-1 scale
  features: string[]; // Features that contributed to this prediction
  method: 'ai-scoring' | 'ai-ensemble' | 'rule-based';
  alternatives?: Array<{ type: FieldType; confidence: number }>; // Runner-up predictions
}

/**
 * Extract all meaningful tokens from a form element
 */
const extractFieldFeatures = (element: SupportedElement): FieldFeatures => {
  const tokens: string[] = [];
  const primaryTokens: string[] = [];
  const contextTokens: string[] = [];
  const negativeTokens: string[] = [];

  // Helper to tokenize and clean strings (supports Unicode)
  const tokenize = (str: string): string[] => {
    if (!str) return [];

    // Convert to lowercase
    const lower = str.toLowerCase();

    // Translate keywords to English equivalents
    const translated = translateKeywords(lower);

    // Split by non-alphanumeric characters (but preserve Unicode letters)
    // This regex keeps Unicode letters/numbers and splits on punctuation/symbols
    return translated
      .replace(/[^\p{L}\p{N}]+/gu, ' ') // Unicode-aware: keep letters and numbers
      .split(/\s+/)
      .filter(t => t.length > 1); // Remove single chars
  };

  // Extract from main attributes
  const name = element.getAttribute('name') || '';
  const id = element.id || '';
  const nameTokens = tokenize(name);
  const idTokens = tokenize(id);
  primaryTokens.push(...nameTokens, ...idTokens); // Primary identifiers
  tokens.push(...nameTokens, ...idTokens);

  const placeholder = element.getAttribute('placeholder') || '';
  tokens.push(...tokenize(placeholder));
  tokens.push(...tokenize(element.className || ''));
  tokens.push(...tokenize(element.getAttribute('aria-label') || ''));
  tokens.push(...tokenize(element.title || ''));

  // Autocomplete hint (very reliable when present)
  const autocomplete = element.getAttribute('autocomplete') || '';
  if (autocomplete && autocomplete !== 'off' && autocomplete !== 'on') {
    primaryTokens.push(...tokenize(autocomplete));
    tokens.push(...tokenize(autocomplete));
  }

  // Extract from data attributes
  Array.from(element.attributes).forEach(attr => {
    if (attr.name.startsWith('data-')) {
      tokens.push(...tokenize(attr.name.slice(5)));
      tokens.push(...tokenize(attr.value));
    }
  });

  // Extract context from labels
  if ('labels' in element && element.labels) {
    Array.from(element.labels).forEach(label => {
      contextTokens.push(...tokenize(label.textContent || ''));
    });
  }

  // Fallback label search by id
  if (id) {
    const labelFor = document.querySelector(`label[for="${CSS.escape(id)}"]`);
    if (labelFor) {
      contextTokens.push(...tokenize(labelFor.textContent || ''));
    }
  }

  // Extract context from parent elements (form legends, fieldsets, etc.)
  let parent = element.parentElement;
  let depth = 0;
  while (parent && depth < 4) {
    if (parent.tagName === 'LEGEND') {
      contextTokens.push(...tokenize(parent.textContent || ''));
    }
    if (parent.tagName === 'FIELDSET') {
      const legend = parent.querySelector(':scope > legend');
      if (legend) {
        contextTokens.push(...tokenize(legend.textContent || ''));
      }
    }
    parent = parent.parentElement;
    depth++;
  }

  // Determine input type
  const inputType =
    element.tagName === 'INPUT'
      ? (element as HTMLInputElement).type || 'text'
      : element.tagName.toLowerCase();

  // Structural features
  const structuralFeatures = {
    hasLabel: contextTokens.length > 0,
    hasPlaceholder: !!placeholder,
    hasPattern: element.hasAttribute('pattern'),
    inputType,
    maxLength: parseInt(element.getAttribute('maxlength') || '0', 10),
    minLength: parseInt(element.getAttribute('minlength') || '0', 10),
    required: element.hasAttribute('required'),
    autocomplete,
    tagName: element.tagName
  };

  return {
    tokens: [...new Set(tokens)], // Remove duplicates
    primaryTokens: [...new Set(primaryTokens)],
    contextTokens: [...new Set(contextTokens)],
    negativeTokens,
    structuralFeatures
  };
};

/**
 * Score calculation result
 */
interface ScoreResult {
  score: number;
  matchedFeatures: string[];
  negativeScore: number;
}

/**
 * Calculate similarity score between field tokens and pattern
 * Uses weighted matching based on token importance
 */
const calculatePatternScore = (features: FieldFeatures, pattern: TrainingPattern): ScoreResult => {
  let score = 0;
  let negativeScore = 0;
  const matchedFeatures: string[] = [];
  const cfg = SCORING_CONFIG;

  // Check negative patterns first
  const negatives = NEGATIVE_PATTERNS[pattern.type] || [];
  features.primaryTokens.forEach(token => {
    if (negatives.some(neg => token.includes(neg) || neg.includes(token))) {
      negativeScore += 0.5;
      matchedFeatures.push(`negative:${token}`);
    }
  });

  // Check direct pattern matches in field tokens
  // PRIORITY 1: Primary tokens (name/id) get highest weight
  features.primaryTokens.forEach(token => {
    pattern.patterns.forEach(patternStr => {
      // Exact match gets full score with bonus
      if (token === patternStr) {
        score += pattern.weight * cfg.PRIMARY_EXACT_MATCH;
        matchedFeatures.push(`primary:${token}==${patternStr}`);
      }
      // Contains match gets partial score
      else if (token.includes(patternStr)) {
        const matchStrength = Math.min(patternStr.length / token.length, 1.0);
        score += pattern.weight * matchStrength * cfg.PRIMARY_CONTAINS;
        matchedFeatures.push(`primary:${token}→${patternStr}`);
      }
      // Pattern contains token (minimum 4 chars)
      else if (patternStr.includes(token) && token.length >= cfg.PRIMARY_MIN_SUBSTRING_LENGTH) {
        const matchStrength = token.length / patternStr.length;
        score += pattern.weight * matchStrength * cfg.PRIMARY_SUBSTRING;
        matchedFeatures.push(`primary:${token}⊂${patternStr}`);
      }
    });
  });

  // PRIORITY 2: Secondary tokens (placeholder, className, etc.) get lower weight
  const secondaryTokens = features.tokens.filter(t => !features.primaryTokens.includes(t));
  secondaryTokens.forEach(token => {
    pattern.patterns.forEach(patternStr => {
      // Exact match gets reduced score for secondary
      if (token === patternStr) {
        score += pattern.weight * cfg.SECONDARY_EXACT_MATCH;
        matchedFeatures.push(`token:${token}==${patternStr}`);
      }
      // Contains match gets partial score
      else if (token.includes(patternStr)) {
        const matchStrength = Math.min(patternStr.length / token.length, 1.0);
        score += pattern.weight * matchStrength * cfg.SECONDARY_CONTAINS;
        matchedFeatures.push(`token:${token}→${patternStr}`);
      }
      // Pattern contains token (minimum 4 chars to avoid false positives like 'user')
      else if (patternStr.includes(token) && token.length >= cfg.SECONDARY_MIN_SUBSTRING_LENGTH) {
        const matchStrength = token.length / patternStr.length;
        score += pattern.weight * matchStrength * cfg.SECONDARY_SUBSTRING;
        matchedFeatures.push(`token:${token}⊂${patternStr}`);
      }
    });
  });

  // Check context keywords (lower weight)
  if (pattern.contextKeywords) {
    features.contextTokens.forEach(contextToken => {
      pattern.contextKeywords?.forEach(keyword => {
        if (contextToken.includes(keyword) || keyword.includes(contextToken)) {
          score += pattern.weight * cfg.CONTEXT_KEYWORD;
          matchedFeatures.push(`context:${contextToken}→${keyword}`);
        }
      });
    });
  }

  // IMPORTANT: If placeholder/label explicitly mentions the pattern, give strong boost
  features.contextTokens.forEach(contextToken => {
    pattern.patterns.forEach(patternStr => {
      if (contextToken === patternStr) {
        score += pattern.weight * cfg.CONTEXT_EXACT_MATCH;
        matchedFeatures.push(`context-exact:${contextToken}==${patternStr}`);
      } else if (
        contextToken.includes(patternStr) &&
        patternStr.length > cfg.CONTEXT_MIN_PATTERN_LENGTH
      ) {
        score += pattern.weight * cfg.CONTEXT_CONTAINS;
        matchedFeatures.push(`context-contains:${contextToken}→${patternStr}`);
      }
    });
  });

  // Boost score for structural features that match common patterns
  const struct = features.structuralFeatures;
  const structBonuses: Record<string, { types: FieldType[]; bonus: number }> = {
    email: { types: ['email'], bonus: cfg.STRUCT_EMAIL_TYPE },
    password: { types: ['password'], bonus: cfg.STRUCT_PASSWORD_TYPE },
    url: { types: ['url'], bonus: cfg.STRUCT_URL_TYPE },
    date: { types: ['date', 'birthdate'], bonus: cfg.STRUCT_DATE_TYPE },
    number: { types: ['number'], bonus: cfg.STRUCT_NUMBER_TYPE },
    tel: { types: ['phone'], bonus: cfg.STRUCT_TEL_TYPE }
  };

  const bonus = structBonuses[struct.inputType];
  if (bonus && bonus.types.includes(pattern.type)) {
    score += bonus.bonus;
    matchedFeatures.push(`struct:type=${struct.inputType}`);
  }

  // Boost for required fields (slightly higher confidence)
  if (struct.required) {
    score *= cfg.REQUIRED_MULTIPLIER;
  }

  // Apply negative score penalty
  score = Math.max(0, score - negativeScore);

  return { score, matchedFeatures, negativeScore };
};

/**
 * Predict field type using AI-powered scoring algorithm
 * @param element - The form element to analyze (input, textarea, or select)
 * @param minConfidence - Minimum confidence threshold (0-1)
 * @returns Prediction with confidence score, or null if below threshold
 */
export const predictFieldType = (
  element: SupportedElement,
  minConfidence: number = SCORING_CONFIG.DEFAULT_MIN_CONFIDENCE
): AIPrediction | null => {
  // Check cache first
  const signature = generateAttributeSignature(element);
  const cached = predictionCache.get(element);

  if (cached && isCacheValid(cached, signature)) {
    // Return cached result if valid
    if (!cached.prediction || cached.prediction.confidence >= minConfidence) {
      return cached.prediction;
    }
  }

  // Extract features from the field
  const features = extractFieldFeatures(element);

  // If no meaningful tokens, return null
  if (features.tokens.length === 0 && features.contextTokens.length === 0) {
    const nullResult: CachedPrediction = {
      prediction: null,
      attributesSignature: signature,
      timestamp: Date.now()
    };
    predictionCache.set(element, nullResult);
    return null;
  }

  // Build pattern index on first use
  buildPatternIndex();

  // Calculate scores for all patterns
  const scores: Array<{
    pattern: TrainingPattern;
    score: number;
    matchedFeatures: string[];
  }> = [];

  trainingData.forEach(pattern => {
    const result = calculatePatternScore(features, pattern);
    if (result.score > 0) {
      scores.push({
        pattern,
        score: result.score,
        matchedFeatures: result.matchedFeatures
      });
    }
  });

  // Sort by score (descending)
  scores.sort((a, b) => b.score - a.score);

  // Get best prediction
  if (scores.length === 0) {
    const nullResult: CachedPrediction = {
      prediction: null,
      attributesSignature: signature,
      timestamp: Date.now()
    };
    predictionCache.set(element, nullResult);
    return null;
  }

  const bestMatch = scores[0];
  if (!bestMatch) {
    const nullResult: CachedPrediction = {
      prediction: null,
      attributesSignature: signature,
      timestamp: Date.now()
    };
    predictionCache.set(element, nullResult);
    return null;
  }

  const cfg = SCORING_CONFIG;

  // Normalize confidence with improved scaling
  let confidence = Math.min(bestMatch.score / cfg.CONFIDENCE_DIVISOR, 1.0);

  // If we have a clear winner (significantly better than second), boost confidence
  if (scores.length > 1) {
    const secondBest = scores[1];
    if (secondBest) {
      const scoreDifference = bestMatch.score - secondBest.score;
      if (scoreDifference > cfg.CONFIDENCE_BOOST_THRESHOLD) {
        confidence = Math.min(confidence * cfg.CONFIDENCE_BOOST_MULTIPLIER, cfg.MAX_CONFIDENCE);
      }
    }
  }

  // Get alternatives for debugging/transparency
  const alternatives = scores.slice(1, 4).map(s => ({
    type: s.pattern.type,
    confidence: Math.min(s.score / cfg.CONFIDENCE_DIVISOR, 1.0)
  }));

  const result: AIPrediction = {
    type: bestMatch.pattern.type,
    confidence,
    features: bestMatch.matchedFeatures,
    method: 'ai-scoring',
    alternatives
  };

  // Cache the result (regardless of threshold check)
  predictionCache.set(element, {
    prediction: result,
    attributesSignature: signature,
    timestamp: Date.now()
  });

  // Check if confidence meets minimum threshold
  if (confidence < minConfidence) {
    return null;
  }

  return result;
};

/**
 * Enhanced prediction using ensemble method
 * Combines AI scoring with additional heuristics
 */
export const predictFieldTypeEnhanced = (
  element: SupportedElement,
  minConfidence: number = SCORING_CONFIG.DEFAULT_MIN_CONFIDENCE
): AIPrediction | null => {
  // Get base AI prediction
  const basePrediction = predictFieldType(element, minConfidence * 0.8);

  if (!basePrediction) {
    return null;
  }

  // Apply ensemble enhancements
  let confidence = basePrediction.confidence;
  const features = [...basePrediction.features];

  // Get element attributes for enhancement checks
  const placeholder = element.getAttribute('placeholder') || '';
  const inputType = element.tagName === 'INPUT' ? (element as HTMLInputElement).type : '';

  // Enhancement 1: Check for common attribute patterns
  if (basePrediction.type === 'email') {
    if (/@/.test(placeholder)) {
      confidence += 0.1;
      features.push('enhance:placeholder-has-@');
    }
    if (inputType === 'email') {
      confidence += 0.15;
      features.push('enhance:native-email-type');
    }
  }

  if (basePrediction.type === 'password') {
    if (inputType === 'password') {
      confidence += 0.15;
      features.push('enhance:native-password-type');
    }
  }

  if (basePrediction.type === 'phone') {
    if (inputType === 'tel') {
      confidence += 0.1;
      features.push('enhance:native-tel-type');
    }
    if (/[\d\-()]{3,}/.test(placeholder)) {
      confidence += 0.05;
      features.push('enhance:placeholder-has-phone-format');
    }
  }

  // URL pattern in placeholder
  if (basePrediction.type === 'url' && /https?:\/\/|www\./.test(placeholder)) {
    confidence += 0.1;
    features.push('enhance:placeholder-has-url');
  }

  // Enhancement 2: Check field position (first/last name often appear together)
  if (basePrediction.type === 'first_name' || basePrediction.type === 'last_name') {
    const form = element.closest('form');
    if (form) {
      const inputs = Array.from(form.querySelectorAll('input[type="text"], input:not([type])'));
      const index = inputs.indexOf(element);
      if (index >= 0 && index < inputs.length - 1) {
        const nextInput = inputs[index + 1] as HTMLInputElement;
        const nextName = (nextInput.name || nextInput.id || '').toLowerCase();
        if (basePrediction.type === 'first_name' && /last|surname|family/.test(nextName)) {
          confidence += 0.05;
          features.push('enhance:next-field-is-lastname');
        }
        if (basePrediction.type === 'last_name' && index > 0) {
          const prevInput = inputs[index - 1] as HTMLInputElement;
          const prevName = (prevInput.name || prevInput.id || '').toLowerCase();
          if (/first|given|fore/.test(prevName)) {
            confidence += 0.05;
            features.push('enhance:prev-field-is-firstname');
          }
        }
      }
    }
  }

  // Cap confidence at MAX_CONFIDENCE (never 100% certain)
  confidence = Math.min(confidence, SCORING_CONFIG.MAX_CONFIDENCE);

  return {
    type: basePrediction.type,
    confidence,
    features,
    method: 'ai-ensemble',
    alternatives: basePrediction.alternatives
  };
};

/**
 * Get detailed analysis of a field for debugging
 */
export const analyzeField = (
  element: SupportedElement
): {
  features: FieldFeatures;
  predictions: Array<{ type: FieldType; confidence: number; features: string[] }>;
} => {
  const features = extractFieldFeatures(element);
  const predictions: Array<{ type: FieldType; confidence: number; features: string[] }> = [];

  trainingData.forEach(pattern => {
    const result = calculatePatternScore(features, pattern);
    const confidence = Math.min(result.score / SCORING_CONFIG.CONFIDENCE_DIVISOR, 1.0);
    if (confidence > 0.1) {
      predictions.push({
        type: pattern.type,
        confidence,
        features: result.matchedFeatures
      });
    }
  });

  predictions.sort((a, b) => b.confidence - a.confidence);

  return { features, predictions };
};

/**
 * Check if AI detection should be enabled based on user settings
 */
export const isAIDetectionEnabled = async (): Promise<boolean> => {
  return new Promise(resolve => {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      resolve(true); // Default enabled in non-extension context
      return;
    }
    chrome.storage.local.get(['enableAIDetection'], (result: { enableAIDetection?: boolean }) => {
      resolve(result.enableAIDetection !== false); // Default enabled
    });
  });
};

/**
 * Get confidence threshold from user settings
 */
export const getConfidenceThreshold = async (): Promise<number> => {
  return new Promise(resolve => {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      resolve(SCORING_CONFIG.DEFAULT_MIN_CONFIDENCE);
      return;
    }
    chrome.storage.local.get(
      ['aiConfidenceThreshold'],
      (result: { aiConfidenceThreshold?: number }) => {
        resolve(result.aiConfidenceThreshold || SCORING_CONFIG.DEFAULT_MIN_CONFIDENCE);
      }
    );
  });
};

export default {
  predictFieldType,
  predictFieldTypeEnhanced,
  analyzeField,
  isAIDetectionEnabled,
  getConfidenceThreshold,
  clearPredictionCache
};
