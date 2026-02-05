// helpers/dateHelpers.ts
// Date generation utilities with age range support and multiple format options

import { faker } from './fakerLocale';

// ============ Configuration ============

const DATE_CONFIG = {
  MIN_AGE: 0,
  MAX_AGE: 120,
  DEFAULT_MIN_AGE: 18,
  DEFAULT_MAX_AGE: 65
} as const;

// ============ Types ============

export type DateFormat =
  | 'iso' // YYYY-MM-DD
  | 'us' // MM/DD/YYYY
  | 'eu' // DD/MM/YYYY
  | 'jp' // YYYY年MM月DD日
  | 'compact'; // YYYYMMDD

export interface DateGenerationOptions {
  minAge?: number;
  maxAge?: number;
  format?: DateFormat;
  respectMinMax?: boolean; // Respect input's min/max attributes
}

// ============ Utility Functions ============

/**
 * Clamp age value to valid range
 */
const clampAge = (age: number): number => {
  return Math.max(DATE_CONFIG.MIN_AGE, Math.min(age, DATE_CONFIG.MAX_AGE));
};

/**
 * Format date according to specified format
 */
const formatDate = (date: Date, format: DateFormat): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  switch (format) {
    case 'iso':
      return `${year}-${month}-${day}`;
    case 'us':
      return `${month}/${day}/${year}`;
    case 'eu':
      return `${day}/${month}/${year}`;
    case 'jp':
      return `${year}年${month}月${day}日`;
    case 'compact':
      return `${year}${month}${day}`;
    default:
      return `${year}-${month}-${day}`;
  }
};

/**
 * Parse min/max date string to Date object
 */
const parseInputDate = (dateStr: string | null): Date | null => {
  if (!dateStr) return null;

  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Generate a random date between two dates
 */
const randomDateBetween = (minDate: Date, maxDate: Date): Date => {
  // Ensure minDate <= maxDate
  if (minDate > maxDate) {
    [minDate, maxDate] = [maxDate, minDate];
  }

  const minTime = minDate.getTime();
  const maxTime = maxDate.getTime();
  const randomTime = minTime + Math.random() * (maxTime - minTime);

  return new Date(randomTime);
};

// ============ Main Functions ============

/**
 * Generate a birthdate within the specified age range
 * @param minAge - Minimum age (default: 18)
 * @param maxAge - Maximum age (default: 65)
 * @param options - Additional options including format
 * @returns Date string in specified format (default: ISO)
 */
export function generateBirthdate(
  minAge: number | DateGenerationOptions = DATE_CONFIG.DEFAULT_MIN_AGE,
  maxAge: number = DATE_CONFIG.DEFAULT_MAX_AGE
): string {
  // Handle options object as first parameter
  let options: DateGenerationOptions = {};
  let actualMinAge: number = DATE_CONFIG.DEFAULT_MIN_AGE;
  let actualMaxAge: number = DATE_CONFIG.DEFAULT_MAX_AGE;

  if (typeof minAge === 'object') {
    options = minAge;
    actualMinAge = options.minAge ?? DATE_CONFIG.DEFAULT_MIN_AGE;
    actualMaxAge = options.maxAge ?? DATE_CONFIG.DEFAULT_MAX_AGE;
  } else {
    actualMinAge = minAge;
    actualMaxAge = maxAge;
  }

  const format = options.format ?? 'iso';

  // Clamp and validate age range
  const min = clampAge(actualMinAge);
  const max = clampAge(Math.max(actualMinAge, actualMaxAge));

  const today = new Date();

  // Calculate the date range for valid birthdates
  // For minAge: The person must be AT LEAST minAge years old
  // So their birthdate must be AT MOST (today - minAge years)
  const latestBirthdate = new Date(today.getFullYear() - min, today.getMonth(), today.getDate());

  // For maxAge: The person must be AT MOST maxAge years old
  // So their birthdate must be AT LEAST (today - maxAge years - 1 day before next birthday)
  const earliestBirthdate = new Date(
    today.getFullYear() - max - 1,
    today.getMonth(),
    today.getDate() + 1
  );

  // Generate random date in range
  const birthdate = randomDateBetween(earliestBirthdate, latestBirthdate);

  return formatDate(birthdate, format);
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
 * Generate birth month (1-12)
 */
export function generateBirthMonth(minAge = 18, maxAge = 65): string {
  const birthdate = generateBirthdate(minAge, maxAge);
  return birthdate.split('-')[1] ?? '';
}

/**
 * Generate birth day (1-31)
 */
export function generateBirthDay(minAge = 18, maxAge = 65): string {
  const birthdate = generateBirthdate(minAge, maxAge);
  return birthdate.split('-')[2] ?? '';
}

/**
 * Generate a date respecting input's min/max constraints
 */
export function generateConstrainedDate(
  input: HTMLInputElement,
  options: DateGenerationOptions = {}
): string {
  const { format = 'iso' } = options;

  const minDate = parseInputDate(input.min);
  const maxDate = parseInputDate(input.max);

  let resultDate: Date;

  if (minDate && maxDate) {
    resultDate = randomDateBetween(minDate, maxDate);
  } else if (minDate) {
    // Generate date between min and 10 years from min
    const maxFallback = new Date(minDate);
    maxFallback.setFullYear(maxFallback.getFullYear() + 10);
    resultDate = randomDateBetween(minDate, maxFallback);
  } else if (maxDate) {
    // Generate date between 10 years before max and max
    const minFallback = new Date(maxDate);
    minFallback.setFullYear(minFallback.getFullYear() - 10);
    resultDate = randomDateBetween(minFallback, maxDate);
  } else {
    // No constraints, use default behavior
    resultDate = faker.date.past({ years: 5 });
  }

  return formatDate(resultDate, format);
}

// ============ Field Detection ============

/**
 * Birthdate field patterns in multiple languages
 */
const BIRTHDATE_PATTERNS = [
  // English
  'birth',
  'birthday',
  'birthdate',
  'dob',
  'dateofbirth',
  'date_of_birth',
  'date-of-birth',
  'bday',
  'born',
  // Japanese
  '生年月日',
  '誕生日',
  '生年',
  // Chinese
  '出生日期',
  '生日',
  // Korean
  '생년월일',
  '생일',
  // Vietnamese
  'ngày sinh',
  'ngaysinh',
  // Spanish
  'fecha de nacimiento',
  'fechanacimiento',
  'nacimiento',
  // French
  'date de naissance',
  'datenaissance',
  'naissance',
  // German
  'geburtsdatum',
  'geburtstag',
  // Portuguese
  'data de nascimento',
  'nascimento',
  // Italian
  'data di nascita',
  // Arabic
  'تاريخ الميلاد',
  // Russian
  'дата рождения',
  // Polish
  'data urodzenia'
];

/**
 * Check if a field is likely a birthdate/DOB field
 * @param element - The form element to check (input or select)
 * @returns true if the field appears to be a birthdate field
 */
export function isBirthdateField(
  element: HTMLInputElement | HTMLSelectElement | HTMLElement
): boolean {
  const name = (element.getAttribute('name') || '').toLowerCase();
  const id = (element.id || '').toLowerCase();
  const placeholder = (element.getAttribute('placeholder') || '').toLowerCase();
  const ariaLabel = (element.getAttribute('aria-label') || '').toLowerCase();
  const autocomplete = (element.getAttribute('autocomplete') || '').toLowerCase();

  // Check autocomplete attribute (very reliable)
  if (autocomplete.includes('bday') || autocomplete.includes('birthday')) {
    return true;
  }

  // Get label text if available
  let labelText = '';
  if ('labels' in element && element.labels) {
    labelText = Array.from(element.labels)
      .map(l => l.textContent?.toLowerCase() || '')
      .join(' ');
  }

  const combinedText = `${name} ${id} ${placeholder} ${ariaLabel} ${labelText}`;

  return BIRTHDATE_PATTERNS.some(pattern => combinedText.includes(pattern));
}

/**
 * Check if element is a year select for birthdate
 */
export function isBirthYearSelect(element: HTMLSelectElement): boolean {
  if (element.tagName !== 'SELECT') return false;

  const name = (element.name || '').toLowerCase();
  const id = (element.id || '').toLowerCase();

  // Check if it's explicitly a year field
  if (/(birth|bday|dob).*year|year.*(birth|bday|dob)/i.test(name + id)) {
    return true;
  }

  // Check options - birth year selects typically have years from ~1920 to current
  const options = Array.from(element.options);
  if (options.length < 20) return false;

  const yearValues = options
    .map(opt => parseInt(opt.value, 10))
    .filter(v => !isNaN(v) && v >= 1900 && v <= new Date().getFullYear());

  return yearValues.length >= 20;
}

/**
 * Get age-appropriate date based on field context
 * @param input - The input element
 * @param minAge - Minimum age from settings
 * @param maxAge - Maximum age from settings
 * @param options - Additional options
 * @returns Appropriate date string
 */
export function getContextualDate(
  input: HTMLInputElement,
  minAge?: number,
  maxAge?: number,
  options: DateGenerationOptions = {}
): string {
  const { format = 'iso', respectMinMax = true } = options;

  // Check if input has min/max constraints
  if (respectMinMax && (input.min || input.max)) {
    return generateConstrainedDate(input, { format });
  }

  // Check if this is a birthdate field
  if (isBirthdateField(input)) {
    return generateBirthdate({
      minAge: minAge ?? DATE_CONFIG.DEFAULT_MIN_AGE,
      maxAge: maxAge ?? DATE_CONFIG.DEFAULT_MAX_AGE,
      format
    });
  }

  // For other date fields, generate a recent past date
  const pastDate = faker.date.past({ years: 5 });
  return formatDate(pastDate, format);
}

/**
 * Detect date format from input pattern or locale
 */
export function detectDateFormat(input: HTMLInputElement): DateFormat {
  const pattern = input.pattern || '';
  const placeholder = input.placeholder || '';

  // Check placeholder hints
  if (/mm\/dd/i.test(placeholder)) return 'us';
  if (/dd\/mm/i.test(placeholder)) return 'eu';
  if (/yyyy年/i.test(placeholder) || /年月日/.test(placeholder)) return 'jp';

  // Check pattern hints
  if (/\d{2}\/\d{2}\/\d{4}/.test(pattern)) {
    // Ambiguous, default to ISO
    return 'iso';
  }

  // Check HTML lang attribute
  const lang = document.documentElement.lang || navigator.language || 'en';
  if (lang.startsWith('ja') || lang.startsWith('zh')) return 'jp';
  if (lang.startsWith('en-US')) return 'us';
  if (/^(de|fr|es|it|pt|nl)/.test(lang)) return 'eu';

  return 'iso';
}
