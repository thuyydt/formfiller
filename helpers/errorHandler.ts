// helpers/errorHandler.ts
// Centralized error handling and retry logic

import { logger as loggerUtil } from './logger.js';

export interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  exponentialBackoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Retry a function with exponential backoff
 */
export async function retryAsync<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { maxRetries = 3, delayMs = 100, exponentialBackoff = true, onRetry } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        break;
      }

      // Call retry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, lastError);
      }

      // Calculate delay with exponential backoff
      const delay = exponentialBackoff ? delayMs * Math.pow(2, attempt) : delayMs;

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Safe dynamic import with retry
 */
export async function safeImport<T>(path: string, retries = 3): Promise<T> {
  return retryAsync(() => import(path) as Promise<T>, {
    maxRetries: retries,
    delayMs: 100,
    onRetry: (attempt, error) => {
      loggerUtil.warn(`Import retry ${attempt}/${retries} for ${path}: ${error.message}`);
    }
  });
}

/**
 * Error categories for better handling
 */
export enum ErrorCategory {
  NETWORK = 'network',
  STORAGE = 'storage',
  DOM = 'dom',
  IMPORT = 'import',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown'
}

/**
 * Categorize error for appropriate handling
 */
export function categorizeError(error: Error): ErrorCategory {
  const message = error.message.toLowerCase();

  if (message.includes('import') || message.includes('module')) {
    return ErrorCategory.IMPORT;
  }
  if (message.includes('storage') || message.includes('quota')) {
    return ErrorCategory.STORAGE;
  }
  if (message.includes('network') || message.includes('fetch')) {
    return ErrorCategory.NETWORK;
  }
  if (message.includes('element') || message.includes('dom')) {
    return ErrorCategory.DOM;
  }
  if (message.includes('invalid') || message.includes('validation')) {
    return ErrorCategory.VALIDATION;
  }

  return ErrorCategory.UNKNOWN;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: Error): string {
  const category = categorizeError(error);

  switch (category) {
    case ErrorCategory.NETWORK:
      return 'Network connection issue. Please check your internet connection.';
    case ErrorCategory.STORAGE:
      return 'Storage error. Your browser may be out of space.';
    case ErrorCategory.DOM:
      return 'Page structure error. Try refreshing the page.';
    case ErrorCategory.IMPORT:
      return 'Extension loading error. Please reload the extension.';
    case ErrorCategory.VALIDATION:
      return 'Invalid data format. Please check your settings.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Log error with context
 */
export function logError(
  context: string,
  error: Error,
  additionalInfo?: Record<string, unknown>
): void {
  const category = categorizeError(error);

  loggerUtil.error(`[${context}] ${error.message}`, error, {
    category,
    ...additionalInfo
  });
}

/**
 * Safe chrome storage operation with retry
 */
export async function safeStorageGet<T = Record<string, unknown>>(
  keys: string | string[] | null
): Promise<T> {
  return retryAsync(
    () =>
      new Promise<T>((resolve, reject) => {
        chrome.storage.local.get(keys, result => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(result as T);
          }
        });
      }),
    {
      maxRetries: 2,
      delayMs: 50,
      onRetry: attempt => {
        loggerUtil.warn(`Storage retry ${attempt}/2`);
      }
    }
  );
}

/**
 * Safe chrome storage set with retry
 */
export async function safeStorageSet(items: Record<string, unknown>): Promise<void> {
  return retryAsync(
    () =>
      new Promise<void>((resolve, reject) => {
        chrome.storage.local.set(items, () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve();
          }
        });
      }),
    {
      maxRetries: 2,
      delayMs: 50
    }
  );
}

/**
 * Safe message sending with retry
 */
export async function safeSendMessage(tabId: number, message: unknown): Promise<unknown> {
  return retryAsync(
    () =>
      new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, message, response => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      }),
    {
      maxRetries: 2,
      delayMs: 100
    }
  );
}

/**
 * Global unhandled rejection handler
 */
export function initGlobalErrorHandler(): void {
  window.addEventListener('unhandledrejection', event => {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));

    logError('Unhandled Rejection', error);

    // Show user notification for critical errors
    const category = categorizeError(error);
    if (category !== ErrorCategory.UNKNOWN) {
      void (async () => {
        try {
          const { showNotification } = await import('./visualFeedback.js');
          showNotification(getUserFriendlyMessage(error), 'error');
        } catch {
          // Fallback: at least log it
          loggerUtil.error('Failed to show error notification');
        }
      })();
    }

    event.preventDefault();
  });

  window.addEventListener('error', event => {
    const error =
      event.error instanceof Error ? event.error : new Error(event.message || 'Unknown error');

    logError('Uncaught Error', error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });
}
