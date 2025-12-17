# 🚀 Build & Deploy Guide

## Quick Commands

### Development
```bash
# Watch mode with HMR (recommended for development)
npm run dev

# Type checking only
npm run type-check
```

### Production Build

```bash
# Build for specific browser
npm run build:chrome      # Chrome Extension
npm run build:firefox     # Firefox Add-on  
npm run build:safari      # Safari Extension

# Build for all browsers at once
npm run build:all
```

## Output Files

### Chrome Extension
- **Folder:** `dist-chrome/`
- **Zip:** `form-filler-chrome-v2.4.0.zip` (~404KB)
- **Submit to:** https://chrome.google.com/webstore/devconsole

### Firefox Add-on
- **Folder:** `dist-firefox/`
- **Zip:** `form-filler-firefox-v2.4.0.zip` (~404KB)
- **Submit to:** https://addons.mozilla.org/developers/

### Safari Extension
- **Folder:** `dist-safari/`
- **No zip** (requires Xcode wrapper)
- **See:** Safari-specific instructions below

## Build Process (Vite)

All builds now use **Vite** instead of esbuild:

```
Source Files → Vite Build → dist/ → Copy to dist-{browser}/ → Create zip
```

**Build output structure:**
```
dist/
├── background.js          1.68 KB
├── content.js           498.57 KB  
├── options.js            12.32 KB
├── contextMenus.js        0.99 KB
├── chunks/              (code-split modules)
│   ├── clearUndo-*.js         1.92 KB
│   ├── fillSingleField-*.js   2.95 KB
│   ├── visualFeedback-*.js   11.42 KB
│   ├── fillAll-*.js          11.59 KB
│   └── customFieldMatcher-*.js 16.33 KB
├── manifest.json
├── options.html
├── options.css
└── icons/
```

## Testing Locally

### Chrome
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `dist-chrome/` folder

### Firefox
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `dist-firefox/manifest.json`

### Safari
See detailed Safari instructions below.

## Browser-Specific Details

### 🌐 Chrome Extension

**Build:**
```bash
npm run build:chrome
```

**Output:**
- Folder: `dist-chrome/`
- Zip: `form-filler-chrome-v2.4.0.zip`

**Manifest:** Uses `manifest.json` (Manifest V3)

**Submit:**
1. Go to https://chrome.google.com/webstore/devconsole
2. Click "New Item"
3. Upload `form-filler-chrome-v2.4.0.zip`
4. Fill in store listing details
5. Submit for review

**Review time:** Usually 1-3 days

---

### 🦊 Firefox Add-on

**Build:**
```bash
npm run build:firefox
```

**Output:**
- Folder: `dist-firefox/`
- Zip: `form-filler-firefox-v2.4.0.zip`

**Manifest:** Uses `manifest.firefox.json` (Manifest V2/V3 hybrid)

**Submit:**
1. Go to https://addons.mozilla.org/developers/
2. Click "Submit a New Add-on"
3. Upload `form-filler-firefox-v2.4.0.zip`
4. Fill in listing details
5. Choose distribution channel (listed or self-hosted)
6. Submit for review

**Review time:** Usually 1-5 days

**Note:** Firefox uses stricter CSP policies. Test thoroughly in `about:debugging`.

---

### 🧭 Safari Extension

**Build:**
```bash
npm run build:safari
```

**Output:**
- Folder: `dist-safari/` (no zip)

**Manifest:** Uses `manifest.safari.json`

**Important:** Safari extensions require Xcode wrapper!

#### Step-by-Step Safari Conversion:

1. **Install Xcode** (from Mac App Store)

2. **Create Safari Extension App:**
   ```
   File → New → Project → macOS → Safari Extension App
   Name: "Form Filler"
   ```

3. **Replace extension contents:**
   ```bash
   # In Xcode project navigator:
   # Delete existing Extension folder contents
   # Copy all files from dist-safari/ to Extension folder
   ```

4. **Configure signing:**
   - Select project in Xcode
   - Go to "Signing & Capabilities"
   - Select your Team (requires Apple Developer account)
   - Enable "App Sandbox" capability

5. **Test locally:**
   ```
   Product → Run (Cmd+R)
   → Safari opens
   → Enable extension: Safari → Settings → Extensions
   ```

6. **Submit to App Store:**
   ```
   Product → Archive
   → Distribute App → App Store Connect
   → Upload
   → Go to App Store Connect
   → Fill in app info
   → Submit for review
   ```

**Requirements:**
- ✅ Apple Developer account ($99/year)
- ✅ macOS computer with Xcode
- ✅ Valid code signing certificate

**Review time:** Usually 1-2 weeks

**Detailed guide:** [SAFARI_EXTENSION_GUIDE.md](./SAFARI_EXTENSION_GUIDE.md)

---

## Manifest Differences

### Chrome (manifest.json)
```json
{
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"
  },
  "action": { ... }
}
```

### Firefox (manifest.firefox.json)
```json
{
  "manifest_version": 3,
  "background": {
    "scripts": ["background.js"]
  },
  "browser_action": { ... },
  "browser_specific_settings": {
    "gecko": { ... }
  }
}
```

### Safari (manifest.safari.json)
```json
{
  "manifest_version": 2,
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  },
  "browser_action": { ... }
}
```

## Troubleshooting

### Build fails
```bash
# Clean everything
rm -rf dist dist-chrome dist-firefox dist-safari node_modules

# Reinstall dependencies
npm install

# Try building again
npm run build:chrome
```

### Extension doesn't load
```bash
# Check manifest syntax
cat dist-chrome/manifest.json | jq .

# Check file structure
ls -la dist-chrome/
```

### Missing files in zip
```bash
# Check if all files copied
unzip -l form-filler-chrome-v2.4.0.zip

# Should include:
# - background.js
# - content.js  
# - options.js
# - contextMenus.js
# - chunks/ folder
# - manifest.json
# - icons/
# - options.html
# - options.css
```

### Vite build errors
```bash
# Type check first
npm run type-check

# Check Node version (requires 18+)
node --version

# Update dependencies
npm update
```

## Version Updates

When releasing new version:

1. **Update version in package.json:**
   ```json
   {
     "version": "2.5.0"
   }
   ```

2. **Update manifests:**
   - `manifest.json` → `"version": "2.5.0"`
   - `manifest.firefox.json` → `"version": "2.5.0"`
   - `manifest.safari.json` → `"version": "2.5.0"`

3. **Build all platforms:**
   ```bash
   npm run build:all
   ```

4. **Check output:**
   ```bash
   ls -lh *.zip
   # Should show:
   # form-filler-chrome-v2.5.0.zip
   # form-filler-firefox-v2.5.0.zip
   ```

5. **Test locally:**
   - Load unpacked in Chrome
   - Load temporary in Firefox
   - Run in Xcode for Safari

6. **Submit to stores:**
   - Chrome Web Store
   - Firefox Add-ons
   - App Store (Safari)

## CI/CD (Optional)

### GitHub Actions example:
```yaml
name: Build Extensions

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build:all
      - uses: actions/upload-artifact@v3
        with:
          name: extensions
          path: |
            form-filler-chrome-v*.zip
            form-filler-firefox-v*.zip
```

## File Sizes

| File | Size (gzip) | Browser |
|------|-------------|---------|
| Chrome zip | ~404 KB | Chrome |
| Firefox zip | ~404 KB | Firefox |
| Safari folder | ~500 KB | Safari (unzipped) |

**Note:** Sizes are similar because all use same Vite build output.

## Performance

### Build Times
- First build: ~500ms
- Incremental (dev): ~50ms with HMR
- Full rebuild: ~500ms

### Bundle Analysis
```bash
# View bundle sizes
npm run build 2>&1 | grep "dist/"

# Outputs:
# dist/content.js       498.57 KB │ gzip: 174.18 KB
# dist/options.js        12.32 KB │ gzip:   3.68 KB
# dist/background.js      1.68 KB │ gzip:   0.64 KB
# dist/contextMenus.js    0.99 KB │ gzip:   0.49 KB
```

## Support

### Browser Compatibility
- ✅ Chrome 126+
- ✅ Firefox 109+
- ✅ Safari 14+
- ✅ Edge (Chromium-based)

### Need Help?
- 📖 [README.md](./README.md)
- 📖 [MODERN_STACK_GUIDE.md](./MODERN_STACK_GUIDE.md)
- 🐛 [Report issues](https://github.com/thuyydt/formfiller/issues)

---

**Happy deploying! 🚀**
