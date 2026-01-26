#!/usr/bin/env node

/**
 * Local Agenda Setup Script
 *
 * This script helps new users customize the template for their own newsletter.
 *
 * Usage:
 *   Interactive mode:  pnpm setup
 *   Config file mode:  node scripts/setup.js --config config/atx-agenda.json
 *   Template removal:  node scripts/setup.js --remove-template-only
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const matter = require('gray-matter');
const yaml = require('js-yaml');

const ROOT_DIR = path.join(__dirname, '..');

// Parse command line arguments
const args = process.argv.slice(2);
const configIndex = args.indexOf('--config');
const removeTemplateOnly = args.includes('--remove-template-only');
const configPath = configIndex !== -1 ? args[configIndex + 1] : null;

// Color presets for easy selection (hex + oklch for both CMS and CSS)
const COLOR_PRESETS = {
    lime: {
        hex: '#a3e635',
        oklch: 'oklch(0.87 0.18 127)',
        name: 'Lime Green (default)'
    },
    blue: { hex: '#3b82f6', oklch: 'oklch(0.7 0.15 250)', name: 'Ocean Blue' },
    orange: {
        hex: '#f97316',
        oklch: 'oklch(0.75 0.18 50)',
        name: 'Sunset Orange'
    },
    purple: {
        hex: '#8b5cf6',
        oklch: 'oklch(0.65 0.2 300)',
        name: 'Royal Purple'
    },
    pink: { hex: '#ec4899', oklch: 'oklch(0.7 0.2 350)', name: 'Hot Pink' },
    teal: { hex: '#14b8a6', oklch: 'oklch(0.7 0.15 180)', name: 'Teal' },
    red: { hex: '#dc2626', oklch: 'oklch(0.6 0.2 25)', name: 'Crimson Red' },
    gold: { hex: '#eab308', oklch: 'oklch(0.8 0.15 85)', name: 'Gold' }
};

/**
 * Convert hex color to OKLCH
 * @param {string} hex - Hex color (e.g., "#ff5500" or "ff5500")
 * @returns {string} - OKLCH color string
 */
function hexToOklch(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Parse hex to RGB (0-255)
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Convert to linear RGB (0-1, gamma corrected)
    const toLinear = (c) => {
        c = c / 255;
        return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    const lr = toLinear(r);
    const lg = toLinear(g);
    const lb = toLinear(b);

    // Linear RGB to XYZ (D65)
    const x = 0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb;
    const y = 0.2126729 * lr + 0.7151522 * lg + 0.072175 * lb;
    const z = 0.0193339 * lr + 0.119192 * lg + 0.9503041 * lb;

    // XYZ to OKLAB
    const l_ = Math.cbrt(
        0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z
    );
    const m_ = Math.cbrt(
        0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z
    );
    const s_ = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z);

    const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    const bVal = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

    // OKLAB to OKLCH
    const C = Math.sqrt(a * a + bVal * bVal);
    let H = Math.atan2(bVal, a) * (180 / Math.PI);
    if (H < 0) H += 360;

    // Format with reasonable precision
    return `oklch(${L.toFixed(2)} ${C.toFixed(2)} ${H.toFixed(0)})`;
}

/**
 * Validate hex color format
 * @param {string} hex - Input string
 * @returns {boolean} - True if valid hex color
 */
function isValidHex(hex) {
    return /^#?[0-9A-Fa-f]{6}$/.test(hex);
}

function replaceInFile(filePath, searchValue, replaceValue) {
    if (!fs.existsSync(filePath)) {
        console.log(`  ⚠ File not found: ${filePath}`);
        return false;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(searchValue, replaceValue);
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent);
        return true;
    }
    return false;
}

function deleteDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
        return true;
    }
    return false;
}

function deleteFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
    }
    return false;
}

/**
 * Recursively copy a directory
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 */
function copyDirectory(src, dest) {
    if (!fs.existsSync(src)) {
        return false;
    }

    // Create destination if it doesn't exist
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }

    return true;
}

/**
 * Remove template page and all references to it
 */
function removeTemplatePage() {
    // Remove template page directory
    console.log('🗑️  Removing template page...');
    deleteDirectory(path.join(ROOT_DIR, 'content/template'));
    console.log('   ✓ Template page removed\n');

    // Remove Template from navigation in home content
    console.log('📄 Updating navigation...');
    const homeContentPath = path.join(ROOT_DIR, 'content/home/index.md');
    if (fs.existsSync(homeContentPath)) {
        const homeContent = fs.readFileSync(homeContentPath, 'utf8');
        const updatedHomeContent = homeContent.replace(
            /  - title: Template\n    slug: \/template\n/g,
            ''
        );
        fs.writeFileSync(homeContentPath, updatedHomeContent);
    }

    // Note: In 11ty, navigation is handled via global data (homeContent)
    // No separate navigation file to update
    console.log('   ✓ Navigation updated via home content\n');

    // Note: In 11ty, the homepage is template-based (src/pages/index.njk)
    // No hardcoded CTA sections to remove

    // Update CMS config to remove template collection
    console.log('📄 Updating CMS config...');
    const cmsConfigPath = path.join(ROOT_DIR, 'public/admin/config.yml');
    if (fs.existsSync(cmsConfigPath)) {
        let cmsContent = fs.readFileSync(cmsConfigPath, 'utf8');
        // Remove template collection
        cmsContent = cmsContent.replace(
            /  - name: template[\s\S]*?(?=  - name: home)/,
            ''
        );
        fs.writeFileSync(cmsConfigPath, cmsContent);
    }
    console.log('   ✓ CMS config updated\n');
}

/**
 * Update CMS config to point to config-driven content directories
 * This allows admins to edit content via CMS that commits to the config directory
 * @param {string} contentDir - Path to content directory (e.g., "config/atx-agenda-content")
 * @param {string} configFilePath - Path to the JSON config file (e.g., "config/atx-agenda.json")
 */
function updateCmsConfig(contentDir, configFilePath) {
    const cmsConfigPath = path.join(ROOT_DIR, 'public/admin/config.yml');

    if (!fs.existsSync(cmsConfigPath)) {
        console.log('   ⚠ CMS config not found, skipping CMS path updates');
        return;
    }

    console.log('📝 Updating CMS config for config-driven content...');
    let cmsContent = fs.readFileSync(cmsConfigPath, 'utf8');

    // Targeted replacement 1: Update site-config collection's JSON file path
    cmsContent = cmsContent.replace(
        /(- name: site-config[\s\S]*?- file: )[^\n]+/,
        `$1${configFilePath}`
    );

    // Targeted replacement 2: Update updates collection's folder path
    cmsContent = cmsContent.replace(
        /(- name: updates[\s\S]*?folder: )[^\n]+/,
        `$1${contentDir}/updates`
    );

    // Targeted replacement 3: Update events collection's file path
    cmsContent = cmsContent.replace(
        /(- name: events[\s\S]*?- file: )[^\n]+/,
        `$1${contentDir}/events/index.md`
    );

    fs.writeFileSync(cmsConfigPath, cmsContent);
    console.log(`   ✓ Site Config now uses ${configFilePath}`);
    console.log(`   ✓ Updates collection now points to ${contentDir}/updates`);
    console.log(
        `   ✓ Events collection now points to ${contentDir}/events/index.md\n`
    );
}

/**
 * Apply configuration values (from config file or interactive input)
 */
function applyConfiguration(config, configFilePath = null) {
    const {
        orgName,
        tagline,
        description,
        brandColor,
        heroText,
        eventsTitle,
        beehiiv,
        removeTemplate,
        contentDir
    } = config;

    const primaryColorHex = brandColor || COLOR_PRESETS.lime.hex;
    const primaryColorOklch = isValidHex(primaryColorHex)
        ? hexToOklch(primaryColorHex)
        : COLOR_PRESETS.lime.oklch;

    console.log(
        '═══════════════════════════════════════════════════════════════'
    );
    console.log('   Applying changes...');
    console.log(
        '═══════════════════════════════════════════════════════════════\n'
    );

    // Update Site Settings (content/settings/index.md)
    // Data-driven approach: map JSON config keys to YAML keys and update if they exist
    console.log('📄 Updating site settings...');
    const settingsPath = path.join(ROOT_DIR, 'content/settings/index.md');

    const fileContents = fs.readFileSync(settingsPath, 'utf8');
    const { data, content: bodyContent } = matter(fileContents);

    // Mapping from JSON config keys to YAML keys in settings file
    // Format: { jsonKey: 'yamlKey' } or { jsonKey: ['yamlKey1', 'yamlKey2'] } for multiple mappings
    const configToYamlMapping = {
        orgName: ['sitename', 'copyrightname'], // orgName maps to both sitename and copyrightname
        tagline: 'tagline',
        description: 'description',
        heroText: 'herotext'
    };

    // Update YAML fields based on config - only if they exist in config
    Object.entries(configToYamlMapping).forEach(([jsonKey, yamlKeys]) => {
        const configValue = config[jsonKey];
        if (
            configValue !== undefined &&
            configValue !== null &&
            configValue !== ''
        ) {
            if (Array.isArray(yamlKeys)) {
                // Multiple YAML keys map to one JSON key
                yamlKeys.forEach((yamlKey) => {
                    data[yamlKey] = configValue;
                });
            } else {
                // Single YAML key maps to one JSON key
                data[yamlKeys] = configValue;
            }
        }
    });

    // Handle brandColor separately (needs hex conversion)
    if (brandColor !== undefined && brandColor !== null && brandColor !== '') {
        data.brandcolor = primaryColorHex;
    }

    // Handle nested beehiiv object - merge into newsletter if it exists in config
    if (beehiiv && typeof beehiiv === 'object') {
        if (!data.newsletter) {
            data.newsletter = {};
        }
        // Update newsletter fields from beehiiv config if they exist
        Object.entries(beehiiv).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                // Convert camelCase to the format used in YAML (e.g., embedCode stays embedCode)
                data.newsletter[key] = value;
            }
        });
    }

    // Always update these defaults (not from config, but required)
    data.subscribercount = '';
    data.subscribercounttext = 'subscribers getting weekly updates';

    // Stringify back to YAML and reconstruct the file
    const yamlContent = yaml.dump(data, {
        lineWidth: -1, // Don't wrap lines
        noRefs: true, // Don't use YAML references
        quotingType: "'", // Use single quotes to match existing format
        forceQuotes: false // Only quote when necessary
    });

    const updatedContent = `---\n${yamlContent}---${bodyContent ? '\n' + bodyContent : ''}`;
    fs.writeFileSync(settingsPath, updatedContent);
    console.log('   ✓ Site settings updated\n');

    // Update Home Content (content/home/index.md)
    // Data-driven approach: map JSON config keys to YAML keys
    console.log('📄 Updating home content...');
    const homePath = path.join(ROOT_DIR, 'content/home/index.md');

    const homeFileContents = fs.readFileSync(homePath, 'utf8');
    const { data: homeData, content: homeBodyContent } =
        matter(homeFileContents);

    // Mapping from JSON config keys to YAML keys in home content file
    const homeConfigToYamlMapping = {
        orgName: 'title',
        tagline: 'tagline'
    };

    // Update YAML fields based on config - only if they exist in config
    Object.entries(homeConfigToYamlMapping).forEach(([jsonKey, yamlKey]) => {
        const configValue = config[jsonKey];
        if (
            configValue !== undefined &&
            configValue !== null &&
            configValue !== ''
        ) {
            homeData[yamlKey] = configValue;
        }
    });

    // Always update footerbiotext default
    homeData.footerbiotext =
        'Your weekly guide to local events and community happenings.';

    // Stringify back to YAML and reconstruct the file
    const homeYamlContent = yaml.dump(homeData, {
        lineWidth: -1,
        noRefs: true,
        quotingType: "'",
        forceQuotes: false
    });

    const updatedHomeContent = `---\n${homeYamlContent}---${homeBodyContent ? '\n' + homeBodyContent : ''}`;
    fs.writeFileSync(homePath, updatedHomeContent);
    console.log('   ✓ Home content updated\n');

    // Update main.css with brand color (OKLCH for CSS)
    console.log('🎨 Updating brand color in CSS...');
    const cssPath = path.join(ROOT_DIR, 'src/css/main.css');
    replaceInFile(
        cssPath,
        /--primary: oklch\([^)]+\)/g,
        `--primary: ${primaryColorOklch}`
    );
    replaceInFile(
        cssPath,
        /--accent: oklch\([^)]+\)/g,
        `--accent: ${primaryColorOklch}`
    );
    replaceInFile(
        cssPath,
        /--ring: oklch\([^)]+\)/g,
        `--ring: ${primaryColorOklch}`
    );
    replaceInFile(
        cssPath,
        /--sidebar-primary: oklch\([^)]+\)/g,
        `--sidebar-primary: ${primaryColorOklch}`
    );
    replaceInFile(
        cssPath,
        /--sidebar-ring: oklch\([^)]+\)/g,
        `--sidebar-ring: ${primaryColorOklch}`
    );
    replaceInFile(
        cssPath,
        /--chart-1: oklch\([^)]+\)/g,
        `--chart-1: ${primaryColorOklch}`
    );
    console.log('   ✓ Brand color updated in CSS\n');

    // Note: Events embed is now CMS-driven via contentDir/events/index.md
    // No direct file manipulation needed - CMS points to the correct file
    // Brand color and Beehiiv settings are now handled above in the YAML parsing block

    // Navigation is now handled via 11ty global data (homeContent)
    // No separate navigation file to update
    console.log('📄 Navigation configuration handled via home content\n');

    // Update CMS config to point to config content directories
    if (contentDir && configFilePath) {
        updateCmsConfig(contentDir, configFilePath);
    }

    // Update events page title if provided
    if (eventsTitle && contentDir) {
        console.log('📄 Updating events page...');
        const eventsPath = path.join(ROOT_DIR, contentDir, 'events/index.md');
        if (fs.existsSync(eventsPath)) {
            replaceInFile(eventsPath, /^title: .*/m, `title: ${eventsTitle}`);
            console.log(`   ✓ Events title updated to "${eventsTitle}"\n`);
        }
    }

    // Note: We no longer copy content - CMS points directly to config content directory
    // Next.js reads from content/ but for config-driven sites, content lives in config/

    // Remove template if requested
    if (removeTemplate) {
        removeTemplatePage();
    }

    console.log(
        '═══════════════════════════════════════════════════════════════'
    );
    console.log('');
    console.log('   ✅ Setup complete!');
    console.log('');
    if (orgName) {
        console.log(`   Your newsletter "${orgName}" is ready to go.`);
    }
    console.log('');
    console.log(
        '═══════════════════════════════════════════════════════════════\n'
    );
}

/**
 * Run setup in non-interactive mode with config file
 */
function runWithConfig(configFilePath) {
    console.log('\n');
    console.log(
        '╔══════════════════════════════════════════════════════════════╗'
    );
    console.log(
        '║   🚀 Local Agenda Setup (Non-Interactive Mode)               ║'
    );
    console.log(
        '╚══════════════════════════════════════════════════════════════╝'
    );
    console.log('\n');

    const fullPath = path.resolve(ROOT_DIR, configFilePath);
    console.log(`📄 Loading config from: ${fullPath}\n`);

    if (!fs.existsSync(fullPath)) {
        console.error(`❌ Config file not found: ${fullPath}`);
        process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    console.log(`   Organization: ${config.orgName || '(default)'}`);
    console.log(`   Tagline: ${config.tagline || '(default)'}`);
    console.log(`   Brand Color: ${config.brandColor || '(default)'}`);
    console.log(`   Content Dir: ${config.contentDir || '(default)'}`);
    console.log(`   Remove Template: ${config.removeTemplate ? 'Yes' : 'No'}`);
    console.log('');

    // Pass the config file path so CMS can be configured to edit it
    applyConfiguration(config, configFilePath);
}

/**
 * Run setup to only remove template (for customer forks)
 */
function runRemoveTemplateOnly() {
    console.log('\n');
    console.log(
        '╔══════════════════════════════════════════════════════════════╗'
    );
    console.log(
        '║   🚀 Local Agenda Setup (Remove Template Only)               ║'
    );
    console.log(
        '╚══════════════════════════════════════════════════════════════╝'
    );
    console.log('\n');

    console.log('   This will remove the template page,');
    console.log('   keeping all other defaults for CMS configuration.\n');

    removeTemplatePage();

    console.log(
        '═══════════════════════════════════════════════════════════════'
    );
    console.log('');
    console.log('   ✅ Template removal complete!');
    console.log('');
    console.log('   Configure your site via the CMS at /admin');
    console.log('');
    console.log(
        '═══════════════════════════════════════════════════════════════\n'
    );
}

/**
 * Run setup in interactive mode
 */
async function runInteractive() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function question(prompt) {
        return new Promise((resolve) => {
            rl.question(prompt, resolve);
        });
    }

    console.log('\n');
    console.log(
        '╔══════════════════════════════════════════════════════════════╗'
    );
    console.log(
        '║                                                              ║'
    );
    console.log(
        '║   🚀 Welcome to Local Agenda Setup                           ║'
    );
    console.log(
        '║                                                              ║'
    );
    console.log(
        '║   This script will customize the template for your          ║'
    );
    console.log(
        '║   community newsletter.                                      ║'
    );
    console.log(
        '║                                                              ║'
    );
    console.log(
        '╚══════════════════════════════════════════════════════════════╝'
    );
    console.log('\n');

    // 1. Organization Name
    console.log('📝 STEP 1: Organization Name\n');
    const orgName = await question(
        '   What is your newsletter/organization name?\n   (e.g., "Austin Events", "Brooklyn Buzz")\n\n   > '
    );

    if (!orgName.trim()) {
        console.log('\n   ❌ Organization name is required. Exiting.\n');
        rl.close();
        process.exit(1);
    }

    // 2. Brand Color
    console.log('\n📎 STEP 2: Brand Color\n');
    console.log('   Choose a preset color or enter your own:\n');

    Object.entries(COLOR_PRESETS).forEach(([key, value], index) => {
        console.log(`   ${index + 1}. ${value.name} (${value.hex})`);
    });
    console.log(`   9. Custom hex color (e.g., #ff5500)`);
    console.log('');

    const colorChoice = await question(
        '   Enter number (1-9) or press Enter for lime: '
    );

    let primaryColorHex = COLOR_PRESETS.lime.hex;
    const colorKeys = Object.keys(COLOR_PRESETS);

    if (colorChoice.trim()) {
        const choiceNum = parseInt(colorChoice);
        if (choiceNum >= 1 && choiceNum <= 8) {
            const preset = COLOR_PRESETS[colorKeys[choiceNum - 1]];
            primaryColorHex = preset.hex;
            console.log(`   ✓ Selected: ${preset.name} (${preset.hex})`);
        } else if (choiceNum === 9) {
            const customHex = await question(
                '\n   Enter hex color (e.g., "#ff5500" or "ff5500"):\n   > '
            );
            if (customHex.trim() && isValidHex(customHex.trim())) {
                primaryColorHex = customHex.trim().startsWith('#')
                    ? customHex.trim()
                    : `#${customHex.trim()}`;
                console.log(`   ✓ Using custom color: ${primaryColorHex}`);
            } else {
                console.log(
                    '   ⚠ Invalid hex color. Using default lime green.'
                );
            }
        }
    } else {
        console.log('   ✓ Using default: Lime Green');
    }

    // 3. Tagline
    console.log('\n✍️  STEP 3: Tagline\n');
    const tagline = await question(
        '   Enter a short tagline for your newsletter:\n   (e.g., "Your Weekly Guide to Austin Events")\n\n   > '
    );

    // 3b. Site Description (for SEO)
    console.log('\n📝 STEP 3b: Site Description (SEO)\n');
    console.log('   This appears in search results and social media shares.\n');
    const siteDescription = await question(
        '   Enter a longer description for your newsletter:\n   (e.g., "Discover the best local events in Austin every week. Subscribe for curated weekly event guides.")\n\n   > '
    );

    // 4. Beehiiv Newsletter Integration
    console.log('\n📧 STEP 4: Newsletter Integration (Beehiiv)\n');
    console.log(
        '   Beehiiv is a newsletter platform that powers your subscriber signups.'
    );
    console.log(
        '   You can set this up now or configure it later in Site Settings.\n'
    );
    console.log('   Options:');
    console.log('   1. Skip for now (configure later in CMS)');
    console.log('   2. Iframe Embed (works on all Beehiiv tiers)');
    console.log('   3. Native Form (requires Beehiiv API access)\n');

    const beehiivChoice = await question(
        '   Enter choice (1-3) or press Enter to skip: '
    );

    let beehiivMode = 'iframe';
    let beehiivEmbedCode = '';
    let beehiivPublicationId = '';
    let beehiivApiKey = '';
    let beehiivSubscribeUrl = '';

    if (beehiivChoice.trim() === '2') {
        console.log('\n   To get your embed code:');
        console.log('   1. Go to Beehiiv → Audience → Subscribe Forms');
        console.log('   2. Create or select a form');
        console.log('   3. Click "Get Embed Code" and copy the iframe code\n');

        const embedCode = await question(
            '   Paste your Beehiiv embed code (or press Enter to skip):\n   > '
        );
        if (embedCode.trim()) {
            beehiivEmbedCode = embedCode.trim();
            console.log('   ✓ Embed code saved');
        } else {
            console.log(
                '   ⚠ Skipped - you can add this later in Site Settings'
            );
        }
    } else if (beehiivChoice.trim() === '3') {
        beehiivMode = 'native';
        console.log('\n   To get your API credentials:');
        console.log('   1. Go to Beehiiv → Settings → API');
        console.log('   2. Copy your Publication ID');
        console.log('   3. Create a new API Key\n');

        const pubId = await question(
            '   Enter your Publication ID (or press Enter to skip):\n   > '
        );
        if (pubId.trim()) {
            beehiivPublicationId = pubId.trim();
            console.log('   ✓ Publication ID saved');
        }

        const apiKey = await question(
            '\n   Enter your API Key (or press Enter to skip):\n   > '
        );
        if (apiKey.trim()) {
            beehiivApiKey = apiKey.trim();
            console.log('   ✓ API Key saved');
        }

        if (!pubId.trim() || !apiKey.trim()) {
            console.log(
                '   ⚠ Incomplete - you can add credentials later in Site Settings'
            );
        }
    } else {
        console.log(
            '   ✓ Skipped - you can configure Beehiiv later in Site Settings'
        );
    }

    // Ask for Subscribe Page URL (used by header button)
    console.log('\n   📎 Subscribe Page URL');
    console.log('   This URL is used by the "Subscribe" button in the header.');
    console.log('   Format: https://yourname.beehiiv.com/subscribe\n');

    const subscribeUrlInput = await question(
        '   Enter your Beehiiv subscribe page URL (or press Enter to skip):\n   > '
    );
    if (subscribeUrlInput.trim()) {
        beehiivSubscribeUrl = subscribeUrlInput.trim();
        console.log('   ✓ Subscribe URL saved');
    } else {
        console.log('   ⚠ Skipped - button will scroll to signup form instead');
    }

    // 5. Confirm cleanup
    console.log('\n🧹 STEP 5: Cleanup\n');
    console.log('   The following will be removed:');
    console.log('   • Template page (/template)\n');

    const confirmCleanup = await question('   Proceed with cleanup? (Y/n): ');
    const doCleanup = confirmCleanup.toLowerCase() !== 'n';

    rl.close();

    // Apply configuration
    applyConfiguration({
        orgName: orgName.trim(),
        tagline: tagline.trim() || 'Your Weekly Guide to Local Events',
        description: siteDescription.trim(),
        brandColor: primaryColorHex,
        beehiiv: {
            mode: beehiivMode,
            embedCode: beehiivEmbedCode,
            publicationId: beehiivPublicationId,
            apiKey: beehiivApiKey,
            subscribeUrl: beehiivSubscribeUrl
        },
        removeTemplate: doCleanup
    });

    console.log('   Next steps:');
    console.log('   1. Run `pnpm dev:all` to start developing');
    console.log('   2. Visit http://localhost:3001/admin to manage content');
    console.log('   3. Deploy to Netlify when ready');
    console.log('');
}

// Main entry point
if (configPath) {
    runWithConfig(configPath);
} else if (removeTemplateOnly) {
    runRemoveTemplateOnly();
} else {
    runInteractive().catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
}
