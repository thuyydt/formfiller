// helpers/fillAll.ts
import type { FormFillerSettings } from '../types';
import { fillInputs } from '../forms/fillInputs.js';
import { fillTextareas } from '../forms/fillTextareas.js';
import { fillSelects } from '../forms/fillSelects.js';
import { fillRadios, fillCheckboxes } from '../forms/radioCheckboxFillers.js';
import { showFeedback } from './visualFeedback.js';
import { saveFormState } from './clearUndo.js';
import { clearAttributeCache } from './typeDetection.js';
import { performanceMonitor } from './performanceMonitor.js';
import { cleanupAfterFill } from './memoryManager.js';
import { logger } from './logger.js';
import { setDisableIframeFill } from './domHelpers.js';

export const fillAll = async (settings: FormFillerSettings): Promise<void> => {
  // Start performance monitoring
  performanceMonitor.start('fillAll');

  // Apply iframe setting before filling
  setDisableIframeFill(settings.disableIframeFill ?? false);

  // Save current form state before filling (for undo functionality)
  saveFormState();

  // Fill all field types using microtasks instead of setTimeout for better performance
  await performanceMonitor.measure('fillInputs', async () => await fillInputs(settings));
  // Clear cache immediately to free memory
  clearAttributeCache();

  // Use requestAnimationFrame for better performance than setTimeout
  // This ensures DOM updates are batched efficiently
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

  performanceMonitor.measure('fillTextareas', () => fillTextareas(settings));
  clearAttributeCache();

  performanceMonitor.measure('fillSelects', () => fillSelects(settings));
  clearAttributeCache();

  performanceMonitor.measure('fillRadios', () => fillRadios(settings));
  clearAttributeCache();

  performanceMonitor.measure('fillCheckboxes', () => fillCheckboxes(settings));
  clearAttributeCache();

  // Wait one more frame for any async validation
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

  // Ensure no field is left focused which might interfere with button clicks
  const activeElement = document.activeElement as HTMLElement | null;
  if (activeElement?.blur) {
    activeElement.blur();
  }

  // Show visual feedback to user
  showFeedback();

  // End performance monitoring and print report
  const duration = performanceMonitor.end('fillAll');
  logger.info(`Form filling completed in ${duration?.toFixed(2)}ms`);
  performanceMonitor.printReport();

  // Dispatch a custom event to signal completion
  const timestamp = Date.now();

  document.dispatchEvent(
    new CustomEvent('formFillerComplete', {
      bubbles: true,
      detail: {
        timestamp,
        performance: performanceMonitor.getReport()
      }
    })
  );

  // Memory cleanup: Use memory manager for better control
  cleanupAfterFill(500);
};
