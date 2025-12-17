// components/behavior-tab.ts - Behavior settings tab
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

interface BehaviorSettings {
  ignoreFields?: string;
  ignoreHidden?: boolean;
  ignoreFilled?: boolean;
  ignoreDomains?: string;
  enableLabelMatching?: boolean;
  defaultPassword?: string;
  // Date range settings
  minAge?: number;
  maxAge?: number;
  // File input settings
  enableFileInput?: boolean;
  // Iframe settings
  disableIframeFill?: boolean;
}

@customElement('behavior-tab')
export class BehaviorTab extends LitElement {
  @property({ type: Object }) settings: BehaviorSettings = {};

  static override styles = css`
    fieldset {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin: 28px 36px 0 36px;
      padding: 18px 24px;
      background: #f9f9f9;
    }

    legend {
      color: #2d7ff9;
      font-size: 1.15em;
      font-weight: bold;
      padding: 0 8px;
    }

    label {
      display: block;
      font-size: 1.05em;
      margin-bottom: 8px;
    }

    input[type='text'],
    textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 1em;
      transition: border 0.2s;
      font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    input:focus,
    textarea:focus {
      border: 1.5px solid #2d7ff9;
      outline: none;
    }

    input[type='checkbox'] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      margin-right: 8px;
      vertical-align: middle;
    }

    .note {
      background: #f1f7ff;
      border-left: 4px solid #2d7ff9;
      padding: 12px 16px;
      margin: 12px 0 0 0;
      border-radius: 4px;
      font-size: 0.96em;
      line-height: 1.5;
    }

    .help-text {
      font-size: small;
      color: #888;
      display: block;
      margin-top: 6px;
    }

    code {
      background: #e5e7eb;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.92em;
    }

    @media (max-width: 768px) {
      fieldset {
        margin: 20px 20px 0 20px;
        padding: 14px 18px;
      }
    }
  `;

  private handleTextChange(field: string, e: Event) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    this.dispatchChange({ [field]: target.value });
  }

  private handleCheckboxChange(field: string, e: Event) {
    const target = e.target as HTMLInputElement;
    this.dispatchChange({ [field]: target.checked });
  }

  private handleNumberChange(field: string, e: Event) {
    const target = e.target as HTMLInputElement;
    const value = target.value ? parseInt(target.value, 10) : undefined;
    this.dispatchChange({ [field]: value });
  }

  private dispatchChange(changes: Partial<BehaviorSettings>) {
    this.dispatchEvent(
      new CustomEvent('settings-change', {
        detail: changes,
        bubbles: true,
        composed: true
      })
    );
  }

  override render() {
    return html`
      <fieldset>
        <legend>Field Filtering</legend>
        <label>
          Ignore fields with these keywords (comma-separated):
          <input
            type="text"
            .value=${this.settings.ignoreFields || ''}
            @input=${(e: Event) => this.handleTextChange('ignoreFields', e)}
            placeholder="e.g. password,confirm,captcha"
          />
          <i class="help-text">Fields containing these keywords will be skipped.</i>
        </label>
        <label style="margin-top: 16px;">
          <input
            type="checkbox"
            ?checked=${this.settings.ignoreHidden !== false}
            @change=${(e: Event) => this.handleCheckboxChange('ignoreHidden', e)}
          />
          Ignore hidden or invisible fields
        </label>
        <label>
          <input
            type="checkbox"
            ?checked=${this.settings.ignoreFilled}
            @change=${(e: Event) => this.handleCheckboxChange('ignoreFilled', e)}
          />
          Ignore fields with existing content
        </label>
        <div class="note">
          <b>Note:</b> Fields with type="hidden" or readonly are always ignored.
          <br />
          Use keywords to skip sensitive fields like passwords.
        </div>
      </fieldset>

      <fieldset>
        <legend>Domain Filtering</legend>
        <label>
          Domains to ignore (one per line):
          <textarea
            rows="5"
            .value=${this.settings.ignoreDomains || ''}
            @input=${(e: Event) => this.handleTextChange('ignoreDomains', e)}
            placeholder="e.g.&#10;example.com&#10;test.site.com"
          ></textarea>
          <i class="help-text">The extension won't fill forms on these websites.</i>
        </label>
      </fieldset>

      <fieldset>
        <legend>Label-Based Matching</legend>
        <label>
          <input
            type="checkbox"
            ?checked=${this.settings.enableLabelMatching !== false}
            @change=${(e: Event) => this.handleCheckboxChange('enableLabelMatching', e)}
          />
          Enable label-based field matching
        </label>
        <div class="note">
          When enabled, the extension will find the closest label to input fields and use it for
          matching custom fields.
          <br />
          This helps when fields don't have clear name, id, class, or other attributes.
          <br />
          <br />
          <b>How it works:</b>
          <br />
          - Finds the closest label element near the input
          <br />
          - Considers distance and text content to determine the best match
          <br />
          - Works with standard &lt;label&gt; elements and other label-like elements
          <br />
          - Enhances custom field matching patterns to include label text
        </div>
      </fieldset>

      <fieldset>
        <legend>Default Password</legend>
        <label>
          Default password for all password fields:
          <input
            type="text"
            .value=${this.settings.defaultPassword || ''}
            @input=${(e: Event) => this.handleTextChange('defaultPassword', e)}
            placeholder="Leave empty to use random passwords"
          />
          <i class="help-text">
            If set, all password fields will use this value instead of random passwords.
            <br />
            Perfect for testing - use the same password (e.g., "123456") for all accounts.
          </i>
        </label>
        <div class="note">
          <b>Pro Tip:</b> Many testers prefer a consistent password like <code>Test@123</code> or
          <code>Password1!</code>
          <br />
          This makes it easy to remember and log back into test accounts.
          <br />
          <br />
          <b>Security Note:</b> Only use this feature for testing/development environments!
        </div>
      </fieldset>

      <fieldset>
        <legend>Birthdate / Age Range</legend>
        <div style="display: flex; gap: 24px; flex-wrap: wrap;">
          <label style="flex: 1; min-width: 120px;">
            Minimum Age:
            <input
              type="number"
              min="0"
              max="120"
              .value=${this.settings.minAge !== undefined ? String(this.settings.minAge) : '18'}
              @input=${(e: Event) => this.handleNumberChange('minAge', e)}
              style="width: 80px;"
            />
          </label>
          <label style="flex: 1; min-width: 120px;">
            Maximum Age:
            <input
              type="number"
              min="0"
              max="120"
              .value=${this.settings.maxAge !== undefined ? String(this.settings.maxAge) : '65'}
              @input=${(e: Event) => this.handleNumberChange('maxAge', e)}
              style="width: 80px;"
            />
          </label>
        </div>
        <i class="help-text">
          Set the age range for generated birthdates. Defaults to 18-65 years old.
        </i>
        <div class="note">
          <b>How it works:</b> When filling date fields detected as birthdate/DOB fields, the
          extension will generate dates within this age range.
          <br />
          <b>Example:</b> Min Age = 21, Max Age = 35 → Birthdates from
          ${new Date().getFullYear() - 35} to ${new Date().getFullYear() - 21}
        </div>
      </fieldset>

      <fieldset>
        <legend>File Input Support</legend>
        <label>
          <input
            type="checkbox"
            ?checked=${this.settings.enableFileInput !== false}
            @change=${(e: Event) => this.handleCheckboxChange('enableFileInput', e)}
          />
          Enable file input auto-fill (experimental)
        </label>
        <i class="help-text">
          When enabled, file upload fields will be filled with a small placeholder file.
        </i>
        <div class="note">
          <b>Note:</b> This feature creates small test files (1x1 pixel images or text files) for
          testing file upload functionality.
          <br />
          <b>Supported types:</b> Images (PNG, JPEG, GIF), Documents (PDF, TXT)
          <br />
          <br />
          <b>⚠️ Experimental:</b> Some websites may not accept programmatically generated files.
        </div>
      </fieldset>

      <fieldset>
        <legend>Iframe Settings</legend>
        <label>
          <input
            type="checkbox"
            ?checked=${this.settings.disableIframeFill}
            @change=${(e: Event) => this.handleCheckboxChange('disableIframeFill', e)}
          />
          Disable form filling in iframes
        </label>
        <i class="help-text">
          When enabled, the extension will skip filling fields inside iframes.
        </i>
        <div class="note">
          <b>When to use:</b> Some websites embed forms in iframes (e.g., payment forms, embedded
          widgets). Enable this option if you want to skip filling fields in those embedded frames.
          <br />
          <br />
          <b>Note:</b> Cross-origin iframes are always skipped due to browser security restrictions.
        </div>
      </fieldset>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'behavior-tab': BehaviorTab;
  }
}
