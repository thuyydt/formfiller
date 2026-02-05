/**
 * Korean to English keyword mapping for better detection
 * Translates common Korean field labels to English equivalents
 * IMPORTANT: Order matters! Longer keywords must come first to avoid partial matches
 */
export const koreanKeywordMap: [string, string][] = [
  // Longest compounds first (4+ syllables)
  ['비밀번호 확인', 'password'],
  ['휴대전화번호', 'phone'],
  ['휴대폰번호', 'phone'],
  ['전화번호', 'phone'],
  ['생년월일', 'birthday'],
  ['우편번호', 'zipcode'],
  ['상세주소', 'address'],
  ['이메일 주소', 'email'],
  ['회사이름', 'company'],
  ['카드번호', 'credit_card'],
  ['유효기간', 'credit_card_expiry'],
  ['보안코드', 'credit_card_cvv'],
  ['계좌번호', 'account_number'],
  ['예금주명', 'account_name'],
  ['웹사이트', 'url'],

  // Medium length (2-3 syllables)
  ['아이디', 'username'],
  ['사용자명', 'username'],
  ['비밀번호', 'password'],
  ['이메일', 'email'],
  ['휴대폰', 'phone'],
  ['연락처', 'phone'],
  ['주소', 'address'],
  ['국가', 'country'],
  ['도시', 'city'],
  ['성별', 'sex'],
  ['나이', 'age'],
  ['직업', 'job_title'],
  ['회사', 'company'],
  ['부서', 'department'],
  ['검색', 'search'],
  ['가격', 'price'],
  ['수량', 'number'],
  ['팩스', 'phone'],
  ['메모', 'text'],
  ['설명', 'description'],

  // Short terms (1 syllable)
  ['이름', 'name'],
  ['성명', 'name'],
  ['성', 'lastname'],
  ['명', 'firstname'],
  ['시', 'city'],
  ['도', 'state'],
  ['구', 'city'],
  ['동', 'address'],
  ['남', 'sex'],
  ['여', 'sex']
];

/**
 * Check if text contains Korean characters (Hangul)
 */
export const containsKorean = (text: string): boolean => {
  // Hangul Syllables: AC00-D7AF
  // Hangul Jamo: 1100-11FF
  // Hangul Compatibility Jamo: 3130-318F
  return /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(text);
};

/**
 * Translate Korean keywords to English for better pattern matching
 * Uses ordered array to ensure longer keywords are matched first
 */
export const translateKoreanKeywords = (text: string): string => {
  if (!text || !containsKorean(text)) return text;

  let translated = text;
  // Process in order (longest first) to avoid partial matches
  for (const [korean, english] of koreanKeywordMap) {
    if (translated.includes(korean)) {
      translated = translated.replaceAll(korean, english);
    }
  }
  return translated;
};
