// typeDetectionRules.ts
// Centralized configuration for field type detection rules
// This makes it easy to add, modify, or remove detection patterns without touching the logic

// ============ Types ============

/**
 * Detection rule for a specific field type
 */
interface DetectionRule {
  /** Unique field type identifier */
  type: string;
  /** Keywords to match in field attributes */
  keywords: string[];
  /** Optional array of types that should exclude this match */
  excludeTypes?: string[];
  /** Priority for rule matching (higher = checked first, default 10) */
  priority?: number;
  /** Negative patterns that should NOT match for this type */
  negativeKeywords?: string[];
}

/**
 * Detection rules configuration
 * Each rule defines:
 * - type: The field type identifier
 * - keywords: Array of keywords to match in field attributes
 * - excludeTypes: Optional array of types that should exclude this match
 * - priority: Optional priority for rule matching (higher = checked first)
 * - negativeKeywords: Optional negative patterns that should NOT match
 */
interface DetectionRulesConfig {
  textInputTypes: DetectionRule[];
  japaneseTypes: DetectionRule[];
  nativeInputTypes: string[];
  nativeTypeMapping: Record<string, string>;
}

/**
 * Element attributes used for detection
 */
interface ElementAttributes {
  type: string;
  placeholder: string;
  ariaLabel: string;
  label: string;
  name: string;
  id: string;
  classList: string;
  dataAttributes: string;
  namePart: string;
  idPart: string;
  classPart: string;
  placeholderPart: string;
  ariaLabelPart: string;
  labelPart: string;
  dataAttributesPart: string;
}

// ============ Rules Configuration ============

export const detectionRules: DetectionRulesConfig = {
  // Text input field types (checked for type='text' and type='number')
  // NOTE: Order and priority matters! More specific patterns should have higher priority
  textInputTypes: [
    // Email should be checked before address since "address" can match in "email-address"
    {
      type: 'email',
      priority: 20,
      keywords: [
        'email',
        'emailaddress',
        'email_address',
        'mail',
        'mailaddress',
        'mail_address',
        'e-mail',
        'e_mail',
        'e-mailaddress',
        'e_mail_address'
      ],
      negativeKeywords: ['postal', 'physical', 'street', 'home', 'work']
    },
    {
      type: 'username',
      priority: 15,
      keywords: [
        'username',
        'user_name',
        'loginid',
        'login_id',
        'login',
        'userID',
        'user_id',
        'userid',
        'userlogin',
        'user_login',
        'useraccount',
        'user_account'
      ],
      negativeKeywords: ['name', 'email']
    },
    {
      type: 'first_name',
      priority: 18,
      keywords: ['firstname', 'first_name', 'givenname', 'given_name', 'forename', 'fore_name']
    },
    {
      type: 'last_name',
      priority: 18,
      keywords: [
        'lastname',
        'last_name',
        'surname',
        'sur_name',
        'familyname',
        'family_name',
        'secondname',
        'second_name'
      ]
    },
    {
      type: 'name',
      priority: 10,
      keywords: [
        'name',
        'full_name',
        'fullname',
        'yourname',
        'your_name',
        'contactname',
        'contact_name',
        'uname',
        'u_name'
      ],
      excludeTypes: ['first_name', 'last_name', 'username', 'company']
    },
    {
      type: 'phone',
      priority: 15,
      keywords: [
        'phone',
        'phonenumber',
        'phone_number',
        'tel',
        'telephone',
        'mobile',
        'cell',
        'contactnumber',
        'contact_number',
        'fax',
        'faxnumber',
        'fax_number',
        'whatsappnumber',
        'whatsapp_number',
        'vibernumber',
        'viber_number',
        'wechatnumber',
        'wechat_number',
        'linenumber',
        'line_number',
        'skypenumber',
        'skype_number',
        'telegramnumber',
        'telegram_number',
        'signalnumber',
        'signal_number',
        'callnumber',
        'call_number'
      ]
    },
    {
      type: 'country',
      priority: 12,
      keywords: [
        'country',
        'countryname',
        'country_name',
        'nationality',
        'nationalityname',
        'nationality_name'
      ]
    },
    {
      type: 'city',
      priority: 12,
      keywords: [
        'city',
        'town',
        'village',
        'locality',
        'localityname',
        'locality_name',
        'suburb',
        'suburbname',
        'suburb_name',
        'municipality',
        'municipalityname',
        'municipality_name',
        'ward',
        'wardname',
        'ward_name'
      ],
      negativeKeywords: ['state', 'province', 'region']
    },
    {
      type: 'building',
      priority: 14,
      keywords: [
        'building',
        'buildingname',
        'building_name',
        'apartment',
        'apartmentname',
        'apartment_name',
        'unit',
        'unitname',
        'unit_name',
        'flat',
        'flatname',
        'flat_name',
        'suite',
        'suitename',
        'suite_name',
        'room',
        'roomname',
        'room_name',
        'floor',
        'floorname',
        'floor_name',
        'block',
        'blockname',
        'block_name',
        'house',
        'housename',
        'house_name',
        'condo',
        'condoname',
        'condo_name',
        'villa',
        'villaname',
        'villa_name',
        'residence',
        'residencename',
        'residence_name'
      ]
    },
    {
      type: 'room_number',
      priority: 16,
      keywords: [
        'roomnumber',
        'room_number',
        'roomno',
        'room_no',
        'roomnumbername',
        'room_number_name'
      ]
    },
    {
      type: 'zip',
      priority: 15,
      keywords: [
        'postalcode',
        'postal_code',
        'zipcode',
        'zip_code',
        'postcode',
        'post_code',
        'zip',
        'zipname',
        'zip_name',
        'postal',
        'pin',
        'pincode',
        'pin_code'
      ],
      negativeKeywords: ['area', 'phone']
    },
    {
      type: 'state',
      priority: 12,
      keywords: [
        'state',
        'statename',
        'state_name',
        'province',
        'provincename',
        'province_name',
        'territory',
        'territoryname',
        'territory_name',
        'region',
        'regionname',
        'region_name',
        'county',
        'countyname',
        'county_name',
        'prefecture',
        'prefecturename',
        'prefecture_name',
        'department',
        'departmentname',
        'department_name',
        'district',
        'districtname',
        'district_name',
        'zone',
        'zonename',
        'zone_name',
        'division',
        'divisionname',
        'division_name',
        'subdivision',
        'subdivisionname'
      ],
      negativeKeywords: ['city', 'town', 'locality']
    },
    {
      type: 'birth_year',
      priority: 16,
      keywords: [
        'birthyear',
        'birth_year',
        'byear',
        'b_year',
        'yearofbirth',
        'year_of_birth',
        'dobyear',
        'dob_year'
      ]
    },
    {
      type: 'year',
      priority: 8,
      keywords: ['year', 'yearnum', 'year_num'],
      excludeTypes: ['birth_year']
    },
    {
      type: 'birth_month',
      priority: 16,
      keywords: [
        'birthmonth',
        'birth_month',
        'bmonth',
        'b_month',
        'monthofbirth',
        'month_of_birth',
        'dobmonth',
        'dob_month'
      ]
    },
    {
      type: 'month',
      priority: 8,
      keywords: ['month', 'monthnum', 'month_num'],
      excludeTypes: ['birth_month']
    },
    {
      type: 'birthdate',
      priority: 16,
      keywords: [
        'birthdate',
        'birth_date',
        'dob',
        'dateofbirth',
        'date_of_birth',
        'birthday',
        'bdate',
        'b_date',
        'bday',
        'born',
        'born_date',
        'borndate'
      ]
    },
    {
      type: 'date',
      priority: 8,
      keywords: ['date', 'datepicker', 'date_picker'],
      excludeTypes: ['birthdate']
    },
    {
      type: 'birth_day',
      priority: 16,
      keywords: ['birth_day', 'dayofbirth', 'day_of_birth', 'dobday', 'dob_day']
    },
    {
      type: 'day',
      priority: 8,
      keywords: ['day', 'daynum', 'day_num'],
      excludeTypes: ['birth_day']
    },
    {
      type: 'time',
      priority: 10,
      keywords: [
        'time',
        'timepicker',
        'time_picker',
        'appointmenttime',
        'appointment_time',
        'meetingtime',
        'meeting_time'
      ]
    },
    {
      type: 'url',
      priority: 12,
      keywords: [
        'url',
        'website',
        'web_site',
        'webaddress',
        'web_address',
        'domain',
        'homepage',
        'home_page',
        'webpage',
        'web_page',
        'site',
        'link'
      ],
      negativeKeywords: ['email', 'address']
    },
    {
      type: 'po_box',
      priority: 14,
      keywords: [
        'pobox',
        'po_box',
        'postofficebox',
        'post_office_box',
        'postbox',
        'post_box',
        'po_box_number',
        'po_box_no',
        'poboxnumber',
        'pobox_no',
        'postofficeboxnumber',
        'post_office_box_number'
      ]
    },
    {
      type: 'color',
      priority: 10,
      keywords: [
        'color',
        'colour',
        'hex',
        'hexcode',
        'hex_color',
        'rgb',
        'rgba',
        'hsl',
        'hsla',
        'colorpicker',
        'color_picker',
        'colourpicker',
        'colour_picker'
      ]
    },
    {
      type: 'password',
      priority: 18,
      keywords: [
        'password',
        'pass',
        'passwd',
        'pwd',
        'passphrase',
        'pass_phrase',
        'passwordconfirmation',
        'password_confirmation',
        'confirmpassword',
        'confirm_password',
        'newpassword',
        'new_password',
        'currentpassword',
        'current_password'
      ]
    },
    {
      type: 'company',
      priority: 12,
      keywords: [
        'company',
        'organization',
        'companyname',
        'company_name',
        'businessname',
        'business_name',
        'corporationname',
        'corporation_name',
        'employer',
        'firm',
        'enterprise'
      ]
    },
    {
      type: 'address',
      priority: 10,
      keywords: [
        'address',
        'address1',
        'address_1',
        'addressline',
        'address_line',
        'addressline1',
        'address_line1',
        'address_line_1',
        'street',
        'streetaddress',
        'street_address',
        'streetaddress1',
        'street_address1',
        'street_line',
        'streetline1',
        'residentialaddress',
        'residential_address',
        'mailingaddress',
        'mailing_address',
        'shippingaddress',
        'shipping_address',
        'homeaddress',
        'home_address',
        'workaddress',
        'work_address',
        'officeaddress',
        'office_address',
        'deliveryaddress',
        'delivery_address',
        'locationaddress',
        'location_address',
        'physicaladdress',
        'physical_address',
        'billingaddress',
        'billing_address',
        'address2',
        'address_2',
        'addressline2',
        'address_line2',
        'address_line_2',
        'streetaddress2',
        'street_address2',
        'streetline2',
        'street_line2'
      ],
      excludeTypes: ['email', 'ip_address', 'mac_address']
    },
    {
      type: 'ip_address',
      priority: 14,
      keywords: ['ipaddress', 'ip_address', 'ipv4', 'ipv6', 'ip']
    },
    {
      type: 'mac_address',
      priority: 14,
      keywords: ['macaddress', 'mac_address', 'hwaddr', 'hardware_address']
    },
    {
      type: 'credit_card',
      priority: 16,
      keywords: [
        'creditcard',
        'credit_card',
        'cardnumber',
        'card_number',
        'cardno',
        'card_no',
        'ccnumber',
        'cc_number',
        'ccno',
        'cc_no',
        'cc',
        'debitcard',
        'debit_card',
        'pan'
      ],
      negativeKeywords: ['cvv', 'cvc', 'expir']
    },
    {
      type: 'credit_card_cvv',
      priority: 18,
      keywords: [
        'cvv',
        'cvv2',
        'cardverificationvalue',
        'card_verification_value',
        'cvc',
        'cvc2',
        'cardsecuritycode',
        'card_security_code',
        'securitycode',
        'security_code',
        'cvvcode',
        'cvv_code'
      ]
    },
    {
      type: 'credit_card_expiry',
      priority: 18,
      keywords: [
        'expiry',
        'expiration',
        'exp_date',
        'expirydate',
        'expiry_date',
        'cardexpiry',
        'card_expiry',
        'exp_month',
        'exp_year',
        'mm_yy',
        'mmyy'
      ]
    },
    {
      type: 'account_name',
      priority: 12,
      keywords: [
        'accountname',
        'account_name',
        'bankaccountname',
        'bank_account_name',
        'accountholder'
      ]
    },
    {
      type: 'account_number',
      priority: 12,
      keywords: [
        'accountnumber',
        'account_number',
        'bankaccountnumber',
        'bank_account_number',
        'iban',
        'iban_number',
        'bankaccount',
        'bank_account',
        'bankaccountno',
        'bank_account_no',
        'routingnumber',
        'routing_number',
        'bsb'
      ]
    },
    {
      type: 'sex',
      priority: 10,
      keywords: ['sex', 'gender', 'pers_sex', 'person_sex']
    },
    {
      type: 'age',
      priority: 12,
      keywords: ['age', 'your_age', 'yourage', 'person_age']
    },
    {
      type: 'number',
      priority: 5,
      keywords: [
        'quantity',
        'count',
        'amount',
        'total',
        'subtotal',
        'number',
        'num',
        'qty',
        'qnty'
      ],
      excludeTypes: ['phone', 'credit_card', 'account_number', 'age']
    },
    {
      type: 'emoji',
      priority: 8,
      keywords: ['emoji', 'emoticon']
    },
    {
      type: 'user_agent',
      priority: 8,
      keywords: ['useragent', 'user_agent', 'browser']
    },
    {
      type: 'currency',
      priority: 10,
      keywords: ['currency', 'currency_symbol', 'money_symbol']
    },
    {
      type: 'currency_code',
      priority: 12,
      keywords: ['currencycode', 'currency_code', 'currency_iso', 'iso_currency']
    },
    {
      type: 'currency_name',
      priority: 10,
      keywords: ['currencyname', 'currency_name']
    },
    {
      type: 'price',
      priority: 10,
      keywords: ['price', 'cost', 'fee', 'charge'],
      excludeTypes: ['number']
    },
    {
      type: 'latitude',
      priority: 12,
      keywords: ['latitude', 'lat', 'geo_lat']
    },
    {
      type: 'longitude',
      priority: 12,
      keywords: ['longitude', 'lng', 'geo_lng', 'geo_long']
    },
    {
      type: 'coordinates',
      priority: 10,
      keywords: ['coordinates', 'coords', 'geolocation', 'latlng', 'lat_lng']
    }
  ],

  // Japanese text type detection
  japaneseTypes: [
    {
      type: 'hiragana',
      priority: 15,
      keywords: [
        'hiragana',
        'hiragana_name',
        'ひらがな',
        'ひらがな名前',
        'ひらがな氏名',
        'ひらがな姓',
        'ひらがな名',
        'ひらがなせい',
        'ひらがなめい',
        'ひらがなお名前',
        'ひらがなのお名前',
        'ひらがなでご記入',
        'ひらがなで記入',
        'ふりがな',
        'furi'
      ]
    },
    {
      type: 'katakana',
      priority: 15,
      keywords: [
        'katakana',
        'katakana_name',
        'カタカナ',
        'カタカナ名前',
        'カタカナ氏名',
        'カタカナ姓',
        'カタカナ名',
        'カタカナせい',
        'カタカナめい',
        'カタカナお名前',
        'カタカナのお名前',
        'カタカナでご記入',
        'カタカナで記入',
        'フリガナ',
        'かたかな',
        'カナ',
        'kana'
      ]
    },
    {
      type: 'romaji',
      priority: 15,
      keywords: [
        'romaji',
        'romaji_name',
        'romanized',
        'romanized_name',
        'ローマ字',
        'ローマ字名前',
        'ローマ字氏名',
        'ローマ字姓',
        'ローマ字名',
        'ローマ字せい',
        'ローマ字めい',
        'ローマ字お名前',
        'ローマ字のお名前',
        'ローマ字でご記入',
        'ローマ字で記入',
        'roman',
        'english',
        'alphabet',
        'アルファベット',
        'えいご',
        'えいじ',
        'roma'
      ]
    }
  ],

  // Native HTML input types that map directly to field types
  nativeInputTypes: [
    'email',
    'password',
    'tel',
    'color',
    'month',
    'date',
    'datetime-local',
    'time',
    'url',
    'week',
    'number'
  ],

  // Mapping of native HTML5 input types to normalized field types
  nativeTypeMapping: {
    tel: 'phone'
    // Other types map to themselves
  }
};

// ============ Helper Functions ============

/**
 * Helper function to check if a label matches any keyword in a list
 * @param label - The lowercase label text to check
 * @param keywords - Array of keywords to match against
 * @returns boolean
 */
export const matchesKeywords = (label: string, keywords: string[]): boolean => {
  if (!label) return false;
  return keywords.some(keyword => label.includes(keyword));
};

/**
 * Check if any of the provided attributes match the given keywords
 * @param attrs - Element attributes object
 * @param keywords - Keywords to match
 * @returns boolean
 */
export const matchesAnyAttribute = (attrs: ElementAttributes, keywords: string[]): boolean => {
  // Check both full attributes and parts (last segments after splitting on -, ., [, ])
  // Full attributes are checked first to catch more specific patterns like "email-address"
  const attributesToCheck = [
    attrs.name,
    attrs.id,
    attrs.classList,
    attrs.placeholder,
    attrs.ariaLabel,
    attrs.label,
    attrs.dataAttributes,
    attrs.namePart,
    attrs.idPart,
    attrs.classPart,
    attrs.placeholderPart,
    attrs.ariaLabelPart,
    attrs.labelPart,
    attrs.dataAttributesPart
  ];

  return attributesToCheck.some(attr => matchesKeywords(attr, keywords));
};

/**
 * Check if any attribute matches negative keywords (should NOT match)
 * @param attrs - Element attributes object
 * @param negativeKeywords - Keywords that should NOT be present
 * @returns true if negative keywords are found (should reject this rule)
 */
export const matchesNegativeKeywords = (
  attrs: ElementAttributes,
  negativeKeywords?: string[]
): boolean => {
  if (!negativeKeywords || negativeKeywords.length === 0) return false;
  return matchesAnyAttribute(attrs, negativeKeywords);
};

/**
 * Check if a field type string matches keywords
 * @param fieldType - The detected field type (e.g., 'address', 'email')
 * @param keywords - Keywords to check against
 * @returns boolean
 */
export const isFieldType = (fieldType: string, keywords: string[]): boolean => {
  return matchesKeywords(fieldType, keywords);
};

/**
 * Get keywords for a specific field type
 * @param type - The field type identifier
 * @returns Array of keywords for that type, or empty array if not found
 */
export const getKeywordsForType = (type: string): string[] => {
  const rule = detectionRules.textInputTypes.find(r => r.type === type);
  return rule ? rule.keywords : [];
};

/**
 * Get rule for a specific field type
 * @param type - The field type identifier
 * @returns Detection rule or undefined
 */
export const getRuleForType = (type: string): DetectionRule | undefined => {
  return detectionRules.textInputTypes.find(r => r.type === type);
};

/**
 * Get all rules sorted by priority (highest first)
 * @returns Sorted array of detection rules
 */
export const getRulesByPriority = (): DetectionRule[] => {
  return [...detectionRules.textInputTypes].sort((a, b) => (b.priority ?? 10) - (a.priority ?? 10));
};

// ============ Exports ============

export type { DetectionRule, DetectionRulesConfig, ElementAttributes };
