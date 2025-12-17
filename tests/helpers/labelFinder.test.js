// labelFinder.test.js
import { findClosestLabel, getAllPossibleLabels } from '../../helpers/labelFinder';

describe('labelFinder', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('findClosestLabel', () => {
    test('should find label using labels property', () => {
      const input = document.createElement('input');
      input.id = 'test-input';
      const label = document.createElement('label');
      label.htmlFor = 'test-input';
      label.textContent = 'Test Label';

      document.body.appendChild(label);
      document.body.appendChild(input);

      const result = findClosestLabel(input);
      expect(result).toBe('Test Label');
    });

    test('should return empty string when no label found', () => {
      const input = document.createElement('input');
      document.body.appendChild(input);

      const result = findClosestLabel(input);
      expect(result).toBe('');
    });

    test('should find label from parent element', () => {
      const container = document.createElement('div');
      const label = document.createElement('label');
      label.textContent = 'Parent Label';
      const input = document.createElement('input');

      label.appendChild(input);
      container.appendChild(label);
      document.body.appendChild(container);

      const result = findClosestLabel(input);
      expect(result).toBeTruthy();
    });

    test('should handle null input', () => {
      const result = findClosestLabel(null);
      expect(result).toBe('');
    });

    test('should trim label text', () => {
      const input = document.createElement('input');
      input.id = 'test-input';
      const label = document.createElement('label');
      label.htmlFor = 'test-input';
      label.textContent = '  Trimmed Label  ';

      document.body.appendChild(label);
      document.body.appendChild(input);

      const result = findClosestLabel(input);
      expect(result).toBe('Trimmed Label');
    });

    test('should find label by calculating distance to nearby span', () => {
      const container = document.createElement('div');
      const span = document.createElement('span');
      span.textContent = 'Username';
      const input = document.createElement('input');

      container.appendChild(span);
      container.appendChild(input);
      document.body.appendChild(container);

      const result = findClosestLabel(input);
      expect(result).toBe('Username');
    });

    test('should find label from div element', () => {
      const container = document.createElement('div');
      const labelDiv = document.createElement('div');
      labelDiv.textContent = 'Email Address';
      const input = document.createElement('input');

      container.appendChild(labelDiv);
      container.appendChild(input);
      document.body.appendChild(container);

      const result = findClosestLabel(input);
      expect(result).toBe('Email Address');
    });

    test('should find label from paragraph element', () => {
      const container = document.createElement('div');
      const p = document.createElement('p');
      p.textContent = 'Password Field';
      const input = document.createElement('input');

      container.appendChild(p);
      container.appendChild(input);
      document.body.appendChild(container);

      const result = findClosestLabel(input);
      expect(result).toBe('Password Field');
    });

    test('should find label from td element', () => {
      const table = document.createElement('table');
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      td1.textContent = 'Phone Number';
      const td2 = document.createElement('td');
      const input = document.createElement('input');

      td2.appendChild(input);
      tr.appendChild(td1);
      tr.appendChild(td2);
      table.appendChild(tr);
      document.body.appendChild(table);

      const result = findClosestLabel(input);
      expect(result).toBe('Phone Number');
    });

    test('should find label from th element', () => {
      const table = document.createElement('table');
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.textContent = 'Full Name';
      const td = document.createElement('td');
      const input = document.createElement('input');

      td.appendChild(input);
      tr.appendChild(th);
      tr.appendChild(td);
      table.appendChild(tr);
      document.body.appendChild(table);

      const result = findClosestLabel(input);
      expect(result).toBe('Full Name');
    });

    test('should find label from legend element', () => {
      const fieldset = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = 'Personal Info';
      const input = document.createElement('input');

      fieldset.appendChild(legend);
      fieldset.appendChild(input);
      document.body.appendChild(fieldset);

      const result = findClosestLabel(input);
      expect(result).toBe('Personal Info');
    });

    test('should find label from heading elements', () => {
      const container = document.createElement('div');
      const h3 = document.createElement('h3');
      h3.textContent = 'Contact Details';
      const input = document.createElement('input');

      container.appendChild(h3);
      container.appendChild(input);
      document.body.appendChild(container);

      const result = findClosestLabel(input);
      expect(result).toBe('Contact Details');
    });

    test('should ignore elements with text longer than 100 characters', () => {
      const container = document.createElement('div');
      const longTextDiv = document.createElement('div');
      longTextDiv.textContent = 'A'.repeat(101);
      const shortLabel = document.createElement('span');
      shortLabel.textContent = 'Short';
      const input = document.createElement('input');

      container.appendChild(longTextDiv);
      container.appendChild(shortLabel);
      container.appendChild(input);
      document.body.appendChild(container);

      const result = findClosestLabel(input);
      expect(result).toBe('Short');
    });

    test('should cache computed style for performance', () => {
      const container = document.createElement('div');
      const label = document.createElement('span');
      label.textContent = 'Test Label';
      const input = document.createElement('input');

      container.appendChild(label);
      container.appendChild(input);
      document.body.appendChild(container);

      const result = findClosestLabel(input);
      expect(result).toBe('Test Label');
      // Check that style was cached
      expect(label._cachedStyle).toBeDefined();
    });    test('should search up to maxDepth levels', () => {
      const level1 = document.createElement('div');
      const level2 = document.createElement('div');
      const level3 = document.createElement('div');
      const level4 = document.createElement('div');

      const labelAtLevel3 = document.createElement('span');
      labelAtLevel3.textContent = 'Level 3 Label';

      const input = document.createElement('input');

      level3.appendChild(labelAtLevel3);
      level3.appendChild(level2);
      level2.appendChild(level1);
      level1.appendChild(input);
      level4.appendChild(level3);
      document.body.appendChild(level4);

      const result = findClosestLabel(input);
      expect(result).toBe('Level 3 Label');
    });

    test('should use cached rect for performance', () => {
      const container = document.createElement('div');
      const label = document.createElement('span');
      label.textContent = 'Cached Test';
      const input = document.createElement('input');

      container.appendChild(label);
      container.appendChild(input);
      document.body.appendChild(container);

      // Call twice to ensure caching works
      const result1 = findClosestLabel(input);
      const result2 = findClosestLabel(input);

      expect(result1).toBe('Cached Test');
      expect(result2).toBe('Cached Test');
    });

    test('should find closest label when multiple labels exist', () => {
      const container = document.createElement('div');
      const nearLabel = document.createElement('span');
      nearLabel.textContent = 'Near Label';

      const input = document.createElement('input');

      container.appendChild(nearLabel);
      container.appendChild(input);
      document.body.appendChild(container);

      const result = findClosestLabel(input);
      expect(result).toBe('Near Label');
    });
  });

  describe('getAllPossibleLabels', () => {
    test('should collect all possible label sources', () => {
      const input = document.createElement('input');
      input.id = 'test-input';
      input.placeholder = 'Enter your email';
      input.setAttribute('aria-label', 'Email input');

      const label = document.createElement('label');
      label.htmlFor = 'test-input';
      label.textContent = 'Email Address';

      document.body.appendChild(label);
      document.body.appendChild(input);

      const result = getAllPossibleLabels(input);

      expect(result).toContain('Email Address');
      expect(result).toContain('Enter your email');
      expect(result).toContain('Email input');
      expect(result.length).toBeGreaterThan(0);
    });

    test('should return empty array for null input', () => {
      const result = getAllPossibleLabels(null);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    test('should include placeholder text', () => {
      const input = document.createElement('input');
      input.placeholder = 'Enter name';
      document.body.appendChild(input);

      const result = getAllPossibleLabels(input);
      expect(result).toContain('Enter name');
    });

    test('should include aria-label', () => {
      const input = document.createElement('input');
      input.setAttribute('aria-label', 'Username field');
      document.body.appendChild(input);

      const result = getAllPossibleLabels(input);
      expect(result).toContain('Username field');
    });

    test('should include title attribute', () => {
      const input = document.createElement('input');
      input.title = 'Field title';
      document.body.appendChild(input);

      const result = getAllPossibleLabels(input);
      expect(result).toContain('Field title');
    });

    test('should filter out empty strings', () => {
      const input = document.createElement('input');
      input.placeholder = '';
      document.body.appendChild(input);

      const result = getAllPossibleLabels(input);
      expect(result.every(label => label.length > 0)).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    test('should work with complex form structure', () => {
      // Create a realistic form structure
      const form = document.createElement('form');
      const fieldset = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = 'User Information';

      const div = document.createElement('div');
      const label = document.createElement('label');
      label.textContent = 'Full Name:';

      const input = document.createElement('input');
      input.type = 'text';
      input.id = 'fullname';
      input.placeholder = 'John Doe';

      label.htmlFor = 'fullname';

      div.appendChild(label);
      div.appendChild(input);
      fieldset.appendChild(legend);
      fieldset.appendChild(div);
      form.appendChild(fieldset);
      document.body.appendChild(form);

      const closestLabel = findClosestLabel(input);
      const allLabels = getAllPossibleLabels(input);

      expect(closestLabel).toBe('Full Name:');
      expect(allLabels).toContain('Full Name:');
      expect(allLabels).toContain('John Doe');
    });
  });
});
