module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.{js,ts}', '**/?(*.)+(spec|test).{js,ts}'],
  transform: {
    '^.+\\.(js|ts)$': ['babel-jest', { configFile: './babel.config.js' }]
  },
  collectCoverageFrom: [
    'helpers/**/*.{js,ts}',
    'forms/**/*.{js,ts}',
    'content.{js,ts}',
    'background.{js,ts}',
    'options.{js,ts}',
    '!**/node_modules/**',
    '!**/dist-*/**',
    '!**/lib/**', // Exclude faker lib as it's third-party
    '!helpers/typeDetection.ts' // Exclude barrel/re-export file
  ],
  coverageThreshold: {
    global: {
      branches: 72.5,
      functions: 67, // Many private/internal functions not exported
      lines: 80,
      statements: 78
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^../lib$': '<rootDir>/tests/__mocks__/fakerMock.js',
    '^../../lib$': '<rootDir>/tests/__mocks__/fakerMock.js',
    '^(.+)\\.js$': '$1'
  },
  transformIgnorePatterns: ['node_modules/(?!(faker)/)'],
  coverageDirectory: 'coverage',
  verbose: true
};
