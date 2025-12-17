// tests/helpers/dateHelpers.test.js

// Mock faker before importing the module
jest.mock('../../helpers/fakerLocale', () => ({
  faker: {
    date: {
      between: jest.fn(({ from, to }) => {
        // Return a date between from and to
        const fromTime = from.getTime();
        const toTime = to.getTime();
        const midTime = (fromTime + toTime) / 2;
        return new Date(midTime);
      })
    },
    number: {
      int: jest.fn(({ min, max }) => Math.floor((min + max) / 2))
    }
  }
}));

const {
  generateBirthdate,
  generateBirthdateTime,
  generateBirthYear,
  isBirthdateField
} = require('../../helpers/dateHelpers');

describe('dateHelpers', () => {
  describe('generateBirthdate', () => {
    it('should generate a valid date string in YYYY-MM-DD format', () => {
      const result = generateBirthdate(18, 65);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should use default values when no params provided', () => {
      const result = generateBirthdate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should generate dates within the specified age range', () => {
      const minAge = 25;
      const maxAge = 35;
      const result = generateBirthdate(minAge, maxAge);

      const birthYear = parseInt(result.split('-')[0]);
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;

      // Age should be within a reasonable range (accounting for month/day variations)
      expect(age).toBeGreaterThanOrEqual(minAge - 1);
      expect(age).toBeLessThanOrEqual(maxAge + 1);
    });

    it('should handle edge case where minAge > maxAge', () => {
      const result = generateBirthdate(50, 30); // min > max
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should clamp ages to valid range (0-120)', () => {
      const result = generateBirthdate(-5, 200);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('generateBirthdateTime', () => {
    it('should generate a valid datetime string in YYYY-MM-DDTHH:mm format', () => {
      const result = generateBirthdateTime(18, 65);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });

    it('should use default values when no params provided', () => {
      const result = generateBirthdateTime();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });
  });

  describe('generateBirthYear', () => {
    it('should generate a valid year string', () => {
      const result = generateBirthYear(18, 65);
      expect(result).toMatch(/^\d{4}$/);
    });

    it('should generate year within age range', () => {
      const minAge = 20;
      const maxAge = 40;
      const result = generateBirthYear(minAge, maxAge);

      const birthYear = parseInt(result);
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;

      expect(age).toBeGreaterThanOrEqual(minAge - 1);
      expect(age).toBeLessThanOrEqual(maxAge + 1);
    });
  });

  describe('isBirthdateField', () => {
    let mockInput;

    beforeEach(() => {
      mockInput = document.createElement('input');
      mockInput.type = 'text';
    });

    it('should detect birthdate by name attribute', () => {
      mockInput.name = 'birthdate';
      expect(isBirthdateField(mockInput)).toBe(true);
    });

    it('should detect dob by name attribute', () => {
      mockInput.name = 'dob';
      expect(isBirthdateField(mockInput)).toBe(true);
    });

    it('should detect birthday by id attribute', () => {
      mockInput.id = 'birthday';
      expect(isBirthdateField(mockInput)).toBe(true);
    });

    it('should detect dateofbirth by placeholder', () => {
      mockInput.placeholder = 'Enter your date of birth';
      expect(isBirthdateField(mockInput)).toBe(true);
    });

    it('should detect Japanese 生年月日', () => {
      mockInput.name = '生年月日';
      expect(isBirthdateField(mockInput)).toBe(true);
    });

    it('should detect Chinese 出生日期', () => {
      mockInput.name = '出生日期';
      expect(isBirthdateField(mockInput)).toBe(true);
    });

    it('should detect Korean 생년월일', () => {
      mockInput.name = '생년월일';
      expect(isBirthdateField(mockInput)).toBe(true);
    });

    it('should detect Spanish fecha de nacimiento', () => {
      mockInput.placeholder = 'fecha de nacimiento';
      expect(isBirthdateField(mockInput)).toBe(true);
    });

    it('should return false for regular date fields', () => {
      mockInput.name = 'appointment_date';
      expect(isBirthdateField(mockInput)).toBe(false);
    });

    it('should return false for unrelated fields', () => {
      mockInput.name = 'email';
      expect(isBirthdateField(mockInput)).toBe(false);
    });

    it('should detect by aria-label', () => {
      mockInput.setAttribute('aria-label', 'Date of Birth');
      expect(isBirthdateField(mockInput)).toBe(true);
    });
  });
});
