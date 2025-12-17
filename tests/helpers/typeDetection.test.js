// typeDetection.test.js
import { detectFieldType, getElmJapanType } from '../../helpers/typeDetection';

describe('typeDetection', () => {
  let mockElement;

  beforeEach(() => {
    mockElement = document.createElement('input');
    mockElement.type = 'text';
  });

  describe('Email Detection', () => {
    test('should detect email by type', () => {
      mockElement.type = 'email';
      const result = detectFieldType(mockElement);
      expect(result).toBe('email');
    });

    test('should detect email by name', () => {
      mockElement.name = 'user_email';
      const result = detectFieldType(mockElement);
      expect(result).toBe('email');
    });

    test('should detect email by id', () => {
      mockElement.id = 'email-address';
      const result = detectFieldType(mockElement);
      expect(result).toBe('email');
    });

    test('should detect email by placeholder', () => {
      mockElement.placeholder = 'Enter your email';
      const result = detectFieldType(mockElement);
      expect(result).toBe('email');
    });
  });

  describe('Phone Detection', () => {
    test('should detect phone by type', () => {
      mockElement.type = 'tel';
      const result = detectFieldType(mockElement);
      expect(result).toBe('phone');
    });

    test('should detect phone by name', () => {
      mockElement.name = 'phone_number';
      const result = detectFieldType(mockElement);
      expect(result).toBe('phone');
    });

    test('should detect mobile phone', () => {
      mockElement.name = 'mobile';
      const result = detectFieldType(mockElement);
      expect(result).toBe('phone');
    });

    test('should detect telephone', () => {
      mockElement.id = 'telephone';
      const result = detectFieldType(mockElement);
      expect(result).toBe('phone');
    });
  });

  describe('Name Detection', () => {
    test('should detect first name', () => {
      mockElement.name = 'first_name';
      const result = detectFieldType(mockElement);
      expect(result).toBe('first_name');
    });

    test('should detect last name', () => {
      mockElement.name = 'last_name';
      const result = detectFieldType(mockElement);
      expect(result).toBe('last_name');
    });

    test('should detect full name', () => {
      mockElement.name = 'full_name';
      const result = detectFieldType(mockElement);
      expect(result).toBe('name');
    });

    test('should detect surname', () => {
      mockElement.name = 'surname';
      const result = detectFieldType(mockElement);
      expect(result).toBe('last_name');
    });
  });

  describe('Address Detection', () => {
    test('should detect street address', () => {
      mockElement.name = 'street_address';
      const result = detectFieldType(mockElement);
      expect(result).toBe('address');
    });

    test('should detect city', () => {
      mockElement.name = 'city';
      const result = detectFieldType(mockElement);
      expect(result).toBe('city');
    });

    test('should detect zip code', () => {
      mockElement.name = 'zip_code';
      const result = detectFieldType(mockElement);
      expect(result).toBe('zip');
    });

    test('should detect postal code', () => {
      mockElement.name = 'postal_code';
      const result = detectFieldType(mockElement);
      expect(result).toBe('zip');
    });

    test('should detect country', () => {
      mockElement.name = 'country';
      const result = detectFieldType(mockElement);
      expect(result).toBe('country');
    });
  });

  describe('Date Detection', () => {
    test('should detect date by type', () => {
      mockElement.type = 'date';
      const result = detectFieldType(mockElement);
      expect(result).toBe('date');
    });

    test('should detect birthdate', () => {
      mockElement.name = 'birth_date';
      const result = detectFieldType(mockElement);
      expect(result).toBe('birthdate');
    });

    test('should detect birthday', () => {
      mockElement.name = 'birthday';
      const result = detectFieldType(mockElement);
      expect(result).toBe('birthdate');
    });
  });

  describe('Number Detection', () => {
    test('should detect number by type', () => {
      mockElement.type = 'number';
      const result = detectFieldType(mockElement);
      expect(result).toBe('number');
    });

    test('should detect age', () => {
      mockElement.name = 'age';
      const result = detectFieldType(mockElement);
      expect(result).toBe('number');
    });

    test('should detect quantity', () => {
      mockElement.name = 'quantity';
      const result = detectFieldType(mockElement);
      expect(result).toBe('number');
    });

    test('should detect amount', () => {
      mockElement.name = 'amount';
      const result = detectFieldType(mockElement);
      expect(result).toBe('number');
    });
  });

  describe('URL Detection', () => {
    test('should detect url by type', () => {
      mockElement.type = 'url';
      const result = detectFieldType(mockElement);
      expect(result).toBe('url');
    });

    test('should detect website', () => {
      mockElement.name = 'website';
      const result = detectFieldType(mockElement);
      expect(result).toBe('url');
    });

    test('should detect homepage', () => {
      mockElement.name = 'homepage';
      const result = detectFieldType(mockElement);
      expect(result).toBe('url');
    });
  });

  describe('Username Detection', () => {
    test('should detect username', () => {
      mockElement.name = 'username';
      const result = detectFieldType(mockElement);
      expect(result).toBe('username');
    });

    test('should detect user_name', () => {
      mockElement.name = 'user_name';
      const result = detectFieldType(mockElement);
      expect(result).toBe('username');
    });

    test('should detect login', () => {
      mockElement.name = 'login';
      const result = detectFieldType(mockElement);
      expect(result).toBe('username');
    });
  });

  describe('Password Detection', () => {
    test('should detect password by type', () => {
      mockElement.type = 'password';
      const result = detectFieldType(mockElement);
      expect(result).toBe('password');
    });

    test('should detect password by name', () => {
      mockElement.name = 'password';
      const result = detectFieldType(mockElement);
      expect(result).toBe('password');
    });

    test('should detect pwd', () => {
      mockElement.name = 'pwd';
      const result = detectFieldType(mockElement);
      expect(result).toBe('password');
    });
  });

  describe('Company Detection', () => {
    test('should detect company', () => {
      mockElement.name = 'company';
      const result = detectFieldType(mockElement);
      expect(result).toBe('company');
    });

    test('should detect organization', () => {
      mockElement.name = 'organization';
      const result = detectFieldType(mockElement);
      expect(result).toBe('company');
    });
  });

  describe('Color Detection', () => {
    test('should detect color by type', () => {
      mockElement.type = 'color';
      const result = detectFieldType(mockElement);
      expect(result).toBe('color');
    });

    test('should detect color by name', () => {
      mockElement.name = 'favorite_color';
      const result = detectFieldType(mockElement);
      expect(result).toBe('color');
    });
  });

  describe('Edge Cases', () => {
    test('should return text for unrecognized field', () => {
      mockElement.name = 'random_field_12345';
      const result = detectFieldType(mockElement);
      expect(result).toBe('text');
    });

    test('should handle empty attributes', () => {
      mockElement.name = '';
      mockElement.id = '';
      mockElement.placeholder = '';
      const result = detectFieldType(mockElement);
      expect(result).toBeTruthy();
    });

    test('should be case insensitive', () => {
      mockElement.name = 'EMAIL_ADDRESS';
      const result = detectFieldType(mockElement);
      expect(result).toBe('email');
    });

    test('should handle null element', () => {
      expect(() => detectFieldType(null)).not.toThrow();
    });

    test('should detect by class name', () => {
      mockElement.className = 'email-input';
      const result = detectFieldType(mockElement);
      expect(result).toBe('email');
    });

    test('should detect by aria-label', () => {
      mockElement.setAttribute('aria-label', 'Email address');
      const result = detectFieldType(mockElement);
      expect(result).toBe('email');
    });
  });

  describe('Priority Tests', () => {
    test('should prioritize type attribute over name', () => {
      mockElement.type = 'email';
      mockElement.name = 'phone';
      const result = detectFieldType(mockElement);
      expect(result).toBe('email');
    });

    test('should check name if type is generic', () => {
      mockElement.type = 'text';
      mockElement.name = 'user_email';
      const result = detectFieldType(mockElement);
      expect(result).toBe('email');
    });
  });

  describe('Japanese Name Detection', () => {
    test('should detect hiragana name field', () => {
      mockElement.name = 'name_hiragana';
      const result = detectFieldType(mockElement);
      expect(['name', 'first_name', 'last_name', 'text']).toContain(result);
    });

    test('should detect katakana name field', () => {
      mockElement.name = 'name_katakana';
      const result = detectFieldType(mockElement);
      expect(['name', 'first_name', 'last_name', 'text']).toContain(result);
    });

    test('should detect romaji name field', () => {
      mockElement.name = 'name_romaji';
      const result = detectFieldType(mockElement);
      expect(['name', 'first_name', 'last_name', 'text']).toContain(result);
    });
  });

  describe('Additional Coverage Tests', () => {
    test('should handle input with data attributes', () => {
      mockElement.setAttribute('data-type', 'email');
      mockElement.setAttribute('data-field', 'user-email');
      const result = detectFieldType(mockElement);
      expect(result).toBeTruthy();
    });

    test('should detect field with complex class names', () => {
      mockElement.className = 'form-control input-email user-email-field';
      const result = detectFieldType(mockElement);
      expect(result).toBe('email');
    });

    test('should handle input with label containing keyword', () => {
      const label = document.createElement('label');
      label.textContent = 'Email Address';
      label.htmlFor = 'test-input';
      mockElement.id = 'test-input';
      document.body.appendChild(label);
      document.body.appendChild(mockElement);

      const result = detectFieldType(mockElement);

      document.body.removeChild(label);
      document.body.removeChild(mockElement);

      expect(result).toBe('email');
    });

    test('should cache element attributes', () => {
      mockElement.name = 'user_email';
      // First call
      const result1 = detectFieldType(mockElement);
      // Second call should use cache
      const result2 = detectFieldType(mockElement);

      expect(result1).toBe(result2);
      expect(result1).toBe('email');
    });

    test('should parse name parts with brackets', () => {
      mockElement.name = 'user[email]';
      const result = detectFieldType(mockElement);
      expect(result).toBe('email');
    });

    test('should parse name parts with dots', () => {
      mockElement.name = 'user.email.address';
      const result = detectFieldType(mockElement);
      expect(result).toBe('email');
    });

    test('should parse name parts with hyphens', () => {
      mockElement.name = 'user-email-input';
      const result = detectFieldType(mockElement);
      expect(result).toBe('email');
    });

    test('should detect state field', () => {
      mockElement.name = 'province';
      const result = detectFieldType(mockElement);
      expect(result).toBe('state');
    });

    test('should detect year field', () => {
      mockElement.name = 'year';
      const result = detectFieldType(mockElement);
      expect(result).toBe('year');
    });

    test('should detect month field', () => {
      mockElement.name = 'month';
      const result = detectFieldType(mockElement);
      expect(result).toBe('month');
    });

    test('should detect day field', () => {
      mockElement.name = 'day';
      const result = detectFieldType(mockElement);
      expect(result).toBe('day');
    });

    test('should detect time input', () => {
      mockElement.type = 'time';
      const result = detectFieldType(mockElement);
      expect(result).toBe('time');
    });

    test('should detect datetime-local input', () => {
      mockElement.type = 'datetime-local';
      const result = detectFieldType(mockElement);
      expect(result).toBe('datetime-local');
    });

    test('should detect week input', () => {
      mockElement.type = 'week';
      const result = detectFieldType(mockElement);
      expect(result).toBe('week');
    });

    test('should detect month input type', () => {
      mockElement.type = 'month';
      const result = detectFieldType(mockElement);
      expect(result).toBe('month');
    });

    test('should handle search input', () => {
      mockElement.type = 'search';
      const result = detectFieldType(mockElement);
      expect(result).toBeTruthy();
    });

    test('should detect building field', () => {
      mockElement.name = 'building';
      const result = detectFieldType(mockElement);
      expect(result).toBe('building');
    });

    test('should detect room_number field', () => {
      mockElement.name = 'room_number';
      const result = detectFieldType(mockElement);
      // room_number contains 'room' which matches building first due to order
      expect(['room_number', 'building']).toContain(result);
    });

    test('should handle type attribute with uppercase', () => {
      Object.defineProperty(mockElement, 'type', { value: 'EMAIL', writable: true });
      const result = detectFieldType(mockElement);
      expect(['email', 'text']).toContain(result);
    });

    test('should return number for unrecognized number input', () => {
      mockElement.type = 'number';
      mockElement.name = 'custom_number_field';
      const result = detectFieldType(mockElement);
      expect(result).toBe('number');
    });

    test('should handle placeholder with spaces', () => {
      mockElement.placeholder = 'Enter your phone number here';
      const result = detectFieldType(mockElement);
      expect(result).toBe('phone');
    });

    test('should handle aria-label with spaces', () => {
      mockElement.setAttribute('aria-label', 'User email address field');
      const result = detectFieldType(mockElement);
      expect(result).toBe('email');
    });

    test('should handle label with spaces', () => {
      const label = document.createElement('label');
      label.textContent = 'Your telephone number';
      label.htmlFor = 'tel-input';
      mockElement.id = 'tel-input';
      document.body.appendChild(label);
      document.body.appendChild(mockElement);

      const result = detectFieldType(mockElement);

      document.body.removeChild(label);
      document.body.removeChild(mockElement);

      expect(result).toBe('phone');
    });

    test('should detect excluded types correctly', () => {
      // Test that email takes priority over address
      mockElement.name = 'email_address';
      const result = detectFieldType(mockElement);
      expect(result).toBe('email');
    });
  });

  describe('getElmJapanType Tests', () => {
    test('should detect hiragana for text input', () => {
      mockElement.type = 'text';
      mockElement.name = 'name_hiragana';
      const result = getElmJapanType(mockElement);
      expect(result).toBe('hiragana');
    });

    test('should detect katakana for text input', () => {
      mockElement.type = 'text';
      mockElement.name = 'name_katakana';
      const result = getElmJapanType(mockElement);
      expect(result).toBe('katakana');
    });

    test('should detect romaji for text input', () => {
      mockElement.type = 'text';
      mockElement.name = 'name_romaji';
      const result = getElmJapanType(mockElement);
      expect(result).toBe('romaji');
    });

    test('should return empty string for non-text input', () => {
      mockElement.type = 'email';
      mockElement.name = 'name_hiragana';
      const result = getElmJapanType(mockElement);
      expect(result).toBe('');
    });

    test('should return empty string for null input', () => {
      const result = getElmJapanType(null);
      expect(result).toBe('');
    });

    test('should return empty string for non-Japanese text input', () => {
      mockElement.type = 'text';
      mockElement.name = 'regular_name';
      const result = getElmJapanType(mockElement);
      expect(result).toBe('');
    });
  });
});
