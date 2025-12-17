// inputFillers.ts
import { faker, lang } from '../helpers/fakerLocale';
import {
  generateRandomHiraganaName,
  generateRandomKatakanaName,
  generateRandomRomajiName
} from '../helpers/japaneseNameGenerators';
import {
  generateBirthdate,
  generateBirthdateTime,
  generateBirthYear
} from '../helpers/dateHelpers';

type InputLabel = string;

type JapanLabel = string;

// Settings context for date generation
interface InputFillerContext {
  minAge?: number;
  maxAge?: number;
}

// Global context that can be set by fillInputs
let fillerContext: InputFillerContext = {};

/**
 * Set the context for input generation (called from fillInputs)
 */
export function setInputFillerContext(context: InputFillerContext): void {
  fillerContext = context;
}

function generateInputValue(
  label: InputLabel,
  input: HTMLInputElement,
  japanLabel: JapanLabel
): string {
  switch (label) {
  case 'username':
    return faker.internet.username();
  case 'name': {
    let value = faker.person.fullName();
    if (lang === 'ja') {
      if (japanLabel === 'hiragana') {
        value = generateRandomHiraganaName(3, 5);
      } else if (japanLabel === 'katakana') {
        value = generateRandomKatakanaName(3, 5);
      } else if (japanLabel === 'romaji') {
        value = generateRandomRomajiName(3, 5);
      }
      // If no specific script detected but locale is Japanese, use regular faker names
      // The faker already has Japanese names loaded
    }
    return value;
  }
  case 'first_name': {
    let value = faker.person.firstName();
    if (lang === 'ja') {
      if (japanLabel === 'hiragana') {
        value = generateRandomHiraganaName(2, 3);
      } else if (japanLabel === 'katakana') {
        value = generateRandomKatakanaName(2, 3);
      } else if (japanLabel === 'romaji') {
        value = generateRandomRomajiName(2, 4);
      }
      // If no specific script detected but locale is Japanese, use regular faker names
      // The faker already has Japanese names loaded
    }
    return value;
  }
  case 'last_name': {
    let value = faker.person.lastName();
    if (lang === 'ja') {
      if (japanLabel === 'hiragana') {
        value = generateRandomHiraganaName(2, 3);
      } else if (japanLabel === 'katakana') {
        value = generateRandomKatakanaName(2, 3);
      } else if (japanLabel === 'romaji') {
        value = generateRandomRomajiName(2, 4);
      }
      // If no specific script detected but locale is Japanese, use regular faker names
      // The faker already has Japanese names loaded
    }
    return value;
  }
  case 'email':
    return faker.internet.email({
      provider: ['mailinator.com', 'yopmail.com', 'maildrop.cc'][Math.floor(Math.random() * 3)]
    });
  case 'phone':
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
    return faker.number.int({ min: 1, max: 31 }).toString().padStart(2, '0');
  case 'date':
    return faker.date.past({ years: 20 }).toISOString().split('T')[0] ?? '';
  case 'birthdate':
    return generateBirthdate(fillerContext.minAge, fillerContext.maxAge);
  case 'time':
    return faker.date.recent({ days: 1 }).toTimeString().split(' ')[0] ?? '';
  case 'url':
    return faker.internet.url();
  case 'po_box':
    return faker.location.zipCode();
  case 'color':
    return faker.color.rgb({ format: 'hex' });
  case 'company':
    return faker.company.name();
  case 'job_title':
    return faker.person.jobTitle();
  case 'address':
    return faker.location.streetAddress();
  case 'week':
    return faker.date.weekday({ context: true }).toLowerCase();
  case 'datetime-local':
    return faker.date.recent({ days: 1 }).toISOString().slice(0, 16);
  case 'birthdate_datetime':
    return generateBirthdateTime(fillerContext.minAge, fillerContext.maxAge);
  case 'colorpicker':
    return faker.color.rgb({ format: 'hex' });
  case 'password': {
    // Check if default password is set in settings (will be passed via context)
    // For now, return memorable password, will be overridden in fillInputs if default is set
    return faker.internet.password({
      length: 12,
      memorable: true,
      pattern: /[a-zA-Z0-9!@#$%^&*()_+]/
    });
  }
  case 'tel':
    return faker.phone.number({ style: 'international' });
  case 'datetime':
    return faker.date.recent({ days: 1 }).toISOString().slice(0, 19);
  case 'ip_address':
    return faker.internet.ipv4();
  case 'mac_address':
    return faker.internet.mac();
  case 'credit_card':
    return faker.finance.creditCardNumber();
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
    return faker.finance.amount({ min: 1, max: 1000, dec: 2 });
  case 'latitude':
    return faker.location.latitude({ min: -90, max: 90 }).toString();
  case 'longitude':
    return faker.location.longitude({ min: -180, max: 180 }).toString();
  case 'account_name':
    return faker.finance.accountName();
  case 'account_number':
    return faker.finance.accountNumber();
  case 'amount':
    return faker.finance.amount({ min: 1, max: 1000, dec: 2 });
  case 'credit_card_cvv':
    return faker.finance.creditCardCVV();
  case 'sex':
    return faker.person.sex();
  default:
    if (input.type === 'text') {
      return faker.lorem.words({ min: 1, max: 5 });
    }
    if (input.type === 'number') {
      const min = input.min ? parseInt(input.min) : 1;
      let max = input.max ? parseInt(input.max) : 1000;
      if (max <= min) {
        max = min + 500;
      }
      return String(faker.number.int({ min: min, max: max }));
    }
    return faker.lorem.sentence({ min: 1, max: 5 });
  }
}

export { generateInputValue };
export type { InputLabel, JapanLabel, InputFillerContext };
