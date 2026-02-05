/**
 * Chinese (Simplified & Traditional) to English keyword mapping for better detection
 * Translates common Chinese field labels to English equivalents
 * IMPORTANT: Order matters! Longer keywords must come first to avoid partial matches
 */
export const chineseKeywordMap: [string, string][] = [
  // Longest compounds first
  ['确认密码', 'password'],
  ['確認密碼', 'password'], // Traditional
  ['验证码', 'verification_code'],
  ['驗證碼', 'verification_code'], // Traditional
  ['出生日期', 'birthday'],
  ['手机号码', 'phone'],
  ['手機號碼', 'phone'], // Traditional
  ['电话号码', 'phone'],
  ['電話號碼', 'phone'], // Traditional
  ['电子邮箱', 'email'],
  ['電子郵箱', 'email'], // Traditional
  ['电子邮件', 'email'],
  ['邮政编码', 'zipcode'],
  ['郵政編碼', 'zipcode'], // Traditional
  ['详细地址', 'address'],
  ['詳細地址', 'address'], // Traditional
  ['公司名称', 'company'],
  ['公司名稱', 'company'], // Traditional
  ['身份证号', 'id_card'],
  ['身份證號', 'id_card'], // Traditional
  ['信用卡号', 'credit_card'],
  ['信用卡號', 'credit_card'], // Traditional
  ['持卡人姓名', 'account_name'],
  ['有效期', 'credit_card_expiry'],
  ['安全码', 'credit_card_cvv'],
  ['安全碼', 'credit_card_cvv'], // Traditional
  ['银行账号', 'account_number'],
  ['銀行賬號', 'account_number'], // Traditional
  ['网站地址', 'url'],
  ['網站地址', 'url'], // Traditional

  // Medium length
  ['用户名', 'username'],
  ['用戶名', 'username'], // Traditional
  ['密码', 'password'],
  ['密碼', 'password'], // Traditional
  ['姓名', 'name'],
  ['手机', 'phone'],
  ['手機', 'phone'], // Traditional
  ['电话', 'phone'],
  ['電話', 'phone'], // Traditional
  ['邮箱', 'email'],
  ['郵箱', 'email'], // Traditional
  ['地址', 'address'],
  ['省份', 'state'],
  ['城市', 'city'],
  ['区县', 'city'],
  ['區縣', 'city'], // Traditional
  ['国家', 'country'],
  ['國家', 'country'], // Traditional
  ['性别', 'sex'],
  ['性別', 'sex'], // Traditional
  ['年龄', 'age'],
  ['年齡', 'age'], // Traditional
  ['职业', 'job_title'],
  ['職業', 'job_title'], // Traditional
  ['职位', 'job_title'],
  ['職位', 'job_title'], // Traditional
  ['公司', 'company'],
  ['部门', 'department'],
  ['部門', 'department'], // Traditional
  ['传真', 'phone'],
  ['傳真', 'phone'], // Traditional
  ['搜索', 'search'],
  ['搜尋', 'search'], // Traditional
  ['价格', 'price'],
  ['價格', 'price'], // Traditional
  ['数量', 'number'],
  ['數量', 'number'], // Traditional
  ['描述', 'description'],
  ['说明', 'description'],
  ['說明', 'description'], // Traditional

  // Short terms
  ['姓', 'lastname'],
  ['名', 'firstname'],
  ['省', 'state'],
  ['市', 'city'],
  ['区', 'city'],
  ['區', 'city'], // Traditional
  ['男', 'sex'],
  ['女', 'sex']
];

/**
 * Check if text contains Chinese characters (Han script)
 * Note: Some characters overlap with Japanese Kanji
 */
export const containsChinese = (text: string): boolean => {
  // CJK Unified Ideographs: 4E00-9FFF
  // CJK Extension A: 3400-4DBF
  return /[\u4E00-\u9FFF\u3400-\u4DBF]/.test(text);
};

/**
 * Translate Chinese keywords to English for better pattern matching
 * Uses ordered array to ensure longer keywords are matched first
 */
export const translateChineseKeywords = (text: string): string => {
  if (!text || !containsChinese(text)) return text;

  let translated = text;
  // Process in order (longest first) to avoid partial matches
  for (const [chinese, english] of chineseKeywordMap) {
    if (translated.includes(chinese)) {
      translated = translated.replaceAll(chinese, english);
    }
  }
  return translated;
};
