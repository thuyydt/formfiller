// fakerMock.js - Mock faker library for testing
const mockPerson = {
  firstName: () => 'John',
  lastName: () => 'Doe',
  fullName: () => 'John Doe',
  jobTitle: () => 'Software Engineer'
};

const mockInternet = {
  email: options => (options?.provider ? `test@${options.provider}` : 'test@example.com'),
  username: () => 'testuser',
  url: () => 'https://example.com',
  userName: () => 'testuser',
  domainName: () => 'example.com',
  password: () => 'TestPass123!',
  ipv4: () => '192.168.1.1',
  mac: () => '00:11:22:33:44:55',
  emoji: () => '😀',
  userAgent: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
};

const mockLocation = {
  city: () => 'New York',
  country: () => 'United States',
  streetAddress: () => '123 Main St',
  zipCode: () => '10001',
  state: () => 'NY',
  buildingNumber: () => '456',
  secondaryAddress: () => 'Apt 789',
  latitude: options => {
    const min = options?.min || -90;
    const max = options?.max || 90;
    return Math.random() * (max - min) + min;
  },
  longitude: options => {
    const min = options?.min || -180;
    const max = options?.max || 180;
    return Math.random() * (max - min) + min;
  }
};

const mockPhone = {
  number: options => {
    if (options?.style === 'international') {
      return '+1-555-0123';
    }
    return '555-0123';
  }
};

const mockCompany = {
  name: () => 'Acme Corp',
  catchPhrase: () => 'Innovation at its finest'
};

const mockFinance = {
  amount: options => {
    const min = options?.min || 0;
    const max = options?.max || 1000;
    const dec = options?.dec || 2;
    const value = Math.random() * (max - min) + min;
    return value.toFixed(dec);
  },
  creditCardNumber: () => '4111111111111111',
  creditCardCVV: () => '123',
  currencyName: () => 'US Dollar',
  currencyCode: () => 'USD',
  currencySymbol: () => '$',
  accountName: () => 'Checking Account',
  accountNumber: () => '12345678'
};

const mockDate = {
  past: options => {
    const years = options?.years || 1;
    const date = new Date();
    date.setFullYear(date.getFullYear() - years);
    return date;
  },
  future: () => new Date('2025-12-31'),
  birthdate: () => new Date('1990-01-01'),
  recent: options => {
    const days = options?.days || 1;
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  },
  weekday: () => 'monday'
};

const mockLorem = {
  word: () => 'lorem',
  words: options => {
    const count = typeof options === 'number' ? options : options?.min || 3;
    return Array(count).fill('word').join(' ');
  },
  sentence: () => 'Lorem ipsum dolor sit amet.',
  paragraph: () => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
};

const mockColor = {
  human: () => 'blue',
  rgb: options => {
    if (options?.format === 'hex') {
      return '#0000ff';
    }
    return 'rgb(0, 0, 255)';
  },
  hex: () => '#0000ff'
};

const mockNumber = {
  int: options => {
    const min = options?.min || 0;
    const max = options?.max || 100;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  float: options => {
    const min = options?.min || 0;
    const max = options?.max || 100;
    return Math.random() * (max - min) + min;
  }
};

const mockString = {
  numeric: (length = 5) => '12345'.substring(0, length),
  alpha: (length = 5) => 'ABCDE'.substring(0, length),
  alphanumeric: (length = 8) => 'ABC123XY'.substring(0, length)
};

const mockHelpers = {
  arrayElement: array => array[Math.floor(Math.random() * array.length)],
  shuffle: array => [...array].sort(() => Math.random() - 0.5)
};

const mockSystem = {
  fileName: () => 'document.txt',
  filePath: () => '/home/user/document.txt'
};

const mockWord = {
  words: (count = 3) => Array(count).fill('word').join(' ')
};

const mockFaker = {
  person: mockPerson,
  internet: mockInternet,
  location: mockLocation,
  phone: mockPhone,
  company: mockCompany,
  finance: mockFinance,
  date: mockDate,
  lorem: mockLorem,
  color: mockColor,
  number: mockNumber,
  string: mockString,
  helpers: mockHelpers,
  system: mockSystem,
  word: mockWord,
  setLocale: () => {},
  seed: () => {}
};

// Export faker instances for all locales
export const fakerEN = mockFaker;
export const fakerJA = mockFaker;
export const fakerVI = mockFaker;
export const fakerZH_CN = mockFaker;
export const fakerAR = mockFaker;
export const fakerDE = mockFaker;
export const fakerES = mockFaker;
export const fakerFR = mockFaker;
export const fakerKO = mockFaker;
export const fakerPL = mockFaker;
export const fakerRU = mockFaker;

export default mockFaker;
