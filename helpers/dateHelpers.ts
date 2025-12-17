// helpers/dateHelpers.ts
// Date generation utilities with age range support

import { faker } from './fakerLocale';

/**
 * Generate a birthdate within the specified age range
 * @param minAge - Minimum age (default: 18)
 * @param maxAge - Maximum age (default: 65)
 * @returns Date string in ISO format (YYYY-MM-DD)
 */
export function generateBirthdate(minAge = 18, maxAge = 65): string {
  // Ensure valid range
  const min = Math.max(0, Math.min(minAge, 120));
  const max = Math.max(min, Math.min(maxAge, 120));

  const today = new Date();
  const currentYear = today.getFullYear();

  // Calculate date range
  const maxDate = new Date(currentYear - min, today.getMonth(), today.getDate());
  const minDate = new Date(currentYear - max - 1, today.getMonth(), today.getDate() + 1);

  // Generate random date between min and max
  const randomDate = faker.date.between({ from: minDate, to: maxDate });

  return randomDate.toISOString().split('T')[0] ?? '';
}

/**
 * Generate a birthdate for datetime-local inputs
 * @param minAge - Minimum age (default: 18)
 * @param maxAge - Maximum age (default: 65)
 * @returns DateTime string in format YYYY-MM-DDTHH:mm
 */
export function generateBirthdateTime(minAge = 18, maxAge = 65): string {
  const birthdate = generateBirthdate(minAge, maxAge);
  // Add a random time
  const hours = faker.number.int({ min: 0, max: 23 }).toString().padStart(2, '0');
  const minutes = faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0');
  return `${birthdate}T${hours}:${minutes}`;
}

/**
 * Generate year from birthdate
 * @param minAge - Minimum age (default: 18)
 * @param maxAge - Maximum age (default: 65)
 * @returns Year string
 */
export function generateBirthYear(minAge = 18, maxAge = 65): string {
  const birthdate = generateBirthdate(minAge, maxAge);
  return birthdate.split('-')[0] ?? '';
}

/**
 * Check if a field is likely a birthdate/DOB field
 * @param input - The input element to check
 * @returns true if the field appears to be a birthdate field
 */
export function isBirthdateField(input: HTMLInputElement): boolean {
  const name = (input.name || '').toLowerCase();
  const id = (input.id || '').toLowerCase();
  const placeholder = (input.placeholder || '').toLowerCase();
  const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();
  const label = input.labels?.[0]?.textContent?.toLowerCase() || '';

  const birthdatePatterns = [
    'birth',
    'birthday',
    'birthdate',
    'dob',
    'dateofbirth',
    'date_of_birth',
    'date-of-birth',
    'bday',
    'born',
    '生年月日', // Japanese
    '出生日期', // Chinese
    '생년월일', // Korean
    'ngày sinh', // Vietnamese
    'fecha de nacimiento', // Spanish
    'date de naissance', // French
    'geburtsdatum', // German
    'تاريخ الميلاد', // Arabic
    'дата рождения', // Russian
    'data urodzenia' // Polish
  ];

  const combinedText = `${name} ${id} ${placeholder} ${ariaLabel} ${label}`;

  return birthdatePatterns.some(pattern => combinedText.includes(pattern));
}

/**
 * Get age-appropriate date based on field context
 * @param input - The input element
 * @param minAge - Minimum age from settings
 * @param maxAge - Maximum age from settings
 * @returns Appropriate date string
 */
export function getContextualDate(
  input: HTMLInputElement,
  minAge?: number,
  maxAge?: number
): string {
  if (isBirthdateField(input)) {
    return generateBirthdate(minAge ?? 18, maxAge ?? 65);
  }

  // For other date fields, use faker's default date generation
  return faker.date.past({ years: 20 }).toISOString().split('T')[0] ?? '';
}
