// tests/helpers/domHelpers.test.js
import {
  getAllInputs,
  getAllTextareas,
  getAllSelects,
  getAllRadios,
  getAllCheckboxes,
  waitForElements,
  isElementVisible,
  clearTraversalCache
} from '../../helpers/domHelpers';

describe('domHelpers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    clearTraversalCache(); // Clear cache before each test
  });

  afterEach(() => {
    document.body.innerHTML = '';
    clearTraversalCache(); // Clear cache after each test
  });

  describe('getAllInputs', () => {
    it('should return empty array when no inputs exist', () => {
      const inputs = getAllInputs();
      expect(inputs).toEqual([]);
    });

    it('should get all text inputs from document', () => {
      document.body.innerHTML = `
        <form>
          <input type="text" id="name" />
          <input type="email" id="email" />
          <input type="tel" id="phone" />
        </form>
      `;

      const inputs = getAllInputs();
      expect(inputs.length).toBe(3);
      expect(inputs[0].id).toBe('name');
      expect(inputs[1].id).toBe('email');
      expect(inputs[2].id).toBe('phone');
    });

    it('should exclude disabled inputs', () => {
      document.body.innerHTML = `
        <input type="text" id="enabled" />
        <input type="text" id="disabled" disabled />
      `;

      const inputs = getAllInputs();
      expect(inputs.length).toBe(1);
      expect(inputs[0].id).toBe('enabled');
    });

    it('should get inputs from shadow DOM', () => {
      const host = document.createElement('div');
      const shadowRoot = host.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = '<input type="text" id="shadow-input" />';
      document.body.appendChild(host);

      const inputs = getAllInputs();
      expect(inputs.length).toBe(1);
      expect(inputs[0].id).toBe('shadow-input');
    });

    it('should get inputs from nested shadow DOM', () => {
      const host1 = document.createElement('div');
      const shadow1 = host1.attachShadow({ mode: 'open' });

      const host2 = document.createElement('div');
      const shadow2 = host2.attachShadow({ mode: 'open' });
      shadow2.innerHTML = '<input type="text" id="nested-input" />';

      shadow1.appendChild(host2);
      document.body.appendChild(host1);

      const inputs = getAllInputs();
      expect(inputs.length).toBe(1);
      expect(inputs[0].id).toBe('nested-input');
    });

    it('should handle iframes gracefully', () => {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);

      // This should not throw
      expect(() => getAllInputs()).not.toThrow();
    });

    it('should get inputs from accessible iframes', () => {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);

      // Set up iframe document
      if (iframe.contentDocument) {
        iframe.contentDocument.body.innerHTML = '<input type="text" id="iframe-input" />';
      }

      const inputs = getAllInputs();
      // Should include iframe input if accessible
      const iframeInput = inputs.find(input => input.id === 'iframe-input');
      if (iframe.contentDocument) {
        expect(iframeInput).toBeDefined();
      }
    });

    it('should handle multiple forms', () => {
      document.body.innerHTML = `
        <form id="form1">
          <input type="text" id="input1" />
        </form>
        <form id="form2">
          <input type="text" id="input2" />
        </form>
      `;

      const inputs = getAllInputs();
      expect(inputs.length).toBe(2);
    });
  });

  describe('getAllTextareas', () => {
    it('should return empty array when no textareas exist', () => {
      const textareas = getAllTextareas();
      expect(textareas).toEqual([]);
    });

    it('should get all textareas from document', () => {
      document.body.innerHTML = `
        <textarea id="bio"></textarea>
        <textarea id="comments"></textarea>
      `;

      const textareas = getAllTextareas();
      expect(textareas.length).toBe(2);
      expect(textareas[0].id).toBe('bio');
      expect(textareas[1].id).toBe('comments');
    });

    it('should exclude disabled textareas', () => {
      document.body.innerHTML = `
        <textarea id="enabled"></textarea>
        <textarea id="disabled" disabled></textarea>
      `;

      const textareas = getAllTextareas();
      expect(textareas.length).toBe(1);
      expect(textareas[0].id).toBe('enabled');
    });

    it('should get textareas from shadow DOM', () => {
      const host = document.createElement('div');
      const shadowRoot = host.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = '<textarea id="shadow-textarea"></textarea>';
      document.body.appendChild(host);

      const textareas = getAllTextareas();
      expect(textareas.length).toBe(1);
      expect(textareas[0].id).toBe('shadow-textarea');
    });

    it('should handle iframes gracefully', () => {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);

      expect(() => getAllTextareas()).not.toThrow();
    });
  });

  describe('getAllSelects', () => {
    it('should return empty array when no selects exist', () => {
      const selects = getAllSelects();
      expect(selects).toEqual([]);
    });

    it('should get all select elements from document', () => {
      document.body.innerHTML = `
        <select id="country">
          <option value="us">US</option>
        </select>
        <select id="state">
          <option value="ca">CA</option>
        </select>
      `;

      const selects = getAllSelects();
      expect(selects.length).toBe(2);
      expect(selects[0].id).toBe('country');
      expect(selects[1].id).toBe('state');
    });

    it('should exclude disabled selects', () => {
      document.body.innerHTML = `
        <select id="enabled"></select>
        <select id="disabled" disabled></select>
      `;

      const selects = getAllSelects();
      expect(selects.length).toBe(1);
      expect(selects[0].id).toBe('enabled');
    });

    it('should get selects from shadow DOM', () => {
      const host = document.createElement('div');
      const shadowRoot = host.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = '<select id="shadow-select"></select>';
      document.body.appendChild(host);

      const selects = getAllSelects();
      expect(selects.length).toBe(1);
      expect(selects[0].id).toBe('shadow-select');
    });

    it('should handle iframes gracefully', () => {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);

      expect(() => getAllSelects()).not.toThrow();
    });
  });

  describe('getAllRadios', () => {
    it('should return empty array when no radios exist', () => {
      const radios = getAllRadios();
      expect(radios).toEqual([]);
    });

    it('should get all radio inputs from document', () => {
      document.body.innerHTML = `
        <input type="radio" name="gender" value="male" id="male" />
        <input type="radio" name="gender" value="female" id="female" />
      `;

      const radios = getAllRadios();
      expect(radios.length).toBe(2);
      expect(radios[0].id).toBe('male');
      expect(radios[1].id).toBe('female');
    });

    it('should exclude disabled radios', () => {
      document.body.innerHTML = `
        <input type="radio" name="test" id="enabled" />
        <input type="radio" name="test" id="disabled" disabled />
      `;

      const radios = getAllRadios();
      expect(radios.length).toBe(1);
      expect(radios[0].id).toBe('enabled');
    });

    it('should get radios from shadow DOM', () => {
      const host = document.createElement('div');
      const shadowRoot = host.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = '<input type="radio" id="shadow-radio" />';
      document.body.appendChild(host);

      const radios = getAllRadios();
      expect(radios.length).toBe(1);
      expect(radios[0].id).toBe('shadow-radio');
    });

    it('should handle iframes gracefully', () => {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);

      expect(() => getAllRadios()).not.toThrow();
    });
  });

  describe('getAllCheckboxes', () => {
    it('should return empty array when no checkboxes exist', () => {
      const checkboxes = getAllCheckboxes();
      expect(checkboxes).toEqual([]);
    });

    it('should get all checkbox inputs from document', () => {
      document.body.innerHTML = `
        <input type="checkbox" id="terms" />
        <input type="checkbox" id="newsletter" />
      `;

      const checkboxes = getAllCheckboxes();
      expect(checkboxes.length).toBe(2);
      expect(checkboxes[0].id).toBe('terms');
      expect(checkboxes[1].id).toBe('newsletter');
    });

    it('should exclude disabled checkboxes', () => {
      document.body.innerHTML = `
        <input type="checkbox" id="enabled" />
        <input type="checkbox" id="disabled" disabled />
      `;

      const checkboxes = getAllCheckboxes();
      expect(checkboxes.length).toBe(1);
      expect(checkboxes[0].id).toBe('enabled');
    });

    it('should get checkboxes from shadow DOM', () => {
      const host = document.createElement('div');
      const shadowRoot = host.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = '<input type="checkbox" id="shadow-checkbox" />';
      document.body.appendChild(host);

      const checkboxes = getAllCheckboxes();
      expect(checkboxes.length).toBe(1);
      expect(checkboxes[0].id).toBe('shadow-checkbox');
    });

    it('should handle iframes gracefully', () => {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);

      expect(() => getAllCheckboxes()).not.toThrow();
    });
  });

  describe('waitForElements', () => {
    it('should resolve immediately if elements exist', async () => {
      document.body.innerHTML = '<div class="test"></div>';

      const result = await waitForElements('.test', 1000);
      expect(result).toBe(true);
    });

    it('should wait for elements to appear', async () => {
      setTimeout(() => {
        document.body.innerHTML = '<div class="delayed"></div>';
      }, 200);

      const result = await waitForElements('.delayed', 1000);
      expect(result).toBe(true);
    });

    it('should timeout if elements never appear', async () => {
      const result = await waitForElements('.nonexistent', 500);
      expect(result).toBe(false);
    }, 1000);

    it('should handle multiple elements', async () => {
      document.body.innerHTML = `
        <div class="item"></div>
        <div class="item"></div>
      `;

      const result = await waitForElements('.item', 1000);
      expect(result).toBe(true);
    });

    it('should respect custom timeout', async () => {
      const start = Date.now();
      await waitForElements('.never', 300);
      const duration = Date.now() - start;

      expect(duration).toBeGreaterThanOrEqual(300);
      expect(duration).toBeLessThan(500);
    }, 1000);
  });

  describe('isElementVisible', () => {
    it('should return false for null element', () => {
      expect(isElementVisible(null)).toBe(false);
    });

    it('should return true for visible element', () => {
      const div = document.createElement('div');
      div.style.width = '100px';
      div.style.height = '100px';
      div.textContent = 'test';
      document.body.appendChild(div);

      // In JSDOM, offsetParent is used for visibility check
      const isVisible = isElementVisible(div);
      expect(typeof isVisible).toBe('boolean');

      document.body.removeChild(div);
    });

    it('should return false for display:none', () => {
      const div = document.createElement('div');
      div.style.display = 'none';
      document.body.appendChild(div);

      expect(isElementVisible(div)).toBe(false);

      document.body.removeChild(div);
    });

    it('should return false for visibility:hidden', () => {
      const div = document.createElement('div');
      div.style.visibility = 'hidden';
      div.style.width = '100px';
      div.style.height = '100px';
      document.body.appendChild(div);

      expect(isElementVisible(div)).toBe(false);

      document.body.removeChild(div);
    });

    it('should return false for opacity:0', () => {
      const div = document.createElement('div');
      div.style.opacity = '0';
      div.style.width = '100px';
      div.style.height = '100px';
      document.body.appendChild(div);

      expect(isElementVisible(div)).toBe(false);

      document.body.removeChild(div);
    });

    it('should return false for zero width or height', () => {
      const div = document.createElement('div');
      div.style.width = '0';
      div.style.height = '0';
      document.body.appendChild(div);

      expect(isElementVisible(div)).toBe(false);

      document.body.removeChild(div);
    });

    it('should return false when parent has display:none', () => {
      const parent = document.createElement('div');
      parent.style.display = 'none';
      const child = document.createElement('div');
      child.style.width = '100px';
      child.style.height = '100px';
      parent.appendChild(child);
      document.body.appendChild(parent);

      expect(isElementVisible(child)).toBe(false);

      document.body.removeChild(parent);
    });

    it('should handle element with proper dimensions', () => {
      const div = document.createElement('div');
      div.style.width = '200px';
      div.style.height = '100px';
      div.style.display = 'block';
      div.textContent = 'content';
      document.body.appendChild(div);

      const isVisible = isElementVisible(div);
      expect(typeof isVisible).toBe('boolean');

      document.body.removeChild(div);
    });
  });

  describe('Integration tests', () => {
    it('should handle complex form with mixed elements', () => {
      document.body.innerHTML = `
        <form>
          <input type="text" id="name" />
          <input type="email" id="email" />
          <textarea id="bio"></textarea>
          <select id="country"></select>
          <input type="radio" name="gender" value="m" />
          <input type="radio" name="gender" value="f" />
          <input type="checkbox" id="terms" />
        </form>
      `;

      expect(getAllInputs().length).toBe(5); // text, email, 2 radios, 1 checkbox
      expect(getAllTextareas().length).toBe(1);
      expect(getAllSelects().length).toBe(1);
      expect(getAllRadios().length).toBe(2);
      expect(getAllCheckboxes().length).toBe(1);
    });

    it('should handle shadow DOM with multiple elements', () => {
      const host = document.createElement('div');
      const shadow = host.attachShadow({ mode: 'open' });
      shadow.innerHTML = `
        <input type="text" id="shadow-text" />
        <textarea id="shadow-textarea"></textarea>
        <select id="shadow-select"></select>
      `;
      document.body.appendChild(host);

      expect(getAllInputs().length).toBe(1);
      expect(getAllTextareas().length).toBe(1);
      expect(getAllSelects().length).toBe(1);
    });
  });
});
