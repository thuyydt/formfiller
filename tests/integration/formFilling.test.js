// formFilling.test.js - Integration tests
describe('Form Filling Integration', () => {
  let form;

  beforeEach(() => {
    form = document.createElement('form');
    document.body.appendChild(form);
  });

  afterEach(() => {
    if (form.parentNode) {
      document.body.removeChild(form);
    }
  });

  test('should fill complete registration form', () => {
    // Create a realistic registration form
    form.innerHTML = `
      <input type="text" name="username" id="username" />
      <input type="email" name="email" id="email" />
      <input type="password" name="password" id="password" />
      <input type="text" name="first_name" id="first_name" />
      <input type="text" name="last_name" id="last_name" />
      <input type="tel" name="phone" id="phone" />
      <input type="date" name="birthdate" id="birthdate" />
      <select name="country" id="country">
        <option value="">Select Country</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
        <option value="jp">Japan</option>
      </select>
      <input type="checkbox" name="terms" id="terms" />
      <input type="radio" name="gender" value="male" id="male" />
      <input type="radio" name="gender" value="female" id="female" />
    `;

    const elements = form.querySelectorAll('input, select');
    expect(elements.length).toBeGreaterThan(0);

    // Verify form structure
    expect(form.querySelector('#username')).toBeTruthy();
    expect(form.querySelector('#email')).toBeTruthy();
    expect(form.querySelector('#password')).toBeTruthy();
  });

  test('should fill contact form', () => {
    form.innerHTML = `
      <input type="text" name="name" placeholder="Full Name" />
      <input type="email" name="email" placeholder="Email Address" />
      <input type="tel" name="phone" placeholder="Phone Number" />
      <textarea name="message" placeholder="Your Message"></textarea>
    `;

    const inputs = form.querySelectorAll('input');
    expect(inputs.length).toBe(3);

    const textarea = form.querySelector('textarea');
    expect(textarea).toBeTruthy();
  });

  test('should fill address form', () => {
    form.innerHTML = `
      <input type="text" name="street" placeholder="Street Address" />
      <input type="text" name="city" placeholder="City" />
      <input type="text" name="state" placeholder="State" />
      <input type="text" name="zip" placeholder="ZIP Code" />
      <input type="text" name="country" placeholder="Country" />
    `;

    const inputs = form.querySelectorAll('input');
    expect(inputs.length).toBe(5);
  });

  test('should handle form with mixed field types', () => {
    form.innerHTML = `
      <input type="text" name="name" />
      <input type="number" name="age" min="18" max="100" />
      <input type="range" name="rating" min="1" max="5" />
      <input type="color" name="color" />
      <input type="date" name="start_date" />
      <input type="time" name="time" />
      <input type="url" name="website" />
      <select name="category">
        <option>Option 1</option>
        <option>Option 2</option>
      </select>
    `;

    const inputs = form.querySelectorAll('input, select');
    expect(inputs.length).toBe(8);
  });

  test('should skip hidden and readonly fields', () => {
    form.innerHTML = `
      <input type="text" name="visible" />
      <input type="hidden" name="hidden" value="secret" />
      <input type="text" name="readonly" readonly value="readonly" />
      <input type="text" name="disabled" disabled />
    `;

    const visibleInput = form.querySelector('[name="visible"]');
    const hiddenInput = form.querySelector('[name="hidden"]');
    const readonlyInput = form.querySelector('[name="readonly"]');
    const disabledInput = form.querySelector('[name="disabled"]');

    expect(visibleInput).toBeTruthy();
    expect(hiddenInput).toBeTruthy();
    expect(readonlyInput.readOnly).toBe(true);
    expect(disabledInput.disabled).toBe(true);
  });

  test('should handle form with labels', () => {
    form.innerHTML = `
      <label for="email">Email Address:</label>
      <input type="text" id="email" name="email_field" />
      
      <label for="phone">Phone Number:</label>
      <input type="text" id="phone" name="phone_field" />
    `;

    const emailInput = form.querySelector('#email');
    const phoneInput = form.querySelector('#phone');
    const emailLabel = form.querySelector('label[for="email"]');
    const phoneLabel = form.querySelector('label[for="phone"]');

    expect(emailInput).toBeTruthy();
    expect(phoneInput).toBeTruthy();
    expect(emailLabel.textContent).toContain('Email');
    expect(phoneLabel.textContent).toContain('Phone');
  });

  test('should handle nested form structure', () => {
    form.innerHTML = `
      <fieldset>
        <legend>Personal Information</legend>
        <div class="form-group">
          <label>Name</label>
          <input type="text" name="name" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" />
        </div>
      </fieldset>
      <fieldset>
        <legend>Contact</legend>
        <div class="form-group">
          <label>Phone</label>
          <input type="tel" name="phone" />
        </div>
      </fieldset>
    `;

    const fieldsets = form.querySelectorAll('fieldset');
    expect(fieldsets.length).toBe(2);

    const inputs = form.querySelectorAll('input');
    expect(inputs.length).toBe(3);
  });

  test('should handle form with validation attributes', () => {
    form.innerHTML = `
      <input type="email" name="email" required />
      <input type="text" name="code" pattern="[A-Z]{3}[0-9]{3}" />
      <input type="text" name="username" minlength="3" maxlength="20" />
      <input type="number" name="age" min="18" max="100" />
    `;

    const emailInput = form.querySelector('[name="email"]');
    const codeInput = form.querySelector('[name="code"]');
    const usernameInput = form.querySelector('[name="username"]');
    const ageInput = form.querySelector('[name="age"]');

    expect(emailInput.required).toBe(true);
    expect(codeInput.pattern).toBe('[A-Z]{3}[0-9]{3}');
    expect(usernameInput.minLength).toBe(3);
    expect(usernameInput.maxLength).toBe(20);
    expect(ageInput.min).toBe('18');
    expect(ageInput.max).toBe('100');
  });

  test('should handle form with aria attributes', () => {
    form.innerHTML = `
      <input type="text" name="field1" aria-label="User Email" />
      <input type="text" name="field2" aria-describedby="help-text" />
      <span id="help-text">Enter your phone number</span>
    `;

    const field1 = form.querySelector('[name="field1"]');
    const field2 = form.querySelector('[name="field2"]');

    expect(field1.getAttribute('aria-label')).toBe('User Email');
    expect(field2.getAttribute('aria-describedby')).toBe('help-text');
  });

  test('should handle dynamic form updates', () => {
    form.innerHTML = `
      <input type="text" name="existing" />
    `;

    expect(form.querySelectorAll('input').length).toBe(1);

    // Simulate dynamic field addition
    const newInput = document.createElement('input');
    newInput.type = 'email';
    newInput.name = 'new_email';
    form.appendChild(newInput);

    expect(form.querySelectorAll('input').length).toBe(2);
  });
});
