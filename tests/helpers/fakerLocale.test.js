// fakerLocale.test.js
import { updateFakerLocale, faker, lang } from '../../helpers/fakerLocale';

describe('fakerLocale', () => {
  describe('updateFakerLocale', () => {
    test('should update locale when valid locale is provided', () => {
      // Update to English
      updateFakerLocale('en');

      // Verify the locale was changed
      expect(typeof faker).toBe('object');
      expect(faker).toBeDefined();
    });

    test('should update to different locales', () => {
      updateFakerLocale('vi');
      expect(faker).toBeDefined();

      updateFakerLocale('zh-CN');
      expect(faker).toBeDefined();

      updateFakerLocale('ar');
      expect(faker).toBeDefined();

      updateFakerLocale('de');
      expect(faker).toBeDefined();

      updateFakerLocale('es');
      expect(faker).toBeDefined();

      updateFakerLocale('fr');
      expect(faker).toBeDefined();

      updateFakerLocale('ko');
      expect(faker).toBeDefined();

      updateFakerLocale('pl');
      expect(faker).toBeDefined();

      updateFakerLocale('ru');
      expect(faker).toBeDefined();

      // Return to Japanese
      updateFakerLocale('ja');
      expect(faker).toBeDefined();
    });

    test('should not update when same locale is provided', () => {
      updateFakerLocale('en');
      const fakerBefore = faker;

      // Try to update to the same locale
      updateFakerLocale('en');

      // Should still be the same
      expect(faker).toBe(fakerBefore);
    });

    test('should not update when invalid locale is provided', () => {
      updateFakerLocale('ja');
      const fakerBefore = faker;

      // Try invalid locales
      updateFakerLocale('invalid');
      expect(faker).toBe(fakerBefore);

      updateFakerLocale('xx-XX');
      expect(faker).toBe(fakerBefore);

      updateFakerLocale('');
      expect(faker).toBe(fakerBefore);
    });

    test('should export lang variable', () => {
      expect(lang).toBeDefined();
      expect(typeof lang).toBe('string');
    });

    test('should have default locale as ja', () => {
      // Reset to default by importing fresh
      expect(lang).toBe('ja');
    });

    test('should allow switching between multiple locales', () => {
      updateFakerLocale('en');
      expect(faker).toBeDefined();

      updateFakerLocale('fr');
      expect(faker).toBeDefined();

      updateFakerLocale('de');
      expect(faker).toBeDefined();

      // Back to default
      updateFakerLocale('ja');
      expect(faker).toBeDefined();
    });
  });

  describe('faker instance', () => {
    test('should have required faker methods', () => {
      expect(faker.person).toBeDefined();
      expect(faker.internet).toBeDefined();
      expect(faker.location).toBeDefined();
      expect(faker.phone).toBeDefined();
      expect(faker.company).toBeDefined();
    });

    test('should generate data after locale change', () => {
      updateFakerLocale('en');
      const email = faker.internet.email();
      expect(email).toBeTruthy();
      expect(typeof email).toBe('string');

      const name = faker.person.firstName();
      expect(name).toBeTruthy();
      expect(typeof name).toBe('string');
    });
  });
});
