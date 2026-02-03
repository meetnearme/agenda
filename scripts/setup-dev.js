#!/usr/bin/env node

/**
 * Local Development Setup Script
 *
 * This script sets up the project for local development by using the
 * atx-agenda.json config. It configures the CMS to point to ATX Agenda
 * content directories.
 *
 * Usage:
 *   node scripts/setup-dev.js
 *   pnpm setup:dev
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SITE_CONFIG = process.env.SITE_CONFIG || 'atx-agenda';
const CONFIG_MAP = {
    'atx-agenda': 'config/atx-agenda.json',
    marketing: 'config/marketing.json',
    'santa-fe-agenda': 'config/santa-fe-agenda.json'
};
const CONFIG_PATH = path.join(
    ROOT_DIR,
    CONFIG_MAP[SITE_CONFIG] || 'config/atx-agenda.json'
);

console.log('\n');
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log(
    '║   🛠️  Local Development Setup                                 ║'
);
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log('\n');

// Load the config
if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`❌ Config file not found: ${CONFIG_PATH}`);
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

console.log(`📄 Using config: ${path.relative(ROOT_DIR, CONFIG_PATH)}`);
console.log(`📁 Content directory: ${config.contentDir || 'content'}`);
console.log('');

// Run the main setup script with the config
const configArgPath = path.relative(ROOT_DIR, CONFIG_PATH);
execSync(`node scripts/setup.js --config ${configArgPath}`, {
    cwd: ROOT_DIR,
    stdio: 'inherit'
});

// Create .env.local with the content directory + theme
const contentDir = config.contentDir || 'content';
const theme = config.theme || 'dark';
const envLocalPath = path.join(ROOT_DIR, '.env.local');
fs.writeFileSync(
    envLocalPath,
    `CONTENT_DIR=${contentDir}\nTHEME=${theme}\nSITE_CONFIG=${SITE_CONFIG}\n`
);
console.log(
    `📝 Created .env.local with CONTENT_DIR=${contentDir} and THEME=${theme}`
);

console.log('');
console.log('✅ Ready! Run the dev server:');
console.log('   pnpm dev:all');
console.log('');
