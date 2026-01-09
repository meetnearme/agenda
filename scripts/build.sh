#!/bin/bash
# Netlify build script - runs appropriate setup based on SITE_CONFIG env var
set -e

echo "========================================"
echo "Local Agenda Build Script"
echo "========================================"

# Default content directory
CONTENT_DIR="content"

if [ "$SITE_CONFIG" = "atx-agenda" ]; then
  echo "Building ATX Agenda site..."
  echo "Using config: config/atx-agenda.json"
  node scripts/setup.js --config config/atx-agenda.json
  # Extract contentDir from config for Next.js build
  CONTENT_DIR=$(node -e "console.log(require('./config/atx-agenda.json').contentDir || 'content')")
elif [ "$SITE_CONFIG" = "marketing" ]; then
  echo "Building Marketing site..."
  echo "Using config: config/marketing.json"
  node scripts/setup.js --config config/marketing.json
  # Extract contentDir from config for Next.js build
  CONTENT_DIR=$(node -e "console.log(require('./config/marketing.json').contentDir || 'content')")
else
  echo "Building customer fork (removing template only)..."
  echo "No SITE_CONFIG env var set - using defaults"
  node scripts/setup.js --remove-template-only
fi

echo ""
echo "Content directory: $CONTENT_DIR"
export CONTENT_DIR
echo "Running Next.js build..."
pnpm build

echo ""
echo "Build complete!"

