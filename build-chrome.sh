#!/bin/bash

# Build script for Chrome Extension
echo "🌐 Building Chrome Extension..."

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")
echo "📌 Version: $VERSION"

# Create build directory
rm -rf dist-chrome
mkdir -p dist-chrome

# Build with Vite
echo "🔨 Building with Vite..."
NODE_ENV=production npm run build

# Copy Vite output to Chrome dist
echo "📦 Copying build files..."
rm -rf dist-chrome
cp -r dist dist-chrome

# Copy Chrome manifest
echo "📝 Using Chrome manifest..."
cp manifest.json dist-chrome/

# Create zip file for submission
echo "📦 Creating zip file..."
cd dist-chrome
zip -r ../form-filler-chrome-v$VERSION.zip . -x "*.DS_Store"
cd ..

echo "✅ Chrome build complete!"
echo "📦 Package: form-filler-chrome-v$VERSION.zip"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://chrome.google.com/webstore/devconsole"
echo "2. Upload form-filler-chrome-v$VERSION.zip"
echo "3. Fill in listing details"
