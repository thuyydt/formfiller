# Privacy Policy for Form Filler Extension

**Last Updated: November 21, 2025**

## Introduction

Form Filler ("we", "our", or "the extension") is committed to protecting your privacy. This Privacy Policy explains how we handle data when you use our browser extension.

## Data Collection and Usage

### What Data We Collect

**We do NOT collect, store, or transmit any personal data to external servers.**

The extension only stores the following data **locally on your device** using Chrome's local storage:

- **User Settings**: Your preferences such as:
  - Selected language/locale
  - Ignored field patterns
  - Ignored domains
  - Custom field matching rules
  - Behavior preferences (ignore hidden fields, ignore filled fields, etc.)
  - Visual feedback preferences (sound, notifications)
  - Label matching settings

- **Form History** (Temporary): 
  - When you fill a form, the extension temporarily stores the original field values to enable the "Undo" feature
  - This history is cleared when you navigate away from the page or close the browser

### What Data We DO NOT Collect

- ❌ We do NOT collect any personal information
- ❌ We do NOT track your browsing history
- ❌ We do NOT send data to external servers
- ❌ We do NOT use analytics or tracking tools
- ❌ We do NOT collect filled form data
- ❌ We do NOT share data with third parties
- ❌ We do NOT sell your data

## How the Extension Works

1. **Local Processing Only**: All form filling operations happen entirely on your local device
2. **Generated Fake Data**: The extension generates random fake data using the Faker.js library locally in your browser
3. **No Network Requests**: The extension does not make any network requests or communicate with external servers
4. **Offline Capable**: The extension works completely offline

## Permissions Explanation

The extension requires the following permissions:

- **`activeTab`**: To access and fill forms on the current active tab when you click the extension icon or use keyboard shortcuts
- **`contextMenus`**: To add right-click menu options for quick access to fill, undo, and clear actions
- **`storage`**: To save your settings locally on your device (no data leaves your device)
- **`All URLs`**: The extension needs to detect and fill forms on any website you visit. This permission is strictly used to inject the form-filling script into pages only when you interact with the extension.

## Data Storage

All data is stored locally using:
- **Chrome Storage API**: Settings and preferences
- **Session Memory**: Temporary form history for undo functionality

Your data never leaves your device and is not synchronized to any cloud service unless you explicitly enable Chrome's built-in sync feature (which is controlled by Chrome, not by this extension).

## Third-Party Services

This extension does NOT use any third-party services, analytics, or tracking tools. The Faker.js library used for generating fake data runs entirely within your browser and does not communicate with external servers.

## Children's Privacy

This extension does not knowingly collect any information from children under 13 years of age. The extension is designed for developers and testers who need to populate forms with test data.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Any changes will be reflected in the "Last Updated" date at the top of this document. Continued use of the extension after changes constitutes acceptance of the updated policy.

## Data Deletion

To delete all data stored by the extension:

1. **Remove Settings**: Right-click the extension icon → Options → Clear your custom settings
2. **Uninstall Extension**: Remove the extension from your browser to delete all stored data
3. **Clear Browser Data**: Use Chrome's "Clear browsing data" feature and select "Cookies and other site data"

## Your Rights

You have the right to:
- Access your stored settings (via the Options page)
- Modify your settings at any time
- Delete all data by uninstalling the extension
- Export your settings as a JSON file
- Import settings from a backup

## Open Source

This extension is open source. You can review the entire source code at:
https://github.com/thuyydt/formfiller

## Contact

If you have any questions or concerns about this Privacy Policy, please:
- Open an issue on GitHub: https://github.com/thuyydt/formfiller/issues
- Contact the maintainer via GitHub: https://github.com/thuyydt

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- Firefox Add-ons Policies
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)

## Summary

**In simple terms**: This extension does not collect, store, or share any of your personal data. All operations happen locally on your device. Your privacy is fully protected.

---

**Form Filler Extension**  
Version 2.2.1  
© 2025 thuyydt  
Licensed under MIT License
