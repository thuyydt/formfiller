// inputFillers.ts
// Generates fake data for form input fields based on detected field type
import { faker, lang } from '../helpers/fakerLocale';
import {
  generateFullName as generateJapaneseFullName,
  generateGivenName as generateJapaneseGivenName,
  generateSurname as generateJapaneseSurname
} from '../helpers/japaneseNameGenerators';
import type { NameFormat } from '../helpers/japaneseNameGenerators';
import {
  generateBirthdate,
  generateBirthdateTime,
  generateBirthYear
} from '../helpers/dateHelpers';

// ============ Types ============

/**
 * Supported field types for input generation
 */
type FieldType =
  | 'username'
  | 'name'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'phone'
  | 'tel'
  | 'country'
  | 'city'
  | 'building'
  | 'room_number'
  | 'zip'
  | 'postal_code'
  | 'state'
  | 'year'
  | 'birth_year'
  | 'month'
  | 'birth_month'
  | 'day'
  | 'birth_day'
  | 'date'
  | 'birthdate'
  | 'time'
  | 'url'
  | 'po_box'
  | 'color'
  | 'colorpicker'
  | 'company'
  | 'job_title'
  | 'address'
  | 'week'
  | 'datetime-local'
  | 'datetime'
  | 'birthdate_datetime'
  | 'password'
  | 'ip_address'
  | 'mac_address'
  | 'credit_card'
  | 'credit_card_cvv'
  | 'credit_card_expiry'
  | 'emoji'
  | 'user_agent'
  | 'currency'
  | 'currency_code'
  | 'currency_name'
  | 'price'
  | 'latitude'
  | 'longitude'
  | 'coordinates'
  | 'account_name'
  | 'account_number'
  | 'amount'
  | 'sex'
  | 'age'
  | 'number'
  | 'text'
  | 'description';

type InputLabel = string;
type JapanLabel = 'hiragana' | 'katakana' | 'romaji' | '';

/**
 * Settings context for data generation
 */
interface InputFillerContext {
  minAge?: number;
  maxAge?: number;
  defaultPassword?: string;
  emailProviders?: string[];
}

// ============ Configuration ============

const DEFAULT_EMAIL_PROVIDERS = ['mailinator.com', 'yopmail.com', 'maildrop.cc'];

// ============ Context Management ============

// Context that can be set by fillInputs
let fillerContext: InputFillerContext = {};

/**
 * Set the context for input generation (called from fillInputs)
 */
export function setInputFillerContext(context: InputFillerContext): void {
  fillerContext = { ...fillerContext, ...context };
}

/**
 * Reset the context to defaults
 */
export function resetInputFillerContext(): void {
  fillerContext = {};
}

// ============ Helper Functions ============

/**
 * Generate a Japanese name based on the script type
 * @param japanLabel - 'hiragana', 'katakana', 'romaji', or ''
 * @param nameType - 'full', 'given', or 'surname'
 * @param fallbackFn - Function to call if not Japanese locale
 */
function generateJapaneseName(
  japanLabel: JapanLabel,
  nameType: 'full' | 'given' | 'surname',
  fallbackFn: () => string
): string {
  if (!japanLabel) {
    return fallbackFn();
  }

  // Map JapanLabel to NameFormat
  const format: NameFormat = japanLabel as NameFormat;

  switch (nameType) {
    case 'full':
      return generateJapaneseFullName(format);
    case 'given':
      return generateJapaneseGivenName(format);
    case 'surname':
      return generateJapaneseSurname(format);
    default:
      return fallbackFn();
  }
}

/**
 * Get a random email provider from config or defaults
 */
function getRandomEmailProvider(): string {
  const providers = fillerContext.emailProviders ?? DEFAULT_EMAIL_PROVIDERS;
  return providers[Math.floor(Math.random() * providers.length)] ?? 'mailinator.com';
}

/**
 * Parse numeric constraint from input attribute
 */
function parseNumericConstraint(value: string | null, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Generate a number respecting input constraints
 */
function generateConstrainedNumber(input: HTMLInputElement): string {
  const min = parseNumericConstraint(input.min, 1);
  let max = parseNumericConstraint(input.max, 1000);
  const step = parseNumericConstraint(input.step, 1);

  if (max <= min) {
    max = min + 500;
  }

  // Generate a value that respects the step
  const range = max - min;
  const steps = Math.floor(range / step);
  const randomSteps = faker.number.int({ min: 0, max: steps });
  const value = min + randomSteps * step;

  return String(Math.min(value, max));
}

/**
 * Generate text respecting length constraints
 */
function generateConstrainedText(input: HTMLInputElement, minWords = 1, maxWords = 5): string {
  const minLength = parseNumericConstraint(input.minLength?.toString() ?? null, 0);
  const maxLength = parseNumericConstraint(input.maxLength?.toString() ?? null, 500);

  let text = faker.lorem.words({ min: minWords, max: maxWords });

  // Ensure minimum length
  while (text.length < minLength && text.length < 500) {
    text += ' ' + faker.lorem.word();
  }

  // Truncate if exceeds max length
  if (maxLength > 0 && text.length > maxLength) {
    text = text.substring(0, maxLength).trim();
  }

  return text;
}

// ============ Main Generator Function ============

// ============ Main Generator Function ============

function generateInputValue(
  label: InputLabel,
  input: HTMLInputElement,
  japanLabel: JapanLabel
): string {
  switch (label) {
    case 'username':
      return faker.internet.username();

    case 'name':
      if (lang === 'ja' && japanLabel) {
        return generateJapaneseName(japanLabel, 'full', () => faker.person.fullName());
      }
      return faker.person.fullName();

    case 'first_name':
      if (lang === 'ja' && japanLabel) {
        return generateJapaneseName(japanLabel, 'given', () => faker.person.firstName());
      }
      return faker.person.firstName();

    case 'last_name':
      if (lang === 'ja' && japanLabel) {
        return generateJapaneseName(japanLabel, 'surname', () => faker.person.lastName());
      }
      return faker.person.lastName();

    case 'email':
      return faker.internet.email({ provider: getRandomEmailProvider() });

    case 'phone':
    case 'tel':
      return faker.phone.number({ style: 'international' });

    case 'country':
      return faker.location.country();

    case 'city':
      return faker.location.city();

    case 'building':
      return faker.location.buildingNumber();

    case 'room_number':
      return faker.location.secondaryAddress();

    case 'zip':
    case 'postal_code':
      return faker.location.zipCode();

    case 'state':
      return faker.location.state();

    case 'year':
      return faker.date.past({ years: 20 }).getFullYear().toString();

    case 'birth_year':
      return generateBirthYear(fillerContext.minAge, fillerContext.maxAge);

    case 'month':
    case 'birth_month':
      return faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0');

    case 'day':
    case 'birth_day':
      return faker.number.int({ min: 1, max: 28 }).toString().padStart(2, '0');

    case 'date':
      return faker.date.past({ years: 20 }).toISOString().split('T')[0] ?? '';

    case 'birthdate':
      return generateBirthdate(fillerContext.minAge, fillerContext.maxAge);

    case 'time':
      return faker.date.recent({ days: 1 }).toTimeString().split(' ')[0] ?? '';

    case 'url':
      return faker.internet.url();

    case 'po_box':
      return `PO Box ${faker.number.int({ min: 100, max: 9999 })}`;

    case 'color':
    case 'colorpicker':
      return faker.color.rgb({ format: 'hex' });

    case 'company':
      return faker.company.name();

    case 'job_title':
      return faker.person.jobTitle();

    case 'address':
      return faker.location.streetAddress();

    case 'week': {
      // Format: YYYY-Www (e.g., 2024-W05)
      const date = faker.date.recent({ days: 30 });
      const year = date.getFullYear();
      const week = Math.ceil(
        (date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
      return `${year}-W${week.toString().padStart(2, '0')}`;
    }

    case 'datetime-local':
      return faker.date.recent({ days: 7 }).toISOString().slice(0, 16);

    case 'datetime':
      return faker.date.recent({ days: 7 }).toISOString().slice(0, 19);

    case 'birthdate_datetime':
      return generateBirthdateTime(fillerContext.minAge, fillerContext.maxAge);

    case 'password':
      if (fillerContext.defaultPassword) {
        return fillerContext.defaultPassword;
      }
      return faker.internet.password({
        length: 12,
        memorable: true,
        pattern: /[a-zA-Z0-9!@#$%^&*()_+]/
      });

    case 'ip_address':
      return faker.internet.ipv4();

    case 'mac_address':
      return faker.internet.mac();

    case 'credit_card':
      return faker.finance.creditCardNumber();

    case 'credit_card_cvv':
      return faker.finance.creditCardCVV();

    case 'credit_card_expiry': {
      // Format: MM/YY
      const futureDate = faker.date.future({ years: 5 });
      const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
      const year = futureDate.getFullYear().toString().slice(-2);
      return `${month}/${year}`;
    }

    case 'emoji':
      return faker.internet.emoji();

    case 'user_agent':
      return faker.internet.userAgent();

    case 'currency':
      return faker.finance.currencySymbol();

    case 'currency_code':
      return faker.finance.currencyCode();

    case 'currency_name':
      return faker.finance.currencyName();

    case 'price':
    case 'amount':
      return faker.finance.amount({ min: 1, max: 1000, dec: 2 });

    case 'latitude':
      return faker.location.latitude().toString();

    case 'longitude':
      return faker.location.longitude().toString();

    case 'coordinates':
      return `${faker.location.latitude()}, ${faker.location.longitude()}`;

    case 'account_name':
      return faker.finance.accountName();

    case 'account_number':
      return faker.finance.accountNumber();

    case 'sex':
      return faker.person.sex();

    case 'age': {
      const minAge = fillerContext.minAge ?? 18;
      const maxAge = fillerContext.maxAge ?? 65;
      return faker.number.int({ min: minAge, max: maxAge }).toString();
    }

    case 'number':
      return generateConstrainedNumber(input);

    case 'description':
    case 'text':
      return generateConstrainedText(input, 2, 10);

    default:
      // Handle based on input type attribute
      if (input.type === 'number') {
        return generateConstrainedNumber(input);
      }
      if (input.type === 'text') {
        return generateConstrainedText(input, 1, 5);
      }
      return faker.lorem.sentence({ min: 1, max: 5 });
  }
}

// ============ Exports ============

export { generateInputValue };
export type { InputLabel, JapanLabel, InputFillerContext, FieldType };
