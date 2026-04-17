#!/bin/bash

# Tamil Calendar Frontend Build Script
# Run from /tamil_bot/frontend directory

set -e

echo "🔨 Starting Tamil Calendar Frontend Build..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the frontend directory:"
    echo "  cd /tamil_bot/frontend"
    exit 1
fi

# Check if index.html exists
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found in current directory!"
    echo "Current directory: $(pwd)"
    echo "Files present:"
    ls -la | grep -E "index|html|vite"
    exit 1
fi

echo "✅ Working directory: $(pwd)"
echo "✅ index.html found"
echo ""

# Clear old build artifacts
echo "🧹 Cleaning old build artifacts..."
rm -rf dist node_modules/.vite node_modules/.bin/vite
echo "✅ Cleaned"
echo ""

# Install dependencies if node_modules is missing
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Build
echo "🔨 Building for production..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build completed successfully!"
    echo ""
    echo "📁 Build output directory: $(pwd)/dist"
    echo ""
    echo "📊 Build size:"
    du -sh dist/
    echo ""
    echo "✅ Ready to deploy!"
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi
