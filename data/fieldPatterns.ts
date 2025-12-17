// data/fieldPatterns.ts
// Training data for AI field detection - extracted patterns from real-world forms
// This serves as the knowledge base for intelligent field type detection

import type { FieldType } from '../types';

/**
 * Training pattern structure
 */
export interface TrainingPattern {
  type: FieldType;
  patterns: string[];
  weight: number; // Confidence weight (0-1)
  contextKeywords?: string[]; // Keywords that often appear near this field
}

/**
 * Training data based on real-world form patterns
 * Weights are determined by pattern specificity and reliability
 */
export const trainingData: TrainingPattern[] = [
  // Email patterns
  {
    type: 'email',
    patterns: [
      'email',
      'mail',
      'e-mail',
      'eml',
      'emailaddress',
      'email_address',
      'correo',
      'correio',
      'electronico'
    ],
    weight: 0.95,
    contextKeywords: ['contact', 'account', 'login', 'register', 'subscribe']
  },

  // Phone patterns - Higher weight and more patterns
  {
    type: 'phone',
    patterns: [
      'phone',
      'tel',
      'mobile',
      'cell',
      'telefon',
      'telefono',
      'telephone',
      'fax',
      'whatsapp',
      'contact_number',
      'contactnumber'
    ],
    weight: 0.94,
    contextKeywords: ['contact', 'call', 'sms', 'number']
  },

  // Name patterns - More specific patterns with higher weights
  {
    type: 'first_name',
    patterns: [
      'firstname',
      'first_name',
      'fname',
      'givenname',
      'given_name',
      'first',
      'nombre',
      'prenom'
    ],
    weight: 0.93,
    contextKeywords: ['personal', 'profile', 'user', 'customer', 'given']
  },

  {
    type: 'last_name',
    patterns: [
      'lastname',
      'last_name',
      'lname',
      'surname',
      'family_name',
      'familyname',
      'last',
      'apellido',
      'nom',
      'family'
    ],
    weight: 0.93,
    contextKeywords: ['personal', 'profile', 'user', 'customer', 'family', 'sur']
  },

  {
    type: 'name',
    patterns: ['name', 'fullname', 'full_name', 'displayname', 'display_name'],
    weight: 0.8,
    contextKeywords: ['your', 'enter', 'please', 'full']
  },

  // Address patterns
  {
    type: 'address',
    patterns: [
      'address',
      'street',
      'addr',
      'streetaddress',
      'street_address',
      'direccion',
      'adresse',
      'line1',
      'line2'
    ],
    weight: 0.91,
    contextKeywords: ['shipping', 'billing', 'home', 'delivery']
  },

  {
    type: 'city',
    patterns: ['city', 'town', 'locality', 'ciudad', 'ville', 'stadt', 'municipality'],
    weight: 0.91,
    contextKeywords: ['address', 'location', 'shipping', 'billing']
  },

  {
    type: 'state',
    patterns: ['state', 'province', 'region', 'prefecture', 'estado', 'provincia'],
    weight: 0.88,
    contextKeywords: ['address', 'location']
  },

  {
    type: 'zip',
    patterns: [
      'zip',
      'zipcode',
      'postal',
      'postcode',
      'postalcode',
      'postal_code',
      'plz',
      'cp',
      'postleitzahl'
    ],
    weight: 0.92,
    contextKeywords: ['code', 'address']
  },

  {
    type: 'country',
    patterns: ['country', 'nationality', 'nation', 'pais', 'pays', 'land', 'countryname'],
    weight: 0.91,
    contextKeywords: ['select', 'choose', 'location']
  },

  // Password and security
  {
    type: 'password',
    patterns: ['password', 'passwd', 'pwd', 'pass', 'contrasena', 'motdepasse'],
    weight: 0.98,
    contextKeywords: ['login', 'security', 'confirm', 'new', 'current']
  },

  {
    type: 'username',
    patterns: [
      'username',
      'user_name',
      'login',
      'userid',
      'user_id',
      'loginid',
      'usuario',
      'user',
      'account',
      'accountname'
    ],
    weight: 0.95,
    contextKeywords: ['account', 'sign', 'login', 'unique']
  },

  // Company
  {
    type: 'company',
    patterns: [
      'company',
      'organization',
      'org',
      'business',
      'employer',
      'empresa',
      'societe',
      'companyname',
      'firm'
    ],
    weight: 0.88,
    contextKeywords: ['work', 'professional', 'employment']
  },

  {
    type: 'job_title',
    patterns: [
      'jobtitle',
      'job_title',
      'jobtitle',
      'position',
      'role',
      'occupation',
      'cargo',
      'poste',
      'jobposition',
      'profession',
      'designation'
    ],
    weight: 0.86,
    contextKeywords: ['work', 'professional', 'current', 'employment', 'job', 'career']
  },

  // Internet
  {
    type: 'url',
    patterns: ['url', 'website', 'site', 'webpage', 'web', 'link', 'sitio'],
    weight: 0.89,
    contextKeywords: ['http', 'www', 'domain']
  },

  // Date
  {
    type: 'birthdate',
    patterns: [
      'dob',
      'birthdate',
      'birthday',
      'birth_date',
      'dateofbirth',
      'date_of_birth',
      'bdate',
      'born',
      '生年月日',
      '出生日期',
      '생년월일'
    ],
    weight: 0.94,
    contextKeywords: ['birth', 'born', 'age']
  },

  {
    type: 'date',
    patterns: ['date', 'fecha', 'datum', 'datepicker'],
    weight: 0.85,
    contextKeywords: ['select', 'pick', 'choose']
  },

  // Number
  {
    type: 'number',
    patterns: ['age', 'quantity', 'qty', 'amount', 'count', 'number', 'num', 'cantidad'],
    weight: 0.8,
    contextKeywords: ['enter', 'input']
  },

  // Color
  {
    type: 'color',
    patterns: ['color', 'colour', 'rgb', 'hex', 'shade', 'paint'],
    weight: 0.87,
    contextKeywords: ['pick', 'select', 'choose']
  },

  // Text (default)
  {
    type: 'text',
    patterns: ['text', 'input', 'field', 'value', 'message', 'comment', 'notes', 'description'],
    weight: 0.5, // Low weight, used as fallback
    contextKeywords: ['enter', 'type', 'write']
  }
];
