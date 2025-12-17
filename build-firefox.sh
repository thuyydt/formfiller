#!/bin/bash

# Build script for Firefox Add-on
echo "🦊 Building Firefox Add-on..."

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
echo "📌 Version: $VERSION"

# Create build directory
rm -rf dist-firefox
mkdir -p dist-firefox

# Build with Vite
echo "🔨 Building with Vite..."
NODE_ENV=production npm run build

# Copy Vite output to Firefox dist
echo "📦 Copying build files..."
rm -rf dist-firefox
cp -r dist dist-firefox

# Copy Firefox-specific manifest
echo "📝 Using Firefox manifest..."
cp manifest.firefox.json dist-firefox/manifest.json

# Create zip file for submission
echo "📦 Creating zip file..."
cd dist-firefox
zip -r ../form-filler-firefox-v$VERSION.zip . -x "*.DS_Store"
cd ..

echo "✅ Firefox build complete!"
echo "📦 Package: form-filler-firefox-v$VERSION.zip"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://addons.mozilla.org/developers/"
echo "2. Submit form-filler-firefox-v$VERSION.zip"
echo "3. Fill in listing details"
