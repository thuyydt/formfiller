// content.ts - Main content script with TypeScript
import type { ExtensionMessage, MessageResponse, FormFillerSettings } from './types';
import { updateFakerLocale } from './helpers/fakerLocale';
import { initGlobalErrorHandler, logError, getUserFriendlyMessage } from './helpers/errorHandler';
import { settingsCache } from './helpers/settingsCache';
import { cachedParseIgnoreDomains } from './helpers/computedCache';
import { fillAll } from './helpers/fillAll';
import { undoFill, canUndo, clearAllFields } from './helpers/clearUndo';
import { fillSingleField } from './helpers/fillSingleField';
import { showNotification } from './helpers/visualFeedback';
import { formFillRateLimiter } from './helpers/security';
import { logger } from './helpers/logger';

// Initialize global error handler
initGlobalErrorHandler();

// Store the last focused element for context menu
let lastFocusedElement: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null = null;

// Mutex flag to prevent concurrent fill operations
let isFilling = false;

// Track focused editable elements
const handleFocusIn = (event: FocusEvent): void => {
  const target = event.target as HTMLElement;
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  ) {
    lastFocusedElement = target;
  }
};

document.addEventListener('focusin', handleFocusIn, true);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  document.removeEventListener('focusin', handleFocusIn, true);
  lastFocusedElement = null;
});

// Initialize the faker locale based on stored value
void (async () => {
  try {
    const locale = await settingsCache.get<string>('locale');
    if (locale) {
      updateFakerLocale(locale);
    }
  } catch {
    // Fallback to direct storage if cache fails
    try {
      const result = await chrome.storage.local.get(['locale']);
      const locale = result.locale as string | undefined;
      if (locale) {
        updateFakerLocale(locale);
      }
    } catch {
      // Silently fail - will use default locale
    }
  }
})();

// Listen for messages from the extension (background/popup)
chrome.runtime.onMessage.addListener(
  (
    request: ExtensionMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ): boolean => {
    if (request && request.type === 'FILL_FORM') {
      // Prevent concurrent fill operations
      if (isFilling) {
        logger.warn('Fill operation already in progress, ignoring request');
        sendResponse({ status: 'busy' });
        return true;
      }

      void (async () => {
        isFilling = true;
        try {
          // Check rate limit to prevent abuse
          if (!formFillRateLimiter.isAllowed()) {
            logger.warn('Form fill rate limit exceeded');
            showNotification('⚠️ Please wait before filling again', 'warning');
            sendResponse({ status: 'error' });
            return;
          }

          // Use settings cache for faster access
          const settings = await settingsCache.getSettings();

          if (request.locale) {
            updateFakerLocale(request.locale);
          } else if (settings.locale) {
            updateFakerLocale(settings.locale);
          }

          // Check ignoreDomains
          const ignoreDomains = cachedParseIgnoreDomains(settings.ignoreDomains || '');
          const currentDomain = window.location.hostname;

          if (ignoreDomains.some(domain => currentDomain.endsWith(domain))) {
            sendResponse({ status: 'ignored-domain' });
            return;
          }

          // Pass settings to fillAll
          // Small delay to ensure dynamically loaded content (modals, SPAs) is ready
          // Wait for any pending DOM updates (Vue, React, Angular modals)
          await new Promise<void>(resolve => {
            if (document.readyState === 'complete') {
              // Give extra time for modal animations and Vue rendering
              setTimeout(() => resolve(), 100);
            } else {
              window.addEventListener(
                'load',
                () => {
                  setTimeout(() => resolve(), 100);
                },
                { once: true }
              );
            }
          });

          await fillAll(settings);
          sendResponse({ status: 'filled' });
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));
          logError('Fill Form', err, { domain: window.location.hostname });

          // Show user-friendly error
          showNotification(getUserFriendlyMessage(err), 'error');

          sendResponse({ status: 'error' });
        } finally {
          isFilling = false;
        }
      })();
      // Indicate async response
      return true;
    }

    // Handle UNDO action
    if (request && request.type === 'UNDO_FILL') {
      try {
        if (canUndo()) {
          const result = undoFill();
          if (result.success) {
            showNotification(`↶ ${result.message}`, 'success');
          } else {
            showNotification(result.message, 'warning');
          }
          sendResponse({ status: 'undone', count: result.count || 0 });
        } else {
          showNotification('⚠ No history available to undo', 'warning');
          sendResponse({ status: 'no-history' });
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        logError('Undo Fill', err);
        sendResponse({ status: 'error' });
      }
      return true;
    }

    // Handle CLEAR action
    if (request && request.type === 'CLEAR_FORM') {
      try {
        const result = clearAllFields();
        if (result.count && result.count > 0) {
          showNotification(`🗑 ${result.message}`, 'success');
        } else {
          showNotification('⚠ No fields to clear', 'warning');
        }
        sendResponse({ status: 'cleared', count: result.count || 0 });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        logError('Clear Form', err);
        sendResponse({ status: 'error' });
      }
      return true;
    }

    // Handle FILL_SINGLE_FIELD action (right-click context menu)
    if (request && request.type === 'FILL_SINGLE_FIELD') {
      if (!lastFocusedElement || !document.body.contains(lastFocusedElement)) {
        showNotification('⚠ No field selected', 'warning');
        sendResponse({ status: 'no-field' });
        return true;
      }

      void (async () => {
        try {
          const settings = await settingsCache.getMultiple<Record<string, unknown>>([
            'locale',
            'customFields',
            'enableLabelMatching',
            'defaultPassword'
          ]);

          if (settings.locale) {
            updateFakerLocale(settings.locale as string);
          }

          if (lastFocusedElement) {
            fillSingleField(lastFocusedElement, settings as FormFillerSettings);
            sendResponse({ status: 'filled', count: 1 });
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));
          logError('Fill Single Field', err);
          sendResponse({ status: 'error' });
        }
      })();
      return true;
    }

    return true;
  }
);
