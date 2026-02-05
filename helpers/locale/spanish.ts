/**
 * Spanish to English keyword mapping for better detection
 * Translates common Spanish field labels to English equivalents
 * IMPORTANT: Order matters! Longer keywords must come first to avoid partial matches
 */
export const spanishKeywordMap: [string, string][] = [
  // Longest compounds first
  ['confirmar contraseña', 'password'],
  ['correo electrónico', 'email'],
  ['dirección de correo', 'email'],
  ['fecha de nacimiento', 'birthday'],
  ['número de teléfono', 'phone'],
  ['código postal', 'zipcode'],
  ['nombre de usuario', 'username'],
  ['nombre de la empresa', 'company'],
  ['número de tarjeta', 'credit_card'],
  ['titular de la tarjeta', 'account_name'],
  ['código de seguridad', 'credit_card_cvv'],
  ['fecha de vencimiento', 'credit_card_expiry'],
  ['fecha de caducidad', 'credit_card_expiry'],
  ['número de cuenta', 'account_number'],
  ['sitio web', 'url'],
  ['página web', 'url'],

  // Medium length
  ['contraseña', 'password'],
  ['apellidos', 'lastname'],
  ['apellido', 'lastname'],
  ['nombre', 'firstname'],
  ['teléfono', 'phone'],
  ['celular', 'phone'],
  ['móvil', 'phone'],
  ['dirección', 'address'],
  ['domicilio', 'address'],
  ['calle', 'address'],
  ['ciudad', 'city'],
  ['población', 'city'],
  ['municipio', 'city'],
  ['provincia', 'state'],
  ['estado', 'state'],
  ['región', 'state'],
  ['país', 'country'],
  ['género', 'sex'],
  ['sexo', 'sex'],
  ['edad', 'age'],
  ['profesión', 'job_title'],
  ['cargo', 'job_title'],
  ['empresa', 'company'],
  ['compañía', 'company'],
  ['departamento', 'department'],
  ['comentarios', 'description'],
  ['mensaje', 'description'],
  ['descripción', 'description'],
  ['buscar', 'search'],
  ['precio', 'price'],
  ['cantidad', 'number'],

  // Short terms (use word boundaries)
  ['fax', 'phone'],
  ['cp', 'zipcode']
];

/**
 * Escape special regex characters in a string
 */
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Translate Spanish keywords to English for better pattern matching
 * Uses ordered array to ensure longer keywords are matched first
 */
export const translateSpanishKeywords = (text: string): string => {
  if (!text) return text;

  let translated = text;
  // Process in order (longest first) to avoid partial matches
  for (const [spanish, english] of spanishKeywordMap) {
    // Use word boundaries for short words to avoid false positives
    const pattern = spanish.length <= 3 ? `\\b${escapeRegex(spanish)}\\b` : escapeRegex(spanish);
    const regex = new RegExp(pattern, 'gi');

    if (regex.test(translated)) {
      translated = translated.replace(regex, english);
    }
  }
  return translated;
};
