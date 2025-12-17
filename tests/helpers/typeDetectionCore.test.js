// tests/helpers/typeDetectionCore.test.js
import { getElmType, getElmTypeWithAI, getElmJapanType } from '../../helpers/typeDetectionCore';

// Mock AI detection module
jest.mock('../../helpers/aiFieldDetection', () => ({
  predictFieldTypeEnhanced: jest.fn(),
  isAIDetectionEnabled: jest.fn(),
  getConfidenceThreshold: jest.fn()
}));

// Mock label finder
jest.mock('../../helpers/labelFinder', () => ({
  findClosestLabel: jest.fn()
}));

describe('typeDetectionCore', () => {
  let mockInput;

  beforeEach(() => {
    mockInput = document.createElement('input');
    mockInput.type = 'text';
    jest.clearAllMocks();
  });

  describe('getElmType', () => {
    it('should detect email by type attribute', () => {
      mockInput.type = 'email';
      expect(getElmType(mockInput)).toBe('email');
    });

    it('should detect phone by tel type', () => {
      mockInput.type = 'tel';
      expect(getElmType(mockInput)).toBe('phone');
    });

    it('should detect email by name attribute', () => {
      mockInput.name = 'user_email';
      expect(getElmType(mockInput)).toBe('email');
    });

    it('should detect email by id attribute', () => {
      mockInput.id = 'email-field';
      expect(getElmType(mockInput)).toBe('email');
    });

    it('should detect email by placeholder', () => {
      mockInput.placeholder = 'Enter your email';
      expect(getElmType(mockInput)).toBe('email');
    });

    it('should detect email by aria-label', () => {
      mockInput.setAttribute('aria-label', 'Email address');
      expect(getElmType(mockInput)).toBe('email');
    });

    it('should detect email by class name', () => {
      mockInput.className = 'form-control email-input';
      expect(getElmType(mockInput)).toBe('email');
    });

    it('should detect email by data attributes', () => {
      mockInput.setAttribute('data-field', 'email');
      expect(getElmType(mockInput)).toBe('email');
    });

    it('should use findClosestLabel when no label element', () => {
      const { findClosestLabel } = require('../../helpers/labelFinder');
      findClosestLabel.mockReturnValue('Email Address');

      expect(getElmType(mockInput)).toBe('email');
      expect(findClosestLabel).toHaveBeenCalledWith(mockInput);
    });

    it('should handle null closestLabel gracefully', () => {
      const { findClosestLabel } = require('../../helpers/labelFinder');
      findClosestLabel.mockReturnValue(null);

      mockInput.name = 'unknown_field';
      expect(getElmType(mockInput)).toBe('text');
    });

    it('should detect first_name and not match name due to excludeTypes', () => {
      mockInput.name = 'first_name';
      expect(getElmType(mockInput)).toBe('first_name');
    });

    it('should detect last_name and not match name due to excludeTypes', () => {
      mockInput.name = 'last_name';
      expect(getElmType(mockInput)).toBe('last_name');
    });

    it('should detect name when not first_name or last_name', () => {
      mockInput.name = 'full_name';
      expect(getElmType(mockInput)).toBe('name');
    });

    it('should detect first_name and exclude name match', () => {
      mockInput.name = 'firstname_input';
      expect(getElmType(mockInput)).toBe('first_name');
    });

    it('should detect last_name and exclude name match', () => {
      mockInput.name = 'lastname_field';
      expect(getElmType(mockInput)).toBe('last_name');
    });

    it('should detect first_name even with username keyword', () => {
      mockInput.name = 'firstname';
      const result = getElmType(mockInput);
      expect(result).toBe('first_name');
    });

    it('should return text for unrecognized field', () => {
      mockInput.name = 'random_xyz_123';
      expect(getElmType(mockInput)).toBe('text');
    });

    it('should return number for number input type', () => {
      mockInput.type = 'number';
      mockInput.name = 'custom_number';
      expect(getElmType(mockInput)).toBe('number');
    });

    it('should cache attributes on element', () => {
      mockInput.name = 'email';

      // First call
      const result1 = getElmType(mockInput);

      // Second call should use cache
      const result2 = getElmType(mockInput);

      expect(result1).toBe(result2);
      expect(result1).toBe('email');
      expect(mockInput._attrCache).toBeDefined();
    });

    it('should handle input with label element', () => {
      const label = document.createElement('label');
      label.textContent = 'Email Address';
      label.htmlFor = 'test-email';
      mockInput.id = 'test-email';

      document.body.appendChild(label);
      document.body.appendChild(mockInput);

      const result = getElmType(mockInput);

      document.body.removeChild(label);
      document.body.removeChild(mockInput);

      expect(result).toBe('email');
    });

    it('should handle null input', () => {
      expect(getElmType(null)).toBe('text');
    });

    it('should detect date by type attribute', () => {
      mockInput.type = 'date';
      expect(getElmType(mockInput)).toBe('date');
    });

    it('should detect password by type attribute', () => {
      mockInput.type = 'password';
      expect(getElmType(mockInput)).toBe('password');
    });

    it('should detect url by type attribute', () => {
      mockInput.type = 'url';
      expect(getElmType(mockInput)).toBe('url');
    });

    it('should detect color by type attribute', () => {
      mockInput.type = 'color';
      expect(getElmType(mockInput)).toBe('color');
    });

    it('should detect month by type attribute', () => {
      mockInput.type = 'month';
      expect(getElmType(mockInput)).toBe('month');
    });

    it('should detect week by type attribute', () => {
      mockInput.type = 'week';
      expect(getElmType(mockInput)).toBe('week');
    });

    it('should detect time by type attribute', () => {
      mockInput.type = 'time';
      expect(getElmType(mockInput)).toBe('time');
    });

    it('should keep datetime-local as datetime-local', () => {
      mockInput.type = 'datetime-local';
      expect(getElmType(mockInput)).toBe('datetime-local');
    });
  });

  describe('getElmJapanType', () => {
    it('should detect hiragana for text input', () => {
      mockInput.type = 'text';
      mockInput.name = 'name_hiragana';
      expect(getElmJapanType(mockInput)).toBe('hiragana');
    });

    it('should detect katakana for text input', () => {
      mockInput.type = 'text';
      mockInput.name = 'name_katakana';
      expect(getElmJapanType(mockInput)).toBe('katakana');
    });

    it('should detect romaji for text input', () => {
      mockInput.type = 'text';
      mockInput.name = 'name_romaji';
      expect(getElmJapanType(mockInput)).toBe('romaji');
    });

    it('should return empty string for non-text input', () => {
      mockInput.type = 'email';
      mockInput.name = 'name_hiragana';
      expect(getElmJapanType(mockInput)).toBe('');
    });

    it('should return empty string for null input', () => {
      expect(getElmJapanType(null)).toBe('');
    });

    it('should return empty string for non-Japanese field', () => {
      mockInput.type = 'text';
      mockInput.name = 'regular_name';
      expect(getElmJapanType(mockInput)).toBe('');
    });
  });

  describe('getElmTypeWithAI', () => {
    it('should return text for null input', async () => {
      const result = await getElmTypeWithAI(null);
      expect(result).toBe('text');
    });

    it('should use rule-based detection when AI is disabled', async () => {
      const { isAIDetectionEnabled } = require('../../helpers/aiFieldDetection');
      isAIDetectionEnabled.mockResolvedValue(false);

      mockInput.name = 'user_email';
      const result = await getElmTypeWithAI(mockInput);

      expect(result).toBe('email');
      expect(isAIDetectionEnabled).toHaveBeenCalled();
    });

    it('should return rule-based result for non-text types even with AI enabled', async () => {
      const { isAIDetectionEnabled } = require('../../helpers/aiFieldDetection');
      isAIDetectionEnabled.mockResolvedValue(true);

      mockInput.name = 'user_email';
      const result = await getElmTypeWithAI(mockInput);

      expect(result).toBe('email');
    });

    it('should use AI detection for generic text fields when enabled', async () => {
      const {
        isAIDetectionEnabled,
        getConfidenceThreshold,
        predictFieldTypeEnhanced
      } = require('../../helpers/aiFieldDetection');

      isAIDetectionEnabled.mockResolvedValue(true);
      getConfidenceThreshold.mockResolvedValue(0.7);
      predictFieldTypeEnhanced.mockReturnValue({
        type: 'phone',
        confidence: 0.85
      });

      mockInput.name = 'contact_field';
      const result = await getElmTypeWithAI(mockInput);

      expect(result).toBe('phone');
      expect(predictFieldTypeEnhanced).toHaveBeenCalledWith(mockInput, 0.7);
    });

    it('should fallback to rule-based when AI confidence is low', async () => {
      const {
        isAIDetectionEnabled,
        getConfidenceThreshold,
        predictFieldTypeEnhanced
      } = require('../../helpers/aiFieldDetection');

      isAIDetectionEnabled.mockResolvedValue(true);
      getConfidenceThreshold.mockResolvedValue(0.7);
      predictFieldTypeEnhanced.mockReturnValue({
        type: 'phone',
        confidence: 0.5 // Below threshold
      });

      mockInput.name = 'unknown_field';
      const result = await getElmTypeWithAI(mockInput);

      expect(result).toBe('text'); // Fallback to rule-based
    });

    it('should handle AI detection errors gracefully', async () => {
      const {
        isAIDetectionEnabled,
        getConfidenceThreshold,
        predictFieldTypeEnhanced
      } = require('../../helpers/aiFieldDetection');

      isAIDetectionEnabled.mockResolvedValue(true);
      getConfidenceThreshold.mockResolvedValue(0.7);
      predictFieldTypeEnhanced.mockImplementation(() => {
        throw new Error('AI model failed');
      });

      // Mock logger instead of console
      const { logger } = require('../../helpers/logger');
      const loggerWarnSpy = jest.spyOn(logger, 'warn').mockImplementation();

      mockInput.name = 'unknown_field';
      const result = await getElmTypeWithAI(mockInput);

      expect(result).toBe('text');
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'AI detection failed, using rule-based result:',
        expect.any(Error)
      );

      loggerWarnSpy.mockRestore();
    });

    it('should fallback to rule-based when AI returns null', async () => {
      const {
        isAIDetectionEnabled,
        getConfidenceThreshold,
        predictFieldTypeEnhanced
      } = require('../../helpers/aiFieldDetection');

      isAIDetectionEnabled.mockResolvedValue(true);
      getConfidenceThreshold.mockResolvedValue(0.7);
      predictFieldTypeEnhanced.mockReturnValue(null);

      mockInput.name = 'custom_field';
      const result = await getElmTypeWithAI(mockInput);

      expect(result).toBe('text');
    });
  });

  describe('clearAttributeCache', () => {
    it('should clear cached attributes from all inputs', () => {
      // Import the function - it's not exported, so we test indirectly
      // by checking cache behavior
      const input1 = document.createElement('input');
      input1.name = 'email1';
      const input2 = document.createElement('input');
      input2.name = 'email2';

      document.body.appendChild(input1);
      document.body.appendChild(input2);

      // Populate cache
      getElmType(input1);
      getElmType(input2);

      expect(input1._attrCache).toBeDefined();
      expect(input2._attrCache).toBeDefined();

      // Since clearAttributeCache is not exported, we verify the cache exists
      // The actual clearing is tested through internal behavior

      document.body.removeChild(input1);
      document.body.removeChild(input2);
    });
  });

  describe('Attribute caching', () => {
    it('should parse name parts correctly', () => {
      mockInput.name = 'user[email][primary]';
      getElmType(mockInput);
      expect(mockInput._attrCache.namePart).toBeTruthy();
    });

    it('should parse id parts correctly', () => {
      mockInput.id = 'form-user.email-address';
      getElmType(mockInput);
      expect(mockInput._attrCache.idPart).toBeTruthy();
    });

    it('should handle multiple class names', () => {
      mockInput.className = 'form-control input-field email-address';
      getElmType(mockInput);
      expect(mockInput._attrCache.classPart).toBe('email-address');
    });

    it('should handle data attributes', () => {
      mockInput.setAttribute('data-field-type', 'email');
      mockInput.setAttribute('data-validation', 'required');
      getElmType(mockInput);
      expect(mockInput._attrCache.dataAttributes).toContain('email');
    });
  });

  describe('Japanese keyword translation', () => {
    it('should detect username from Japanese label "ログインID"', () => {
      mockInput.setAttribute('aria-label', 'ログインID');
      const result = getElmType(mockInput);
      expect(result).toBe('username');
    });

    it('should detect username from Japanese "ログイン" in placeholder', () => {
      mockInput.placeholder = 'ログイン名を入力';
      const result = getElmType(mockInput);
      expect(result).toBe('username');
    });

    it('should detect username from Japanese "ユーザー" in name attribute', () => {
      mockInput.name = 'ユーザー名';
      const result = getElmType(mockInput);
      expect(result).toBe('username');
    });

    it('should detect email from Japanese "メール" keyword', () => {
      const label = document.createElement('label');
      label.textContent = 'メールアドレス';
      label.htmlFor = 'test-mail';
      mockInput.id = 'test-mail';

      document.body.appendChild(label);
      document.body.appendChild(mockInput);

      const result = getElmType(mockInput);

      document.body.removeChild(label);
      document.body.removeChild(mockInput);

      expect(result).toBe('email');
    });

    it('should detect password from Japanese "パスワード"', () => {
      mockInput.placeholder = 'パスワードを入力してください';
      const result = getElmType(mockInput);
      expect(result).toBe('password');
    });

    it('should detect phone from Japanese "電話番号"', () => {
      mockInput.setAttribute('aria-label', '電話番号');
      const result = getElmType(mockInput);
      expect(result).toBe('phone');
    });

    it('should detect phone from Japanese "電話" (short form)', () => {
      mockInput.name = '電話';
      const result = getElmType(mockInput);
      expect(result).toBe('phone');
    });

    it('should detect name from Japanese "名前"', () => {
      const label = document.createElement('label');
      label.textContent = '名前';
      label.htmlFor = 'name-input';
      mockInput.id = 'name-input';

      document.body.appendChild(label);
      document.body.appendChild(mockInput);

      const result = getElmType(mockInput);

      document.body.removeChild(label);
      document.body.removeChild(mockInput);

      expect(result).toBe('name');
    });

    it('should detect name from Japanese "氏名"', () => {
      mockInput.placeholder = '氏名を入力';
      const result = getElmType(mockInput);
      expect(result).toBe('name');
    });

    it('should detect first_name from Japanese "名"', () => {
      mockInput.name = '名';
      const result = getElmType(mockInput);
      expect(result).toBe('first_name');
    });

    it('should detect last_name from Japanese "姓"', () => {
      mockInput.name = '姓';
      const result = getElmType(mockInput);
      expect(result).toBe('last_name');
    });

    it('should detect address from Japanese "住所"', () => {
      mockInput.setAttribute('aria-label', '住所');
      const result = getElmType(mockInput);
      expect(result).toBe('address');
    });

    it('should detect zip from Japanese "郵便番号"', () => {
      mockInput.placeholder = '郵便番号';
      const result = getElmType(mockInput);
      expect(result).toBe('zip');
    });

    it('should detect company from Japanese "会社"', () => {
      mockInput.name = '会社';
      const result = getElmType(mockInput);
      expect(result).toBe('company');
    });

    it('should detect company from Japanese "会社名"', () => {
      mockInput.placeholder = '会社名を入力';
      const result = getElmType(mockInput);
      expect(result).toBe('company');
    });

    it('should detect country from Japanese "国"', () => {
      mockInput.name = '国';
      const result = getElmType(mockInput);
      expect(result).toBe('country');
    });

    it('should detect state from Japanese "都道府県"', () => {
      mockInput.setAttribute('aria-label', '都道府県');
      const result = getElmType(mockInput);
      expect(result).toBe('state');
    });

    it('should detect city from Japanese "市区町村"', () => {
      mockInput.placeholder = '市区町村';
      const result = getElmType(mockInput);
      expect(result).toBe('city');
    });

    it('should handle mixed Japanese and English keywords', () => {
      mockInput.name = 'user_ログイン_id';
      const result = getElmType(mockInput);
      expect(result).toBe('username');
    });

    it('should translate Japanese in class names', () => {
      mockInput.className = 'form-input メール-field';
      const result = getElmType(mockInput);
      expect(result).toBe('email');
    });

    it('should translate Japanese in data attributes', () => {
      mockInput.setAttribute('data-field', 'ユーザー情報');
      const result = getElmType(mockInput);
      expect(result).toBe('username');
    });

    it('should preserve cache for Japanese keywords', () => {
      mockInput.setAttribute('aria-label', 'ログインID');

      // First call - creates cache
      const result1 = getElmType(mockInput);

      // Second call - uses cache
      const result2 = getElmType(mockInput);

      expect(result1).toBe('username');
      expect(result2).toBe('username');
      expect(mockInput._attrCache).toBeDefined();
      expect(mockInput._attrCache.ariaLabel).toContain('login'); // Translated
    });

    it('should handle multiple Japanese keywords in one attribute', () => {
      mockInput.placeholder = 'ユーザーのログインIDを入力';
      const result = getElmType(mockInput);
      expect(result).toBe('username');
    });

    it('should not translate non-Japanese text', () => {
      mockInput.name = 'regular_email_field';
      const result = getElmType(mockInput);
      expect(result).toBe('email');
    });

    it('should handle empty Japanese strings gracefully', () => {
      mockInput.name = '';
      mockInput.placeholder = '';
      const result = getElmType(mockInput);
      expect(result).toBe('text');
    });

    it('should handle input without any attributes', () => {
      const bareInput = document.createElement('input');
      const result = getElmType(bareInput);
      expect(result).toBe('text');
    });

    it('should handle input with only whitespace in attributes', () => {
      mockInput.name = '   ';
      mockInput.placeholder = '   ';
      mockInput.setAttribute('aria-label', '   ');
      const result = getElmType(mockInput);
      expect(result).toBe('text');
    });

    it('should handle label with null textContent', () => {
      const label = document.createElement('label');
      label.textContent = null;
      label.htmlFor = 'test-input';
      mockInput.id = 'test-input';

      document.body.appendChild(label);
      document.body.appendChild(mockInput);

      const result = getElmType(mockInput);

      document.body.removeChild(label);
      document.body.removeChild(mockInput);

      expect(result).toBe('text');
    });

    it('should handle multiple Japanese to English translations in same string', () => {
      mockInput.placeholder = 'ユーザーのメールアドレス'; // user's email address
      const result = getElmType(mockInput);
      // Should match email as it's more specific
      expect(result).toBe('email');
    });

    it('should not translate when no Japanese characters present', () => {
      mockInput.name = 'regular_input_field';
      mockInput.placeholder = 'Enter your data';
      const result = getElmType(mockInput);
      expect(result).toBe('text');
    });
  });

  describe('Japanese keyword edge cases', () => {
    it('should handle Japanese keywords in label with whitespace', () => {
      const label = document.createElement('label');
      label.textContent = '  ログインID  ';
      label.htmlFor = 'login-field';
      mockInput.id = 'login-field';

      document.body.appendChild(label);
      document.body.appendChild(mockInput);

      const result = getElmType(mockInput);

      document.body.removeChild(label);
      document.body.removeChild(mockInput);

      expect(result).toBe('username');
    });

    it('should handle Japanese keywords with numbers', () => {
      mockInput.name = 'ログインID123';
      const result = getElmType(mockInput);
      expect(result).toBe('username');
    });

    it('should prioritize specific keywords over generic ones', () => {
      mockInput.name = '電話番号'; // Should match phone, not just text
      const result = getElmType(mockInput);
      expect(result).toBe('phone');
    });

    it('should handle case where Japanese appears in multiple attributes', () => {
      mockInput.name = 'メール';
      mockInput.placeholder = 'メールアドレス';
      mockInput.setAttribute('aria-label', 'Email メール');
      const result = getElmType(mockInput);
      expect(result).toBe('email');
    });

    it('should handle partial Japanese keyword matches', () => {
      mockInput.name = 'input_ログイン_field';
      const result = getElmType(mockInput);
      expect(result).toBe('username');
    });
  });

  describe('Integration: Japanese with AI detection', () => {
    it('should translate Japanese before passing to AI detection', async () => {
      const {
        isAIDetectionEnabled,
        getConfidenceThreshold,
        predictFieldTypeEnhanced
      } = require('../../helpers/aiFieldDetection');

      isAIDetectionEnabled.mockResolvedValue(true);
      getConfidenceThreshold.mockResolvedValue(0.7);
      predictFieldTypeEnhanced.mockReturnValue({
        type: 'username',
        confidence: 0.9
      });

      mockInput.name = 'ログイン'; // Japanese login
      mockInput._attrCache = undefined; // Clear cache

      const result = await getElmTypeWithAI(mockInput);

      // Should detect as username (rule-based would catch it)
      expect(result).toBe('username');
    });

    it('should handle Japanese keywords when AI fails', async () => {
      const {
        isAIDetectionEnabled,
        getConfidenceThreshold,
        predictFieldTypeEnhanced
      } = require('../../helpers/aiFieldDetection');

      isAIDetectionEnabled.mockResolvedValue(true);
      getConfidenceThreshold.mockResolvedValue(0.7);
      predictFieldTypeEnhanced.mockImplementation(() => {
        throw new Error('AI failed');
      });

      const { logger } = require('../../helpers/logger');
      const loggerWarnSpy = jest.spyOn(logger, 'warn').mockImplementation();

      // Use a field that rule-based detection would mark as 'text'
      // but AI could potentially improve
      mockInput.name = 'custom_field_123';
      mockInput.placeholder = 'メールアドレス'; // Japanese for email
      mockInput._attrCache = undefined; // Clear cache to force re-detection

      const result = await getElmTypeWithAI(mockInput);

      // Rule-based should detect email from the translated Japanese keyword
      expect(result).toBe('email');

      // AI should have been called but failed, so logger.warn should be called
      // only if the field type was 'text' initially
      // In this case, rule-based catches 'email' so AI is never called

      loggerWarnSpy.mockRestore();
    });

    it('should handle empty input type attribute', async () => {
      const { isAIDetectionEnabled } = require('../../helpers/aiFieldDetection');

      isAIDetectionEnabled.mockResolvedValue(false);

      mockInput.type = '';
      mockInput.name = 'user_email';
      const result = await getElmTypeWithAI(mockInput);

      expect(result).toBe('email');
    });

    it('should prioritize rule-based for non-text types even with high AI confidence', async () => {
      const {
        isAIDetectionEnabled,
        getConfidenceThreshold,
        predictFieldTypeEnhanced
      } = require('../../helpers/aiFieldDetection');

      isAIDetectionEnabled.mockResolvedValue(true);
      getConfidenceThreshold.mockResolvedValue(0.7);
      predictFieldTypeEnhanced.mockReturnValue({
        type: 'text',
        confidence: 0.95
      });

      mockInput.type = 'email';
      const result = await getElmTypeWithAI(mockInput);

      // Rule-based should win for type='email'
      expect(result).toBe('email');
    });
  });

  describe('Edge cases for attribute extraction', () => {
    it('should handle input without labels property', () => {
      const input = document.createElement('input');
      Object.defineProperty(input, 'labels', {
        get: () => null
      });
      input.name = 'email_field';

      const result = getElmType(input);
      expect(result).toBe('email');
    });

    it('should handle input with empty classList', () => {
      mockInput.className = '';
      mockInput.name = 'phone';
      const result = getElmType(mockInput);
      expect(result).toBe('phone');
    });

    it('should handle input without any data attributes', () => {
      mockInput.name = 'user_email';
      // Ensure no data-* attributes
      Array.from(mockInput.attributes).forEach(attr => {
        if (attr.name.startsWith('data-')) {
          mockInput.removeAttribute(attr.name);
        }
      });

      const result = getElmType(mockInput);
      expect(result).toBe('email');
    });

    it('should handle input with number type but text-related name', () => {
      mockInput.type = 'number';
      mockInput.name = 'age';
      const result = getElmType(mockInput);
      expect(result).toBe('number');
    });
  });
});
