// inputFillers.test.js
import { generateInputValue } from '../../forms/inputFillers';

describe('inputFillers', () => {
  describe('generateInputValue', () => {
    test('should generate username', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('username', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('should generate name', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('name', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate first_name', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('first_name', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate last_name', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('last_name', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate email', () => {
      const mockInput = document.createElement('input');
      mockInput.type = 'email';
      const result = generateInputValue('email', mockInput);

      expect(result).toBeTruthy();
      expect(result).toContain('@');
    });

    test('should generate phone number', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('phone', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate address', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('address', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate city', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('city', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate number within range', () => {
      const mockInput = document.createElement('input');
      mockInput.type = 'number';
      mockInput.min = '10';
      mockInput.max = '20';
      const result = generateInputValue('number', mockInput);

      const value = Number(result);
      expect(value).toBeGreaterThanOrEqual(10);
      expect(value).toBeLessThanOrEqual(20);
    });

    test('should generate company name', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('company', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate URL', () => {
      const mockInput = document.createElement('input');
      mockInput.type = 'url';
      const result = generateInputValue('url', mockInput);

      expect(result).toBeTruthy();
      expect(result).toMatch(/^https?:\/\//);
    });

    test('should generate default text value', () => {
      const mockInput = document.createElement('input');
      mockInput.type = 'text';
      const result = generateInputValue('text', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should handle null input gracefully', () => {
      const mockInput = document.createElement('input');
      mockInput.type = 'text';
      const result = generateInputValue('text', mockInput);
      // Should not throw and return some value
      expect(typeof result).toBe('string');
    });

    test('should handle undefined label', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue(undefined, mockInput);

      expect(typeof result).toBe('string');
    });

    test('should handle empty string label', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('', mockInput);

      expect(typeof result).toBe('string');
    });

    test('should generate color value', () => {
      const mockInput = document.createElement('input');
      mockInput.type = 'color';
      const result = generateInputValue('color', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate country', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('country', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate building number', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('building', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate room_number', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('room_number', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate postal_code', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('postal_code', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate state', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('state', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate year', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('year', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      const year = parseInt(result);
      expect(year).toBeGreaterThan(2000);
      expect(year).toBeLessThanOrEqual(new Date().getFullYear());
    });

    test('should generate month', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('month', mockInput);

      expect(result).toBeTruthy();
      const month = parseInt(result);
      expect(month).toBeGreaterThanOrEqual(1);
      expect(month).toBeLessThanOrEqual(12);
      expect(result.length).toBe(2);
    });

    test('should generate day', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('day', mockInput);

      expect(result).toBeTruthy();
      const day = parseInt(result);
      expect(day).toBeGreaterThanOrEqual(1);
      expect(day).toBeLessThanOrEqual(31);
      expect(result.length).toBe(2);
    });

    test('should generate date', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('date', mockInput);

      expect(result).toBeTruthy();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should generate time', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('time', mockInput);

      expect(result).toBeTruthy();
      expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    test('should generate po_box', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('po_box', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate week', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('week', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate datetime-local', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('datetime-local', mockInput);

      expect(result).toBeTruthy();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });

    test('should generate colorpicker', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('colorpicker', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate password', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('password', mockInput);

      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThanOrEqual(12);
    });

    test('should generate tel', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('tel', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate datetime', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('datetime', mockInput);

      expect(result).toBeTruthy();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    });

    test('should generate ip_address', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('ip_address', mockInput);

      expect(result).toBeTruthy();
      expect(result).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
    });

    test('should generate mac_address', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('mac_address', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate credit_card', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('credit_card', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate emoji', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('emoji', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate user_agent', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('user_agent', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate currency', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('currency', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate currency_code', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('currency_code', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate currency_name', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('currency_name', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate price', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('price', mockInput);

      expect(result).toBeTruthy();
      const price = parseFloat(result);
      expect(price).toBeGreaterThanOrEqual(1);
      expect(price).toBeLessThanOrEqual(1000);
    });

    test('should generate latitude', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('latitude', mockInput);

      expect(result).toBeTruthy();
      const lat = parseFloat(result);
      expect(lat).toBeGreaterThanOrEqual(-90);
      expect(lat).toBeLessThanOrEqual(90);
    });

    test('should generate longitude', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('longitude', mockInput);

      expect(result).toBeTruthy();
      const lon = parseFloat(result);
      expect(lon).toBeGreaterThanOrEqual(-180);
      expect(lon).toBeLessThanOrEqual(180);
    });

    test('should generate account_name', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('account_name', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate account_number', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('account_number', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate amount', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('amount', mockInput);

      expect(result).toBeTruthy();
      const amount = parseFloat(result);
      expect(amount).toBeGreaterThanOrEqual(1);
      expect(amount).toBeLessThanOrEqual(1000);
    });

    test('should generate credit_card_cvv', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('credit_card_cvv', mockInput);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThanOrEqual(3);
    });

    test('should handle number input with max < min', () => {
      const mockInput = document.createElement('input');
      mockInput.type = 'number';
      mockInput.min = '100';
      mockInput.max = '50';
      const result = generateInputValue('unknown', mockInput);

      const value = Number(result);
      expect(value).toBeGreaterThanOrEqual(100);
      expect(value).toBeLessThanOrEqual(600);
    });

    test('should handle number input with no max', () => {
      const mockInput = document.createElement('input');
      mockInput.type = 'number';
      mockInput.min = '50';
      const result = generateInputValue('unknown', mockInput);

      const value = Number(result);
      expect(value).toBeGreaterThanOrEqual(50);
      expect(value).toBeLessThanOrEqual(1000);
    });

    test('should handle number input with no min', () => {
      const mockInput = document.createElement('input');
      mockInput.type = 'number';
      mockInput.max = '100';
      const result = generateInputValue('unknown', mockInput);

      const value = Number(result);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(100);
    });

    // Japanese name generation tests
    test('should generate Japanese name with hiragana when lang is ja', () => {
      // Mock fakerLocale to return 'ja'
      jest.mock('../../helpers/fakerLocale', () => ({
        faker: require('../__mocks__/fakerMock').default,
        lang: 'ja'
      }));

      const mockInput = document.createElement('input');
      const result = generateInputValue('name', mockInput, 'hiragana');

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate Japanese name with katakana when lang is ja', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('name', mockInput, 'katakana');

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate Japanese name with romaji when lang is ja', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('name', mockInput, 'romaji');

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate Japanese first name with hiragana', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('first_name', mockInput, 'hiragana');

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate Japanese first name with katakana', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('first_name', mockInput, 'katakana');

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate Japanese first name with romaji', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('first_name', mockInput, 'romaji');

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate Japanese last name with hiragana', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('last_name', mockInput, 'hiragana');

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate Japanese last name with katakana', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('last_name', mockInput, 'katakana');

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should generate Japanese last name with romaji', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('last_name', mockInput, 'romaji');

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    test('should use default faker name when japanLabel is empty', () => {
      const mockInput = document.createElement('input');
      const result = generateInputValue('name', mockInput, '');

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });
});
