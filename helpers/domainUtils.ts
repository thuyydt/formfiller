// helpers/domainUtils.ts
// Shared utility for domain-related checks

import { cachedParseIgnoreDomains } from './computedCache.js';

/**
 * Check if current domain should be ignored based on ignoreDomains setting
 * Uses cached parsing for performance
 * @param ignoreDomains - Comma or newline-separated list of domains to ignore
 * @returns true if current domain should be ignored
 */
export const shouldIgnoreDomain = (ignoreDomains = ''): boolean => {
  if (!ignoreDomains || ignoreDomains.trim() === '') {
    return false;
  }

  const domains = cachedParseIgnoreDomains(ignoreDomains);
  if (domains.length === 0) {
    return false;
  }

  const currentDomain = window.location.hostname;
  return domains.some(domain => currentDomain.endsWith(domain));
};

/**
 * Parse and cache ignore keywords from settings
 * @param ignoreFields - Comma-separated list of field keywords to ignore
 * @returns Array of lowercase trimmed keywords
 */
export const parseIgnoreKeywords = (ignoreFields = ''): string[] => {
  if (!ignoreFields || ignoreFields.trim() === '') {
    return [];
  }

  return ignoreFields
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
};
