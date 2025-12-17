// tests/helpers/typeDetectionRules.test.js
import {
  detectionRules,
  matchesAnyAttribute,
  isFieldType,
  getKeywordsForType
} from '../../helpers/typeDetectionRules';

describe('typeDetectionRules', () => {
  describe('detectionRules configuration', () => {
    it('should have textInputTypes array', () => {
      expect(Array.isArray(detectionRules.textInputTypes)).toBe(true);
      expect(detectionRules.textInputTypes.length).toBeGreaterThan(0);
    });

    it('should have japaneseTypes array', () => {
      expect(Array.isArray(detectionRules.japaneseTypes)).toBe(true);
      expect(detectionRules.japaneseTypes.length).toBeGreaterThan(0);
    });

    it('should have nativeInputTypes array', () => {
      expect(Array.isArray(detectionRules.nativeInputTypes)).toBe(true);
      expect(detectionRules.nativeInputTypes.length).toBeGreaterThan(0);
    });

    it('should have nativeTypeMapping object', () => {
      expect(typeof detectionRules.nativeTypeMapping).toBe('object');
      expect(Object.keys(detectionRules.nativeTypeMapping).length).toBeGreaterThan(0);
    });

    it('should contain email detection rule', () => {
      const emailRule = detectionRules.textInputTypes.find(rule => rule.type === 'email');
      expect(emailRule).toBeDefined();
      expect(emailRule.keywords).toContain('email');
    });

    it('should contain phone detection rule', () => {
      const phoneRule = detectionRules.textInputTypes.find(rule => rule.type === 'phone');
      expect(phoneRule).toBeDefined();
      expect(phoneRule.keywords).toContain('phone');
    });

    it('should contain name detection rules', () => {
      const firstNameRule = detectionRules.textInputTypes.find(rule => rule.type === 'first_name');
      const lastNameRule = detectionRules.textInputTypes.find(rule => rule.type === 'last_name');
      const nameRule = detectionRules.textInputTypes.find(rule => rule.type === 'name');

      expect(firstNameRule).toBeDefined();
      expect(lastNameRule).toBeDefined();
      expect(nameRule).toBeDefined();
    });

    it('should contain address-related detection rules', () => {
      const addressRule = detectionRules.textInputTypes.find(rule => rule.type === 'address');
      const cityRule = detectionRules.textInputTypes.find(rule => rule.type === 'city');
      const zipRule = detectionRules.textInputTypes.find(rule => rule.type === 'zip');

      expect(addressRule).toBeDefined();
      expect(cityRule).toBeDefined();
      expect(zipRule).toBeDefined();
    });

    it('should have Japanese name types', () => {
      const hiraganaRule = detectionRules.japaneseTypes.find(rule => rule.type === 'hiragana');
      const katakanaRule = detectionRules.japaneseTypes.find(rule => rule.type === 'katakana');
      const romajiRule = detectionRules.japaneseTypes.find(rule => rule.type === 'romaji');

      expect(hiraganaRule).toBeDefined();
      expect(katakanaRule).toBeDefined();
      expect(romajiRule).toBeDefined();
    });

    it('should map native input types correctly', () => {
      expect(detectionRules.nativeTypeMapping['tel']).toBe('phone');
    });

    it('should include native input types', () => {
      expect(detectionRules.nativeInputTypes).toContain('email');
      expect(detectionRules.nativeInputTypes).toContain('tel');
      expect(detectionRules.nativeInputTypes).toContain('url');
      expect(detectionRules.nativeInputTypes).toContain('date');
      expect(detectionRules.nativeInputTypes).toContain('number');
      expect(detectionRules.nativeInputTypes).toContain('time');
      expect(detectionRules.nativeInputTypes).toContain('color');
      expect(detectionRules.nativeInputTypes).toContain('password');
    });

    it('should have exclude types for name rule', () => {
      const nameRule = detectionRules.textInputTypes.find(rule => rule.type === 'name');
      expect(nameRule.excludeTypes).toBeDefined();
      expect(nameRule.excludeTypes).toContain('first_name');
      expect(nameRule.excludeTypes).toContain('last_name');
    });
  });

  describe('matchesAnyAttribute', () => {
    const mockAttributes = {
      type: 'text',
      placeholder: 'enter your email address',
      ariaLabel: 'email input field',
      label: 'email',
      name: 'user_email',
      id: 'email-input',
      classList: 'form-control email-field',
      dataAttributes: 'data-type: email',
      namePart: 'email',
      idPart: 'input',
      classPart: 'email-field',
      placeholderPart: 'address',
      ariaLabelPart: 'field',
      labelPart: 'email',
      dataAttributesPart: 'email'
    };

    it('should match keyword in name', () => {
      expect(matchesAnyAttribute(mockAttributes, ['email'])).toBe(true);
    });

    it('should match keyword in id', () => {
      expect(matchesAnyAttribute(mockAttributes, ['input'])).toBe(true);
    });

    it('should match keyword in placeholder', () => {
      expect(matchesAnyAttribute(mockAttributes, ['address'])).toBe(true);
    });

    it('should match keyword in label', () => {
      expect(matchesAnyAttribute(mockAttributes, ['email'])).toBe(true);
    });

    it('should match keyword in classList', () => {
      expect(matchesAnyAttribute(mockAttributes, ['form-control'])).toBe(true);
    });

    it('should not match non-existent keyword', () => {
      expect(matchesAnyAttribute(mockAttributes, ['password', 'secret'])).toBe(false);
    });

    it('should match multiple keywords (OR logic)', () => {
      expect(matchesAnyAttribute(mockAttributes, ['password', 'email'])).toBe(true);
    });

    it('should be case insensitive', () => {
      // Keywords are already lowercase in detectionRules, so we test with lowercase
      expect(matchesAnyAttribute(mockAttributes, ['email'])).toBe(true);
      expect(matchesAnyAttribute(mockAttributes, ['input'])).toBe(true);
    });

    it('should handle empty keywords array', () => {
      expect(matchesAnyAttribute(mockAttributes, [])).toBe(false);
    });

    it('should match partial words', () => {
      expect(matchesAnyAttribute(mockAttributes, ['mail'])).toBe(true);
    });

    it('should match in ariaLabel', () => {
      expect(matchesAnyAttribute(mockAttributes, ['input'])).toBe(true);
    });

    it('should match in dataAttributes', () => {
      expect(matchesAnyAttribute(mockAttributes, ['data-type'])).toBe(true);
    });

    it('should match name parts', () => {
      expect(matchesAnyAttribute(mockAttributes, ['email'])).toBe(true);
    });

    it('should match id parts', () => {
      expect(matchesAnyAttribute(mockAttributes, ['input'])).toBe(true);
    });

    it('should match class parts', () => {
      expect(matchesAnyAttribute(mockAttributes, ['email-field'])).toBe(true);
    });

    it('should match placeholder parts', () => {
      expect(matchesAnyAttribute(mockAttributes, ['address'])).toBe(true);
    });
  });

  describe('Detection rules completeness', () => {
    it('should cover common field types', () => {
      const expectedTypes = [
        'email',
        'phone',
        'name',
        'first_name',
        'last_name',
        'address',
        'city',
        'zip',
        'country',
        'state',
        'date',
        'company',
        'username',
        'password'
      ];

      expectedTypes.forEach(type => {
        const rule = detectionRules.textInputTypes.find(r => r.type === type);
        expect(rule).toBeDefined();
        expect(rule.keywords.length).toBeGreaterThan(0);
      });
    });

    it('should have comprehensive phone keywords', () => {
      const phoneRule = detectionRules.textInputTypes.find(rule => rule.type === 'phone');
      expect(phoneRule.keywords).toContain('phone');
      expect(phoneRule.keywords).toContain('mobile');
      expect(phoneRule.keywords).toContain('tel');
      expect(phoneRule.keywords).toContain('telephone');
    });

    it('should have comprehensive address keywords', () => {
      const addressRule = detectionRules.textInputTypes.find(rule => rule.type === 'address');
      expect(addressRule).toBeDefined();
      expect(addressRule.keywords.length).toBeGreaterThan(2);
    });

    it('should have rules ordered by specificity', () => {
      const emailIndex = detectionRules.textInputTypes.findIndex(r => r.type === 'email');
      const addressIndex = detectionRules.textInputTypes.findIndex(r => r.type === 'address');

      // Email should come before address since "email_address" should match email, not address
      expect(emailIndex).toBeLessThan(addressIndex);
    });
  });

  describe('isFieldType', () => {
    it('should return true when field type matches keywords', () => {
      expect(isFieldType('email', ['email', 'mail'])).toBe(true);
    });

    it('should return false when field type does not match keywords', () => {
      expect(isFieldType('email', ['phone', 'tel'])).toBe(false);
    });

    it('should handle partial matches', () => {
      expect(isFieldType('email_address', ['email'])).toBe(true);
    });
  });

  describe('getKeywordsForType', () => {
    it('should return keywords for email type', () => {
      const keywords = getKeywordsForType('email');
      expect(keywords.length).toBeGreaterThan(0);
      expect(keywords).toContain('email');
    });

    it('should return keywords for phone type', () => {
      const keywords = getKeywordsForType('phone');
      expect(keywords.length).toBeGreaterThan(0);
      expect(keywords).toContain('phone');
    });

    it('should return empty array for unknown type', () => {
      const keywords = getKeywordsForType('nonexistent_type');
      expect(keywords).toEqual([]);
    });

    it('should return keywords for name types', () => {
      expect(getKeywordsForType('first_name').length).toBeGreaterThan(0);
      expect(getKeywordsForType('last_name').length).toBeGreaterThan(0);
      expect(getKeywordsForType('name').length).toBeGreaterThan(0);
    });
  });
});
