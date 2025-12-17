/**
 * Japanese to English keyword mapping for better detection
 * Translates common Japanese field labels to English equivalents
 * IMPORTANT: Order matters! Longer keywords must come first to avoid partial matches
 */
export const japaneseKeywordMap: [string, string][] = [
  // Longest compounds first (8+ chars)
  ['セキュリティコード', 'credit_card_cvv'],

  // 5 chars
  ['マンション', 'building'],
  ['フルネーム', 'name'],
  ['パスワード', 'password'],

  // 4 chars
  ['電話番号', 'phone'],
  ['生年月日', 'birthday'],
  ['都道府県', 'prefecture'], // Use prefecture instead of state to match more specific rule
  ['市区町村', 'city'],
  ['郵便番号', 'zipcode'],
  ['部屋番号', 'room_number'],
  ['有効期限', 'date'],
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

  // 1 char
  ['国', 'country'],
  ['姓', 'lastname'],
  ['名', 'firstname']
];

/**
 * Translate Japanese keywords to English for better pattern matching
 * Uses ordered array to ensure longer keywords are matched first
 */
export const translateJapaneseKeywords = (text: string): string => {
  if (!text) return text;

  let translated = text;
  // Process in order (longest first) to avoid partial matches
  for (const [japanese, english] of japaneseKeywordMap) {
    if (translated.includes(japanese)) {
      translated = translated.replace(new RegExp(japanese, 'g'), english);
    }
  }
  return translated;
};
