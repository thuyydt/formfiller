// helpers/visualFeedback.ts
// Provides visual feedback to users when form filling is complete

import { settingsCache } from './settingsCache';

const NOTIFICATION_DURATION = 3000; // 3 seconds
const HIGHLIGHT_DURATION = 1500; // 1.5 seconds

type NotificationType = 'success' | 'warning' | 'error';

// Show a toast notification
export const showNotification = (message: string, type: NotificationType = 'success'): void => {
  // Remove any existing notification first
  const existingNotification = document.getElementById('form-filler-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.id = 'form-filler-notification';

  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.gap = '6px';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '14');
  svg.setAttribute('height', '14');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('fill', 'none');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '10');
  circle.setAttribute('cy', '10');
  circle.setAttribute('r', '9');
  circle.setAttribute('stroke', 'white');
  circle.setAttribute('stroke-width', '2');
  circle.setAttribute('fill', 'none');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M6 10l3 3 5-6');
  path.setAttribute('stroke', 'white');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');

  svg.appendChild(circle);
  svg.appendChild(path);

  const span = document.createElement('span');
  span.textContent = message;

  container.appendChild(svg);
  container.appendChild(span);
  notification.appendChild(container);

  // Styles
  const backgroundColor =
    type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#ef4444';

  // Use individual assignments for better performance and type safety
  notification.style.position = 'fixed';
  notification.style.top = '16px';
  notification.style.right = '16px';
  notification.style.backgroundColor = backgroundColor;
  notification.style.color = 'white';
  notification.style.padding = '0px 4px';
  notification.style.borderRadius = '6px';
  notification.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
  notification.style.zIndex = '2147483647'; // Maximum z-index
  notification.style.fontSize = '13px';
  notification.style.fontFamily =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  notification.style.fontWeight = '500';
  notification.style.animation = 'formFillerSlideIn 0.3s ease-out';
  notification.style.maxWidth = '250px';
  notification.style.wordWrap = 'break-word';

  // Add animation styles if not already present
  if (!document.getElementById('form-filler-styles')) {
    const style = document.createElement('style');
    style.id = 'form-filler-styles';
    style.textContent =
      '@keyframes formFillerSlideIn{from{transform:translateX(400px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes formFillerSlideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(400px);opacity:0}}@keyframes formFillerHighlight{0%{box-shadow:0 0 0 0 rgba(16,185,129,0.7);background-color:rgba(16,185,129,0.1)}50%{box-shadow:0 0 0 4px rgba(16,185,129,0.3);background-color:rgba(16,185,129,0.2)}100%{box-shadow:0 0 0 0 rgba(16,185,129,0);background-color:transparent}}';
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Auto remove after duration
  setTimeout(() => {
    notification.style.animation = 'formFillerSlideOut 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, NOTIFICATION_DURATION);
};

// Highlight filled fields with animation
// Returns the count of fields that were actually filled (not just have values)
export const highlightFilledFields = (): number => {
  // Get only fields that were filled by the extension (marked with data attribute)
  const fields = document.querySelectorAll<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >(
    'input[data-form-filler-filled="true"]:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]), textarea[data-form-filler-filled="true"], select[data-form-filler-filled="true"]'
  );

  let filledCount = 0;

  // Create a Set of filled field elements for O(1) lookup
  const filledElements = new Set<HTMLElement>();

  for (const field of Array.from(fields)) {
    // Skip button-like inputs (redundant check, but keep for safety)
    if (field instanceof HTMLInputElement) {
      const inputType = field.type.toLowerCase();
      if (
        inputType === 'button' ||
        inputType === 'submit' ||
        inputType === 'reset' ||
        inputType === 'image'
      ) {
        continue;
      }
    }

    // Count this field (it was marked as filled by extension)
    filledCount++;
    filledElements.add(field);

    // Store original styles
    const originalBoxShadow = field.style.boxShadow;
    const originalBackgroundColor = field.style.backgroundColor;
    const originalTransition = field.style.transition;

    // Apply highlight animation
    field.style.transition = 'box-shadow 0.3s ease, background-color 0.3s ease';
    field.style.animation = `formFillerHighlight ${HIGHLIGHT_DURATION}ms ease-out`;

    // Remove animation after it completes and clear element reference
    const timeoutId = setTimeout(() => {
      field.style.animation = '';
      field.style.boxShadow = originalBoxShadow;
      field.style.backgroundColor = originalBackgroundColor;
      field.style.transition = originalTransition;
      // Clear from Set to allow garbage collection
      filledElements.delete(field);
      // Remove the tracking attribute after highlighting
      field.removeAttribute('data-form-filler-filled');
    }, HIGHLIGHT_DURATION);

    // Clean up timeout if element is removed from DOM
    const observer = new MutationObserver(() => {
      if (document && !document.contains(field)) {
        clearTimeout(timeoutId);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  return filledCount;
};

// Count filled fields and show summary
const showFillSummary = (): number => {
  const filledCount = highlightFilledFields();

  if (filledCount > 0) {
    const message = filledCount === 1 ? 'Filled 1 field' : `Filled ${filledCount} fields`;
    showNotification(message, 'success');
  } else {
    showNotification('No fields found to fill', 'warning');
  }

  return filledCount;
};

// Play a subtle success sound (optional, can be disabled)
const playSuccessSound = async (): Promise<void> => {
  try {
    // Check if sound is enabled in settings using cache
    const enableSound = await settingsCache.get<boolean>('enableSound');

    if (enableSound !== true) {
      return; // Sound disabled or not set
    }

    // Create a simple success beep using Web Audio API
    const AudioContextClass =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // Frequency in Hz
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch {
    // Silently fail if audio is not supported, blocked, or cache fails
  }
};

// Main function to show all visual feedback
export const showFeedback = (): number => {
  const filledCount = showFillSummary();

  // Only play sound if fields were actually filled
  if (filledCount > 0) {
    void playSuccessSound();
  }

  return filledCount;
};
