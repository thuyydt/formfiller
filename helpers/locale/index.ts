import { translateJapaneseKeywords } from './japanese';
import { translateVietnameseKeywords } from './vietnamese';
import { translateChineseKeywords } from './chinese';
import { translateKoreanKeywords } from './korean';
import { translateArabicKeywords } from './arabic';
import { translateGermanKeywords } from './german';
import { translateSpanishKeywords } from './spanish';
import { translateFrenchKeywords } from './french';
import { translatePolishKeywords } from './polish';
import { translateRussianKeywords } from './russian';

/**
 * Translates keywords from various languages to English for better pattern matching.
 * This function aggregates translations from all supported locales.
 *
 * @param text - The text to translate
 * @returns The translated text
 */
export const translateKeywords = (text: string): string => {
  if (!text) return text;

  let translated = text;

  // Apply translations for each supported language
  // Note: The order might matter if there are overlapping keywords across languages,
  // but usually scripts are distinct (e.g. Japanese vs Vietnamese vs Chinese vs Korean).
  // For European languages sharing Latin script, we rely on the specific keyword maps
  // being distinct enough or the order of application.

  translated = translateJapaneseKeywords(translated);
  translated = translateVietnameseKeywords(translated);
  translated = translateChineseKeywords(translated);
  translated = translateKoreanKeywords(translated);
  translated = translateArabicKeywords(translated);
  translated = translateGermanKeywords(translated);
  translated = translateSpanishKeywords(translated);
  translated = translateFrenchKeywords(translated);
  translated = translatePolishKeywords(translated);
  translated = translateRussianKeywords(translated);

  return translated;
};
