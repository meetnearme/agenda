#!/usr/bin/env node

/**
 * Local Development Setup Script
 *
 * This script sets up the project for local development by using the
 * atx-agenda.json config but replacing the events embed with a localhost version.
 *
 * Usage:
 *   node scripts/setup-dev.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const CONFIG_PATH = path.join(ROOT_DIR, 'config/atx-agenda.json');
const TEMP_CONFIG_PATH = path.join(ROOT_DIR, 'config/.atx-agenda-dev.json');

// Local development events embed
const LOCAL_EVENTS_EMBED = `<div id="mnm-embed-container"></div>
<script src="http://localhost:8001/static/assets/embed.js" data-subdomain="atxagenda" data-user-id="350373621882956150"></script>`;

console.log('\n');
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log(
    '║   🛠️  Local Development Setup                                 ║'
);
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log('\n');

// Load the base config
if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`❌ Config file not found: ${CONFIG_PATH}`);
    process.exit(1);
}

const baseConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// Override eventsEmbed with localhost version
const devConfig = {
    ...baseConfig,
    eventsEmbed: LOCAL_EVENTS_EMBED
};

console.log('📄 Using config: config/atx-agenda.json');
console.log('🔄 Overriding eventsEmbed with localhost:8001 version');
console.log('');

// Write temporary dev config
fs.writeFileSync(TEMP_CONFIG_PATH, JSON.stringify(devConfig, null, 2));

try {
    // Run the main setup script with the dev config
    execSync(`node scripts/setup.js --config ${TEMP_CONFIG_PATH}`, {
        cwd: ROOT_DIR,
        stdio: 'inherit'
    });
} finally {
    // Clean up temporary config file
    if (fs.existsSync(TEMP_CONFIG_PATH)) {
        fs.unlinkSync(TEMP_CONFIG_PATH);
    }
}

console.log(
    '💡 Tip: Make sure the local events embed server is running on port 8001'
);
console.log('');
