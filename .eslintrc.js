module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
    webextensions: true
  },
  extends: [
    'eslint:recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }]
      }
    },
    {
      files: ['components/**/*.ts'],
      rules: {
        '@typescript-eslint/unbound-method': 'off',
        'indent': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off'
      }
    },
    {
      files: ['*.js'],
      parserOptions: {
        project: null
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      files: ['tests/**/*.js', 'jest.config.js', 'babel.config.js'],
      parserOptions: {
        project: null
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ],
  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    'no-console': ['warn', { 
      allow: ['warn', 'error'] 
    }],
    'no-debugger': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'arrow-spacing': 'error',
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],
    'keyword-spacing': 'error',
    'space-infix-ops': 'error',
    'eol-last': ['error', 'always'],
    'no-trailing-spaces': 'error',
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }]
  },
  globals: {
    chrome: 'readonly',
    faker: 'readonly',
    importScripts: 'readonly',
    createLocaleContextMenus: 'readonly'
  },
  ignorePatterns: [
    'node_modules/',
    'dist-*/',
    'dist/',
    'coverage/',
    '*.bundle.js',
    'lib/faker.ts',
    'lib/**/*.ts'
  ]
};
