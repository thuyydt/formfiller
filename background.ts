// background.ts - Background service worker with TypeScript
import type { ExtensionMessage, ContextMenuId } from './types';
import { safeSendMessage, logError } from './helpers/errorHandler';
import { logger } from './helpers/logger';

// Declare browser API for Firefox
declare const browser: typeof chrome | undefined;

type LocaleName = 'ja' | 'en' | 'zh' | 'vi' | 'ar' | 'ko' | 'es' | 'fr' | 'de' | 'pl' | 'ru';

const localeNames: Record<LocaleName, string> = {
  ja: 'Japanese',
  en: 'English',
  zh: 'Chinese',
  vi: 'Vietnamese',
  ar: 'Arabic',
  ko: 'Korean',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pl: 'Polish',
  ru: 'Russian'
};

// Use browser API for Firefox compatibility, fallback to chrome API
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

const createLocaleContextMenus = async (currentLocale?: string): Promise<void> => {
  return new Promise<void>(resolve => {
    browserAPI.contextMenus.removeAll(() => {
      // Create menus immediately after removal
      // Use 'action' for Chrome MV3, 'browser_action' for Firefox
      const contextType = (
        browserAPI.action ? 'action' : 'browser_action'
      ) as chrome.contextMenus.ContextType;

      browserAPI.contextMenus.create({
        id: 'current-locale' as ContextMenuId,
        title: `Current: ${(currentLocale && localeNames[currentLocale as LocaleName]) ?? 'Japanese'} (Click icon to fill form)`,
        contexts: [contextType],
        enabled: false
      });

      browserAPI.contextMenus.create({
        id: 'separator-1' as ContextMenuId,
        type: 'separator',
        contexts: [contextType]
      });

      browserAPI.contextMenus.create({
        id: 'undo-fill' as ContextMenuId,
        title: 'Undo Last Fill',
        contexts: [contextType]
      });

      browserAPI.contextMenus.create({
        id: 'clear-form' as ContextMenuId,
        title: 'Clear All Fields',
        contexts: [contextType]
      });

      // Add context menu for individual field filling
      browserAPI.contextMenus.create({
        id: 'fill-this-field' as ContextMenuId,
        title: 'Fill This Field',
        contexts: ['editable']
      });

      resolve();
    });
  });
};

// Handle context menu clicks
browserAPI.contextMenus.onClicked.addListener(
  (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
    if (!tab?.id) return;

    let messageType: string | null = null;

    if (info.menuItemId === 'undo-fill') {
      messageType = 'UNDO_FILL';
    } else if (info.menuItemId === 'clear-form') {
      messageType = 'CLEAR_FORM';
    } else if (info.menuItemId === 'fill-this-field') {
      messageType = 'FILL_SINGLE_FIELD';
    }

    if (messageType && tab.id) {
      void safeSendMessage(tab.id, { type: messageType }).catch((error: Error) => {
        logError(`Context Menu: ${messageType}`, error, { tabId: tab.id });
      });
    }
  }
);

// Listen for extension icon click
const actionAPI = browserAPI.browserAction ?? browserAPI.action;

if (actionAPI?.onClicked) {
  actionAPI.onClicked.addListener((tab: chrome.tabs.Tab) => {
    void (async () => {
      if (tab.id) {
        const message: ExtensionMessage = { type: 'FILL_FORM' };
        try {
          await browserAPI.tabs.sendMessage(tab.id, message);
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));
          logger.warn('Error sending message:', err.message);
        }
      }
    })();
  });
}

// Listen for keyboard commands
browserAPI.commands.onCommand.addListener((command: string, tab?: chrome.tabs.Tab) => {
  void (async () => {
    if (!tab?.id) return;

    let message: ExtensionMessage;

    switch (command) {
    case 'fill_form':
      message = { type: 'FILL_FORM' };
      break;
    case 'undo_fill':
      message = { type: 'UNDO_FILL' };
      break;
    case 'clear_form':
      message = { type: 'CLEAR_FORM' };
      break;
    default:
      return;
    }

    try {
      await browserAPI.tabs.sendMessage(tab.id, message);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.warn('Error sending message:', err.message);
    }
  })();
});

// Create context menus on install
browserAPI.runtime.onInstalled.addListener(() => {
  void createLocaleContextMenus();
});
