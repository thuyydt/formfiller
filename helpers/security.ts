/**
 * Security Utilities
 * Content Security and Input Sanitization
 */

import { logger } from './logger.js';

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Validate regex pattern safety
 */
export function isRegexSafe(pattern: string, maxLength = 1000): boolean {
  // Check pattern length
  if (pattern.length > maxLength) {
    logger.warn('Security: Regex pattern too long', { length: pattern.length });
    return false;
  }

  // Check for ReDoS vulnerable patterns
  const vulnerablePatterns = [
    /(\w+)+$/, // Catastrophic backtracking
    /(\d+)*$/, // Catastrophic backtracking
    /(a+)+$/, // Catastrophic backtracking
    /(\w*)*$/ // Catastrophic backtracking
  ];

  for (const vulnerable of vulnerablePatterns) {
    if (vulnerable.test(pattern)) {
      logger.warn('Security: Potentially vulnerable regex pattern detected');
      return false;
    }
  }

  try {
    // Test compilation
    new RegExp(pattern);
    return true;
  } catch {
    logger.warn('Security: Invalid regex pattern');
    return false;
  }
}

/**
 * Validate and sanitize custom field patterns
 */
export function sanitizeCustomFieldPattern(pattern: string): string {
  // Remove potentially dangerous characters
  return pattern
    .replace(/[<>'"]/g, '') // Remove HTML/script tags
    .trim();
}

/**
 * Check if URL is from trusted domain
 */
export function isTrustedDomain(url: string, trustedDomains: string[]): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    return trustedDomains.some(trusted => {
      const trustedLower = trusted.toLowerCase();
      return hostname === trustedLower || hostname.endsWith(`.${trustedLower}`);
    });
  } catch {
    logger.warn('Security: Invalid URL', { url });
    return false;
  }
}

/**
 * Rate limiter to prevent abuse
 */
export class RateLimiter {
  private timestamps: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number; // milliseconds

  constructor(maxRequests = 10, timeWindowMs = 1000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  /**
   * Check if action is allowed
   */
  isAllowed(): boolean {
    const now = Date.now();

    // Remove old timestamps outside the time window
    this.timestamps = this.timestamps.filter(ts => now - ts < this.timeWindow);

    if (this.timestamps.length >= this.maxRequests) {
      logger.warn('Security: Rate limit exceeded');
      return false;
    }

    this.timestamps.push(now);
    return true;
  }

  /**
   * Reset the limiter
   */
  reset(): void {
    this.timestamps = [];
  }
}

/**
 * Validate storage data size to prevent quota issues
 */
export function isStorageSizeSafe(data: Record<string, unknown>, maxBytes = 8192): boolean {
  try {
    const jsonString = JSON.stringify(data);
    const bytes = new Blob([jsonString]).size;

    if (bytes > maxBytes) {
      logger.warn('Security: Storage data too large', { bytes, maxBytes });
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Security: Failed to validate storage size', error as Error);
    return false;
  }
}

/**
 * Secure random string generator
 */
export function generateSecureId(length = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Content Security Policy validator
 */
export function validateCSP(element: HTMLElement): boolean {
  // Check if element has inline event handlers (security risk)
  const dangerousAttributes = [
    'onclick',
    'onload',
    'onerror',
    'onmouseover',
    'onmouseout',
    'onkeydown',
    'onkeyup'
  ];

  for (const attr of dangerousAttributes) {
    if (element.hasAttribute(attr)) {
      logger.warn('Security: Dangerous inline event handler detected', { attr });
      return false;
    }
  }

  return true;
}

// Global rate limiter for form filling
export const formFillRateLimiter = new RateLimiter(5, 1000); // 5 fills per second
