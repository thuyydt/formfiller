// types.ts - Central type definitions for Form Filler Extension

/**
 * Settings for form filling behavior
 */
export interface FormFillerSettings {
  locale?: string;
  ignoreFields?: string;
  ignoreHidden?: boolean;
  ignoreFilled?: boolean;
  ignoreDomains?: string;
  customFields?: CustomField[];
  enableLabelMatching?: boolean;
  enableSound?: boolean;
  aiConfidenceThreshold?: number;
  enableAIDetection?: boolean;
  defaultPassword?: string;
  // Date range settings for birthdate generation
  minAge?: number;
  maxAge?: number;
  // File input support
  enableFileInput?: boolean;
  fileInputTypes?: string[]; // Allowed MIME types, e.g., ['image/png', 'application/pdf']
  // Iframe support
  disableIframeFill?: boolean;
}

/**
 * Custom field configuration types
 */
export type CustomFieldType = 'list' | 'regex' | 'faker';

export interface CustomField {
  field: string;
  type: CustomFieldType;
  value: string;
  faker?: string; // Optional Faker.js path (e.g., 'person.firstName')
}

/**
 * Field type detection results
 */
export type FieldType =
  | 'email'
  | 'phone'
  | 'username'
  | 'password'
  | 'name'
  | 'first_name'
  | 'last_name'
  | 'address'
  | 'city'
  | 'state'
  | 'zip'
  | 'country'
  | 'company'
  | 'job_title'
  | 'url'
  | 'date'
  | 'birthdate'
  | 'number'
  | 'color'
  | 'text';

/**
 * Japanese name script types
 */
export type JapaneseScript = 'hiragana' | 'katakana' | 'romaji' | null;

/**
 * Message types for Chrome extension communication
 */
export type MessageType = 'FILL_FORM' | 'UNDO_FILL' | 'CLEAR_FORM' | 'FILL_SINGLE_FIELD';

export interface ExtensionMessage {
  type: MessageType;
  locale?: string;
  settings?: FormFillerSettings;
}

export interface MessageResponse {
  status: 'filled' | 'undone' | 'cleared' | 'ignored-domain' | 'no-history' | 'no-field' | 'error';
  count?: number;
}

/**
 * Form field history for undo functionality
 */
export interface FieldHistory {
  element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  originalValue: string;
  newValue: string;
}

export interface FormHistory {
  fields: FieldHistory[];
  timestamp: number;
}

/**
 * Detection report types
 */
export interface FieldDetectionInfo {
  element: HTMLElement;
  type: string;
  name: string;
  id: string;
  detectedType: FieldType;
  value?: string;
  customMatch?: CustomField;
  label?: string;
  skipReason?: string;
}

export interface DetectionReport {
  totalFields: number;
  filledFields: FieldDetectionInfo[];
  skippedFields: FieldDetectionInfo[];
  customMatches: FieldDetectionInfo[];
  timestamp: number;
}

/**
 * Storage keys used by the extension
 * Derived from FormFillerSettings to ensure sync
 */
export type StorageKey = keyof FormFillerSettings | 'enableSound';

/**
 * Chrome storage data structure
 */
export type StorageData = Partial<Record<StorageKey, unknown>>;

/**
 * Locale codes supported by the extension
 */
export type SupportedLocale =
  | 'en'
  | 'vi'
  | 'ja'
  | 'zh'
  | 'ar'
  | 'de'
  | 'es'
  | 'fr'
  | 'ko'
  | 'pl'
  | 'ru';

/**
 * Context menu IDs
 */
export type ContextMenuId =
  | 'fill-form'
  | 'undo-fill'
  | 'clear-form'
  | 'fill-this-field'
  | 'separator'
  | 'separator-1'
  | 'current-locale'
  | (string & {});

/**
 * Notification types for visual feedback
 */
export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface NotificationOptions {
  message: string;
  type: NotificationType;
  duration?: number;
}

/**
 * Wildcard pattern matching result
 */
export interface WildcardMatch {
  matched: boolean;
  pattern: string;
  value: string;
}

/**
 * Label finding result
 */
export interface LabelInfo {
  text: string;
  source: 'label' | 'aria-label' | 'placeholder' | 'title' | 'closest';
  distance?: number;
}

/**
 * Type guard utilities
 */
export function isHTMLInputElement(element: unknown): element is HTMLInputElement {
  return element instanceof HTMLInputElement;
}

export function isHTMLSelectElement(element: unknown): element is HTMLSelectElement {
  return element instanceof HTMLSelectElement;
}

export function isHTMLTextAreaElement(element: unknown): element is HTMLTextAreaElement {
  return element instanceof HTMLTextAreaElement;
}

export function isFormElement(
  element: unknown
): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
  return (
    isHTMLInputElement(element) || isHTMLSelectElement(element) || isHTMLTextAreaElement(element)
  );
}

/**
 * Utility type for Chrome API callback
 */
export type ChromeCallback<T = void> = (result?: T) => void;

/**
 * Export all types for convenience
 */
export type {
  FormFillerSettings as Settings,
  CustomField as Field,
  FieldType as Type,
  ExtensionMessage as Message,
  MessageResponse as Response,
  DetectionReport as Report,
  FieldDetectionInfo as FieldInfo
};
