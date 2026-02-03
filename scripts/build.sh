#!/bin/bash
# Netlify build script - runs appropriate setup based on SITE_CONFIG env var
set -e

echo "========================================"
echo "Local Agenda Build Script"
echo "========================================"

# Default content directory + theme
CONTENT_DIR="content"
THEME="dark"

if [ "$SITE_CONFIG" = "atx-agenda" ]; then
  echo "Building ATX Agenda site..."
  echo "Using config: config/atx-agenda.json"
  node scripts/setup.js --config config/atx-agenda.json
  # Extract contentDir from config for 11ty build
  CONTENT_DIR=$(node -e "console.log(require('./config/atx-agenda.json').contentDir || 'content')")
  THEME=$(node -e "console.log(require('./config/atx-agenda.json').theme || 'dark')")
elif [ "$SITE_CONFIG" = "marketing" ]; then
  echo "Building Marketing site..."
  echo "Using config: config/marketing.json"
  node scripts/setup.js --config config/marketing.json
  # Extract contentDir from config for 11ty build
  CONTENT_DIR=$(node -e "console.log(require('./config/marketing.json').contentDir || 'content')")
  THEME=$(node -e "console.log(require('./config/marketing.json').theme || 'dark')")
elif [ "$SITE_CONFIG" = "santa-fe-agenda" ]; then
  echo "Building Santa Fe Agenda site..."
  echo "Using config: config/santa-fe-agenda.json"
  node scripts/setup.js --config config/santa-fe-agenda.json
  # Extract contentDir from config for 11ty build
  CONTENT_DIR=$(node -e "console.log(require('./config/santa-fe-agenda.json').contentDir || 'content')")
  THEME=$(node -e "console.log(require('./config/santa-fe-agenda.json').theme || 'dark')")
elif [ "$SITE_CONFIG" = "plano-moms" ]; then
  echo "Building Plano Moms site..."
  echo "Using config: config/plano-moms.json"
  node scripts/setup.js --config config/plano-moms.json
  # Extract contentDir from config for 11ty build
  CONTENT_DIR=$(node -e "console.log(require('./config/plano-moms.json').contentDir || 'content')")
  THEME=$(node -e "console.log(require('./config/plano-moms.json').theme || 'dark')")
else
  echo "Building customer fork (removing template only)..."
  echo "No SITE_CONFIG env var set - using defaults"
  node scripts/setup.js --remove-template-only
fi

echo ""
echo "Content directory: $CONTENT_DIR"
echo "Theme: $THEME"

# Write to .env.local for 11ty to pick up during static generation
echo "CONTENT_DIR=$CONTENT_DIR" > .env.local
echo "THEME=$THEME" >> .env.local
echo "SITE_CONFIG=$SITE_CONFIG" >> .env.local
echo "Created .env.local with CONTENT_DIR=$CONTENT_DIR and THEME=$THEME"
cat .env.local

export CONTENT_DIR="$CONTENT_DIR"
export THEME="$THEME"
echo "Running 11ty build with CONTENT_DIR=$CONTENT_DIR and THEME=$THEME"
CONTENT_DIR="$CONTENT_DIR" THEME="$THEME" pnpm build

echo ""
echo "Build complete!"

