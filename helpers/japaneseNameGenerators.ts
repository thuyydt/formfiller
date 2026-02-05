// helpers/japaneseNameGenerators.ts
/**
 * Improved Japanese Name Generator
 * Generates realistic Japanese names in multiple formats (Kanji, Hiragana, Katakana, Romaji)
 * Useful for form filling, testing, or demo purposes.
 */

// ============ Name Database ============

interface NameEntry {
  kanji: string;
  hiragana: string;
  katakana: string;
  romaji: string;
}

// Common Japanese surnames (top 30 most common)
const SURNAMES: NameEntry[] = [
  { kanji: '佐藤', hiragana: 'さとう', katakana: 'サトウ', romaji: 'Sato' },
  { kanji: '鈴木', hiragana: 'すずき', katakana: 'スズキ', romaji: 'Suzuki' },
  { kanji: '高橋', hiragana: 'たかはし', katakana: 'タカハシ', romaji: 'Takahashi' },
  { kanji: '田中', hiragana: 'たなか', katakana: 'タナカ', romaji: 'Tanaka' },
  { kanji: '伊藤', hiragana: 'いとう', katakana: 'イトウ', romaji: 'Ito' },
  { kanji: '渡辺', hiragana: 'わたなべ', katakana: 'ワタナベ', romaji: 'Watanabe' },
  { kanji: '山本', hiragana: 'やまもと', katakana: 'ヤマモト', romaji: 'Yamamoto' },
  { kanji: '中村', hiragana: 'なかむら', katakana: 'ナカムラ', romaji: 'Nakamura' },
  { kanji: '小林', hiragana: 'こばやし', katakana: 'コバヤシ', romaji: 'Kobayashi' },
  { kanji: '加藤', hiragana: 'かとう', katakana: 'カトウ', romaji: 'Kato' },
  { kanji: '吉田', hiragana: 'よしだ', katakana: 'ヨシダ', romaji: 'Yoshida' },
  { kanji: '山田', hiragana: 'やまだ', katakana: 'ヤマダ', romaji: 'Yamada' },
  { kanji: '佐々木', hiragana: 'ささき', katakana: 'ササキ', romaji: 'Sasaki' },
  { kanji: '山口', hiragana: 'やまぐち', katakana: 'ヤマグチ', romaji: 'Yamaguchi' },
  { kanji: '松本', hiragana: 'まつもと', katakana: 'マツモト', romaji: 'Matsumoto' },
  { kanji: '井上', hiragana: 'いのうえ', katakana: 'イノウエ', romaji: 'Inoue' },
  { kanji: '木村', hiragana: 'きむら', katakana: 'キムラ', romaji: 'Kimura' },
  { kanji: '林', hiragana: 'はやし', katakana: 'ハヤシ', romaji: 'Hayashi' },
  { kanji: '斎藤', hiragana: 'さいとう', katakana: 'サイトウ', romaji: 'Saito' },
  { kanji: '清水', hiragana: 'しみず', katakana: 'シミズ', romaji: 'Shimizu' },
  { kanji: '山崎', hiragana: 'やまざき', katakana: 'ヤマザキ', romaji: 'Yamazaki' },
  { kanji: '森', hiragana: 'もり', katakana: 'モリ', romaji: 'Mori' },
  { kanji: '池田', hiragana: 'いけだ', katakana: 'イケダ', romaji: 'Ikeda' },
  { kanji: '橋本', hiragana: 'はしもと', katakana: 'ハシモト', romaji: 'Hashimoto' },
  { kanji: '阿部', hiragana: 'あべ', katakana: 'アベ', romaji: 'Abe' },
  { kanji: '石川', hiragana: 'いしかわ', katakana: 'イシカワ', romaji: 'Ishikawa' },
  { kanji: '山下', hiragana: 'やました', katakana: 'ヤマシタ', romaji: 'Yamashita' },
  { kanji: '中島', hiragana: 'なかじま', katakana: 'ナカジマ', romaji: 'Nakajima' },
  { kanji: '石井', hiragana: 'いしい', katakana: 'イシイ', romaji: 'Ishii' },
  { kanji: '小川', hiragana: 'おがわ', katakana: 'オガワ', romaji: 'Ogawa' }
];

// Common Japanese male given names
const MALE_GIVEN_NAMES: NameEntry[] = [
  { kanji: '大翔', hiragana: 'ひろと', katakana: 'ヒロト', romaji: 'Hiroto' },
  { kanji: '蓮', hiragana: 'れん', katakana: 'レン', romaji: 'Ren' },
  { kanji: '陽翔', hiragana: 'はると', katakana: 'ハルト', romaji: 'Haruto' },
  { kanji: '湊', hiragana: 'みなと', katakana: 'ミナト', romaji: 'Minato' },
  { kanji: '朝陽', hiragana: 'あさひ', katakana: 'アサヒ', romaji: 'Asahi' },
  { kanji: '悠真', hiragana: 'ゆうま', katakana: 'ユウマ', romaji: 'Yuma' },
  { kanji: '翔太', hiragana: 'しょうた', katakana: 'ショウタ', romaji: 'Shota' },
  { kanji: '健太', hiragana: 'けんた', katakana: 'ケンタ', romaji: 'Kenta' },
  { kanji: '大輝', hiragana: 'だいき', katakana: 'ダイキ', romaji: 'Daiki' },
  { kanji: '拓海', hiragana: 'たくみ', katakana: 'タクミ', romaji: 'Takumi' },
  { kanji: '悠斗', hiragana: 'ゆうと', katakana: 'ユウト', romaji: 'Yuto' },
  { kanji: '颯太', hiragana: 'そうた', katakana: 'ソウタ', romaji: 'Sota' },
  { kanji: '太郎', hiragana: 'たろう', katakana: 'タロウ', romaji: 'Taro' },
  { kanji: '一郎', hiragana: 'いちろう', katakana: 'イチロウ', romaji: 'Ichiro' },
  { kanji: '直樹', hiragana: 'なおき', katakana: 'ナオキ', romaji: 'Naoki' },
  { kanji: '和也', hiragana: 'かずや', katakana: 'カズヤ', romaji: 'Kazuya' },
  { kanji: '健一', hiragana: 'けんいち', katakana: 'ケンイチ', romaji: 'Kenichi' },
  { kanji: '雄太', hiragana: 'ゆうた', katakana: 'ユウタ', romaji: 'Yuta' },
  { kanji: '翼', hiragana: 'つばさ', katakana: 'ツバサ', romaji: 'Tsubasa' },
  { kanji: '誠', hiragana: 'まこと', katakana: 'マコト', romaji: 'Makoto' }
];

// Common Japanese female given names
const FEMALE_GIVEN_NAMES: NameEntry[] = [
  { kanji: '陽葵', hiragana: 'ひまり', katakana: 'ヒマリ', romaji: 'Himari' },
  { kanji: '凛', hiragana: 'りん', katakana: 'リン', romaji: 'Rin' },
  { kanji: '詩', hiragana: 'うた', katakana: 'ウタ', romaji: 'Uta' },
  { kanji: '陽菜', hiragana: 'ひな', katakana: 'ヒナ', romaji: 'Hina' },
  { kanji: '結菜', hiragana: 'ゆいな', katakana: 'ユイナ', romaji: 'Yuina' },
  { kanji: '葵', hiragana: 'あおい', katakana: 'アオイ', romaji: 'Aoi' },
  { kanji: '美咲', hiragana: 'みさき', katakana: 'ミサキ', romaji: 'Misaki' },
  { kanji: '結衣', hiragana: 'ゆい', katakana: 'ユイ', romaji: 'Yui' },
  { kanji: '愛', hiragana: 'あい', katakana: 'アイ', romaji: 'Ai' },
  { kanji: 'さくら', hiragana: 'さくら', katakana: 'サクラ', romaji: 'Sakura' },
  { kanji: '美月', hiragana: 'みづき', katakana: 'ミヅキ', romaji: 'Mizuki' },
  { kanji: '優花', hiragana: 'ゆうか', katakana: 'ユウカ', romaji: 'Yuka' },
  { kanji: '花子', hiragana: 'はなこ', katakana: 'ハナコ', romaji: 'Hanako' },
  { kanji: '真央', hiragana: 'まお', katakana: 'マオ', romaji: 'Mao' },
  { kanji: '七海', hiragana: 'ななみ', katakana: 'ナナミ', romaji: 'Nanami' },
  { kanji: '美優', hiragana: 'みゆ', katakana: 'ミユ', romaji: 'Miyu' },
  { kanji: '彩花', hiragana: 'あやか', katakana: 'アヤカ', romaji: 'Ayaka' },
  { kanji: '琴音', hiragana: 'ことね', katakana: 'コトネ', romaji: 'Kotone' },
  { kanji: '千尋', hiragana: 'ちひろ', katakana: 'チヒロ', romaji: 'Chihiro' },
  { kanji: '遥', hiragana: 'はるか', katakana: 'ハルカ', romaji: 'Haruka' }
];

// ============ Types ============

export type NameFormat = 'kanji' | 'hiragana' | 'katakana' | 'romaji';
export type Gender = 'male' | 'female' | 'random';

export interface JapaneseName {
  surname: NameEntry;
  givenName: NameEntry;
  gender: 'male' | 'female';
}

// ============ Helper Functions ============

/**
 * Generates a random integer between min and max (inclusive).
 */
const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Picks a random element from an array.
 * @throws Error if array is empty
 */
const randomElement = <T>(arr: readonly T[]): T => {
  if (arr.length === 0) {
    throw new Error('Cannot pick random element from empty array');
  }
  return arr[randomInt(0, arr.length - 1)] as T;
};

// ============ Main Functions ============

/**
 * Generates a complete Japanese name object with all formats.
 * @param gender - 'male', 'female', or 'random'
 * @returns JapaneseName object containing surname, givenName, and gender
 */
export const generateJapaneseName = (gender: Gender = 'random'): JapaneseName => {
  const surname = randomElement(SURNAMES);
  const actualGender: 'male' | 'female' =
    gender === 'random' ? (Math.random() < 0.5 ? 'male' : 'female') : gender;

  const givenNameList = actualGender === 'male' ? MALE_GIVEN_NAMES : FEMALE_GIVEN_NAMES;
  const givenName = randomElement(givenNameList);

  return { surname, givenName, gender: actualGender };
};

/**
 * Generates a full name string in the specified format.
 * Japanese order: surname + given name (no space for kanji/kana, space for romaji)
 * @param format - 'kanji', 'hiragana', 'katakana', or 'romaji'
 * @param gender - 'male', 'female', or 'random'
 */
export const generateFullName = (
  format: NameFormat = 'kanji',
  gender: Gender = 'random'
): string => {
  const name = generateJapaneseName(gender);

  switch (format) {
    case 'kanji':
      return `${name.surname.kanji}${name.givenName.kanji}`;
    case 'hiragana':
      return `${name.surname.hiragana}${name.givenName.hiragana}`;
    case 'katakana':
      return `${name.surname.katakana}${name.givenName.katakana}`;
    case 'romaji':
      return `${name.surname.romaji} ${name.givenName.romaji}`;
  }
};

/**
 * Generates surname only in the specified format.
 * @param format - 'kanji', 'hiragana', 'katakana', or 'romaji'
 */
export const generateSurname = (format: NameFormat = 'kanji'): string => {
  const surname = randomElement(SURNAMES);
  return surname[format];
};

/**
 * Generates given name only in the specified format.
 * @param format - 'kanji', 'hiragana', 'katakana', or 'romaji'
 * @param gender - 'male', 'female', or 'random'
 */
export const generateGivenName = (
  format: NameFormat = 'kanji',
  gender: Gender = 'random'
): string => {
  const actualGender: 'male' | 'female' =
    gender === 'random' ? (Math.random() < 0.5 ? 'male' : 'female') : gender;

  const givenNameList = actualGender === 'male' ? MALE_GIVEN_NAMES : FEMALE_GIVEN_NAMES;
  const givenName = randomElement(givenNameList);
  return givenName[format];
};

/**
 * Generates a name with separate surname and given name fields.
 * Useful for forms that have separate fields for first/last name.
 * @param format - 'kanji', 'hiragana', 'katakana', or 'romaji'
 * @param gender - 'male', 'female', or 'random'
 */
export const generateSeparateNames = (
  format: NameFormat = 'kanji',
  gender: Gender = 'random'
): { surname: string; givenName: string } => {
  const name = generateJapaneseName(gender);
  return {
    surname: name.surname[format],
    givenName: name.givenName[format]
  };
};

/**
 * Gets all available formats for a generated name.
 * Useful when you need to fill multiple related fields (e.g., kanji name + furigana).
 * @param gender - 'male', 'female', or 'random'
 */
export const generateNameAllFormats = (
  gender: Gender = 'random'
): {
  fullName: { kanji: string; hiragana: string; katakana: string; romaji: string };
  surname: NameEntry;
  givenName: NameEntry;
  gender: 'male' | 'female';
} => {
  const name = generateJapaneseName(gender);
  return {
    fullName: {
      kanji: `${name.surname.kanji}${name.givenName.kanji}`,
      hiragana: `${name.surname.hiragana}${name.givenName.hiragana}`,
      katakana: `${name.surname.katakana}${name.givenName.katakana}`,
      romaji: `${name.surname.romaji} ${name.givenName.romaji}`
    },
    surname: name.surname,
    givenName: name.givenName,
    gender: name.gender
  };
};

// ============ Legacy Functions (Backward Compatibility) ============

/**
 * @deprecated Use generateFullName('hiragana') or generateGivenName('hiragana') instead
 * Generates a random Japanese name in Hiragana.
 */
export const generateRandomHiraganaName = (_minLength = 3, _maxLength = 6): string => {
  return generateFullName('hiragana');
};

/**
 * @deprecated Use generateFullName('katakana') or generateGivenName('katakana') instead
 * Generates a random Japanese name in Katakana.
 */
export const generateRandomKatakanaName = (_minLength = 3, _maxLength = 6): string => {
  return generateFullName('katakana');
};

/**
 * @deprecated Use generateFullName('romaji') or generateGivenName('romaji') instead
 * Generates a random Japanese-style Romaji name.
 */
export const generateRandomRomajiName = (_minLength = 3, _maxLength = 6): string => {
  return generateFullName('romaji');
};
