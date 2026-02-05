// tests/helpers/selectTypeDetection.test.ts
import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  detectSelectType,
  selectSmartOption,
  getDetectionConfidence,
  validateSelectedOption
} from '../../helpers/selectTypeDetection';

// Mock DOM elements
const createMockSelect = (
  options: Array<{ value: string; text: string; disabled?: boolean }>,
  attributes: {
    name?: string;
    id?: string;
    'aria-label'?: string;
    className?: string;
  } = {}
): HTMLSelectElement => {
  const select = document.createElement('select');

  // Set attributes
  if (attributes.name) select.name = attributes.name;
  if (attributes.id) select.id = attributes.id;
  if (attributes['aria-label']) select.setAttribute('aria-label', attributes['aria-label']);
  if (attributes.className) select.className = attributes.className;

  // Add options
  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.text = opt.text;
    if (opt.disabled) option.disabled = true;
    select.appendChild(option);
  });

  return select;
};

describe('selectTypeDetection', () => {
  describe('detectSelectType', () => {
    it('should detect country select by name', () => {
      const select = createMockSelect(
        [
          { value: '', text: 'Select country' },
          { value: 'US', text: 'United States' },
          { value: 'UK', text: 'United Kingdom' },
          { value: 'CA', text: 'Canada' }
        ],
        { name: 'country' }
      );

      expect(detectSelectType(select)).toBe('country');
    });

    it('should detect country select by id', () => {
      const select = createMockSelect(
        [
          { value: '', text: 'Choose' },
          { value: 'JP', text: 'Japan' },
          { value: 'VN', text: 'Vietnam' }
        ],
        { id: 'user_country' }
      );

      expect(detectSelectType(select)).toBe('country');
    });

    it('should detect gender select', () => {
      const select = createMockSelect(
        [
          { value: '', text: 'Select' },
          { value: 'M', text: 'Male' },
          { value: 'F', text: 'Female' },
          { value: 'O', text: 'Other' }
        ],
        { name: 'gender' }
      );

      expect(detectSelectType(select)).toBe('gender');
    });

    it('should detect state/province select', () => {
      const select = createMockSelect(
        [
          { value: '', text: 'Select state' },
          { value: 'CA', text: 'California' },
          { value: 'TX', text: 'Texas' },
          { value: 'NY', text: 'New York' }
        ],
        { name: 'state' }
      );

      expect(detectSelectType(select)).toBe('state');
    });

    it('should detect month select', () => {
      const select = createMockSelect(
        [
          { value: '', text: 'Month' },
          { value: '1', text: 'January' },
          { value: '2', text: 'February' },
          { value: '3', text: 'March' }
        ],
        { name: 'birth_month' }
      );

      expect(detectSelectType(select)).toBe('month');
    });

    it('should detect year select', () => {
      const select = createMockSelect(
        [
          { value: '', text: 'Year' },
          { value: '2000', text: '2000' },
          { value: '1999', text: '1999' },
          { value: '1998', text: '1998' }
        ],
        { name: 'birth_year' }
      );

      expect(detectSelectType(select)).toBe('year');
    });

    it('should detect title/salutation select', () => {
      const select = createMockSelect(
        [
          { value: '', text: 'Select' },
          { value: 'mr', text: 'Mr.' },
          { value: 'mrs', text: 'Mrs.' },
          { value: 'ms', text: 'Ms.' }
        ],
        { name: 'title' }
      );

      expect(detectSelectType(select)).toBe('title');
    });

    it('should return unknown for unrecognized select', () => {
      const select = createMockSelect(
        [
          { value: '1', text: 'Option 1' },
          { value: '2', text: 'Option 2' }
        ],
        { name: 'random_field' }
      );

      expect(detectSelectType(select)).toBe('unknown');
    });

    it('should detect language select', () => {
      const select = createMockSelect(
        [
          { value: '', text: 'Select language' },
          { value: 'en', text: 'English' },
          { value: 'es', text: 'Spanish' },
          { value: 'ja', text: 'Japanese' }
        ],
        { name: 'language' }
      );

      expect(detectSelectType(select)).toBe('language');
    });

    it('should detect education level select', () => {
      const select = createMockSelect(
        [
          { value: '', text: 'Select' },
          { value: 'hs', text: 'High School' },
          { value: 'ba', text: 'Bachelor' },
          { value: 'ma', text: 'Master' }
        ],
        { name: 'education' }
      );

      expect(detectSelectType(select)).toBe('education');
    });
  });

  describe('selectSmartOption', () => {
    it('should select a preferred country', () => {
      const select = createMockSelect([
        { value: '', text: 'Select country' },
        { value: 'AF', text: 'Afghanistan' },
        { value: 'US', text: 'United States' },
        { value: 'ZW', text: 'Zimbabwe' }
      ]);

      const result = selectSmartOption(select, 'country');

      expect(result).not.toBeNull();
      expect(result?.option.value).toBe('US');
    });

    it('should skip placeholder options', () => {
      const select = createMockSelect([
        { value: '', text: 'Select gender' },
        { value: '0', text: '-- Choose --' },
        { value: 'M', text: 'Male' },
        { value: 'F', text: 'Female' }
      ]);

      const result = selectSmartOption(select, 'gender');

      expect(result).not.toBeNull();
      expect(['M', 'F']).toContain(result?.option.value);
    });

    it('should skip disabled options', () => {
      const select = createMockSelect([
        { value: '', text: 'Select', disabled: true },
        { value: 'A', text: 'Option A' },
        { value: 'B', text: 'Option B' }
      ]);

      const result = selectSmartOption(select, 'unknown');

      expect(result).not.toBeNull();
      expect(['A', 'B']).toContain(result?.option.value);
    });

    it('should select appropriate year based on age settings', () => {
      const currentYear = new Date().getFullYear();
      const options = [];
      for (let y = currentYear; y >= currentYear - 100; y--) {
        options.push({ value: String(y), text: String(y) });
      }

      const select = createMockSelect(options);
      const result = selectSmartOption(select, 'year', 25, 35);

      expect(result).not.toBeNull();
      const selectedYear = parseInt(result!.option.value);
      expect(selectedYear).toBeGreaterThanOrEqual(currentYear - 35);
      expect(selectedYear).toBeLessThanOrEqual(currentYear - 25);
    });

    it('should return null when no valid options exist', () => {
      const select = createMockSelect([{ value: '', text: 'Select', disabled: true }]);

      const result = selectSmartOption(select, 'unknown');

      expect(result).toBeNull();
    });
  });

  describe('getDetectionConfidence', () => {
    it('should return high confidence for matching name and options', () => {
      const select = createMockSelect(
        [
          { value: '', text: 'Select' },
          { value: 'M', text: 'Male' },
          { value: 'F', text: 'Female' }
        ],
        { name: 'gender' }
      );

      const confidence = getDetectionConfidence(select, 'gender');

      expect(confidence).toBeGreaterThanOrEqual(0.5);
    });

    it('should return 0 for unknown type', () => {
      const select = createMockSelect([{ value: '1', text: 'Option 1' }], { name: 'something' });

      const confidence = getDetectionConfidence(select, 'unknown');

      expect(confidence).toBe(0);
    });
  });

  describe('validateSelectedOption', () => {
    it('should validate year options', () => {
      const validOption = document.createElement('option');
      validOption.value = '1990';
      validOption.text = '1990';

      const invalidOption = document.createElement('option');
      invalidOption.value = '1800';
      invalidOption.text = '1800';

      expect(validateSelectedOption(validOption, 'year')).toBe(true);
      expect(validateSelectedOption(invalidOption, 'year')).toBe(false);
    });

    it('should validate month options', () => {
      const validOption = document.createElement('option');
      validOption.value = '6';
      validOption.text = 'June';

      const invalidOption = document.createElement('option');
      invalidOption.value = '13';
      invalidOption.text = '13';

      expect(validateSelectedOption(validOption, 'month')).toBe(true);
      expect(validateSelectedOption(invalidOption, 'month')).toBe(false);
    });

    it('should validate day options', () => {
      const validOption = document.createElement('option');
      validOption.value = '15';
      validOption.text = '15';

      const invalidOption = document.createElement('option');
      invalidOption.value = '32';
      invalidOption.text = '32';

      expect(validateSelectedOption(validOption, 'day')).toBe(true);
      expect(validateSelectedOption(invalidOption, 'day')).toBe(false);
    });

    it('should validate gender options', () => {
      const validOption = document.createElement('option');
      validOption.value = 'M';
      validOption.text = 'Male';

      const invalidOption = document.createElement('option');
      invalidOption.value = 'xyz';
      invalidOption.text = 'Random';

      expect(validateSelectedOption(validOption, 'gender')).toBe(true);
      expect(validateSelectedOption(invalidOption, 'gender')).toBe(false);
    });

    it('should return true for unknown type', () => {
      const option = document.createElement('option');
      option.value = 'anything';
      option.text = 'Anything';

      expect(validateSelectedOption(option, 'unknown')).toBe(true);
    });
  });
});
