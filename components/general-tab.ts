// components/general-tab.ts - General settings tab
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Declare browser API for Firefox compatibility
declare const browser: typeof chrome | undefined;

interface GeneralSettings {
  locale?: string;
  enableSound?: boolean;
  enableAIDetection?: boolean;
  aiConfidenceThreshold?: number;
}

@customElement('general-tab')
export class GeneralTab extends LitElement {
  @property({ type: Object }) settings: GeneralSettings = {};

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

    select,
    input[type='range'] {
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 1em;
      transition: border 0.2s;
    }

    select:focus,
    input:focus {
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

    .note.blue-bg {
      background: #f0f9ff;
      border-left-color: #3b82f6;
    }

    .note strong {
      color: #2d7ff9;
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

    .slider-label {
      margin-top: 8px;
      display: block;
    }

    .slider-value {
      font-weight: 600;
      color: #2d7ff9;
    }

    input[type='range'] {
      width: 200px;
      margin-left: 8px;
    }

    .help-text {
      font-size: small;
      color: #888;
      display: block;
      margin-top: 6px;
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
      display: inline-block;
      margin-top: 12px;
    }

    .add-btn:hover {
      background: #1e5fcf;
    }

    .help-section {
      font-size: 0.92em;
      color: #666;
      margin-top: 8px;
    }

    @media (max-width: 768px) {
      fieldset {
        margin: 20px 20px 0 20px;
        padding: 14px 18px;
      }
    }
  `;

  private handleLocaleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.dispatchChange({ locale: target.value });
  }

  private handleCheckboxChange(field: string, e: Event) {
    const target = e.target as HTMLInputElement;
    this.dispatchChange({ [field]: target.checked });
  }

  private handleThresholdChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.dispatchChange({ aiConfidenceThreshold: parseInt(target.value, 10) });
  }

  private dispatchChange(changes: Partial<GeneralSettings>) {
    this.dispatchEvent(
      new CustomEvent('settings-change', {
        detail: changes,
        bubbles: true,
        composed: true
      })
    );
  }

  private openShortcuts() {
    // Detect browser and open appropriate shortcuts page
    const isFirefox = typeof browser !== 'undefined' || navigator.userAgent.includes('Firefox');

    if (isFirefox) {
      // Firefox: Use runtime API to open add-ons manager
      const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

      // Open the add-ons manager page with the shortcuts tab
      void browserAPI.tabs
        .create({
          url: 'about:addons'
        })
        .then(() => {
          // After opening, we need to programmatically navigate to shortcuts
          // This is a workaround since we can't directly link to the shortcuts page
        })
        .catch(() => {
          // Show user instruction as fallback
          alert(
            'To customize shortcuts in Firefox:\n1. Type "about:addons" in address bar\n2. Click gear icon (⚙️)\n3. Select "Manage Extension Shortcuts"'
          );
        });
    } else {
      // Chrome: Direct link to shortcuts page works
      void chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
    }
  }

  override render() {
    const threshold = this.settings.aiConfidenceThreshold || 60;

    return html`
      <fieldset>
        <legend>Language & Locale</legend>
        <label>
          Language:
          <select @change=${this.handleLocaleChange} .value=${this.settings.locale || 'ja'}>
            <option value="en" ?selected=${this.settings.locale === 'en'}>English</option>
            <option value="vi" ?selected=${this.settings.locale === 'vi'}>Vietnamese</option>
            <option value="ja" ?selected=${this.settings.locale === 'ja'}>Japanese</option>
            <option value="zh" ?selected=${this.settings.locale === 'zh'}>Chinese</option>
            <option value="ar" ?selected=${this.settings.locale === 'ar'}>Arabic</option>
            <option value="fr" ?selected=${this.settings.locale === 'fr'}>French</option>
            <option value="de" ?selected=${this.settings.locale === 'de'}>German</option>
            <option value="ko" ?selected=${this.settings.locale === 'ko'}>Korean</option>
            <option value="pl" ?selected=${this.settings.locale === 'pl'}>Polish</option>
            <option value="ru" ?selected=${this.settings.locale === 'ru'}>Russian</option>
            <option value="es" ?selected=${this.settings.locale === 'es'}>Spanish</option>
          </select>
          <i class="help-text">Language used for generated fake data.</i>
        </label>
      </fieldset>

      <fieldset>
        <legend>Keyboard Shortcuts</legend>
        <div class="note">
          <b>Default Shortcuts:</b>
          <ul>
            <li>
              <code>Cmd+Shift+F</code> (Mac) / <code>Ctrl+Shift+F</code> (Windows) - Fill form
            </li>
            <li>
              <code>Cmd+Shift+Z</code> (Mac) / <code>Ctrl+Shift+Z</code> (Windows) - Undo fill
            </li>
            <li>
              <code>Cmd+Shift+X</code> (Mac) / <code>Ctrl+Shift+X</code> (Windows) - Clear form
            </li>
          </ul>
          <button class="add-btn" @click=${this.openShortcuts}>Customize Keyboard Shortcuts</button>
          <div class="help-section">
            Click the button above to open your browser's keyboard shortcuts page where you can
            customize all shortcuts for this extension.
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Visual Feedback</legend>
        <label>
          <input
            type="checkbox"
            ?checked=${this.settings.enableSound}
            @change=${(e: Event) => this.handleCheckboxChange('enableSound', e)}
          />
          Play sound when form is filled
        </label>
        <div class="note">
          When enabled, a subtle beep sound will play after successfully filling the form.
        </div>

        <label style="margin-top: 16px;">
          <input
            type="checkbox"
            ?checked=${this.settings.enableAIDetection !== false}
            @change=${(e: Event) => this.handleCheckboxChange('enableAIDetection', e)}
          />
          Enable AI-Powered Field Detection
        </label>
        <div class="note blue-bg">
          <strong>Smart Detection:</strong> Uses machine learning-inspired algorithms to
          intelligently detect field types when standard rules don't match.
          <br />
          Features:
          <br />
          - Analyzes field names, labels, placeholders, and context
          <br />
          - Learns from real-world form patterns
          <br />
          - Provides confidence scores for predictions
          <br />
          - Works as a fallback when rule-based detection returns generic "text"
          <br />
          <br />
          <label class="slider-label">
            Confidence Threshold: <span class="slider-value">${threshold}%</span>
            <input
              type="range"
              min="30"
              max="95"
              step="5"
              .value=${threshold.toString()}
              @input=${this.handleThresholdChange}
            />
          </label>
          <i class="help-text">
            Higher threshold = more accurate but may skip uncertain fields. Lower threshold = fills
            more fields but with less certainty.
          </i>
        </div>
      </fieldset>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'general-tab': GeneralTab;
  }
}
