/**
 * Japanese to English keyword mapping for better detection
 * Translates common Japanese field labels to English equivalents
 * IMPORTANT: Order matters! Longer keywords must come first to avoid partial matches
 */
export const japaneseKeywordMap: [string, string][] = [
  // Longest compounds first (8+ chars)
  ['セキュリティコード', 'credit_card_cvv'],
  ['クレジットカード', 'credit_card'],

  // 5 chars
  ['マンション', 'building'],
  ['フルネーム', 'name'],
  ['パスワード', 'password'],
  ['ウェブサイト', 'url'],

  // 4 chars
  ['電話番号', 'phone'],
  ['生年月日', 'birthday'],
  ['都道府県', 'prefecture'],
  ['市区町村', 'city'],
  ['郵便番号', 'zipcode'],
  ['部屋番号', 'room_number'],
  ['有効期限', 'credit_card_expiry'],
  ['口座番号', 'account_number'],
  ['口座名義', 'account_name'],
  ['フリガナ', 'name'],
  ['ふりがな', 'name'],
  ['ログイン', 'login'],
  ['ユーザー', 'user'],

  // 3 chars
  ['会社名', 'company'],
  ['誕生日', 'birthday'],
  ['連絡先', 'phone'],
  ['カード', 'credit_card'],
  ['メール', 'email'],
  ['FAX', 'phone'],

  // 2 chars
  ['電話', 'phone'],
  ['名前', 'name'],
  ['氏名', 'name'],
  ['住所', 'address'],
  ['会社', 'company'],
  ['年齢', 'age'],
  ['建物', 'building'],
  ['ビル', 'building'],
  ['番地', 'address'],
  ['携帯', 'phone'],
  ['役職', 'job_title'],
  ['職業', 'job_title'],
  ['日付', 'date'],
  ['名義', 'account_name'],
  ['性別', 'sex'],
  ['カナ', 'name'],
  ['かな', 'name'],
  ['メイ', 'firstname'],
  ['セイ', 'lastname'],
  ['検索', 'search'],
  ['価格', 'price'],
  ['数量', 'number'],
  ['説明', 'description'],
  ['備考', 'description'],

  // 1 char
  ['国', 'country'],
  ['姓', 'lastname'],
  ['名', 'firstname']
];

/**
 * Check if text contains Japanese characters (Hiragana, Katakana, or Kanji)
 */
export const containsJapanese = (text: string): boolean => {
  // Hiragana: 3040-309F
  // Katakana: 30A0-30FF
  // CJK (shared with Chinese but often used in Japanese): 4E00-9FAF
  // We check for Hiragana/Katakana specifically as they're unique to Japanese
  return (
    /[\u3040-\u309F\u30A0-\u30FF]/.test(text) ||
    // Also check for common Japanese-specific Kanji patterns
    /[\u4E00-\u9FAF]/.test(text)
  );
};

/**
 * Translate Japanese keywords to English for better pattern matching
 * Uses ordered array to ensure longer keywords are matched first
 */
export const translateJapaneseKeywords = (text: string): string => {
  if (!text || !containsJapanese(text)) return text;

  let translated = text;
  // Process in order (longest first) to avoid partial matches
  for (const [japanese, english] of japaneseKeywordMap) {
    if (translated.includes(japanese)) {
      translated = translated.replaceAll(japanese, english);
    }
  }
  return translated;
};
