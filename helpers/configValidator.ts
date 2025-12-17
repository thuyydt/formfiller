/**
 * Configuration Validator
 * Validate and sanitize extension settings
 */

import type { FormFillerSettings, CustomField } from '../types';
import { logger } from './logger.js';
import { isRegexSafe, sanitizeCustomFieldPattern } from './security.js';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate locale setting
 */
function validateLocale(locale: string): ValidationResult {
  const validLocales = ['ja', 'en', 'zh', 'vi', 'ar', 'ko', 'es', 'fr', 'de', 'pl', 'ru'];

  const result: ValidationResult = {
    valid: validLocales.includes(locale),
    errors: [],
    warnings: []
  };

  if (!result.valid) {
    result.errors.push(`Invalid locale: ${locale}. Must be one of: ${validLocales.join(', ')}`);
  }

  return result;
}

/**
 * Validate ignore fields pattern
 */
function validateIgnoreFields(pattern: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  };

  if (!pattern.trim()) {
    return result; // Empty is valid
  }

  // Split by comma and validate each pattern
  const patterns = pattern.split(',').map(p => p.trim());

  for (const p of patterns) {
    if (p.length > 500) {
      result.errors.push(`Pattern too long: ${p.substring(0, 50)}...`);
      result.valid = false;
    }

    // Check for dangerous patterns
    if (p.includes('<script>') || p.includes('javascript:')) {
      result.errors.push('Dangerous pattern detected');
      result.valid = false;
    }
  }

  return result;
}

/**
 * Validate ignore domains
 */
function validateIgnoreDomains(domains: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  };

  if (!domains.trim()) {
    return result; // Empty is valid
  }

  const domainList = domains.split(',').map(d => d.trim());

  for (const domain of domainList) {
    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/;

    if (!domainRegex.test(domain)) {
      result.warnings.push(`Suspicious domain format: ${domain}`);
    }

    if (domain.length > 253) {
      result.errors.push(`Domain too long: ${domain}`);
      result.valid = false;
    }
  }

  return result;
}

/**
 * Validate custom fields
 */
function validateCustomFields(customFields: CustomField[]): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  };

  if (!Array.isArray(customFields)) {
    result.errors.push('Custom fields must be an array');
    result.valid = false;
    return result;
  }

  if (customFields.length > 100) {
    result.warnings.push('Too many custom fields may impact performance');
  }

  for (let i = 0; i < customFields.length; i++) {
    const field = customFields[i];

    if (!field) continue;

    // Validate field pattern
    if (!field.field || typeof field.field !== 'string') {
      result.errors.push(`Custom field ${i + 1}: Missing or invalid field pattern`);
      result.valid = false;
      continue;
    }

    // Validate type
    const validTypes = ['list', 'regex', 'faker'];
    if (!validTypes.includes(field.type)) {
      result.errors.push(`Custom field ${i + 1}: Invalid type "${field.type}"`);
      result.valid = false;
    }

    // Type-specific validation
    if (field.type === 'regex' && field.value) {
      if (!isRegexSafe(field.value)) {
        result.errors.push(`Custom field ${i + 1}: Unsafe regex pattern`);
        result.valid = false;
      }
    }

    if (field.type === 'list' && field.value) {
      const items = field.value.split(',');
      if (items.length > 1000) {
        result.warnings.push(`Custom field ${i + 1}: Very large list may impact performance`);
      }
    }

    if (field.type === 'faker' && field.faker) {
      // Validate faker path format
      if (!/^[a-zA-Z]+\.[a-zA-Z]+$/.test(field.faker)) {
        result.warnings.push(
          `Custom field ${i + 1}: Faker path should be in format "module.method"`
        );
      }
    }
  }

  return result;
}

/**
 * Validate confidence threshold
 */
function validateConfidenceThreshold(threshold: number): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  };

  if (typeof threshold !== 'number' || isNaN(threshold)) {
    result.errors.push('Confidence threshold must be a number');
    result.valid = false;
    return result;
  }

  if (threshold < 30 || threshold > 95) {
    result.errors.push('Confidence threshold must be between 30 and 95');
    result.valid = false;
  }

  if (threshold < 50) {
    result.warnings.push('Low confidence threshold may cause incorrect field detection');
  }

  return result;
}

/**
 * Validate all settings
 */
export function validateSettings(settings: Partial<FormFillerSettings>): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  };

  // Validate each setting
  if (settings.locale) {
    const localeResult = validateLocale(settings.locale);
    result.errors.push(...localeResult.errors);
    result.warnings.push(...localeResult.warnings);
    result.valid = result.valid && localeResult.valid;
  }

  if (settings.ignoreFields) {
    const ignoreFieldsResult = validateIgnoreFields(settings.ignoreFields);
    result.errors.push(...ignoreFieldsResult.errors);
    result.warnings.push(...ignoreFieldsResult.warnings);
    result.valid = result.valid && ignoreFieldsResult.valid;
  }

  if (settings.ignoreDomains) {
    const ignoreDomainsResult = validateIgnoreDomains(settings.ignoreDomains);
    result.errors.push(...ignoreDomainsResult.errors);
    result.warnings.push(...ignoreDomainsResult.warnings);
    result.valid = result.valid && ignoreDomainsResult.valid;
  }

  if (settings.customFields && Array.isArray(settings.customFields)) {
    const customFieldsResult = validateCustomFields(settings.customFields);
    result.errors.push(...customFieldsResult.errors);
    result.warnings.push(...customFieldsResult.warnings);
    result.valid = result.valid && customFieldsResult.valid;
  }

  if (settings.aiConfidenceThreshold !== undefined) {
    const thresholdResult = validateConfidenceThreshold(settings.aiConfidenceThreshold);
    result.errors.push(...thresholdResult.errors);
    result.warnings.push(...thresholdResult.warnings);
    result.valid = result.valid && thresholdResult.valid;
  }

  return result;
}

/**
 * Sanitize settings before saving
 */
export function sanitizeSettings(
  settings: Partial<FormFillerSettings>
): Partial<FormFillerSettings> {
  const sanitized: Partial<FormFillerSettings> = { ...settings };

  // Sanitize strings
  if (sanitized.ignoreFields && typeof sanitized.ignoreFields === 'string') {
    sanitized.ignoreFields = sanitized.ignoreFields.trim();
  }

  if (sanitized.ignoreDomains && typeof sanitized.ignoreDomains === 'string') {
    sanitized.ignoreDomains = sanitized.ignoreDomains.trim().toLowerCase();
  }

  // Sanitize custom fields
  if (sanitized.customFields && Array.isArray(sanitized.customFields)) {
    sanitized.customFields = sanitized.customFields
      .filter(f => f && f.field && f.type) // Remove invalid entries
      .map(field => ({
        ...field,
        field: sanitizeCustomFieldPattern(field.field)
      }));
  }

  // Clamp numeric values
  if (
    sanitized.aiConfidenceThreshold !== undefined &&
    typeof sanitized.aiConfidenceThreshold === 'number'
  ) {
    sanitized.aiConfidenceThreshold = Math.max(30, Math.min(95, sanitized.aiConfidenceThreshold));
  }

  return sanitized;
}

/**
 * Validate and log settings
 */
export function validateAndLogSettings(settings: Partial<FormFillerSettings>): boolean {
  const validation = validateSettings(settings);

  if (validation.errors.length > 0) {
    logger.error('Settings validation failed', undefined, validation.errors);
  }

  if (validation.warnings.length > 0) {
    logger.warn('Settings validation warnings:', validation.warnings);
  }

  return validation.valid;
}
