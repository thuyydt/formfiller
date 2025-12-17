# How to Install Form Filler for Safari

This guide will help you install and enable the Form Filler extension on Safari for macOS.

## Prerequisites

- **macOS**: You must be using a Mac computer.
- **Safari**: Ensure you have Safari installed (version 14 or later).

## Installation Steps

### 1. Install the App
1. Download the **Form Filler.app** (or unzip the provided file).
2. Drag and drop **Form Filler.app** into your **Applications** folder.
   > **Note:** Keeping the app in your Downloads folder may prevent the extension from working correctly.

### 2. Run the App Once
1. Open your **Applications** folder.
2. Double-click **Form Filler.app** to launch it.
3. You will see a small window with a button that says "Quit and Open Safari Settings..." or similar.
4. Click that button (or just leave the app open for a moment and then open Safari manually).

> **Security Warning?**
> If you see a message saying *"Form Filler.app can't be opened because it is from an unidentified developer"*:
> 1. Go to **System Settings** > **Privacy & Security**.
> 2. Scroll down to the Security section.
> 3. You should see a message about Form Filler. Click **Open Anyway**.
> 4. Click **Open** in the confirmation dialog.

### 3. Enable the Extension in Safari
1. Open **Safari**.
2. In the menu bar at the top of the screen, click **Safari** > **Settings...** (or **Preferences...** on older macOS).
3. Click on the **Extensions** tab.
4. Find **Form Filler** in the list on the left.
5. **Check the box** next to "Form Filler" to enable it.

### 4. Grant Permissions
1. When you enable the extension, Safari might ask for permission to access webpages.
2. Click **Always Allow on Every Website** (or "Edit Websites..." to choose specific sites).
   * *Why?* The extension needs access to read the form fields on the page to fill them with data. It does not track your browsing history.

## How to Use

1. Navigate to any website with a form (e.g., a registration page).
2. Click the **Form Filler icon** in the Safari toolbar (to the left of the address bar).
3. The form will be automatically filled with fake data!

## Troubleshooting

**Extension not showing in Safari Settings?**
- Make sure you have moved the app to the **Applications** folder.
- Make sure you have run the **Form Filler.app** at least once.
- Try restarting Safari (Quit Safari completely with `Cmd+Q` and open it again).
- Try restarting your computer if it still doesn't appear.

**"App is damaged" or "Can't be opened"?**
- This can happen with apps downloaded from the internet that aren't from the App Store.
- Try right-clicking the app and selecting **Open**, then click **Open** in the dialog.

### Advanced: Enabling Unsigned Extensions
If the extension still does not appear in the list, or if you are using a test build that hasn't been signed with an Apple Developer ID, you may need to allow unsigned extensions:

1. Open **Safari Settings** > **Advanced**.
2. Check the box for **"Show features for web developers"** (or "Show Develop menu in menu bar").
3. In the menu bar at the top, click **Develop** > **Allow Unsigned Extensions**.
4. Enter your Mac password if prompted.
5. Restart Safari and check the Extensions list again.
