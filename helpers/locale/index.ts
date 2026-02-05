import { translateJapaneseKeywords, containsJapanese } from './japanese';
import { translateVietnameseKeywords, containsVietnamese } from './vietnamese';
import { translateChineseKeywords, containsChinese } from './chinese';
import { translateKoreanKeywords, containsKorean } from './korean';
import { translateArabicKeywords, containsArabic } from './arabic';
import { translateGermanKeywords } from './german';
import { translateSpanishKeywords } from './spanish';
import { translateFrenchKeywords } from './french';
import { translatePolishKeywords } from './polish';
import { translateRussianKeywords, containsRussian } from './russian';

// ============ Cache ============

const translationCache = new Map<string, string>();
const MAX_CACHE_SIZE = 500;

/**
 * Clear the translation cache
 * Call this when settings change or memory needs to be freed
 */
export const clearTranslationCache = (): void => {
  translationCache.clear();
};

// ============ Language Detection ============

/**
 * Check if text contains Latin script (used by European languages)
 */
const containsLatin = (text: string): boolean => {
  return /[a-zA-ZäöüßÄÖÜáéíóúñÁÉÍÓÚÑàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛçÇąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(text);
};

// ============ Main Translation Function ============

/**
 * Translates keywords from various languages to English for better pattern matching.
 * This function aggregates translations from all supported locales.
 * Uses language detection to only apply relevant translations.
 *
 * @param text - The text to translate
 * @returns The translated text
 */
export const translateKeywords = (text: string): string => {
  if (!text || text.length === 0) return text;

  // Check cache first
  const cached = translationCache.get(text);
  if (cached !== undefined) return cached;

  let translated = text;

  // Apply translations based on detected scripts
  // Non-Latin scripts are distinct, so we can check and apply selectively

  // Japanese (Hiragana, Katakana, some Kanji)
  if (containsJapanese(translated)) {
    translated = translateJapaneseKeywords(translated);
  }

  // Korean (Hangul)
  if (containsKorean(translated)) {
    translated = translateKoreanKeywords(translated);
  }

  // Chinese (Han characters - check after Japanese/Korean since they share some)
  if (containsChinese(translated)) {
    translated = translateChineseKeywords(translated);
  }

  // Vietnamese (Latin with diacritics)
  if (containsVietnamese(translated)) {
    translated = translateVietnameseKeywords(translated);
  }

  // Arabic script
  if (containsArabic(translated)) {
    translated = translateArabicKeywords(translated);
  }

  // Russian (Cyrillic)
  if (containsRussian(translated)) {
    translated = translateRussianKeywords(translated);
  }

  // European languages with Latin script
  // These need to be applied if text contains Latin characters
  // Order: German -> Spanish -> French -> Polish (most specific first)
  if (containsLatin(translated)) {
    translated = translateGermanKeywords(translated);
    translated = translateSpanishKeywords(translated);
    translated = translateFrenchKeywords(translated);
    translated = translatePolishKeywords(translated);
  }

  // Cache the result (with size limit)
  if (translationCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entries (first 100)
    const keysToDelete = Array.from(translationCache.keys()).slice(0, 100);
    keysToDelete.forEach(key => translationCache.delete(key));
  }
  translationCache.set(text, translated);

  return translated;
};

// ============ Exports ============

export {
  translateJapaneseKeywords,
  translateVietnameseKeywords,
  translateChineseKeywords,
  translateKoreanKeywords,
  translateArabicKeywords,
  translateGermanKeywords,
  translateSpanishKeywords,
  translateFrenchKeywords,
  translatePolishKeywords,
  translateRussianKeywords
};
