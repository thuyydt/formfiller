// components/custom-fields-tab.ts - Custom fields settings tab
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { CustomField } from '../types';
import './custom-fields-table';

interface CustomFieldsSettings {
  customFields?: CustomField[];
}

@customElement('custom-fields-tab')
export class CustomFieldsTab extends LitElement {
  @property({ type: Object }) settings: CustomFieldsSettings = {};
  @state() private quickGuideVisible = true;

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

    .note {
      background: #f1f7ff;
      border-left: 4px solid #2d7ff9;
      padding: 12px 16px;
      margin: 12px 0 0 0;
      border-radius: 4px;
      font-size: 0.96em;
      line-height: 1.5;
    }

    .note.warning {
      background: #fff3cd;
      border-left-color: #ffc107;
    }

    .note ul {
      margin: 8px 0 12px 20px;
      padding: 0;
    }

    .note code {
      background: #e5e7eb;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.92em;
    }

    .add-btn {
      background: #2d7ff9;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 1em;
      font-weight: 500;
      transition: background 0.2s;
      margin-bottom: 16px;
    }

    .add-btn:hover {
      background: #1e5fcf;
    }

    .example-box {
      margin: 8px 0 12px 20px;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      fieldset {
        margin: 20px 20px 0 20px;
        padding: 14px 18px;
      }
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    const stored = localStorage.getItem('quickGuideVisible');
    this.quickGuideVisible = stored !== 'false';
  }

  private toggleQuickGuide() {
    this.quickGuideVisible = !this.quickGuideVisible;
    localStorage.setItem('quickGuideVisible', this.quickGuideVisible.toString());
  }

  private handleFieldsChange(e: CustomEvent) {
    this.dispatchEvent(
      new CustomEvent('settings-change', {
        detail: { customFields: e.detail.fields },
        bubbles: true,
        composed: true
      })
    );
  }

  override render() {
    return html`
      <fieldset>
        <legend>Custom Filling Rules</legend>
        <p class="note">
          Define your own rules to fill specific fields. The extension will try to match these rules
          first before using its standard detection.
        </p>

        <button class="add-btn" @click=${this.toggleQuickGuide}>
          ${this.quickGuideVisible ? 'Hide Quick Guide' : 'Show Quick Guide'}
        </button>

        ${this.quickGuideVisible
          ? html`
              <div class="note warning">
                <strong>Quick Guide:</strong><br /><br />

                <strong>1. Matching Field - How to target fields:</strong><br />
                <ul>
                  <li>
                    <strong>Wildcard patterns:</strong>
                    <ul style="margin: 4px 0 0 20px;">
                      <li><code>*email*</code> - Matches any field containing "email"</li>
                      <li><code>phone*</code> - Matches fields starting with "phone"</li>
                      <li><code>*address</code> - Matches fields ending with "address"</li>
                    </ul>
                  </li>
                  <li>
                    <strong>CSS selectors:</strong>
                    <ul style="margin: 4px 0 0 20px;">
                      <li><code>#username</code> - Match by ID</li>
                      <li><code>.email-field</code> - Match by class name</li>
                      <li><code>[data-field="email"]</code> - Match by attribute</li>
                    </ul>
                  </li>
                </ul>

                <strong>2. Type - Choose how to generate data:</strong><br /><br />

                <div style="margin-left: 20px;">
                  <strong>List Type</strong> - Random selection from your values<br />
                  <div class="example-box">
                    <strong>Example:</strong> City selector
                    <ul style="margin-top: 0;">
                      <li>Matching Field: <code>*city*</code></li>
                      <li>Type: <code>List</code></li>
                      <li>Value: <code>Hanoi,Ho Chi Minh,Da Nang</code></li>
                    </ul>
                  </div>

                  <strong>Regex Type</strong> - Pattern-based generation<br />
                  <div class="example-box">
                    <strong>Example:</strong> Employee ID
                    <ul style="margin-top: 0;">
                      <li>Matching Field: <code>*employeeid*</code></li>
                      <li>Type: <code>Regex</code></li>
                      <li>Value: <code>EMP[0-9]{6}</code></li>
                      <li>Result: <code>EMP123456</code></li>
                    </ul>
                  </div>

                  <strong>Faker Type</strong> - Realistic fake data<br />
                  <div class="example-box">
                    <strong>Example:</strong> Email field
                    <ul style="margin-top: 0;">
                      <li>Matching Field: <code>*email*</code></li>
                      <li>Type: <code>Faker</code></li>
                      <li>Faker Data Type: <code>internet.email</code></li>
                    </ul>
                  </div>
                </div>
              </div>
            `
          : ''}

        <custom-fields-table
          .fields=${this.settings.customFields || []}
          @fields-change=${this.handleFieldsChange}
        ></custom-fields-table>

        <div class="note" style="margin-top: 20px;">
          <strong>Pro Tips:</strong>
          <ul style="margin-top: 8px;">
            <li><strong>Priority matters:</strong> Rules are checked from top to bottom</li>
            <li><strong>Test before use:</strong> Start with simple forms first</li>
            <li><strong>Wildcard power:</strong> Use <code>*keyword*</code> to match anywhere</li>
            <li><strong>Backup settings:</strong> Export your rules regularly</li>
          </ul>
        </div>
      </fieldset>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'custom-fields-tab': CustomFieldsTab;
  }
}
