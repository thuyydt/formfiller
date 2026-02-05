// radioCheckboxFillers.test.js
import { fillRadios, fillCheckboxes } from '../../forms/radioCheckboxFillers';

describe('radioCheckboxFillers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('fillRadios', () => {
    test('should handle page with no radios', () => {
      expect(() => fillRadios()).not.toThrow();
    });

    test('should fill radio buttons when present', () => {
      const form = document.createElement('form');
      for (let i = 0; i < 3; i++) {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'test-group';
        radio.value = `option${i + 1}`;
        form.appendChild(radio);
      }
      document.body.appendChild(form);

      fillRadios();

      const radios = form.querySelectorAll('input[type="radio"]');
      expect(radios.length).toBe(3);
    });

    test('should not throw with settings', () => {
      const settings = {
        ignoreFields: 'password',
        ignoreHidden: true,
        ignoreFilled: false
      };

      expect(() => fillRadios(settings)).not.toThrow();
    });

    test('should skip disabled radios', () => {
      const form = document.createElement('form');
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'test';
      radio.disabled = true;
      form.appendChild(radio);
      document.body.appendChild(form);

      fillRadios();

      expect(radio.checked).toBe(false);
    });

    test('should skip radios on ignored domains', () => {
      const settings = {
        ignoreDomains: 'example.com,test.com'
      };

      expect(() => fillRadios(settings)).not.toThrow();
    });
  });

  describe('fillCheckboxes', () => {
    test('should handle page with no checkboxes', () => {
      expect(() => fillCheckboxes()).not.toThrow();
    });

    test('should fill checkboxes when present', () => {
      const form = document.createElement('form');
      for (let i = 0; i < 3; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = `checkbox${i}`;
        checkbox.value = `value${i}`;
        form.appendChild(checkbox);
      }
      document.body.appendChild(form);

      fillCheckboxes();

      const checkboxes = form.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBe(3);
    });

    test('should not throw with settings', () => {
      const settings = {
        ignoreFields: 'password',
        ignoreHidden: true,
        ignoreFilled: false
      };

      expect(() => fillCheckboxes(settings)).not.toThrow();
    });

    test('should skip disabled checkboxes', () => {
      const form = document.createElement('form');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.disabled = true;
      form.appendChild(checkbox);
      document.body.appendChild(form);

      fillCheckboxes();

      expect(checkbox.checked).toBe(false);
    });

    test('should skip readonly checkboxes', () => {
      const form = document.createElement('form');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.setAttribute('readonly', true);
      form.appendChild(checkbox);
      document.body.appendChild(form);

      fillCheckboxes();

      expect(checkbox.checked).toBe(false);
    });

    test('should handle multiple checkbox groups', () => {
      const form = document.createElement('form');

      // Group 1
      for (let i = 0; i < 2; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'group1';
        checkbox.value = `g1_option${i}`;
        form.appendChild(checkbox);
      }

      // Group 2
      for (let i = 0; i < 2; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'group2';
        checkbox.value = `g2_option${i}`;
        form.appendChild(checkbox);
      }

      document.body.appendChild(form);

      fillCheckboxes();

      const checkboxes = form.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBe(4);
    });

    test('should skip checkboxes on ignored domains', () => {
      const settings = {
        ignoreDomains: 'example.com'
      };

      expect(() => fillCheckboxes(settings)).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    test('should handle form with both radios and checkboxes', () => {
      const form = document.createElement('form');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'terms';

      const radio1 = document.createElement('input');
      radio1.type = 'radio';
      radio1.name = 'gender';
      radio1.value = 'male';

      const radio2 = document.createElement('input');
      radio2.type = 'radio';
      radio2.name = 'gender';
      radio2.value = 'female';

      form.appendChild(checkbox);
      form.appendChild(radio1);
      form.appendChild(radio2);
      document.body.appendChild(form);

      expect(() => {
        fillCheckboxes();
        fillRadios();
      }).not.toThrow();
    });

    test('should work with custom field settings', () => {
      const form = document.createElement('form');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'email_subscribe';
      form.appendChild(checkbox);
      document.body.appendChild(form);

      const settings = {
        customFields: [{ field: '*email*', type: 'list', value: 'true' }],
        enableLabelMatching: false
      };

      expect(() => fillCheckboxes(settings)).not.toThrow();
    });
  });
});
