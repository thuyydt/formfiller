// helpers/fakerLocale.ts
import {
  fakerJA,
  fakerEN,
  fakerVI,
  fakerZH_CN,
  fakerAR,
  fakerDE,
  fakerES,
  fakerFR,
  fakerKO,
  fakerPL,
  fakerRU
} from '../lib';
import type { Faker } from '../lib';

/**
 * @module fakerLocale
 * @description Module to manage Faker.js locales for generating fake data.
 */

type LocaleKey = 'ja' | 'en' | 'vi' | 'zh-CN' | 'ar' | 'de' | 'es' | 'fr' | 'ko' | 'pl' | 'ru';

/**
 * A mapping of locale identifiers to their corresponding Faker.js locale objects.
 */
const localeMap: Record<LocaleKey, Faker> = {
  ja: fakerJA,
  en: fakerEN,
  vi: fakerVI,
  'zh-CN': fakerZH_CN,
  ar: fakerAR,
  de: fakerDE,
  es: fakerES,
  fr: fakerFR,
  ko: fakerKO,
  pl: fakerPL,
  ru: fakerRU
};

// Default locale is set to Japanese
// This can be changed based on user preference or application settings.
let currentLocale: LocaleKey = 'ja';
let faker: Faker = localeMap[currentLocale];

/**
 * Updates the current Faker locale if the provided locale exists in the locale map
 * and is different from the current locale.
 *
 * @param locale - The locale identifier to switch to (e.g., 'en', 'fr', 'de').
 */
export const updateFakerLocale = (locale: string): void => {
  if (locale in localeMap && currentLocale !== locale) {
    currentLocale = locale as LocaleKey;
    faker = localeMap[currentLocale];
  }
};

export { faker, currentLocale as lang };
