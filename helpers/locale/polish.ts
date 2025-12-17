/**
 * Polish to English keyword mapping for better detection
 * Translates common Polish field labels to English equivalents
 * IMPORTANT: Order matters! Longer keywords must come first to avoid partial matches
 */
export const polishKeywordMap: [string, string][] = [
  // Longest compounds first
  ['potwierdź hasło', 'password'],
  ['powtórz hasło', 'password'],
  ['data urodzenia', 'birthday'],
  ['numer telefonu', 'phone'],
  ['kod pocztowy', 'zipcode'],
  ['nazwa użytkownika', 'username'],
  ['nazwa firmy', 'company'],
  ['numer karty', 'credit_card'],
  ['właściciel karty', 'account_name'],
  ['kod bezpieczeństwa', 'credit_card_cvv'],
  ['data ważności', 'date'],

  // Medium length
  ['hasło', 'password'],
  ['nazwisko', 'lastname'],
  ['imię', 'firstname'],
  ['telefon', 'phone'],
  ['komórka', 'phone'],
  ['adres e-mail', 'email'],
  ['adres', 'address'],
  ['miasto', 'city'],
  ['miejscowość', 'city'],
  ['województwo', 'state'],
  ['region', 'state'],
  ['kraj', 'country'],
  ['płeć', 'sex'],
  ['wiek', 'age'],
  ['strona internetowa', 'url'],
  ['strona www', 'url'],
  ['zawód', 'job_title'],
  ['stanowisko', 'job_title'],
  ['firma', 'company'],
  ['dział', 'department'],
  ['wiadomość', 'description'],
  ['komentarz', 'description'],
  ['szukaj', 'search'],
  ['cena', 'price'],
  ['ilość', 'number'],
  ['liczba', 'number'],

  // Short terms
  ['ulica', 'address'],
  ['dom', 'building'],
  ['lokal', 'room_number'],
  ['fax', 'phone'],
  ['nip', 'company'] // Tax ID often associated with company
];

/**
 * Translate Polish keywords to English for better pattern matching
 * Uses ordered array to ensure longer keywords are matched first
 */
export const translatePolishKeywords = (text: string): string => {
  if (!text) return text;

  let translated = text;
  // Process in order (longest first) to avoid partial matches
  for (const [polish, english] of polishKeywordMap) {
    // Use word boundaries for short words to avoid false positives (e.g. "dom" in "random")
    const regex =
      polish.length <= 3 ? new RegExp(`\\b${polish}\\b`, 'gi') : new RegExp(polish, 'gi');

    if (regex.test(translated)) {
      translated = translated.replace(regex, english);
    }
  }
  return translated;
};
