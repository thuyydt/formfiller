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
  ['الموقع الإلكتروني', 'url'],
  ['رابط الموقع', 'url'],
  ['الوظيفة', 'job_title'],
  ['المسمى الوظيفي', 'job_title'],
  ['القسم', 'department'],
  ['ملاحظات', 'description'],
  ['رسالة', 'description'],
  ['بحث', 'search'],
  ['السعر', 'price'],
  ['الكمية', 'number'],

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
 * Translate Arabic keywords to English for better pattern matching
 * Uses ordered array to ensure longer keywords are matched first
 */
export const translateArabicKeywords = (text: string): string => {
  if (!text) return text;

  let translated = text;
  // Process in order (longest first) to avoid partial matches
  for (const [arabic, english] of arabicKeywordMap) {
    if (translated.includes(arabic)) {
      translated = translated.replace(new RegExp(arabic, 'g'), english);
    }
  }
  return translated;
};
