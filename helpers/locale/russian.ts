/**
 * Russian to English keyword mapping for better detection
 * Translates common Russian field labels to English equivalents
 * IMPORTANT: Order matters! Longer keywords must come first to avoid partial matches
 */
export const russianKeywordMap: [string, string][] = [
  // Longest compounds first
  ['подтвердите пароль', 'password'],
  ['повторите пароль', 'password'],
  ['электронная почта', 'email'],
  ['адрес электронной почты', 'email'],
  ['номер телефона', 'phone'],
  ['дата рождения', 'birthday'],
  ['почтовый индекс', 'zipcode'],
  ['имя пользователя', 'username'],
  ['название компании', 'company'],
  ['номер карты', 'credit_card'],
  ['владелец карты', 'account_name'],
  ['код безопасности', 'credit_card_cvv'],
  ['срок действия', 'credit_card_expiry'],
  ['номер счета', 'account_number'],
  ['веб-сайт', 'url'],
  ['домашняя страница', 'url'],

  // Medium length
  ['пароль', 'password'],
  ['фамилия', 'lastname'],
  ['имя', 'firstname'],
  ['отчество', 'firstname'],
  ['телефон', 'phone'],
  ['мобильный', 'phone'],
  ['адрес', 'address'],
  ['улица', 'address'],
  ['город', 'city'],
  ['населенный пункт', 'city'],
  ['область', 'state'],
  ['регион', 'state'],
  ['страна', 'country'],
  ['пол', 'sex'],
  ['возраст', 'age'],
  ['сайт', 'url'],
  ['профессия', 'job_title'],
  ['должность', 'job_title'],
  ['компания', 'company'],
  ['организация', 'company'],
  ['отдел', 'department'],
  ['сообщение', 'description'],
  ['комментарий', 'description'],
  ['поиск', 'search'],
  ['цена', 'price'],
  ['количество', 'number'],
  ['описание', 'description'],

  // Short terms
  ['email', 'email'],
  ['факс', 'phone'],
  ['дом', 'building'],
  ['кв', 'room_number']
];

/**
 * Check if text contains Russian (Cyrillic) characters
 */
export const containsRussian = (text: string): boolean => {
  // Cyrillic: 0400-04FF
  // Cyrillic Supplement: 0500-052F
  return /[\u0400-\u04FF\u0500-\u052F]/.test(text);
};

/**
 * Translate Russian keywords to English for better pattern matching
 * Uses ordered array to ensure longer keywords are matched first
 */
export const translateRussianKeywords = (text: string): string => {
  if (!text || !containsRussian(text)) return text;

  let translated = text;
  // Process in order (longest first) to avoid partial matches
  for (const [russian, english] of russianKeywordMap) {
    if (translated.includes(russian)) {
      translated = translated.replaceAll(russian, english);
    }
  }
  return translated;
};
