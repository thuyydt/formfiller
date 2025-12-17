# Form Filler Browser Extension

[![Tests](https://github.com/thuyydt/formfiller/actions/workflows/test.yml/badge.svg)](https://github.com/thuyydt/formfiller/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Code Coverage](https://img.shields.io/badge/coverage-70%25+-green.svg)](./coverage)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

Fills fake-data to HTML Form with AI-powered detection.

## Browser Support
- ✅ **Chrome** (v126+): Install from [Chrome Web Store](https://chromewebstore.google.com/detail/form-filler/akgccbkihlhgjmapmjbhafnoehhkpaai)
- ✅ **Firefox** (v142+): Install from [Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/form-filler-thuyydt/)
- ✅ **Safari** (v14+, macOS only): Download from gitHub Releases and follow [Safari Installation Guide](./SAFARI_INSTALL_GUIDE.md)
- ✅ **Edge** (Chromium-based): Install from Chrome Web Store

## Language Support
- English
- Vietnamese
- Japanese
- Chinese
- Arabic
- Korean
- Spanish
- Polish
- French
- German
- Russian

# Long Description
This browser extension automatically fills out HTML forms with fake data, making it easier for developers and testers to quickly populate forms without having to manually enter information. It supports multiple languages and browsers.
- Simply click the extension icon to fill the current page's form fields with fake data.
- The extension can handle various input types such as text, email, number, date, checkbox, radio buttons, select dropdowns, and textareas.
- It generates realistic fake data for each field type, ensuring that the filled data is appropriate for the field's requirements.
- Ignores fields that are not relevant or do not require input, such as submit buttons and hidden fields.

## Installation

### From Chrome Web Store
Coming soon...

### From Firefox Add-ons
Coming soon...

### From Safari App Store
Please see our [Safari Installation Guide](./SAFARI_INSTALL_GUIDE.md) for detailed instructions on how to install and enable the extension on macOS.

### Manual Installation (Development)

**Chrome/Edge:**
1. Go to `chrome://extensions/` in Chrome.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and select this folder.
4. Click the extension icon to fill fake data on the current page.

**Firefox:**
1. Build Firefox version: `npm run build:firefox`
2. Go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select `manifest.json` from `dist-firefox` folder

For detailed Firefox submission guide, see [FIREFOX_ADDON_GUIDE.md](./FIREFOX_ADDON_GUIDE.md)

**Safari:**
1. Build Safari version: `npm run build:safari`
2. Open Xcode and create Safari Extension App
3. Replace extension folder with `dist-safari/` contents
4. Build and run in Xcode
5. Enable extension in Safari Preferences > Extensions

For detailed Safari conversion guide, see [SAFARI_EXTENSION_GUIDE.md](./SAFARI_EXTENSION_GUIDE.md)

## Features
- Fills text, email, number, date, checkbox, radio, select, and textarea fields with fake data.
- **Clear/Undo**: Undo the last fill operation or clear all fields at once
- **AI-Powered Detection** 🤖: Machine learning-inspired algorithms for intelligent field type detection
- **Enhanced Custom Fields**: Create custom patterns to match specific fields using wildcards (*address*, *email*, etc.)
- **Label-Based Matching**: Automatically detects field purposes by analyzing nearby label text
- **Multi-language Support**: Works with 11 languages including English, Japanese, Chinese, Korean, and more
- **Smart Field Detection**: Ignores irrelevant fields like submit buttons and hidden inputs
- **Flexible Configuration**: Customize ignored fields, domains, and field matching patterns
- **Visual Feedback**: Toast notifications and field highlighting when form is filled

## Keyboard Shortcuts
- `Cmd+Shift+F` (Mac) / `Ctrl+Shift+F` (Windows) - Fill form with fake data
- `Cmd+Shift+Z` (Mac) / `Ctrl+Shift+Z` (Windows) - Undo last fill operation
- `Cmd+Shift+X` (Mac) / `Ctrl+Shift+X` (Windows) - Clear all form fields

**Customize shortcuts:**
1. Open extension settings (right-click icon → Options)
2. Go to "Keyboard Shortcuts" section
3. Click "Customize Keyboard Shortcuts" button
4. Set your preferred key combinations

You can also right-click the extension icon for quick access to these actions.

## Advanced Features

### Custom Field Matching 🆕
Create powerful custom rules to precisely control how fields are filled with three types:

#### 1. **List Type**
Pick random values from a comma-separated list
- Example: Match `*city*` → Fill with `Hanoi,Ho Chi Minh,Da Nang`

#### 2. **Regex Type**
Generate data using regular expression patterns
- Example: Match `*username*` → Pattern `USER-[0-9]{5}` → Result: `USER-12345`

#### 3. **Faker Type** (NEW!)
Use built-in Faker.js data types for realistic fake data:
- **Person:** `person.firstName`, `person.lastName`, `person.fullName`, `person.jobTitle`
- **Location:** `location.city`, `location.streetAddress`, `location.country`, `location.zipCode`
- **Contact:** `internet.email`, `internet.userName`, `phone.number`, `internet.url`
- **Company:** `company.name`, `company.catchPhrase`
- **Finance:** `finance.amount`, `finance.creditCardNumber`, `finance.currencyName`
- **Date:** `date.past`, `date.future`, `date.birthdate`
- **Text:** `lorem.word`, `lorem.sentence`, `lorem.paragraph`
- And many more!

**Wildcard Patterns:**
- `*email*` - Matches any field containing "email"
- `phone*` - Matches fields starting with "phone"
- `*address` - Matches fields ending with "address"

**CSS Selectors:**
- `.email-field` - Match by class name
- `#username` - Match by ID
- `[data-field="email"]` - Match by attribute

### Label-Based Matching
When enabled, the extension intelligently finds labels associated with input fields:
- Detects standard `<label>` elements
- Finds closest text elements (span, div, p, etc.) that describe the field
- Uses aria-label and placeholder text as fallbacks
- Calculates distance to find the most relevant label for each field

This feature is particularly useful for forms that don't have clear field identifiers but have descriptive labels nearby.

### AI-Powered Field Detection 🤖
**NEW!** Smart field type detection using machine learning-inspired algorithms:
- Automatically detects field types when standard rules don't match
- Analyzes field names, labels, placeholders, and context
- Provides confidence scores for predictions (adjustable threshold 30-95%)
- Works as intelligent fallback for ambiguous or non-standard fields
- Trained on thousands of real-world form patterns
- Supports multi-language field detection (11+ languages)

**Example use cases:**
- Non-standard field naming: `usr_eml` → detected as `email`
- Ambiguous fields: `contact_info` → `email` or `phone` based on context
- Multi-language forms: `correo_electronico` → `email`
- Complex forms with minimal attributes

## Development

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/thuyydt/formfiller.git
cd Form-Filler-Chrome-Extension

# Install dependencies
npm install

# Build the extension
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Type check TypeScript files
npm run type-check

# Run linter
npm run lint

# Format code
npm run format
```

### TypeScript Support
The extension uses TypeScript for better type safety and developer experience:

- **Strict TypeScript**: Full type checking enabled
- **Chrome API Types**: Complete type coverage for extension APIs  
- **Type Definitions**: Comprehensive interfaces in `types.ts`
- **IDE Support**: Enhanced IntelliSense and refactoring

```bash
# Type check all TypeScript files
npm run type-check

# Watch mode for continuous type checking
npm run type-check:watch
```

### Testing
The extension has comprehensive test coverage (70%+) using Jest:

- **Unit Tests**: Helper functions, field detection, form fillers
- **Integration Tests**: Complete form filling workflows
- **450+ Test Cases**: Covering edge cases and error handling

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

### Build
```bash
# Build for Chrome
npm run build:chrome

# Build for Firefox
npm run build:firefox

# Build for Safari
npm run build:safari

# Build for all browsers
npm run build:all
```

Output:
- `dist-chrome/` - Chrome extension package
- `dist-firefox/` - Firefox extension package
- `dist-safari/` - Safari Web Extension (requires Xcode wrapper)

**Safari Note:** Safari extensions require an Xcode wrapper app. After running `build:safari`, follow these steps:
1. Open Xcode and create: File > New > Project > macOS > Safari Extension App
2. Replace the extension folder with `dist-safari/` contents
3. Configure signing in Xcode
4. Build and run to test in Safari

See [Safari Web Extensions Guide](https://developer.apple.com/documentation/safariservices/safari_web_extensions) for details.

## Usage
- Click the extension icon on any page with forms to auto-fill them with fake data.
