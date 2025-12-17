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
  ['fecha de vencimiento', 'date'],

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
  ['sitio web', 'url'],
  ['página web', 'url'],
  ['profesión', 'job_title'],
  ['cargo', 'job_title'],
  ['empresa', 'company'],
  ['compañía', 'company'],
  ['departamento', 'department'],
  ['comentarios', 'description'],
  ['mensaje', 'description'],
  ['buscar', 'search'],
  ['precio', 'price'],
  ['cantidad', 'number'],

  // Short terms
  ['fax', 'phone'],
  ['cp', 'zipcode']
];

/**
 * Translate Spanish keywords to English for better pattern matching
 * Uses ordered array to ensure longer keywords are matched first
 */
export const translateSpanishKeywords = (text: string): string => {
  if (!text) return text;

  let translated = text;
  // Process in order (longest first) to avoid partial matches
  for (const [spanish, english] of spanishKeywordMap) {
    // Use word boundaries for short words to avoid false positives (e.g. "cp" in "tcp")
    const regex =
      spanish.length <= 3 ? new RegExp(`\\b${spanish}\\b`, 'gi') : new RegExp(spanish, 'gi');

    if (regex.test(translated)) {
      translated = translated.replace(regex, english);
    }
  }
  return translated;
};
