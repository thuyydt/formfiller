// tests/helpers/fileInputHelper.test.js

// Mock faker before importing the module
jest.mock('../../helpers/fakerLocale', () => ({
  faker: {
    string: {
      alphanumeric: jest.fn(() => 'abc12345')
    }
  }
}));

jest.mock('../../helpers/logger', () => ({
  logger: {
    debug: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  }
}));

// Mock DataTransfer for JSDOM environment
class MockDataTransfer {
  constructor() {
    this.items = {
      add: jest.fn()
    };
    this.files = {
      length: 1,
      item: () => new File(['test'], 'test.png', { type: 'image/png' })
    };
  }
}

// Store original DataTransfer
const originalDataTransfer = global.DataTransfer;

beforeAll(() => {
  global.DataTransfer = MockDataTransfer;
});

afterAll(() => {
  global.DataTransfer = originalDataTransfer;
});

const {
  generateFakeFile,
  fillFileInput,
  getAllFileInputs
} = require('../../helpers/fileInputHelper');

describe('fileInputHelper', () => {
  describe('generateFakeFile', () => {
    it('should generate a PNG file by default', () => {
      const file = generateFakeFile();
      expect(file).toBeInstanceOf(File);
      expect(file.type).toBe('image/png');
      expect(file.name).toMatch(/^test-abc12345\.png$/);
    });

    it('should generate a JPEG file when specified', () => {
      const file = generateFakeFile('image/jpeg');
      expect(file).toBeInstanceOf(File);
      expect(file.type).toBe('image/jpeg');
      expect(file.name).toMatch(/\.jpg$/);
    });

    it('should generate a GIF file when specified', () => {
      const file = generateFakeFile('image/gif');
      expect(file).toBeInstanceOf(File);
      expect(file.type).toBe('image/gif');
      expect(file.name).toMatch(/\.gif$/);
    });

    it('should generate a PDF file when specified', () => {
      const file = generateFakeFile('application/pdf');
      expect(file).toBeInstanceOf(File);
      expect(file.type).toBe('application/pdf');
      expect(file.name).toMatch(/\.pdf$/);
    });

    it('should generate a text file when specified', () => {
      const file = generateFakeFile('text/plain');
      expect(file).toBeInstanceOf(File);
      expect(file.type).toBe('text/plain');
      expect(file.name).toMatch(/\.txt$/);
    });

    it('should generate a CSV file when specified', () => {
      const file = generateFakeFile('text/csv');
      expect(file).toBeInstanceOf(File);
      expect(file.type).toBe('text/csv');
      expect(file.name).toMatch(/\.csv$/);
    });

    it('should generate a JSON file when specified', () => {
      const file = generateFakeFile('application/json');
      expect(file).toBeInstanceOf(File);
      expect(file.type).toBe('application/json');
      expect(file.name).toMatch(/\.json$/);
    });

    it('should have non-zero size', () => {
      const file = generateFakeFile('image/png');
      expect(file.size).toBeGreaterThan(0);
    });
  });

  describe('fillFileInput', () => {
    let mockFileInput;

    beforeEach(() => {
      mockFileInput = document.createElement('input');
      mockFileInput.type = 'file';
      // Mock the files property setter for JSDOM
      Object.defineProperty(mockFileInput, 'files', {
        set: function (value) {
          this._files = value;
        },
        get: function () {
          return this._files;
        },
        configurable: true
      });
    });

    it('should return false for non-file inputs', () => {
      const textInput = document.createElement('input');
      textInput.type = 'text';
      const result = fillFileInput(textInput);
      expect(result).toBe(false);
    });

    it('should fill a file input successfully', () => {
      const result = fillFileInput(mockFileInput);
      expect(result).toBe(true);
      expect(mockFileInput.files).not.toBeNull();
    });

    it('should return true when accept attribute is set', () => {
      mockFileInput.setAttribute('accept', 'image/jpeg');
      const result = fillFileInput(mockFileInput);
      expect(result).toBe(true);
    });

    it('should return true for PDF accept attribute', () => {
      mockFileInput.setAttribute('accept', 'application/pdf');
      const result = fillFileInput(mockFileInput);
      expect(result).toBe(true);
    });

    it('should return true for file extension accept attribute (.png)', () => {
      mockFileInput.setAttribute('accept', '.png');
      const result = fillFileInput(mockFileInput);
      expect(result).toBe(true);
    });

    it('should return true for file extension accept attribute (.pdf)', () => {
      mockFileInput.setAttribute('accept', '.pdf');
      const result = fillFileInput(mockFileInput);
      expect(result).toBe(true);
    });

    it('should return true for wildcard image/* accept attribute', () => {
      mockFileInput.setAttribute('accept', 'image/*');
      const result = fillFileInput(mockFileInput);
      expect(result).toBe(true);
    });

    it('should return true for multiple accept types', () => {
      mockFileInput.setAttribute('accept', '.jpg,.png,.pdf');
      const result = fillFileInput(mockFileInput);
      expect(result).toBe(true);
    });

    it('should dispatch change and input events', () => {
      const changeHandler = jest.fn();
      const inputHandler = jest.fn();
      mockFileInput.addEventListener('change', changeHandler);
      mockFileInput.addEventListener('input', inputHandler);

      fillFileInput(mockFileInput);

      expect(changeHandler).toHaveBeenCalled();
      expect(inputHandler).toHaveBeenCalled();
    });
  });

  describe('getAllFileInputs', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should return empty array when no file inputs exist', () => {
      const result = getAllFileInputs();
      expect(result).toEqual([]);
    });

    it('should return all file inputs', () => {
      const input1 = document.createElement('input');
      input1.type = 'file';
      const input2 = document.createElement('input');
      input2.type = 'file';
      document.body.appendChild(input1);
      document.body.appendChild(input2);

      const result = getAllFileInputs();
      expect(result.length).toBe(2);
    });

    it('should exclude disabled file inputs', () => {
      const input1 = document.createElement('input');
      input1.type = 'file';
      const input2 = document.createElement('input');
      input2.type = 'file';
      input2.disabled = true;
      document.body.appendChild(input1);
      document.body.appendChild(input2);

      const result = getAllFileInputs();
      expect(result.length).toBe(1);
    });

    it('should exclude readonly file inputs', () => {
      const input1 = document.createElement('input');
      input1.type = 'file';
      const input2 = document.createElement('input');
      input2.type = 'file';
      input2.setAttribute('readonly', '');
      document.body.appendChild(input1);
      document.body.appendChild(input2);

      const result = getAllFileInputs();
      expect(result.length).toBe(1);
    });

    it('should not include non-file inputs', () => {
      const input1 = document.createElement('input');
      input1.type = 'file';
      const input2 = document.createElement('input');
      input2.type = 'text';
      document.body.appendChild(input1);
      document.body.appendChild(input2);

      const result = getAllFileInputs();
      expect(result.length).toBe(1);
    });
  });
});
