/**
 * German to English keyword mapping for better detection
 * Translates common German field labels to English equivalents
 * IMPORTANT: Order matters! Longer keywords must come first to avoid partial matches
 */
export const germanKeywordMap: [string, string][] = [
  // Longest compounds first
  ['bestätigen sie ihr passwort', 'password'],
  ['passwort wiederholen', 'password'],
  ['passwort bestätigen', 'password'],
  ['straße und hausnummer', 'address'],
  ['kreditkartennummer', 'credit_card'],
  ['sicherheitscode', 'credit_card_cvv'],
  ['e-mail-adresse', 'email'],
  ['geburtsdatum', 'birthday'],
  ['postleitzahl', 'zipcode'],
  ['telefonnummer', 'phone'],
  ['mobilnummer', 'phone'],
  ['handynummer', 'phone'],
  ['benutzername', 'username'],
  ['firmenname', 'company'],
  ['kontoinhaber', 'account_name'],
  ['kontonummer', 'account_number'],
  ['gültig bis', 'credit_card_expiry'],
  ['ablaufdatum', 'credit_card_expiry'],
  ['internetseite', 'url'],

  // Medium length
  ['nachname', 'lastname'],
  ['vorname', 'firstname'],
  ['passwort', 'password'],
  ['anschrift', 'address'],
  ['adresse', 'address'],
  ['straße', 'address'],
  ['hausnummer', 'building'],
  ['wohnort', 'city'],
  ['stadt', 'city'],
  ['land', 'country'],
  ['bundesland', 'state'],
  ['kanton', 'state'],
  ['geschlecht', 'sex'],
  ['alter', 'age'],
  ['webseite', 'url'],
  ['homepage', 'url'],
  ['beruf', 'job_title'],
  ['funktion', 'job_title'],
  ['abteilung', 'department'],
  ['bemerkung', 'description'],
  ['nachricht', 'description'],
  ['kommentar', 'description'],
  ['beschreibung', 'description'],
  ['suche', 'search'],
  ['preis', 'price'],
  ['menge', 'number'],
  ['anzahl', 'number'],

  // Short terms (use word boundaries)
  ['ort', 'city'],
  ['plz', 'zipcode'],
  ['tel', 'phone'],
  ['fax', 'phone']
];

/**
 * Escape special regex characters in a string
 */
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Translate German keywords to English for better pattern matching
 * Uses ordered array to ensure longer keywords are matched first
 */
export const translateGermanKeywords = (text: string): string => {
  if (!text) return text;

  let translated = text;
  // Process in order (longest first) to avoid partial matches
  for (const [german, english] of germanKeywordMap) {
    // Use word boundaries for short words to avoid false positives
    const pattern = german.length <= 3 ? `\\b${escapeRegex(german)}\\b` : escapeRegex(german);
    const regex = new RegExp(pattern, 'gi');

    if (regex.test(translated)) {
      translated = translated.replace(regex, english);
    }
  }
  return translated;
};
