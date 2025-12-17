// helpers/aiFieldDetection.ts
// AI-Powered Field Detection using Machine Learning-inspired scoring algorithm
// This provides intelligent field detection as a fallback/enhancement to rule-based detection

import type { FieldType } from '../types';
import { trainingData, type TrainingPattern } from '../data/fieldPatterns';
import { translateKeywords } from './locale';

/**
 * Cache for AI predictions to improve performance
 */
interface CachedPrediction {
  prediction: AIPrediction | null;
  attributesSignature: string;
}

const predictionCache = new WeakMap<HTMLInputElement, CachedPrediction>();

/**
 * Generate a signature string based on element attributes
 * Used to invalidate cache if attributes change
 */
const generateAttributeSignature = (input: HTMLInputElement): string => {
  return [
    input.name,
    input.id,
    input.placeholder,
    input.className,
    input.type,
    input.getAttribute('aria-label'),
    input.title,
    input.required ? 'req' : '',
    input.maxLength
  ].join('|');
};

/**
 * Feature extraction result
 */
interface FieldFeatures {
  tokens: string[]; // All tokens extracted from field
  primaryTokens: string[]; // Tokens from name/id only (highest priority)
  contextTokens: string[]; // Tokens from surrounding elements
  structuralFeatures: {
    hasLabel: boolean;
    hasPlaceholder: boolean;
    hasPattern: boolean;
    inputType: string;
    maxLength: number;
    required: boolean;
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
}

/**
 * Extract all meaningful tokens from an input element
 */
const extractFieldFeatures = (input: HTMLInputElement): FieldFeatures => {
  const tokens: string[] = [];
  const primaryTokens: string[] = [];
  const contextTokens: string[] = [];

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
  const nameTokens = tokenize(input.name || '');
  const idTokens = tokenize(input.id || '');
  primaryTokens.push(...nameTokens, ...idTokens); // Primary identifiers
  tokens.push(...nameTokens, ...idTokens);
  tokens.push(...tokenize(input.placeholder || ''));
  tokens.push(...tokenize(input.className || ''));
  tokens.push(...tokenize(input.getAttribute('aria-label') || ''));
  tokens.push(...tokenize(input.title || ''));

  // Extract from data attributes
  Array.from(input.attributes).forEach(attr => {
    if (attr.name.startsWith('data-')) {
      tokens.push(...tokenize(attr.name));
      tokens.push(...tokenize(attr.value));
    }
  });

  // Extract context from label
  const label = input.labels?.[0] || document.querySelector(`label[for="${input.id}"]`);
  if (label) {
    contextTokens.push(...tokenize(label.textContent || ''));
  }

  // Extract context from parent elements (form legends, fieldsets, etc.)
  let parent = input.parentElement;
  let depth = 0;
  while (parent && depth < 3) {
    if (parent.tagName === 'LEGEND' || parent.tagName === 'FIELDSET') {
      contextTokens.push(...tokenize(parent.textContent || ''));
    }
    parent = parent.parentElement;
    depth++;
  }

  // Structural features
  const structuralFeatures = {
    hasLabel: !!label,
    hasPlaceholder: !!input.placeholder,
    hasPattern: !!input.pattern,
    inputType: input.type || 'text',
    maxLength: input.maxLength || 0,
    required: input.required
  };

  return {
    tokens: [...new Set(tokens)], // Remove duplicates
    primaryTokens: [...new Set(primaryTokens)],
    contextTokens: [...new Set(contextTokens)],
    structuralFeatures
  };
};

/**
 * Calculate similarity score between field tokens and pattern
 * Uses weighted matching based on token importance
 */
const calculatePatternScore = (
  features: FieldFeatures,
  pattern: TrainingPattern
): { score: number; matchedFeatures: string[] } => {
  let score = 0;
  const matchedFeatures: string[] = [];

  // Check direct pattern matches in field tokens
  // PRIORITY 1: Primary tokens (name/id) get highest weight
  features.primaryTokens.forEach(token => {
    pattern.patterns.forEach(patternStr => {
      // Exact match gets full score with bonus
      if (token === patternStr) {
        score += pattern.weight * 1.5; // Extra bonus for primary exact match
        matchedFeatures.push(`primary:${token}==${patternStr}`);
      }
      // Contains match gets partial score
      else if (token.includes(patternStr)) {
        const matchStrength = Math.min(patternStr.length / token.length, 1.0);
        score += pattern.weight * matchStrength * 1.2;
        matchedFeatures.push(`primary:${token}→${patternStr}`);
      }
      // Pattern contains token (minimum 4 chars)
      else if (patternStr.includes(token) && token.length >= 4) {
        const matchStrength = token.length / patternStr.length;
        score += pattern.weight * matchStrength * 0.9;
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
        score += pattern.weight * 0.6; // Much lower than primary
        matchedFeatures.push(`token:${token}==${patternStr}`);
      }
      // Contains match gets partial score
      else if (token.includes(patternStr)) {
        const matchStrength = Math.min(patternStr.length / token.length, 1.0);
        score += pattern.weight * matchStrength * 0.5;
        matchedFeatures.push(`token:${token}→${patternStr}`);
      }
      // Pattern contains token (minimum 4 chars to avoid false positives like 'user')
      else if (patternStr.includes(token) && token.length >= 4) {
        const matchStrength = token.length / patternStr.length;
        score += pattern.weight * matchStrength * 0.3; // Very low for secondary substring
        matchedFeatures.push(`token:${token}⊂${patternStr}`);
      }
    });
  });

  // Check context keywords (lower weight)
  if (pattern.contextKeywords) {
    features.contextTokens.forEach(contextToken => {
      pattern.contextKeywords?.forEach(keyword => {
        if (contextToken.includes(keyword) || keyword.includes(contextToken)) {
          score += pattern.weight * 0.35; // Increased from 0.3 to 0.35 for better context weight
          matchedFeatures.push(`context:${contextToken}→${keyword}`);
        }
      });
    });
  }

  // IMPORTANT: If placeholder/label explicitly mentions the pattern, give strong boost
  features.contextTokens.forEach(contextToken => {
    pattern.patterns.forEach(patternStr => {
      if (contextToken === patternStr) {
        score += pattern.weight * 0.5; // Strong boost for exact match in context
        matchedFeatures.push(`context-exact:${contextToken}==${patternStr}`);
      } else if (contextToken.includes(patternStr) && patternStr.length > 3) {
        score += pattern.weight * 0.4; // Good boost for contains in context
        matchedFeatures.push(`context-contains:${contextToken}→${patternStr}`);
      }
    });
  });

  // Boost score for structural features that match common patterns
  if (pattern.type === 'email' && features.structuralFeatures.inputType === 'email') {
    score += 0.5;
    matchedFeatures.push('struct:type=email');
  }
  if (pattern.type === 'password' && features.structuralFeatures.inputType === 'password') {
    score += 0.8;
    matchedFeatures.push('struct:type=password');
  }
  if (pattern.type === 'url' && features.structuralFeatures.inputType === 'url') {
    score += 0.5;
    matchedFeatures.push('struct:type=url');
  }
  if (pattern.type === 'date' && features.structuralFeatures.inputType === 'date') {
    score += 0.5;
    matchedFeatures.push('struct:type=date');
  }
  if (pattern.type === 'number' && features.structuralFeatures.inputType === 'number') {
    score += 0.4;
    matchedFeatures.push('struct:type=number');
  }
  if (pattern.type === 'phone' && features.structuralFeatures.inputType === 'tel') {
    score += 0.5;
    matchedFeatures.push('struct:type=tel');
  }

  // Boost for required fields (slightly higher confidence)
  if (features.structuralFeatures.required) {
    score *= 1.05;
  }

  return { score, matchedFeatures };
};

/**
 * Predict field type using AI-powered scoring algorithm
 * @param input - The input element to analyze
 * @param minConfidence - Minimum confidence threshold (0-1)
 * @returns Prediction with confidence score, or null if below threshold
 */
export const predictFieldType = (
  input: HTMLInputElement,
  minConfidence: number = 0.6
): AIPrediction | null => {
  // Check cache first
  const signature = generateAttributeSignature(input);
  const cached = predictionCache.get(input);

  if (cached && cached.attributesSignature === signature) {
    // Return cached result if signature matches (attributes haven't changed)
    // Only return if confidence meets current threshold (optimization: assume threshold rarely changes drastically per session)
    if (!cached.prediction || cached.prediction.confidence >= minConfidence) {
      return cached.prediction;
    }
  }

  // Extract features from the field
  const features = extractFieldFeatures(input);

  // If no meaningful tokens, return null
  if (features.tokens.length === 0) {
    predictionCache.set(input, { prediction: null, attributesSignature: signature });
    return null;
  }

  // Calculate scores for all patterns
  const scores: Array<{
    pattern: TrainingPattern;
    score: number;
    matchedFeatures: string[];
  }> = [];

  trainingData.forEach(pattern => {
    const { score, matchedFeatures } = calculatePatternScore(features, pattern);
    if (score > 0) {
      scores.push({ pattern, score, matchedFeatures });
    }
  });

  // Sort by score (descending)
  scores.sort((a, b) => b.score - a.score);

  // Get best prediction
  if (scores.length === 0) {
    predictionCache.set(input, { prediction: null, attributesSignature: signature });
    return null;
  }

  const bestMatch = scores[0];
  if (!bestMatch) {
    predictionCache.set(input, { prediction: null, attributesSignature: signature });
    return null;
  }

  // Normalize confidence with improved scaling
  // Higher raw scores get better confidence
  let confidence = Math.min(bestMatch.score / 1.8, 1.0); // Changed from /2 to /1.8 for better scaling

  // If we have a clear winner (significantly better than second), boost confidence
  if (scores.length > 1) {
    const secondBest = scores[1];
    if (secondBest) {
      const scoreDifference = bestMatch.score - secondBest.score;
      if (scoreDifference > 0.3) {
        confidence = Math.min(confidence * 1.1, 0.98); // Boost up to 10%
      }
    }
  }

  const result: AIPrediction = {
    type: bestMatch.pattern.type,
    confidence,
    features: bestMatch.matchedFeatures,
    method: 'ai-scoring'
  };

  // Cache the result (regardless of threshold check)
  predictionCache.set(input, { prediction: result, attributesSignature: signature });

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
  input: HTMLInputElement,
  minConfidence: number = 0.6
): AIPrediction | null => {
  // Get base AI prediction
  const basePrediction = predictFieldType(input, minConfidence * 0.8);

  if (!basePrediction) {
    return null;
  }

  // Apply ensemble enhancements
  let confidence = basePrediction.confidence;
  const features = [...basePrediction.features];

  // Enhancement 1: Check for common attribute patterns
  if (basePrediction.type === 'email') {
    if (/@/.test(input.placeholder || '')) {
      confidence += 0.1;
      features.push('enhance:placeholder-has-@');
    }
    if (input.type === 'email') {
      confidence += 0.15;
      features.push('enhance:native-email-type');
    }
  }

  if (basePrediction.type === 'password') {
    if (input.type === 'password') {
      confidence += 0.15;
      features.push('enhance:native-password-type');
    }
  }

  if (basePrediction.type === 'phone') {
    if (input.type === 'tel') {
      confidence += 0.1;
      features.push('enhance:native-tel-type');
    }
    if (/\d{3}/.test(input.placeholder || '')) {
      confidence += 0.05;
      features.push('enhance:placeholder-has-numbers');
    }
  }

  // Enhancement 2: Check field position (first/last name often appear together)
  if (basePrediction.type === 'first_name' || basePrediction.type === 'last_name') {
    const form = input.form;
    if (form) {
      const inputs = Array.from(form.querySelectorAll('input[type="text"]'));
      const index = inputs.indexOf(input);
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

  // Cap confidence at 0.98 (never 100% certain)
  confidence = Math.min(confidence, 0.98);

  return {
    type: basePrediction.type,
    confidence,
    features,
    method: 'ai-ensemble'
  };
};

/**
 * Get detailed analysis of a field for debugging
 */
export const analyzeField = (
  input: HTMLInputElement
): {
  features: FieldFeatures;
  predictions: Array<{ type: FieldType; confidence: number; features: string[] }>;
} => {
  const features = extractFieldFeatures(input);
  const predictions: Array<{ type: FieldType; confidence: number; features: string[] }> = [];

  trainingData.forEach(pattern => {
    const { score, matchedFeatures } = calculatePatternScore(features, pattern);
    const confidence = Math.min(score / 2, 1.0);
    if (confidence > 0.1) {
      predictions.push({
        type: pattern.type,
        confidence,
        features: matchedFeatures
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
    chrome.storage.local.get(
      ['aiConfidenceThreshold'],
      (result: { aiConfidenceThreshold?: number }) => {
        resolve(result.aiConfidenceThreshold || 0.6); // Default 60%
      }
    );
  });
};

export default {
  predictFieldType,
  predictFieldTypeEnhanced,
  analyzeField,
  isAIDetectionEnabled,
  getConfidenceThreshold
};
