/**
 * French to English keyword mapping for better detection
 * Translates common French field labels to English equivalents
 * IMPORTANT: Order matters! Longer keywords must come first to avoid partial matches
 */
export const frenchKeywordMap: [string, string][] = [
  // Longest compounds first
  ['confirmer le mot de passe', 'password'],
  ['mot de passe', 'password'],
  ['date de naissance', 'birthday'],
  ['numéro de téléphone', 'phone'],
  ['code postal', 'zipcode'],
  ['nom d\'utilisateur', 'username'],
  ['nom de l\'entreprise', 'company'],
  ['numéro de carte', 'credit_card'],
  ['titulaire de la carte', 'account_name'],
  ['code de sécurité', 'credit_card_cvv'],
  ['date d\'expiration', 'date'],
  ['adresse e-mail', 'email'],
  ['site internet', 'url'],

  // Medium length
  ['courriel', 'email'],
  ['prénom', 'firstname'],
  ['nom de famille', 'lastname'],
  ['téléphone', 'phone'],
  ['portable', 'phone'],
  ['mobile', 'phone'],
  ['adresse', 'address'],
  ['ville', 'city'],
  ['région', 'state'],
  ['province', 'state'],
  ['pays', 'country'],
  ['sexe', 'sex'],
  ['genre', 'sex'],
  ['âge', 'age'],
  ['site web', 'url'],
  ['profession', 'job_title'],
  ['fonction', 'job_title'],
  ['société', 'company'],
  ['entreprise', 'company'],
  ['département', 'department'],
  ['commentaire', 'description'],
  ['message', 'description'],
  ['recherche', 'search'],
  ['prix', 'price'],
  ['quantité', 'number'],

  // Short terms
  ['nom', 'lastname'],
  ['rue', 'address'],
  ['fax', 'phone'],
  ['cp', 'zipcode']
];

/**
 * Translate French keywords to English for better pattern matching
 * Uses ordered array to ensure longer keywords are matched first
 */
export const translateFrenchKeywords = (text: string): string => {
  if (!text) return text;

  let translated = text;
  // Process in order (longest first) to avoid partial matches
  for (const [french, english] of frenchKeywordMap) {
    // Use word boundaries for short words to avoid false positives (e.g. "nom" in "economy")
    const regex =
      french.length <= 3 ? new RegExp(`\\b${french}\\b`, 'gi') : new RegExp(french, 'gi');

    if (regex.test(translated)) {
      translated = translated.replace(regex, english);
    }
  }
  return translated;
};
