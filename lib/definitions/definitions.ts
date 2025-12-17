import type { ColorDefinition } from './color';
import type { CompanyDefinition } from './company';
import type { DateDefinition } from './date';
import type { FinanceDefinition } from './finance';
import type { InternetDefinition } from './internet';
import type { LocationDefinition } from './location';
import type { LoremDefinition } from './lorem';
import type { PersonDefinition } from './person';
import type { PhoneNumberDefinition } from './phone_number';
import type { SystemDefinition } from './system';
import type { WordDefinition } from './word';

/**
 * Wrapper type for all definition categories that will make all properties optional and allow extra properties.
 */
export type LocaleEntry<TCategoryDefinition extends Record<string, unknown>> = {
  [P in keyof TCategoryDefinition]?: TCategoryDefinition[P] | null;
} & Record<string, unknown>; // Unsupported & custom entries

/**
 * The definitions as used by the translations/locales.
 */
export type LocaleDefinition = {
  color?: ColorDefinition;
  company?: CompanyDefinition;
  date?: DateDefinition;
  finance?: FinanceDefinition;
  internet?: InternetDefinition;
  location?: LocationDefinition;
  lorem?: LoremDefinition;
  person?: PersonDefinition;
  phone_number?: PhoneNumberDefinition;
  system?: SystemDefinition;
  word?: WordDefinition;
} & Record<string, Record<string, unknown>>;
