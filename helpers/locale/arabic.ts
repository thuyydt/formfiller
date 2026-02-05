/**
 * Arabic to English keyword mapping for better detection
 * Translates common Arabic field labels to English equivalents
 * IMPORTANT: Order matters! Longer keywords must come first to avoid partial matches
 */
export const arabicKeywordMap: [string, string][] = [
  // Longest compounds first
  ['تأكيد كلمة المرور', 'password'],
  ['إعادة كلمة المرور', 'password'],
  ['البريد الإلكتروني', 'email'],
  ['رقم الهاتف المحمول', 'phone'],
  ['تاريخ الميلاد', 'birthday'],
  ['الرمز البريدي', 'zipcode'],
  ['صندوق البريد', 'po_box'],
  ['اسم المستخدم', 'username'],
  ['رقم الهوية', 'id_card'],
  ['رقم البطاقة', 'credit_card'],
  ['اسم العائلة', 'lastname'],
  ['الاسم الأول', 'firstname'],
  ['رقم الهاتف', 'phone'],
  ['كلمة السر', 'password'],
  ['كلمة المرور', 'password'],
  ['رقم الحساب', 'account_number'],
  ['صاحب الحساب', 'account_name'],
  ['تاريخ الانتهاء', 'credit_card_expiry'],
  ['رمز الأمان', 'credit_card_cvv'],
  ['الموقع الإلكتروني', 'url'],
  ['رابط الموقع', 'url'],

  // Medium length
  ['عنوان البريد', 'email'],
  ['اسم الشركة', 'company'],
  ['المحافظة', 'state'],
  ['المنطقة', 'state'],
  ['المدينة', 'city'],
  ['العنوان', 'address'],
  ['الشارع', 'address'],
  ['الدولة', 'country'],
  ['الجنس', 'sex'],
  ['العمر', 'age'],
  ['الوظيفة', 'job_title'],
  ['المسمى الوظيفي', 'job_title'],
  ['القسم', 'department'],
  ['ملاحظات', 'description'],
  ['رسالة', 'description'],
  ['بحث', 'search'],
  ['السعر', 'price'],
  ['الكمية', 'number'],
  ['الوصف', 'description'],

  // Short terms
  ['هاتف', 'phone'],
  ['جوال', 'phone'],
  ['ايميل', 'email'],
  ['بريد', 'email'],
  ['اسم', 'name'],
  ['لقب', 'lastname'],
  ['ذكر', 'sex'],
  ['أنثى', 'sex'],
  ['فاكس', 'phone']
];

/**
 * Check if text contains Arabic characters
 */
export const containsArabic = (text: string): boolean => {
  // Arabic: 0600-06FF
  // Arabic Supplement: 0750-077F
  // Arabic Extended-A: 08A0-08FF
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
};

/**
 * Translate Arabic keywords to English for better pattern matching
 * Uses ordered array to ensure longer keywords are matched first
 */
export const translateArabicKeywords = (text: string): string => {
  if (!text || !containsArabic(text)) return text;

  let translated = text;
  // Process in order (longest first) to avoid partial matches
  for (const [arabic, english] of arabicKeywordMap) {
    if (translated.includes(arabic)) {
      translated = translated.replaceAll(arabic, english);
    }
  }
  return translated;
};
