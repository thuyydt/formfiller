// components/options-page.ts - Main options page component
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { CustomField } from '../types';
import { validateSettings, sanitizeSettings } from '../helpers/configValidator';
import { logger } from '../helpers/logger';
import './general-tab';
import './behavior-tab';
import './custom-fields-tab';
import './advanced-tab';

interface StorageSettings {
  locale?: string;
  ignoreFields?: string;
  ignoreHidden?: boolean;
  ignoreFilled?: boolean;
  ignoreDomains?: string;
  enableLabelMatching?: boolean;
  enableSound?: boolean;
  enableAIDetection?: boolean;
  aiConfidenceThreshold?: number;
  customFields?: CustomField[];
  defaultPassword?: string;
  // Date range settings
  minAge?: number;
  maxAge?: number;
  // File input settings
  enableFileInput?: boolean;
}

@customElement('options-page')
export class OptionsPage extends LitElement {
  @state() private activeTab = 'general';
  @state() private settings: StorageSettings = {};
  @state() private statusMessage = '';
  @state() private statusType: 'success' | 'error' | 'warning' = 'success';
  @state() private version = '';
  @state() private validationErrors: string[] = [];
  @state() private validationWarnings: string[] = [];

  static override styles = css`
    :host {
      display: block;
      font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .container {
      max-width: 800px;
      margin: 40px auto;
      background: #fff;
      padding: 0 0 32px 0;
      border-radius: 12px;
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
    }

    .header {
      text-align: center;
      padding-top: 20px;
    }

    h1 {
      color: #2d7ff9;
      margin-bottom: 8px;
      font-size: 2em;
    }

    .version {
      display: block;
      color: #555;
      font-size: 0.95em;
      margin-bottom: 4px;
    }

    .subtitle {
      color: #888;
      font-size: 0.88em;
      margin: 0 36px 16px;
    }

    .tabs-nav {
      display: flex;
      border-bottom: 2px solid #e0e0e0;
      padding: 0 36px;
      margin-top: 20px;
      gap: 4px;
    }

    .tab-button {
      background: transparent;
      border: none;
      padding: 12px 24px;
      font-size: 1.05em;
      font-weight: 500;
      color: #666;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all 0.2s;
      position: relative;
      top: 2px;
    }

    .tab-button:hover {
      color: #2d7ff9;
      background: #f8fbff;
    }

    .tab-button.active {
      color: #2d7ff9;
      border-bottom-color: #2d7ff9;
      font-weight: 600;
    }

    .tab-content {
      display: none;
      animation: fadeIn 0.3s;
    }

    .tab-content.active {
      display: block;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .save-btn {
      display: block;
      background: #27ae60;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 14px 32px;
      font-size: 1.1em;
      font-weight: 600;
      margin: 32px auto 0 auto;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(39, 174, 96, 0.2);
    }

    .save-btn:hover {
      background: #229954;
      box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
      transform: translateY(-1px);
    }

    .status {
      margin-top: 18px;
      font-size: 1.05em;
      color: #27ae60;
      min-height: 24px;
      text-align: center;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 6px;
      background: #f0fdf4;
    }

    .status.error {
      color: #ef4444;
      background: #fef2f2;
    }

    .status.warning {
      color: #f59e0b;
      background: #fffbeb;
    }

    .validation-details {
      max-width: 800px;
      margin: 12px auto 0 auto;
      padding: 0 36px;
    }

    .validation-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .validation-item {
      padding: 8px 12px;
      margin: 4px 0;
      border-radius: 6px;
      font-size: 0.95em;
      line-height: 1.5;
    }

    .validation-item.error {
      background: #fef2f2;
      color: #dc2626;
      border-left: 3px solid #ef4444;
    }

    .validation-item.warning {
      background: #fffbeb;
      color: #d97706;
      border-left: 3px solid #f59e0b;
    }

    @media (max-width: 768px) {
      .container {
        margin: 20px;
        border-radius: 8px;
      }

      .tabs-nav {
        padding: 0 20px;
        overflow-x: auto;
      }

      .tab-button {
        padding: 10px 16px;
        font-size: 0.95em;
      }
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this.loadVersion();
    this.loadSettings();
    this.restoreActiveTab();
  }

  private loadVersion() {
    const manifest = chrome.runtime.getManifest();
    this.version = manifest.version;
  }

  private restoreActiveTab() {
    const lastActiveTab = localStorage.getItem('formFillerActiveTab');
    if (lastActiveTab) {
      this.activeTab = lastActiveTab;
    }
  }

  private loadSettings() {
    chrome.storage.local.get(null, (result: StorageSettings) => {
      this.settings = {
        locale: result.locale || 'ja',
        ignoreFields: result.ignoreFields || 'capcha,hipinputtext',
        ignoreHidden: result.ignoreHidden !== false,
        ignoreFilled: !!result.ignoreFilled,
        ignoreDomains: result.ignoreDomains || '',
        enableLabelMatching: result.enableLabelMatching !== false,
        enableSound: !!result.enableSound,
        enableAIDetection: result.enableAIDetection !== false,
        aiConfidenceThreshold: result.aiConfidenceThreshold || 60,
        customFields: result.customFields || [],
        defaultPassword: result.defaultPassword || '',
        minAge: result.minAge ?? 18,
        maxAge: result.maxAge ?? 65,
        enableFileInput: result.enableFileInput !== false
      };
    });
  }

  private switchTab(tab: string) {
    this.activeTab = tab;
    localStorage.setItem('formFillerActiveTab', tab);
  }

  private handleSettingsChange(e: CustomEvent) {
    this.settings = { ...this.settings, ...e.detail };
  }

  private async saveSettings() {
    try {
      // Validate settings before saving
      const validation = validateSettings(this.settings);

      this.validationErrors = validation.errors;
      this.validationWarnings = validation.warnings;

      // Show validation errors
      if (!validation.valid) {
        this.statusType = 'error';
        this.statusMessage = `❌ Validation failed. Please fix ${validation.errors.length} error${validation.errors.length > 1 ? 's' : ''} below.`;
        setTimeout(() => {
          this.statusMessage = '';
          this.validationErrors = [];
        }, 8000);
        return;
      }

      // Show warnings but continue
      if (validation.warnings.length > 0) {
        this.statusType = 'warning';
        this.statusMessage = `⚠️ Settings saved with ${validation.warnings.length} warning${validation.warnings.length > 1 ? 's' : ''}.`;
        // Don't return, continue to save
      }

      // Sanitize settings before saving
      const sanitized = sanitizeSettings(this.settings);

      await chrome.storage.local.set(sanitized);

      // Update local settings with sanitized values
      this.settings = { ...this.settings, ...sanitized };

      if (validation.warnings.length === 0) {
        this.statusType = 'success';
        this.statusMessage = '✅ Settings have been successfully saved!';
      } else {
        this.statusMessage += ' (Settings saved with warnings)';
      }

      setTimeout(() => {
        this.statusMessage = '';
        this.validationWarnings = [];
      }, 5000);
    } catch (error) {
      this.statusType = 'error';
      this.statusMessage = '❌ Failed to save settings. Please try again.';
      logger.error('Failed to save settings:', error);
      setTimeout(() => {
        this.statusMessage = '';
      }, 5000);
    }
  }

  override render() {
    return html`
      <div class="container">
        <div class="header">
          <h1>Form Filler Settings</h1>
          <span class="version">Version ${this.version}</span>
          <p class="subtitle">Configure your preferences for form filling</p>
        </div>

        <div class="tabs-nav">
          <button
            class="tab-button ${this.activeTab === 'general' ? 'active' : ''}"
            @click=${() => this.switchTab('general')}
          >
            General
          </button>
          <button
            class="tab-button ${this.activeTab === 'behavior' ? 'active' : ''}"
            @click=${() => this.switchTab('behavior')}
          >
            Behavior
          </button>
          <button
            class="tab-button ${this.activeTab === 'custom-fields' ? 'active' : ''}"
            @click=${() => this.switchTab('custom-fields')}
          >
            Custom Fields
          </button>
          <button
            class="tab-button ${this.activeTab === 'advanced' ? 'active' : ''}"
            @click=${() => this.switchTab('advanced')}
          >
            Advanced
          </button>
        </div>

        <div class="tab-content ${this.activeTab === 'general' ? 'active' : ''}">
          <general-tab
            .settings=${this.settings}
            @settings-change=${this.handleSettingsChange}
          ></general-tab>
        </div>

        <div class="tab-content ${this.activeTab === 'behavior' ? 'active' : ''}">
          <behavior-tab
            .settings=${this.settings}
            @settings-change=${this.handleSettingsChange}
          ></behavior-tab>
        </div>

        <div class="tab-content ${this.activeTab === 'custom-fields' ? 'active' : ''}">
          <custom-fields-tab
            .settings=${this.settings}
            @settings-change=${this.handleSettingsChange}
          ></custom-fields-tab>
        </div>

        <div class="tab-content ${this.activeTab === 'advanced' ? 'active' : ''}">
          <advanced-tab
            .settings=${this.settings}
            .version=${this.version}
            @settings-change=${this.handleSettingsChange}
          ></advanced-tab>
        </div>

        <button class="save-btn" @click=${this.saveSettings}>Save All Settings</button>

        ${this.statusMessage
          ? html`<div class="status ${this.statusType}">${this.statusMessage}</div>`
          : ''}
        ${this.validationErrors.length > 0 || this.validationWarnings.length > 0
          ? html`
              <div class="validation-details">
                ${this.validationErrors.length > 0
                  ? html`
                      <ul class="validation-list">
                        ${this.validationErrors.map(
                          error => html`<li class="validation-item error">❌ ${error}</li>`
                        )}
                      </ul>
                    `
                  : ''}
                ${this.validationWarnings.length > 0
                  ? html`
                      <ul class="validation-list">
                        ${this.validationWarnings.map(
                          warning => html`<li class="validation-item warning">⚠️ ${warning}</li>`
                        )}
                      </ul>
                    `
                  : ''}
              </div>
            `
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'options-page': OptionsPage;
  }
}
