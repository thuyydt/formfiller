// components/custom-fields-table.ts - Custom fields table component
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CustomField } from '../types';

const FAKER_DATA_TYPES = [
  'person.firstName',
  'person.lastName',
  'person.fullName',
  'person.jobTitle',
  'location.zipCode',
  'location.city',
  'location.streetAddress',
  'location.country',
  'phone.number',
  'internet.email',
  'internet.userName',
  'internet.url',
  'internet.domainName',
  'company.name',
  'company.catchPhrase',
  'lorem.word',
  'lorem.sentence',
  'lorem.paragraph',
  'date.past',
  'date.future',
  'date.birthdate',
  'finance.amount',
  'finance.currencyName',
  'finance.creditCardNumber',
  'word.words',
  'color.human'
];

@customElement('custom-fields-table')
export class CustomFieldsTable extends LitElement {
  @property({ type: Array }) fields: CustomField[] = [];

  static override styles = css`
    .custom-fields-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin-top: 10px;
      background: #f8fbff;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(45, 127, 249, 0.07);
      overflow: hidden;
    }

    .custom-fields-table th,
    .custom-fields-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #e0e7ef;
      font-size: 1em;
    }

    .custom-fields-table th {
      background: #eaf2ff;
      color: #2d7ff9;
      font-weight: 600;
      text-align: left;
    }

    .custom-fields-table tr:last-child td {
      border-bottom: none;
    }

    .custom-fields-table select,
    .custom-fields-table input[type="text"] {
      width: 100%;
      padding: 6px 8px;
      border-radius: 4px;
      border: 1px solid #c3d3ee;
      font-size: 1em;
      background: #fff;
      transition: border 0.2s;
      box-sizing: border-box;
    }

    .custom-fields-table select:focus,
    .custom-fields-table input[type="text"]:focus {
      border: 1.5px solid #2d7ff9;
      outline: none;
    }

    .remove-btn {
      background: #e74c3c;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 0.98em;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-btn:hover {
      background: #c0392b;
    }

    .remove-btn svg {
      width: 16px;
      height: 16px;
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
      margin-top: 12px;
    }

    .add-btn:hover {
      background: #1e5fcf;
    }

    .field-faker-container {
      display: block;
    }

    .empty-state {
      text-align: center;
      padding: 32px;
      color: #888;
      font-size: 0.95em;
    }
  `;

  private addField() {
    const newFields = [
      ...this.fields,
      {
        field: '',
        type: 'list' as const,
        value: ''
      }
    ];
    this.emitChange(newFields);
  }

  private removeField(index: number) {
    const newFields = this.fields.filter((_, i) => i !== index);
    this.emitChange(newFields);
  }

  private updateField(index: number, updates: Partial<CustomField>) {
    const newFields = [...this.fields];
    const existingField = newFields[index];
    if (existingField) {
      newFields[index] = { ...existingField, ...updates } as CustomField;
      this.emitChange(newFields);
    }
  }

  private emitChange(fields: CustomField[]) {
    this.dispatchEvent(
      new CustomEvent('fields-change', {
        detail: { fields },
        bubbles: true,
        composed: true
      })
    );
  }

  override render() {
    if (this.fields.length === 0) {
      return html`
        <div class="empty-state">
          <p>No custom fields defined yet.</p>
          <p>Click "Add New Rule" below to create your first custom field rule.</p>
        </div>
        <button class="add-btn" @click=${this.addField}>Add New Rule</button>
      `;
    }

    return html`
      <table class="custom-fields-table">
        <thead>
          <tr>
            <th style="text-align: left;">Matching Field</th>
            <th style="text-align: left;">Type</th>
            <th style="text-align: left;">Value / Faker Data Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${this.fields.map(
            (field, index) => html`
              <tr>
                <td>
                  <input
                    type="text"
                    .value=${field.field}
                    @input=${(e: Event) =>
                      this.updateField(index, { field: (e.target as HTMLInputElement).value })}
                    placeholder="e.g., *address*, #email"
                  />
                </td>
                <td>
                  <select
                    .value=${field.type}
                    @change=${(e: Event) =>
                      this.updateField(index, { type: (e.target as HTMLSelectElement).value as 'list' | 'regex' | 'faker' })}
                  >
                    <option value="list" ?selected=${field.type === 'list'}>List</option>
                    <option value="regex" ?selected=${field.type === 'regex'}>Regex</option>
                    <option value="faker" ?selected=${field.type === 'faker'}>Faker</option>
                  </select>
                </td>
                <td>
                  ${field.type === 'faker'
                    ? html`
                        <select
                          class="field-faker"
                          .value=${field.faker || 'internet.email'}
                          @change=${(e: Event) =>
                            this.updateField(index, { faker: (e.target as HTMLSelectElement).value })}
                        >
                          ${FAKER_DATA_TYPES.map(
                            dataType => html`
                              <option value="${dataType}" ?selected=${field.faker === dataType}>
                                ${dataType}
                              </option>
                            `
                          )}
                        </select>
                      `
                    : html`
                        <input
                          type="text"
                          class="field-value"
                          .value=${field.value || ''}
                          @input=${(e: Event) =>
                            this.updateField(index, { value: (e.target as HTMLInputElement).value })}
                          placeholder="Value or Pattern"
                        />
                      `}
                </td>
                <td>
                  <button class="remove-btn" @click=${() => this.removeField(index)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
      <button class="add-btn" @click=${this.addField}>Add New Rule</button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'custom-fields-table': CustomFieldsTable;
  }
}
