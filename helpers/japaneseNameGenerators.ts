// helpers/japaneseNameGenerators.ts
/**
 * Utility functions to generate random Japanese-style names in Hiragana, Katakana, or Romaji.
 * Useful for form filling, testing, or demo purposes.
 */

/**
 * Generates a random integer between min and max (inclusive).
 */
const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Generates a random name using the provided character set.
 */
const generateRandomNameFromCharset = (
  charset: string[],
  minLength: number,
  maxLength: number
): string => {
  const length = randomInt(minLength, maxLength);
  let name = '';
  for (let i = 0; i < length; i++) {
    name += charset[randomInt(0, charset.length - 1)];
  }
  return name;
};

/**
 * Generates a random Japanese name in Hiragana.
 */
export const generateRandomHiraganaName = (minLength = 3, maxLength = 6): string => {
  const hiragana = [
    'あ','い','う','え','お','か','き','く','け','こ','さ','し','す','せ','そ',
    'た','ち','つ','て','と','な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ',
    'ま','み','む','め','も','や','ゆ','よ','ら','り','る','れ','ろ','わ','を','ん'
  ];
  return generateRandomNameFromCharset(hiragana, minLength, maxLength);
};

/**
 * Generates a random Japanese name in Katakana.
 */
export const generateRandomKatakanaName = (minLength = 3, maxLength = 6): string => {
  const katakana = [
    'ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ',
    'タ','チ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ',
    'マ','ミ','ム','メ','モ','ヤ','ユ','ヨ','ラ','リ','ル','レ','ロ','ワ','ヲ','ン'
  ];
  return generateRandomNameFromCharset(katakana, minLength, maxLength);
};

/**
 * Generates a random Japanese-style Romaji name.
 */
export const generateRandomRomajiName = (minLength = 3, maxLength = 6): string => {
  const vowels = ['a', 'i', 'u', 'e', 'o'];
  const consonants = ['k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'g', 'z', 'd', 'b', 'p'];
  const specialConsonants = ['ky', 'sh', 'ch', 'ny', 'hy', 'my', 'ry', 'gy', 'j', 'dz', 'by', 'py'];
  let name = '';
  const length = randomInt(minLength, maxLength);

  for (let i = 0; i < length; i++) {
    const rand = Math.random();
    if (rand < 0.2) {
      name += vowels[randomInt(0, vowels.length - 1)];
    } else if (rand < 0.5) {
      name += specialConsonants[randomInt(0, specialConsonants.length - 1)];
      name += vowels[randomInt(0, vowels.length - 1)];
    } else {
      name += consonants[randomInt(0, consonants.length - 1)];
      name += vowels[randomInt(0, vowels.length - 1)];
    }
  }
  if (Math.random() < 0.1) name += 'n';
  // Capitalize first letter for a more natural name appearance
  return name.charAt(0).toUpperCase() + name.slice(1);
};
