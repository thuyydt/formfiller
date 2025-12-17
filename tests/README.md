# Test Suite Documentation

## Overview

This test suite provides comprehensive coverage for the Form Filler Chrome Extension. Tests are organized by module and use Jest as the testing framework.

## Structure

```
tests/
├── setup.js                           # Test environment setup
├── helpers/                           # Helper function tests
│   ├── customFieldMatcher.test.js    # Custom field matching tests
│   ├── labelFinder.test.js           # Label detection tests
│   └── typeDetection.test.js         # Field type detection tests
├── forms/                             # Form filler tests
│   ├── inputFillers.test.js          # Input field filling tests
│   └── radioCheckboxFillers.test.js  # Radio/checkbox tests
└── integration/                       # Integration tests
    └── formFilling.test.js           # End-to-end form filling tests
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- customFieldMatcher.test.js
```

### Run tests matching pattern
```bash
npm test -- --testNamePattern="should match email"
```

## Coverage Goals

- **Statements**: 70%+
- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+

## Test Categories

### Unit Tests
Tests for individual functions and modules in isolation.
- `helpers/*.test.js`
- `forms/*.test.js`

### Integration Tests
Tests for complete workflows and feature interactions.
- `integration/formFilling.test.js`

## Writing New Tests

### Test File Naming
- Use `.test.js` suffix
- Match the source file name (e.g., `customFieldMatcher.js` → `customFieldMatcher.test.js`)

### Test Structure
```javascript
describe('ModuleName', () => {
  describe('FunctionName', () => {
    test('should do something specific', () => {
      // Arrange
      const input = createTestInput();
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe(expectedValue);
    });
  });
});
```

### Best Practices

1. **Test one thing per test**
   - Each test should verify a single behavior
   - Use descriptive test names

2. **Use setup and teardown**
   ```javascript
   beforeEach(() => {
     // Setup code
   });
   
   afterEach(() => {
     // Cleanup code
   });
   ```

3. **Mock external dependencies**
   ```javascript
   jest.mock('../../helpers/fakerLocale.js');
   ```

4. **Test edge cases**
   - Null/undefined inputs
   - Empty arrays/strings
   - Boundary values
   - Error conditions

5. **Use meaningful assertions**
   ```javascript
   // Good
   expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
   
   // Avoid
   expect(email).toBeTruthy();
   ```

## Mocking Chrome APIs

Chrome extension APIs are mocked in `setup.js`:

```javascript
global.chrome = {
  runtime: {
    onMessage: { addListener: jest.fn() },
    sendMessage: jest.fn()
  },
  storage: {
    local: {
      get: jest.fn((keys, callback) => callback({})),
      set: jest.fn((data, callback) => callback())
    }
  }
};
```

## Common Test Patterns

### Testing DOM Manipulation
```javascript
test('should fill input field', () => {
  const input = document.createElement('input');
  input.type = 'email';
  document.body.appendChild(input);
  
  fillInputField(input, 'email');
  
  expect(input.value).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  
  document.body.removeChild(input);
});
```

### Testing Async Functions
```javascript
test('should handle async operation', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});
```

### Testing Event Listeners
```javascript
test('should fire change event', () => {
  const input = document.createElement('input');
  let eventFired = false;
  
  input.addEventListener('change', () => {
    eventFired = true;
  });
  
  fillInput(input);
  
  expect(eventFired).toBe(true);
});
```

## Debugging Tests

### Run single test in debug mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand tests/helpers/customFieldMatcher.test.js
```

### View detailed test output
```bash
npm test -- --verbose
```

### Show console logs
```bash
npm test -- --silent=false
```

## Continuous Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

See `.github/workflows/test.yml` for CI configuration.

## Coverage Reports

After running `npm run test:coverage`, view the HTML report:

```bash
open coverage/lcov-report/index.html
```

## Troubleshooting

### Tests fail with "Cannot find module"
- Check that all imports use correct paths
- Verify `moduleNameMapper` in `jest.config.js`

### Chrome API errors
- Ensure `setup.js` is properly configured
- Add missing Chrome API mocks

### DOM-related errors
- Use `jsdom` test environment (already configured)
- Clean up DOM after each test

### Timeout errors
- Increase timeout: `jest.setTimeout(10000)`
- Check for unresolved promises

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [Chrome Extension Testing](https://developer.chrome.com/docs/extensions/mv3/tut_testing/)
