/**
 * Chinese (Simplified) to English keyword mapping for better detection
 * Translates common Chinese field labels to English equivalents
 * IMPORTANT: Order matters! Longer keywords must come first to avoid partial matches
 */
export const chineseKeywordMap: [string, string][] = [
  // Longest compounds first
  ['确认密码', 'password'],
  ['验证码', 'verification_code'],
  ['出生日期', 'birthday'],
  ['手机号码', 'phone'],
  ['电话号码', 'phone'],
  ['电子邮箱', 'email'],
  ['电子邮件', 'email'],
  ['邮政编码', 'zipcode'],
  ['详细地址', 'address'],
  ['公司名称', 'company'],
  ['身份证号', 'id_card'],
  ['信用卡号', 'credit_card'],
  ['持卡人姓名', 'account_name'],
  ['有效期', 'date'],
  ['安全码', 'credit_card_cvv'],

  // Medium length
  ['用户名', 'username'],
  ['密码', 'password'],
  ['姓名', 'name'],
  ['手机', 'phone'],
  ['电话', 'phone'],
  ['邮箱', 'email'],
  ['地址', 'address'],
  ['省份', 'state'],
  ['城市', 'city'],
  ['区县', 'city'],
  ['国家', 'country'],
  ['性别', 'sex'],
  ['年龄', 'age'],
  ['职业', 'job_title'],
  ['职位', 'job_title'],
  ['公司', 'company'],
  ['部门', 'department'],
  ['传真', 'phone'],
  ['搜索', 'search'],
  ['价格', 'price'],
  ['数量', 'number'],

  // Short terms
  ['姓', 'lastname'],
  ['名', 'firstname'],
  ['省', 'state'],
  ['市', 'city'],
  ['区', 'city'],
  ['男', 'sex'],
  ['女', 'sex']
];

/**
 * Translate Chinese keywords to English for better pattern matching
 * Uses ordered array to ensure longer keywords are matched first
 */
export const translateChineseKeywords = (text: string): string => {
  if (!text) return text;

  let translated = text;
  // Process in order (longest first) to avoid partial matches
  for (const [chinese, english] of chineseKeywordMap) {
    if (translated.includes(chinese)) {
      translated = translated.replace(new RegExp(chinese, 'g'), english);
    }
  }
  return translated;
};
