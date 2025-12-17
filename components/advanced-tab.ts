// components/advanced-tab.ts - Advanced settings tab
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { logger } from '../helpers/logger';

interface AdvancedSettings {
  [key: string]: unknown;
}

@customElement('advanced-tab')
export class AdvancedTab extends LitElement {
  @property({ type: Object }) settings: AdvancedSettings = {};
  @property({ type: String }) version = '';
  @state() private statusMessage = '';

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

    .note ul {
      margin: 8px 0 12px 20px;
      padding: 0;
    }

    .tricks {
      padding: 12px;
      background: #f3f4f6;
      border-radius: 6px;
      font-size: 0.96em;
      line-height: 1.8;
    }

    .button-container {
      text-align: center;
      margin: 16px 0;
    }

    .export-btn,
    .import-btn {
      background: #34495e;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 10px 20px;
      cursor: pointer;
      font-size: 0.98em;
      margin: 0 6px;
      transition: background 0.2s;
    }

    .export-btn:hover,
    .import-btn:hover {
      background: #2c3e50;
    }

    .about-section {
      padding: 12px;
      background: #f9f9f9;
      border-radius: 6px;
    }

    .about-section p {
      margin: 0 0 8px 0;
    }

    .about-section a {
      color: #2d7ff9;
      text-decoration: none;
    }

    .about-section a:hover {
      text-decoration: underline;
    }

    .status-message {
      margin-top: 12px;
      text-align: center;
      font-weight: 500;
      min-height: 24px;
    }

    .status-message.success {
      color: #10b981;
    }

    .status-message.error {
      color: #ef4444;
    }

    input[type='file'] {
      display: none;
    }

    @media (max-width: 768px) {
      fieldset {
        margin: 20px 20px 0 20px;
        padding: 14px 18px;
      }
    }
  `;

  private async exportSettings() {
    try {
      const settings = await chrome.storage.local.get(null);
      const manifest = chrome.runtime.getManifest();

      const exportData = {
        _metadata: {
          version: manifest.version,
          exportDate: new Date().toISOString(),
          extensionName: 'Form Filler'
        },
        ...settings
      };

      const dataStr =
        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const dlAnchor = document.createElement('a');
      dlAnchor.setAttribute('href', dataStr);
      const timestamp = new Date().toISOString().split('T')[0];
      dlAnchor.setAttribute('download', `form-filler-settings-${timestamp}.json`);
      document.body.appendChild(dlAnchor);
      dlAnchor.click();
      dlAnchor.remove();

      this.showStatus('✓ Settings exported successfully!', 'success');
    } catch (error) {
      this.showStatus('✗ Failed to export settings', 'error');
      logger.error('Export error:', error);
    }
  }

  private importSettings() {
    const input = this.shadowRoot?.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      input.click();
    }
  }

  private handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async evt => {
      try {
        const result = evt.target?.result;
        if (typeof result !== 'string') return;

        const imported = JSON.parse(result) as AdvancedSettings & {
          _metadata?: { version?: string; exportDate?: string };
        };
        const { _metadata, ...settingsToImport } = imported;

        const validKeys = [
          'locale',
          'ignoreFields',
          'ignoreHidden',
          'ignoreFilled',
          'ignoreDomains',
          'enableLabelMatching',
          'enableSound',
          'enableAIDetection',
          'aiConfidenceThreshold',
          'customFields',
          'defaultPassword',
          'minAge',
          'maxAge',
          'enableFileInput',
          'fileInputTypes'
        ];

        const hasValidSettings = Object.keys(settingsToImport).some(key => validKeys.includes(key));

        if (!hasValidSettings) {
          this.showStatus('✗ Invalid settings file - no valid settings found', 'error');
          return;
        }

        const metadata = _metadata || {};
        const confirmMessage = metadata.version
          ? `Import settings from version ${metadata.version}?\n${metadata.exportDate ? `Exported: ${new Date(metadata.exportDate).toLocaleString()}` : ''}\n\nThis will replace all current settings.`
          : 'Import settings? This will replace all current settings.';

        if (!confirm(confirmMessage)) {
          target.value = '';
          return;
        }

        await chrome.storage.local.set(settingsToImport);
        this.showStatus('✓ Settings imported successfully! Reloading...', 'success');
        setTimeout(() => {
          location.reload();
        }, 1000);
      } catch {
        this.showStatus('✗ Invalid JSON file. Please check the file format.', 'error');
      } finally {
        target.value = '';
      }
    };
    reader.readAsText(file);
  }

  private showStatus(message: string, type: 'success' | 'error') {
    this.statusMessage = message;

    setTimeout(
      () => {
        this.statusMessage = '';
      },
      type === 'success' ? 3000 : 5000
    );

    this.requestUpdate();
  }

  override render() {
    return html`
      <fieldset>
        <legend>Import / Export Settings</legend>
        <div class="button-container">
          <button class="export-btn" @click=${this.exportSettings}>Export Settings</button>
          <input type="file" accept="application/json" @change=${this.handleFileSelect} />
          <button class="import-btn" @click=${this.importSettings}>Import Settings</button>
        </div>
        ${this.statusMessage && !this.statusMessage.includes('learned')
          ? html`<div
              class="status-message ${this.statusMessage.includes('✓') ? 'success' : 'error'}"
            >
              ${this.statusMessage}
            </div>`
          : ''}
        <div class="note">
          <b>Export:</b> Download all your settings as a JSON file for backup or sharing.<br />
          <ul>
            <li>Includes all settings: locale, behavior, custom fields, AI detection, etc.</li>
            <li>File name includes export date</li>
            <li>Contains metadata for tracking</li>
          </ul>
          <b>Import:</b> Restore settings from a previously exported JSON file.<br />
          <ul>
            <li>Shows confirmation dialog with file version</li>
            <li>Validates settings before importing</li>
            <li>Automatically reloads page after successful import</li>
          </ul>
          <b>Tip:</b> Export your settings regularly as backup, especially before making major
          changes.
        </div>
      </fieldset>

      <fieldset>
        <legend>Tips & Tricks</legend>
        <div class="tricks">
          <b>Quick Tips:</b><br />
          - Use keyboard shortcuts for faster workflow<br />
          - Right-click extension icon for quick actions<br />
          - Test custom fields on simple forms first<br />
          - Use wildcard patterns for flexible matching<br />
          - Enable label matching for better field detection<br />
          - Export settings regularly as backup
        </div>
      </fieldset>

      <fieldset>
        <legend>About</legend>
        <div class="about-section">
          <p><b>Version:</b> ${this.version}</p>
          <p><b>Author:</b> thuyydt</p>
          <p><b>Support:</b> <a href="mailto:thuydtshop@gmail.com">thuydtshop@gmail.com</a></p>
          <p>
            <i>"Filling forms faster than you can say 'terms and conditions accepted'"</i>
          </p>
        </div>
      </fieldset>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'advanced-tab': AdvancedTab;
  }
}
