// helpers/selectTypeDetection.ts
// Intelligent type detection for select elements
// Provides smart option selection based on field type

import { findClosestLabel } from './labelFinder.js';
import { translateKeywords } from './locale/index.js';
import { logger } from './logger.js';

/**
 * Select field type
 */
export type SelectFieldType =
  | 'country'
  | 'state'
  | 'city'
  | 'gender'
  | 'title' // Mr, Mrs, Ms, etc.
  | 'year'
  | 'month'
  | 'day'
  | 'age'
  | 'language'
  | 'currency'
  | 'timezone'
  | 'industry'
  | 'employment_status'
  | 'education'
  | 'marital_status'
  | 'payment_method'
  | 'card_type'
  | 'quantity'
  | 'rating'
  | 'priority'
  | 'boolean' // Yes/No, True/False
  | 'unknown';

/**
 * Detection rules for select field types
 */
interface SelectDetectionRule {
  type: SelectFieldType;
  nameKeywords: string[];
  optionKeywords?: string[]; // Keywords to look for in option texts
  optionCountRange?: [number, number]; // Expected option count range
}

const selectDetectionRules: SelectDetectionRule[] = [
  // Country
  {
    type: 'country',
    nameKeywords: [
      'country',
      'nation',
      'pais',
      'pays',
      'land',
      'nationality',
      'countrycode',
      'country_code'
    ],
    optionKeywords: [
      'united states',
      'united kingdom',
      'canada',
      'australia',
      'germany',
      'france',
      'japan',
      'china',
      'vietnam',
      'india'
    ],
    optionCountRange: [50, 300]
  },
  // State/Province
  {
    type: 'state',
    nameKeywords: [
      'state',
      'province',
      'region',
      'prefecture',
      'estado',
      'provincia',
      'county',
      'department'
    ],
    optionKeywords: [
      'california',
      'texas',
      'new york',
      'florida',
      'ontario',
      'quebec',
      'tokyo',
      'osaka'
    ],
    optionCountRange: [5, 100]
  },
  // City
  {
    type: 'city',
    nameKeywords: ['city', 'town', 'locality', 'ciudad', 'ville', 'stadt', 'municipality'],
    optionCountRange: [10, 5000]
  },
  // Gender
  {
    type: 'gender',
    nameKeywords: ['gender', 'sex', 'gioi_tinh', 'genero', 'geschlecht', 'sexe'],
    optionKeywords: [
      'male',
      'female',
      'other',
      'prefer not',
      'non-binary',
      'nam',
      'nữ',
      'homme',
      'femme',
      'männlich',
      'weiblich'
    ],
    optionCountRange: [2, 10]
  },
  // Title (Mr, Mrs, Ms)
  {
    type: 'title',
    nameKeywords: ['title', 'prefix', 'salutation', 'honorific', 'anrede'],
    optionKeywords: ['mr', 'mrs', 'ms', 'miss', 'dr', 'prof', 'sir', 'herr', 'frau', 'ông', 'bà'],
    optionCountRange: [2, 15]
  },
  // Year
  {
    type: 'year',
    nameKeywords: ['year', 'birth_year', 'birthyear', 'dob_year', 'ano', 'année', 'jahr'],
    optionCountRange: [10, 150]
  },
  // Month
  {
    type: 'month',
    nameKeywords: ['month', 'birth_month', 'birthmonth', 'dob_month', 'mes', 'mois', 'monat'],
    optionKeywords: [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
      'jan',
      'feb',
      'mar',
      'apr',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec'
    ],
    optionCountRange: [12, 12]
  },
  // Day
  {
    type: 'day',
    nameKeywords: ['day', 'birth_day', 'birthday', 'dob_day', 'dia', 'jour', 'tag'],
    optionCountRange: [28, 31]
  },
  // Age
  {
    type: 'age',
    nameKeywords: ['age', 'tuoi', 'edad', 'alter'],
    optionCountRange: [10, 150]
  },
  // Language
  {
    type: 'language',
    nameKeywords: ['language', 'lang', 'idioma', 'langue', 'sprache', 'ngon_ngu'],
    optionKeywords: [
      'english',
      'spanish',
      'french',
      'german',
      'japanese',
      'chinese',
      'vietnamese',
      'korean',
      'portuguese'
    ],
    optionCountRange: [5, 200]
  },
  // Currency
  {
    type: 'currency',
    nameKeywords: ['currency', 'moneda', 'devise', 'wahrung', 'tien_te'],
    optionKeywords: [
      'usd',
      'eur',
      'gbp',
      'jpy',
      'cny',
      'vnd',
      'aud',
      'cad',
      'dollar',
      'euro',
      'pound',
      'yen'
    ],
    optionCountRange: [10, 200]
  },
  // Timezone
  {
    type: 'timezone',
    nameKeywords: ['timezone', 'time_zone', 'tz', 'zona_horaria', 'fuseau', 'zeitzone'],
    optionKeywords: ['utc', 'gmt', 'est', 'pst', 'cst', 'pdt', 'america/', 'europe/', 'asia/'],
    optionCountRange: [20, 600]
  },
  // Industry
  {
    type: 'industry',
    nameKeywords: ['industry', 'sector', 'industria', 'branche', 'nganh'],
    optionKeywords: ['technology', 'healthcare', 'finance', 'education', 'retail', 'manufacturing'],
    optionCountRange: [10, 100]
  },
  // Employment Status
  {
    type: 'employment_status',
    nameKeywords: [
      'employment',
      'employment_status',
      'work_status',
      'job_status',
      'empleo',
      'emploi'
    ],
    optionKeywords: [
      'employed',
      'unemployed',
      'self-employed',
      'student',
      'retired',
      'full-time',
      'part-time',
      'freelance'
    ],
    optionCountRange: [3, 15]
  },
  // Education Level
  {
    type: 'education',
    nameKeywords: ['education', 'degree', 'qualification', 'educacion', 'bildung', 'hoc_van'],
    optionKeywords: [
      'high school',
      'bachelor',
      'master',
      'doctorate',
      'phd',
      'diploma',
      'college',
      'university',
      'graduate'
    ],
    optionCountRange: [4, 20]
  },
  // Marital Status
  {
    type: 'marital_status',
    nameKeywords: [
      'marital',
      'marital_status',
      'civil_status',
      'relationship',
      'estado_civil',
      'tinh_trang_hon_nhan'
    ],
    optionKeywords: [
      'single',
      'married',
      'divorced',
      'widowed',
      'separated',
      'engaged',
      'domestic'
    ],
    optionCountRange: [3, 10]
  },
  // Payment Method
  {
    type: 'payment_method',
    nameKeywords: ['payment', 'payment_method', 'pay_method', 'pago', 'zahlung', 'thanh_toan'],
    optionKeywords: [
      'credit card',
      'debit card',
      'paypal',
      'bank transfer',
      'cash',
      'crypto',
      'wire'
    ],
    optionCountRange: [3, 15]
  },
  // Card Type
  {
    type: 'card_type',
    nameKeywords: ['card_type', 'cardtype', 'credit_card_type', 'cc_type'],
    optionKeywords: ['visa', 'mastercard', 'amex', 'american express', 'discover', 'jcb', 'diners'],
    optionCountRange: [3, 10]
  },
  // Quantity
  {
    type: 'quantity',
    nameKeywords: [
      'quantity',
      'qty',
      'amount',
      'count',
      'cantidad',
      'quantite',
      'menge',
      'so_luong'
    ],
    optionCountRange: [1, 100]
  },
  // Rating
  {
    type: 'rating',
    nameKeywords: [
      'rating',
      'score',
      'stars',
      'review',
      'calificacion',
      'note',
      'bewertung',
      'danh_gia'
    ],
    optionCountRange: [3, 11]
  },
  // Priority
  {
    type: 'priority',
    nameKeywords: [
      'priority',
      'urgency',
      'importance',
      'prioridad',
      'priorite',
      'prioritat',
      'uu_tien'
    ],
    optionKeywords: ['low', 'medium', 'high', 'urgent', 'critical', 'normal'],
    optionCountRange: [2, 10]
  },
  // Boolean (Yes/No)
  {
    type: 'boolean',
    nameKeywords: ['agree', 'confirm', 'accept', 'subscribe', 'newsletter', 'terms', 'consent'],
    optionKeywords: ['yes', 'no', 'true', 'false', 'có', 'không', 'si', 'oui', 'non', 'ja', 'nein'],
    optionCountRange: [2, 3]
  }
];

/**
 * Get element attributes for detection
 */
interface SelectAttributes {
  name: string;
  id: string;
  label: string;
  placeholder: string;
  ariaLabel: string;
  classList: string;
  optionTexts: string[];
  optionValues: string[];
  optionCount: number;
}

/**
 * Extract attributes from select element
 */
const getSelectAttributes = (
  select: HTMLSelectElement,
  enableLabelMatching?: boolean
): SelectAttributes => {
  const translateAndLower = (text: string): string => {
    return translateKeywords(text).toLowerCase();
  };

  const name = translateAndLower(select.name || '');
  const id = translateAndLower(select.id || '');
  const ariaLabel = translateAndLower(select.getAttribute('aria-label') || '');
  const classList = Array.from(select.classList)
    .map(cls => translateAndLower(cls))
    .join(' ');

  let label = '';
  if (enableLabelMatching) {
    const closestLabel = findClosestLabel(select);
    if (closestLabel) {
      label = translateAndLower(closestLabel);
    }
  }

  // Also check for labels property
  if (!label && select.labels && select.labels.length > 0) {
    const firstLabel = select.labels[0];
    label = translateAndLower(firstLabel?.textContent?.trim() ?? '');
  }

  const placeholder =
    (select as HTMLSelectElement & { placeholder?: string }).placeholder?.toLowerCase() || '';

  const options = Array.from(select.options);
  const optionTexts = options.map(opt => opt.text.toLowerCase().trim());
  const optionValues = options.map(opt => opt.value.toLowerCase().trim());

  return {
    name,
    id,
    label,
    placeholder,
    ariaLabel,
    classList,
    optionTexts,
    optionValues,
    optionCount: options.length
  };
};

/**
 * Check if any attribute matches keywords
 */
const matchesKeywords = (attrs: SelectAttributes, keywords: string[]): boolean => {
  const attributeValues = [
    attrs.name,
    attrs.id,
    attrs.label,
    attrs.placeholder,
    attrs.ariaLabel,
    attrs.classList
  ];

  return keywords.some(keyword => attributeValues.some(attr => attr.includes(keyword)));
};

/**
 * Check if options contain expected keywords
 */
const optionsMatchKeywords = (attrs: SelectAttributes, keywords: string[]): boolean => {
  if (!keywords || keywords.length === 0) return true;

  const allOptionTexts = [...attrs.optionTexts, ...attrs.optionValues].join(' ');

  // Check if at least 2 keywords match (to avoid false positives)
  let matchCount = 0;
  for (const keyword of keywords) {
    if (allOptionTexts.includes(keyword)) {
      matchCount++;
      if (matchCount >= 2) return true;
    }
  }

  return matchCount > 0;
};

/**
 * Check if option count is within expected range
 */
const optionCountInRange = (attrs: SelectAttributes, range?: [number, number]): boolean => {
  if (!range) return true;
  const [min, max] = range;
  return attrs.optionCount >= min && attrs.optionCount <= max;
};

/**
 * Detect the type of a select element
 */
export const detectSelectType = (
  select: HTMLSelectElement,
  enableLabelMatching?: boolean
): SelectFieldType => {
  const attrs = getSelectAttributes(select, enableLabelMatching);

  // Score-based detection
  let bestMatch: SelectFieldType = 'unknown';
  let bestScore = 0;

  for (const rule of selectDetectionRules) {
    let score = 0;

    // Check name/id keywords (highest weight)
    if (matchesKeywords(attrs, rule.nameKeywords)) {
      score += 50;
    }

    // Check option keywords (medium weight)
    if (rule.optionKeywords && optionsMatchKeywords(attrs, rule.optionKeywords)) {
      score += 30;
    }

    // Check option count range (low weight)
    if (rule.optionCountRange && optionCountInRange(attrs, rule.optionCountRange)) {
      score += 20;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = rule.type;
    }
  }

  // Only return detected type if confidence is high enough (at least name keyword matched)
  if (bestScore >= 50) {
    logger.debug(`Detected select type: ${bestMatch} (score: ${bestScore})`, {
      name: attrs.name,
      id: attrs.id,
      optionCount: attrs.optionCount
    });
    return bestMatch;
  }

  return 'unknown';
};

/**
 * Smart option selector based on field type
 * Returns a recommended option or null if no preference
 */
export interface SmartOptionResult {
  option: HTMLOptionElement;
  reason: string;
}

/**
 * Preferred values for different select types
 */
const preferredValues: Record<SelectFieldType, string[]> = {
  country: [
    'united states',
    'united kingdom',
    'canada',
    'australia',
    'germany',
    'japan',
    'vietnam'
  ],
  state: ['california', 'new york', 'texas', 'florida', 'ontario'],
  city: [],
  gender: ['male', 'female', 'nam', 'nữ', 'homme', 'femme', 'männlich', 'other'],
  title: ['mr', 'ms', 'mrs', 'ông', 'bà', 'herr', 'frau'],
  year: [], // Will be generated dynamically
  month: [], // Random is fine
  day: [], // Random is fine
  age: [], // Will be generated dynamically
  language: ['english', 'tiếng việt', 'vietnamese', 'japanese', '日本語'],
  currency: ['usd', 'eur', 'gbp', 'vnd', 'jpy'],
  timezone: ['utc', 'america/new_york', 'america/los_angeles', 'asia/ho_chi_minh', 'asia/tokyo'],
  industry: ['technology', 'information technology', 'software', 'finance', 'healthcare'],
  employment_status: ['employed', 'full-time', 'working'],
  education: ['bachelor', 'master', 'college', 'university', 'graduate'],
  marital_status: ['single', 'married'],
  payment_method: ['credit card', 'paypal', 'bank transfer'],
  card_type: ['visa', 'mastercard'],
  quantity: ['1', '2', '3'],
  rating: ['5', '4'],
  priority: ['medium', 'normal', 'high'],
  boolean: ['yes', 'true', 'có', '1'],
  unknown: []
};

/**
 * Select the best option based on detected field type
 */
export const selectSmartOption = (
  select: HTMLSelectElement,
  fieldType: SelectFieldType,
  minAge?: number,
  maxAge?: number
): SmartOptionResult | null => {
  const options = Array.from(select.options);

  // Filter out disabled and placeholder options
  const validOptions = options.filter(
    opt =>
      !opt.disabled &&
      opt.value &&
      opt.value.trim() !== '' &&
      opt.value !== '0' &&
      !/^(select|choose|pick|--|please)/i.test(opt.text.trim())
  );

  if (validOptions.length === 0) {
    return null;
  }

  // Special handling for year fields (birth year)
  if (fieldType === 'year' || fieldType === 'age') {
    const currentYear = new Date().getFullYear();
    const targetMinYear = currentYear - (maxAge || 60);
    const targetMaxYear = currentYear - (minAge || 18);

    const yearOptions = validOptions.filter(opt => {
      const yearValue = parseInt(opt.value) || parseInt(opt.text);
      return yearValue >= targetMinYear && yearValue <= targetMaxYear;
    });

    if (yearOptions.length > 0) {
      const randomOption = yearOptions[Math.floor(Math.random() * yearOptions.length)];
      return randomOption ? { option: randomOption, reason: 'age-appropriate year' } : null;
    }
  }

  // Try to match preferred values
  const preferred = preferredValues[fieldType];
  if (preferred && preferred.length > 0) {
    const matchingOptions = validOptions.filter(opt => {
      const text = opt.text.toLowerCase().trim();
      const value = opt.value.toLowerCase().trim();
      return preferred.some(pv => text.includes(pv) || value.includes(pv));
    });

    if (matchingOptions.length > 0) {
      const randomOption = matchingOptions[Math.floor(Math.random() * matchingOptions.length)];
      return randomOption ? { option: randomOption, reason: `preferred ${fieldType} value` } : null;
    }
  }

  // Fallback: return a random valid option
  const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)];
  return randomOption ? { option: randomOption, reason: 'random valid option' } : null;
};

/**
 * Validate that a selected option makes sense for the field type
 */
export const validateSelectedOption = (
  option: HTMLOptionElement,
  fieldType: SelectFieldType
): boolean => {
  const text = option.text.toLowerCase();
  const value = option.value.toLowerCase();

  // Type-specific validation
  switch (fieldType) {
    case 'year': {
      const yearValue = parseInt(value) || parseInt(text);
      return yearValue >= 1900 && yearValue <= new Date().getFullYear();
    }
    case 'month': {
      const monthValue = parseInt(value);
      return (
        (monthValue >= 1 && monthValue <= 12) ||
        /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(text)
      );
    }
    case 'day': {
      const dayValue = parseInt(value);
      return dayValue >= 1 && dayValue <= 31;
    }
    case 'gender':
      return /male|female|other|prefer|non-binary|nam|nữ|homme|femme/i.test(text + value);
    default:
      return true;
  }
};

/**
 * Get confidence score for a detected type
 */
export const getDetectionConfidence = (
  select: HTMLSelectElement,
  detectedType: SelectFieldType,
  enableLabelMatching?: boolean
): number => {
  if (detectedType === 'unknown') return 0;

  const attrs = getSelectAttributes(select, enableLabelMatching);
  const rule = selectDetectionRules.find(r => r.type === detectedType);

  if (!rule) return 0;

  let confidence = 0;

  // Name/ID match
  if (matchesKeywords(attrs, rule.nameKeywords)) {
    confidence += 0.5;
  }

  // Option keywords match
  if (rule.optionKeywords && optionsMatchKeywords(attrs, rule.optionKeywords)) {
    confidence += 0.3;
  }

  // Option count match
  if (rule.optionCountRange && optionCountInRange(attrs, rule.optionCountRange)) {
    confidence += 0.2;
  }

  return Math.min(confidence, 1);
};
