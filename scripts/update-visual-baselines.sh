#!/bin/bash
# Script to update visual regression baselines using Docker
# This ensures baselines are generated in the same Linux environment as CI

set -e

echo "🐳 Building Docker image for visual testing..."
docker compose -f docker-compose.visual-tests.yml build

echo "📸 Generating visual regression baselines in Docker..."
docker compose -f docker-compose.visual-tests.yml up --abort-on-container-exit

echo "✅ Baselines updated! Check the changes with:"
echo "   git status e2e/__snapshots__/"
echo ""
echo "To commit the changes:"
echo "   git add e2e/__snapshots__/"
echo "   git commit -m \"chore(tests): update visual regression baselines\""
