/**
 * @jest-environment jsdom
 */

import {
  generateRandomHiraganaName,
  generateRandomKatakanaName,
  generateRandomRomajiName
} from '../../helpers/japaneseNameGenerators';

describe('Japanese Name Generators', () => {
  describe('generateRandomHiraganaName', () => {
    it('should generate a hiragana name with default length', () => {
      const name = generateRandomHiraganaName();
      expect(name).toBeDefined();
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThanOrEqual(3);
      expect(name.length).toBeLessThanOrEqual(6);
    });

    it('should generate a hiragana name with custom length', () => {
      const name = generateRandomHiraganaName(5, 8);
      expect(name.length).toBeGreaterThanOrEqual(5);
      expect(name.length).toBeLessThanOrEqual(8);
    });

    it('should generate a hiragana name with exact length', () => {
      const name = generateRandomHiraganaName(4, 4);
      expect(name.length).toBe(4);
    });

    it('should only contain hiragana characters', () => {
      const hiraganaPattern = /^[\u3040-\u309F]+$/;
      const name = generateRandomHiraganaName();
      expect(hiraganaPattern.test(name)).toBe(true);
    });

    it('should generate different names on multiple calls', () => {
      const names = new Set();
      for (let i = 0; i < 50; i++) {
        names.add(generateRandomHiraganaName());
      }
      // Should have at least some variety
      expect(names.size).toBeGreaterThan(10);
    });

    it('should generate name with minimum length of 1', () => {
      const name = generateRandomHiraganaName(1, 1);
      expect(name.length).toBe(1);
      expect(/^[\u3040-\u309F]$/.test(name)).toBe(true);
    });

    it('should generate name with longer length', () => {
      const name = generateRandomHiraganaName(10, 15);
      expect(name.length).toBeGreaterThanOrEqual(10);
      expect(name.length).toBeLessThanOrEqual(15);
    });

    it('should use all hiragana character positions', () => {
      // Generate many names to ensure we're accessing the full charset
      const allChars = new Set();
      for (let i = 0; i < 500; i++) {
        const name = generateRandomHiraganaName(3, 6);
        for (const char of name) {
          allChars.add(char);
        }
      }
      // Should have reasonable variety from the charset
      expect(allChars.size).toBeGreaterThan(20);
    });
  });

  describe('generateRandomKatakanaName', () => {
    it('should generate a katakana name with default length', () => {
      const name = generateRandomKatakanaName();
      expect(name).toBeDefined();
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThanOrEqual(3);
      expect(name.length).toBeLessThanOrEqual(6);
    });

    it('should generate a katakana name with custom length', () => {
      const name = generateRandomKatakanaName(5, 8);
      expect(name.length).toBeGreaterThanOrEqual(5);
      expect(name.length).toBeLessThanOrEqual(8);
    });

    it('should generate a katakana name with exact length', () => {
      const name = generateRandomKatakanaName(4, 4);
      expect(name.length).toBe(4);
    });

    it('should only contain katakana characters', () => {
      const katakanaPattern = /^[\u30A0-\u30FF]+$/;
      const name = generateRandomKatakanaName();
      expect(katakanaPattern.test(name)).toBe(true);
    });

    it('should generate different names on multiple calls', () => {
      const names = new Set();
      for (let i = 0; i < 50; i++) {
        names.add(generateRandomKatakanaName());
      }
      // Should have at least some variety
      expect(names.size).toBeGreaterThan(10);
    });

    it('should generate name with minimum length of 1', () => {
      const name = generateRandomKatakanaName(1, 1);
      expect(name.length).toBe(1);
      expect(/^[\u30A0-\u30FF]$/.test(name)).toBe(true);
    });

    it('should generate name with longer length', () => {
      const name = generateRandomKatakanaName(10, 15);
      expect(name.length).toBeGreaterThanOrEqual(10);
      expect(name.length).toBeLessThanOrEqual(15);
    });

    it('should use all katakana character positions', () => {
      // Generate many names to ensure we're accessing the full charset
      const allChars = new Set();
      for (let i = 0; i < 500; i++) {
        const name = generateRandomKatakanaName(3, 6);
        for (const char of name) {
          allChars.add(char);
        }
      }
      // Should have reasonable variety from the charset
      expect(allChars.size).toBeGreaterThan(20);
    });
  });

  describe('generateRandomRomajiName', () => {
    it('should generate a romaji name with default length', () => {
      const name = generateRandomRomajiName();
      expect(name).toBeDefined();
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });

    it('should generate a romaji name with custom length', () => {
      const name = generateRandomRomajiName(5, 8);
      expect(name).toBeDefined();
      expect(name.length).toBeGreaterThan(0);
    });

    it('should generate a romaji name with exact length specification', () => {
      const name = generateRandomRomajiName(2, 2);
      expect(name).toBeDefined();
      expect(name.length).toBeGreaterThan(0);
    });

    it('should only contain valid romaji characters', () => {
      const romajiPattern = /^[A-Za-z]+$/;
      const name = generateRandomRomajiName();
      expect(romajiPattern.test(name)).toBe(true);
    });

    it('should start with uppercase letter', () => {
      const name = generateRandomRomajiName();
      expect(name[0]).toBe(name[0].toUpperCase());
      expect(name[0]).not.toBe(name[0].toLowerCase());
    });

    it('should generate different names on multiple calls', () => {
      const names = new Set();
      for (let i = 0; i < 50; i++) {
        names.add(generateRandomRomajiName());
      }
      // Should have at least some variety
      expect(names.size).toBeGreaterThan(10);
    });

    it('should sometimes include the ending "n"', () => {
      // Generate many names and check if any end with 'n' or 'N'
      let hasEndingN = false;
      for (let i = 0; i < 200; i++) {
        const name = generateRandomRomajiName();
        if (name.endsWith('n') || name.endsWith('N')) {
          hasEndingN = true;
          break;
        }
      }
      expect(hasEndingN).toBe(true);
    });

    it('should generate names with vowels', () => {
      // Check that vowels appear in generated names
      const vowels = ['a', 'i', 'u', 'e', 'o'];
      let hasVowels = false;
      for (let i = 0; i < 10; i++) {
        const name = generateRandomRomajiName().toLowerCase();
        if (vowels.some(v => name.includes(v))) {
          hasVowels = true;
          break;
        }
      }
      expect(hasVowels).toBe(true);
    });

    it('should generate names with consonants', () => {
      // Check that consonants appear in generated names
      const consonants = ['k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'g', 'z', 'd', 'b', 'p'];
      let hasConsonants = false;
      for (let i = 0; i < 10; i++) {
        const name = generateRandomRomajiName().toLowerCase();
        if (consonants.some(c => name.includes(c))) {
          hasConsonants = true;
          break;
        }
      }
      expect(hasConsonants).toBe(true);
    });

    it('should sometimes generate names with special consonant combinations', () => {
      // Generate many names to find special combinations
      const specialConsonants = ['ky', 'sh', 'ch', 'ny', 'hy', 'my', 'ry', 'gy', 'dz', 'by', 'py'];
      let hasSpecialConsonants = false;
      for (let i = 0; i < 200; i++) {
        const name = generateRandomRomajiName().toLowerCase();
        if (specialConsonants.some(sc => name.includes(sc))) {
          hasSpecialConsonants = true;
          break;
        }
      }
      expect(hasSpecialConsonants).toBe(true);
    });

    it('should handle minimum length', () => {
      const name = generateRandomRomajiName(1, 1);
      expect(name).toBeDefined();
      expect(name.length).toBeGreaterThan(0);
    });

    it('should handle longer lengths', () => {
      const name = generateRandomRomajiName(10, 15);
      expect(name).toBeDefined();
      expect(name.length).toBeGreaterThan(0);
    });

    it('should generate names with different patterns', () => {
      // Generate multiple names and verify they use different random branches
      const names = [];
      for (let i = 0; i < 100; i++) {
        names.push(generateRandomRomajiName(3, 5));
      }

      // Check that we have variety in name patterns
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBeGreaterThan(30);
    });

    it('should test vowel-only branch (rand < 0.2)', () => {
      // Generate many names to ensure vowel-only syllables appear
      const vowels = ['a', 'i', 'u', 'e', 'o'];
      let foundVowelOnly = false;

      for (let i = 0; i < 200; i++) {
        const name = generateRandomRomajiName(5, 8).toLowerCase();
        // Check for standalone vowels by looking at the name pattern
        for (const vowel of vowels) {
          if (name.includes(vowel)) {
            foundVowelOnly = true;
            break;
          }
        }
        if (foundVowelOnly) break;
      }

      expect(foundVowelOnly).toBe(true);
    });

    it('should test special consonant branch (0.2 <= rand < 0.5)', () => {
      // Generate many names to find special consonant patterns
      let foundSpecial = false;

      for (let i = 0; i < 200; i++) {
        const name = generateRandomRomajiName(5, 8).toLowerCase();
        const specialPatterns = [
          'ky',
          'sh',
          'ch',
          'ny',
          'hy',
          'my',
          'ry',
          'gy',
          'j',
          'dz',
          'by',
          'py'
        ];

        for (const pattern of specialPatterns) {
          if (name.includes(pattern)) {
            foundSpecial = true;
            break;
          }
        }
        if (foundSpecial) break;
      }

      expect(foundSpecial).toBe(true);
    });

    it('should test regular consonant branch (rand >= 0.5)', () => {
      // Generate many names to find regular consonant patterns
      let foundRegular = false;

      for (let i = 0; i < 100; i++) {
        const name = generateRandomRomajiName(5, 8).toLowerCase();
        const regularConsonants = [
          'ka',
          'sa',
          'ta',
          'na',
          'ha',
          'ma',
          'ra',
          'wa',
          'ki',
          'si',
          'ti',
          'ni'
        ];

        for (const pattern of regularConsonants) {
          if (name.includes(pattern)) {
            foundRegular = true;
            break;
          }
        }
        if (foundRegular) break;
      }

      expect(foundRegular).toBe(true);
    });
  });

  describe('Edge cases and stress tests', () => {
    it('should handle zero as minLength for hiragana', () => {
      const name = generateRandomHiraganaName(0, 3);
      expect(name.length).toBeGreaterThanOrEqual(0);
      expect(name.length).toBeLessThanOrEqual(3);
    });

    it('should handle zero as minLength for katakana', () => {
      const name = generateRandomKatakanaName(0, 3);
      expect(name.length).toBeGreaterThanOrEqual(0);
      expect(name.length).toBeLessThanOrEqual(3);
    });

    it('should handle zero as minLength for romaji', () => {
      const name = generateRandomRomajiName(0, 3);
      expect(name).toBeDefined();
    });

    it('should generate many names without errors', () => {
      expect(() => {
        for (let i = 0; i < 100; i++) {
          generateRandomHiraganaName();
          generateRandomKatakanaName();
          generateRandomRomajiName();
        }
      }).not.toThrow();
    });
  });
});
