#!/bin/bash
# Netlify build script - runs appropriate setup based on SITE_CONFIG env var
set -e

echo "========================================"
echo "Local Agenda Build Script"
echo "========================================"

if [ "$SITE_CONFIG" = "atx-agenda" ]; then
  echo "Building ATX Agenda site..."
  echo "Using config: config/atx-agenda.json"
  node scripts/setup.js --config config/atx-agenda.json
elif [ "$SITE_CONFIG" = "marketing" ]; then
  echo "Building Marketing site..."
  echo "Using config: config/marketing.json"
  node scripts/setup.js --config config/marketing.json
else
  echo "Building customer fork (removing template only)..."
  echo "No SITE_CONFIG env var set - using defaults"
  node scripts/setup.js --remove-template-only
fi

echo ""
echo "Running Next.js build..."
pnpm build

echo ""
echo "Build complete!"

