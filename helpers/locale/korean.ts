/**
 * Korean to English keyword mapping for better detection
 * Translates common Korean field labels to English equivalents
 * IMPORTANT: Order matters! Longer keywords must come first to avoid partial matches
 */
export const koreanKeywordMap: [string, string][] = [
  // Longest compounds first
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
  ['유효기간', 'date'],
  ['보안코드', 'credit_card_cvv'],

  // Medium length
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

  // Short terms
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
 * Translate Korean keywords to English for better pattern matching
 * Uses ordered array to ensure longer keywords are matched first
 */
export const translateKoreanKeywords = (text: string): string => {
  if (!text) return text;

  let translated = text;
  // Process in order (longest first) to avoid partial matches
  for (const [korean, english] of koreanKeywordMap) {
    if (translated.includes(korean)) {
      translated = translated.replace(new RegExp(korean, 'g'), english);
    }
  }
  return translated;
};
