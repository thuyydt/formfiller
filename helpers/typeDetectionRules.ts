// typeDetectionRules.ts
// Centralized configuration for field type detection rules
// This makes it easy to add, modify, or remove detection patterns without touching the logic

/**
 * Detection rule for a specific field type
 */
interface DetectionRule {
  type: string;
  keywords: string[];
  excludeTypes?: string[];
}

/**
 * Detection rules configuration
 * Each rule defines:
 * - type: The field type identifier
 * - keywords: Array of keywords to match in field attributes
 * - excludeTypes: Optional array of types that should exclude this match
 */
interface DetectionRulesConfig {
  textInputTypes: DetectionRule[];
  japaneseTypes: DetectionRule[];
  nativeInputTypes: string[];
  nativeTypeMapping: Record<string, string>;
}

export const detectionRules: DetectionRulesConfig = {
  // Text input field types (checked for type='text' and type='number')
  // NOTE: Order matters! More specific patterns should come before general ones
  textInputTypes: [
    // Email should be checked before address since "address" can match in "email-address"
    {
      type: 'email',
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
      ]
    },
    {
      type: 'username',
      keywords: [
        'username',
        'user_name',
        'loginid',
        'login_id',
        'login',
        'userID',
        'user_id',
        'userid',
        'user',
        'userlogin',
        'user_login',
        'useraccount',
        'user_account'
      ]
    },
    {
      type: 'first_name',
      keywords: ['firstname', 'first_name', 'givenname', 'given_name', 'forename', 'fore_name']
    },
    {
      type: 'last_name',
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
      keywords: [
        'name',
        'full_name',
        'fullname',
        'full_name',
        'yourname',
        'your_name',
        'contactname',
        'contact_name',
        'uname',
        'u_name'
      ],
      excludeTypes: ['first_name', 'last_name'] // Don't match if it's specifically a first/last name
    },
    {
      type: 'phone',
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
      keywords: [
        'city',
        'town',
        'village',
        'locality',
        'localityname',
        'locality_name',
        'district',
        'districtname',
        'district_name',
        'suburb',
        'suburbname',
        'suburb_name',
        'municipality',
        'municipalityname',
        'municipality_name',
        'ward',
        'wardname',
        'ward_name'
      ]
    },
    {
      type: 'building',
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
        'area_code',
        'areacode',
        'pin',
        'pincode',
        'pin_code'
      ]
    },
    {
      type: 'state',
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
        'area',
        'areaname',
        'area_name',
        'division',
        'divisionname',
        'division_name',
        'subdivision',
        'subdivisionname'
      ]
    },
    {
      type: 'birth_year',
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
      keywords: ['year', 'yearnum', 'year_num']
    },
    {
      type: 'birth_month',
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
      keywords: ['month', 'monthnum', 'month_num']
    },
    {
      type: 'birthdate',
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
      keywords: ['date', 'datepicker', 'date_picker']
    },
    {
      type: 'birth_day',
      keywords: ['birth_day', 'dayofbirth', 'day_of_birth', 'dobday', 'dob_day']
    },
    {
      type: 'day',
      keywords: ['day', 'daynum', 'day_num']
    },
    {
      type: 'time',
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
      ]
    },
    {
      type: 'po_box',
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
      keywords: [
        'company',
        'organization',
        'companyname',
        'company_name',
        'businessname',
        'business_name',
        'corporationname',
        'corporation_name'
      ]
    },
    {
      type: 'address',
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
      ]
    },
    {
      type: 'ip_address',
      keywords: ['ipaddress', 'ip_address', 'ipv4', 'ipv6', 'ip']
    },
    {
      type: 'mac_address',
      keywords: ['macaddress', 'mac_address']
    },
    {
      type: 'credit_card',
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
        'debit_card'
      ]
    },
    {
      type: 'credit_card_cvv',
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
      type: 'account_name',
      keywords: ['accountname', 'account_name', 'bankaccountname', 'bank_account_name']
    },
    {
      type: 'account_number',
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
        'bank_account_no'
      ]
    },
    {
      type: 'sex',
      keywords: ['sex', 'gender', 'pers_sex', 'person_sex']
    },
    {
      type: 'number',
      keywords: [
        'age',
        'quantity',
        'count',
        'amount',
        'total',
        'subtotal',
        'price',
        'cost',
        'fee',
        'charge',
        'payment',
        'number',
        'num',
        'qty',
        'qnty'
      ]
    },
    {
      type: 'emoji',
      keywords: ['emoji']
    },
    {
      type: 'user_agent',
      keywords: ['useragent', 'user_agent']
    },
    {
      type: 'currency',
      keywords: ['currency', 'currency_symbol']
    },
    {
      type: 'currency_code',
      keywords: ['currencycode', 'currency_code', 'currency_iso']
    },
    {
      type: 'currency_name',
      keywords: ['currencyname', 'currency_name']
    },
    {
      type: 'price',
      keywords: ['price', 'cost', 'amount', 'total', 'fee', 'charge', 'subtotal']
    },
    {
      type: 'latitude',
      keywords: ['latitude', 'lat']
    },
    {
      type: 'longitude',
      keywords: ['longitude', 'long', 'lng']
    }
  ],

  // Japanese text type detection
  japaneseTypes: [
    {
      type: 'hiragana',
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

/**
 * Helper function to check if a label matches any keyword in a list
 * @param label - The lowercase label text to check
 * @param keywords - Array of keywords to match against
 * @returns boolean
 */
export const matchesKeywords = (label: string, keywords: string[]): boolean => {
  return keywords.some(keyword => label.includes(keyword));
};

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

export type { DetectionRule, DetectionRulesConfig, ElementAttributes };
