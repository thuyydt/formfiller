#!/bin/bash

# Build script for Safari Web Extension
echo "🧭 Building Safari Web Extension..."

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
echo "📌 Version: $VERSION"

# Create build directory
rm -rf dist-safari
mkdir -p dist-safari

# Build with Vite
echo "🔨 Building with Vite..."
NODE_ENV=production npm run build

# Copy Vite output to Safari dist
echo "📦 Copying build files..."
rm -rf dist-safari
cp -r dist dist-safari

# Copy Safari manifest
echo "📝 Using Safari manifest..."
cp manifest.safari.json dist-safari/manifest.json

echo "✅ Safari Web Extension build complete!"
echo "📁 Extension folder: dist-safari/"
echo ""
echo "📋 Next steps to convert to Safari Extension:"
echo "1. Open Xcode"
echo "2. Create new project: File > New > Project > macOS > Safari Extension App"
echo "3. Name your app (e.g., 'Form Filler')"
echo "4. After project creation, replace the extension folder contents with dist-safari/"
echo "5. In Xcode, go to Signing & Capabilities and set up your Team"
echo "6. Build and run the app (Cmd+R)"
echo "7. Enable the extension in Safari > Preferences > Extensions"
echo ""
echo "📋 For App Store submission:"
echo "1. Archive the app: Product > Archive"
echo "2. Distribute App > App Store Connect"
echo "3. Upload to App Store Connect"
echo ""
echo "⚠️  Note: Safari extensions require Xcode and cannot be submitted as just a zip file."
echo "    You need to create a Safari App Extension wrapper using Xcode."
echo ""
echo "📖 Full guide: https://developer.apple.com/documentation/safariservices/safari_web_extensions"
