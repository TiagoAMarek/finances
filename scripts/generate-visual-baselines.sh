#!/bin/bash

# Script to generate baseline screenshots for visual regression tests
# This script should be run locally where Playwright browsers can be installed

set -e  # Exit on error

echo "=========================================="
echo "Visual Regression Test Baseline Generator"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "playwright.config.ts" ]; then
  echo "❌ Error: playwright.config.ts not found"
  echo "Please run this script from the project root directory"
  exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
  echo "❌ Error: pnpm is not installed"
  echo "Please install pnpm: npm install -g pnpm"
  exit 1
fi

echo "✅ Project structure verified"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  pnpm install
  echo "✅ Dependencies installed"
  echo ""
fi

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
echo "This will download Chromium, Firefox, and WebKit browsers (~500MB)"
echo ""

# Install all browsers for complete coverage
pnpm exec playwright install chromium firefox webkit

echo "✅ Browsers installed"
echo ""

# Start generating baselines
echo "📸 Generating baseline screenshots..."
echo "This will:"
echo "  - Start the dev server with mocked data"
echo "  - Run all 42 visual tests"
echo "  - Capture 252 baseline screenshots"
echo "  - Save them to e2e/__snapshots__/"
echo ""
echo "⏱️  Expected time: 5-10 minutes"
echo ""

# Generate baselines
pnpm test:visual:update

echo ""
echo "=========================================="
echo "✅ Baseline generation complete!"
echo "=========================================="
echo ""
echo "📁 Screenshots saved to: e2e/__snapshots__/"
echo ""
echo "Next steps:"
echo "1. Review the generated screenshots:"
echo "   find e2e/__snapshots__ -name '*.png' | head -10"
echo ""
echo "2. Count total screenshots:"
echo "   find e2e/__snapshots__ -name '*.png' | wc -l"
echo "   (Expected: ~252 screenshots)"
echo ""
echo "3. View a few samples to verify quality:"
echo "   open e2e/__snapshots__/chromium-desktop/login-page-default.png"
echo "   open e2e/__snapshots__/chromium-desktop/dashboard-default.png"
echo ""
echo "4. Commit the baselines to git:"
echo "   git add e2e/__snapshots__/"
echo "   git commit -m 'chore: Add baseline screenshots for visual regression tests'"
echo "   git push"
echo ""
echo "5. Run tests to verify baselines work:"
echo "   pnpm test:visual:chromium"
echo ""
echo "For more information, see:"
echo "  - VISUAL_TESTING.md (Quick Start)"
echo "  - e2e/README.md (Comprehensive Guide)"
echo "  - VERIFICATION_CHECKLIST.md (Validation Steps)"
echo ""
