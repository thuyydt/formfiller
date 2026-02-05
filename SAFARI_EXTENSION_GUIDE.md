# Safari Web Extension Submission Guide

This guide explains how to convert your web extension to Safari and submit it to the Mac App Store.

## Prerequisites

- **macOS**: Safari extensions can only be developed on macOS
- **Xcode 12+**: Download from Mac App Store
- **Apple Developer Account**: Required for signing and App Store submission ($99/year)
- **Safari 14+**: For testing

## Build Process

### Step 1: Build the Extension

```bash
npm run build:safari
```

This creates the `dist-safari/` folder with all necessary files.

### Step 2: Create Safari Extension App in Xcode

Safari Web Extensions must be wrapped in a native macOS app. Here's how:

#### 2.1 Create New Project

1. Open Xcode
2. File > New > Project (or `Cmd+Shift+N`)
3. Select **macOS** tab
4. Choose **Safari Extension App** template
5. Click **Next**

#### 2.2 Configure Project

- **Product Name**: `Form Filler` (or your preferred name)
- **Team**: Select your Apple Developer account
- **Organization Identifier**: Your reverse domain (e.g., `com.thuyydt`)
- **Bundle Identifier**: Will be auto-generated (e.g., `com.thuyydt.Form-Filler`)
- **Language**: Swift (default)
- **User Interface**: SwiftUI (default)

Click **Next** and choose save location.

#### 2.3 Replace Extension Folder

After project creation, you'll see a folder structure like:
```
Form Filler/
├── Form Filler.xcodeproj
├── Shared (App)/           (Shared app code)
├── Shared (Extension)/     (Extension code - REPLACE Resources HERE)
│   ├── Resources/          ← Copy dist-safari/* contents here
│   └── SafariWebExtensionHandler.swift
├── iOS (App)/
├── iOS (Extension)/
├── macOS (App)/
└── macOS (Extension)/
```

**Replace the extension:**
```bash
# Assuming you saved Xcode project to ~/Developer/form-filler-safari/Form Filler/
cd ~/Developer/form-filler-safari/Form\ Filler/Shared\ \(Extension\)/Resources/
rm -rf *
cp -r /path/to/your/project/dist-safari/* .
```

Or manually:
1. Open Finder and navigate to your Xcode project
2. Go to `Shared (Extension)/Resources/` folder
3. Delete all files in `Resources/` folder
4. Copy all contents from `dist-safari/` to `Resources/`

### Step 3: Configure Xcode Project

#### 3.1 Update Info.plist (if needed)

The extension's `manifest.json` is automatically converted by Xcode. No changes needed unless you want custom settings.

#### 3.2 Configure Signing

1. Select your project in Xcode navigator
2. Select **Form Filler Extension** target
3. Go to **Signing & Capabilities** tab
4. Check **Automatically manage signing**
5. Select your **Team**
6. Do the same for **Form Filler** (main app) target

#### 3.3 Set Minimum macOS Version (Optional)

1. Select your project
2. Select **Form Filler** target
3. Go to **General** tab
4. Set **Minimum Deployments** to macOS 11.0 or higher (recommended)

### Step 4: Build and Test

#### 4.1 Build the App

1. Select a simulator or "My Mac" in Xcode toolbar
2. Click **Product > Build** (or `Cmd+B`)
3. Fix any build errors if they occur

#### 4.2 Run the App

1. Click **Product > Run** (or `Cmd+R`)
2. The app will launch
3. Click **Open Safari Preferences** button in the app
4. Or manually: Safari > Preferences > Extensions

#### 4.3 Enable Extension in Safari

1. In Safari Preferences > Extensions
2. Find **Form Filler** in the list
3. Check the box to enable it
4. Grant permissions if prompted

#### 4.4 Test the Extension

1. Navigate to a webpage with forms
2. Click the extension icon in Safari toolbar
3. Test all features: Fill, Undo, Clear
4. Test keyboard shortcuts
5. Test on various websites

### Step 5: Prepare for App Store

#### 5.1 Update Version and Build Numbers

1. In Xcode, select your project
2. Select both targets (Form Filler and Form Filler Extension)
3. Update **Version** to match your extension version (e.g., `2.3.0`)
4. Set **Build** number (e.g., `1`)

#### 5.2 Create App Icon

Safari extensions need a macOS app icon (not just the extension icon):

1. Create icon in multiple sizes:
   - 16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024
2. Add to `Assets.xcassets/AppIcon.appiconset/`
3. Or use a tool like [IconGenerator](https://apps.apple.com/app/icon-generator/id1478748096)

#### 5.3 Add Privacy Policy

Apple requires a privacy policy URL:

1. Select your project in Xcode
2. Go to **Form Filler** target > **General** tab
3. Scroll to **App Privacy**
4. Add your privacy policy URL

You already have `PRIVACY_POLICY.md` in your repo. Host it on GitHub Pages or your website.

#### 5.4 Update App Description

Edit the main app's Swift file to add useful information for users.

### Step 6: Archive and Submit

#### 6.1 Archive the App

1. In Xcode, select **Any Mac (Apple Silicon, Intel)** as destination
2. Click **Product > Archive**
3. Wait for archiving to complete
4. Organizer window will open automatically

#### 6.2 Validate the Archive

1. In Organizer, select your archive
2. Click **Validate App**
3. Choose distribution options:
   - App Store Connect
   - Upload your app's symbols: Yes (recommended)
   - Manage Version and Build Number: Automatically manage
4. Click **Validate**
5. Fix any issues reported

#### 6.3 Distribute to App Store

1. Click **Distribute App**
2. Choose **App Store Connect**
3. Choose **Upload**
4. Select distribution options (same as validation)
5. Review app information
6. Click **Upload**
7. Wait for upload to complete (may take several minutes)

### Step 7: App Store Connect

#### 7.1 Create App Record

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps**
3. Click **+** > **New App**
4. Fill in information:
   - **Platform**: macOS
   - **Name**: Form Filler
   - **Primary Language**: English (or your choice)
   - **Bundle ID**: Select the one you created in Xcode
   - **SKU**: Unique identifier (e.g., `form-filler-2024`)
   - **User Access**: Full Access

#### 7.2 Fill in App Information

**App Information:**
- Name: Form Filler
- Subtitle: AI-Powered Form Data Generator
- Category: Developer Tools
- Secondary Category: Utilities

**Pricing and Availability:**
- Price: Free (or set your price)
- Availability: All countries (or select specific)

**Version Information:**
- Screenshots (required):
  - Take screenshots of your extension in action
  - Minimum: 3 screenshots at 1280x800px or higher
- Description: Use your README.md content
- Keywords: form, filler, data, faker, testing, development, automation
- Support URL: GitHub repo or your website
- Marketing URL (optional): Your website
- Privacy Policy URL: Your hosted PRIVACY_POLICY.md

**App Review Information:**
- First Name, Last Name, Email
- Phone Number
- Demo Account (if extension works on specific sites)
- Notes: Explain how to test the extension

#### 7.3 Submit for Review

1. Make sure build is attached (may take 15-30 mins to process after upload)
2. Fill in all required fields
3. Answer App Privacy questions:
   - Does your app collect data? No (or Yes if you do analytics)
4. Export Compliance: This app doesn't use encryption (select No)
5. Click **Submit for Review**

### Step 8: After Approval

- Review typically takes 1-3 days for extensions
- You'll receive email notifications about status changes
- If rejected, read feedback carefully and resubmit

## Updating Your Extension

When you have a new version:

1. Update version in `package.json`
2. Run `npm run build:safari`
3. Replace files in Xcode project
4. Increment version/build number in Xcode
5. Archive and upload new version
6. Create new version in App Store Connect
7. Submit for review

## Common Issues

### Issue: "No valid provisioning profiles found"

**Solution:**
1. Xcode > Preferences > Accounts
2. Select your Apple ID
3. Click **Download Manual Profiles**
4. Or enable **Automatically manage signing** in project settings

### Issue: Extension not showing in Safari

**Solution:**
1. Check Safari > Preferences > Extensions
2. Make sure extension is enabled
3. Check if macOS version meets minimum requirement
4. Try restarting Safari

### Issue: Build fails with "Command CodeSign failed"

**Solution:**
1. Clean build folder: Product > Clean Build Folder
2. Check signing settings are correct
3. Make sure certificates are valid in Keychain Access

### Issue: "This app is damaged and can't be opened"

**Solution:**
1. This happens when running unsigned app
2. Right-click app > Open (instead of double-click)
3. Or properly sign the app with your Developer certificate

## Useful Resources

- [Safari Web Extensions Documentation](https://developer.apple.com/documentation/safariservices/safari_web_extensions)
- [Converting a Web Extension for Safari](https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Safari Extensions Gallery](https://developer.apple.com/safari/extensions/)

## Automation (Advanced)

You can automate the Xcode project creation using `xcrun safari-web-extension-converter`:

```bash
# Convert web extension to Safari app
xcrun safari-web-extension-converter dist-safari/ \
  --project-location ~/Desktop/ \
  --app-name "Form Filler" \
  --bundle-identifier "com.thuyydt.form-filler" \
  --swift

# This creates a complete Xcode project ready to build
```

Then open the generated `.xcodeproj` file and proceed with building.

## Notes

- Safari extensions must be distributed through the Mac App Store (no manual installation like Chrome)
- Users will download your app from App Store, which includes the extension
- The app itself is minimal - its main purpose is to deliver the extension
- You can add features to the macOS app (settings, about, etc.) but it's optional
- Safari Web Extensions use the same APIs as Chrome/Firefox (with minor differences)

## Support

If you encounter issues:
1. Check [Apple Developer Forums](https://developer.apple.com/forums/)
2. Read [Safari Release Notes](https://developer.apple.com/documentation/safari-release-notes)
3. Contact Apple Developer Support (if you're a paid member)
