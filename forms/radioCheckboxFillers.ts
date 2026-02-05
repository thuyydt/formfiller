// forms/radioCheckboxFillers.ts
import type { FormFillerSettings } from '../types';
import { groupInputsByName, randomlyCheckOneInEachGroup } from '../helpers/groupUtils.js';
import { matchCustomField } from '../helpers/customFieldMatcher.js';
import { getAllRadios, getAllCheckboxes } from '../helpers/domHelpers.js';
import { shouldIgnoreDomain } from '../helpers/domainUtils.js';
import { cachedParseIgnoreKeywords } from '../helpers/computedCache.js';

export const fillRadios = (settings: FormFillerSettings = {}): void => {
  if (shouldIgnoreDomain(settings.ignoreDomains)) {
    return;
  }

  // Get radios including those in Vue modals and shadow DOM
  const radios = getAllRadios();
  if (!radios.length) return;

  const ignoreKeywords = cachedParseIgnoreKeywords(settings.ignoreFields || '');

  // Identify groups that are already filled
  const filledGroups = new Set<string>();
  if (settings.ignoreFilled) {
    Array.from(radios).forEach(radio => {
      if (radio.checked && radio.name) {
        filledGroups.add(radio.name);
      }
    });
  }

  // Ignore radio buttons that are already checked
  const uncheckedRadios = Array.from(radios).filter(radio => !radio.checked);
  if (!uncheckedRadios.length) return;

  const filteredRadios = Array.from(uncheckedRadios).filter(radio => {
    if (radio.hasAttribute('readonly')) return false;
    if (
      settings.ignoreHidden &&
      (radio.offsetParent === null ||
        radio.offsetWidth === 0 ||
        radio.offsetHeight === 0 ||
        window.getComputedStyle(radio).visibility === 'hidden')
    )
      return false;

    // Skip if group is already filled
    if (settings.ignoreFilled && radio.name && filledGroups.has(radio.name)) return false;

    const name = (radio.name || '').toLowerCase();
    const id = (radio.id || '').toLowerCase();
    const placeholder = (radio.placeholder || '').toLowerCase();

    if (ignoreKeywords.some(k => name.includes(k) || id.includes(k) || placeholder.includes(k)))
      return false;
    if (matchCustomField(radio, settings.customFields, settings.enableLabelMatching)) return false; // Custom fields override, skip default

    return true;
  });

  const radioGroups = groupInputsByName(filteredRadios as unknown as NodeListOf<HTMLInputElement>);
  randomlyCheckOneInEachGroup(radioGroups);
};

export const fillCheckboxes = (settings: FormFillerSettings = {}): void => {
  if (shouldIgnoreDomain(settings.ignoreDomains)) {
    return;
  }

  // Get checkboxes including those in Vue modals and shadow DOM
  const checkboxes = getAllCheckboxes();
  if (!checkboxes.length) return;

  const ignoreKeywords = (settings.ignoreFields || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  // Identify groups that are already filled
  const filledGroups = new Set<string>();
  if (settings.ignoreFilled) {
    Array.from(checkboxes).forEach(checkbox => {
      if (checkbox.checked && checkbox.name) {
        filledGroups.add(checkbox.name);
      }
    });
  }

  const uncheckedCheckboxes = Array.from(checkboxes).filter(checkbox => !checkbox.checked);
  if (!uncheckedCheckboxes.length) return;

  const filteredCheckboxes = Array.from(uncheckedCheckboxes).filter(checkbox => {
    if (checkbox.hasAttribute('readonly')) return false;
    if (
      settings.ignoreHidden &&
      (checkbox.offsetParent === null ||
        checkbox.offsetWidth === 0 ||
        checkbox.offsetHeight === 0 ||
        window.getComputedStyle(checkbox).visibility === 'hidden')
    )
      return false;

    // Skip if group is already filled
    if (settings.ignoreFilled && checkbox.name && filledGroups.has(checkbox.name)) return false;

    const name = (checkbox.name || '').toLowerCase();
    const id = (checkbox.id || '').toLowerCase();
    const placeholder = (checkbox.placeholder || '').toLowerCase();

    if (ignoreKeywords.some(k => name.includes(k) || id.includes(k) || placeholder.includes(k)))
      return false;
    if (matchCustomField(checkbox, settings.customFields, settings.enableLabelMatching))
      return false;

    return true;
  });

  const checkboxGroups = groupInputsByName(
    filteredCheckboxes as unknown as NodeListOf<HTMLInputElement>
  );
  randomlyCheckOneInEachGroup(checkboxGroups);
};
