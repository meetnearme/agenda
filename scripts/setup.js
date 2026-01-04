#!/usr/bin/env node

/**
 * Local Agenda Setup Script
 *
 * This script helps new users customize the template for their own newsletter.
 * Run with: pnpm setup
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ROOT_DIR = path.join(__dirname, '..');

// Color presets for easy selection (hex + oklch for both CMS and CSS)
const COLOR_PRESETS = {
  lime: {
    hex: '#a3e635',
    oklch: 'oklch(0.87 0.18 127)',
    name: 'Lime Green (default)',
  },
  blue: { hex: '#3b82f6', oklch: 'oklch(0.7 0.15 250)', name: 'Ocean Blue' },
  orange: {
    hex: '#f97316',
    oklch: 'oklch(0.75 0.18 50)',
    name: 'Sunset Orange',
  },
  purple: {
    hex: '#8b5cf6',
    oklch: 'oklch(0.65 0.2 300)',
    name: 'Royal Purple',
  },
  pink: { hex: '#ec4899', oklch: 'oklch(0.7 0.2 350)', name: 'Hot Pink' },
  teal: { hex: '#14b8a6', oklch: 'oklch(0.7 0.15 180)', name: 'Teal' },
  red: { hex: '#dc2626', oklch: 'oklch(0.6 0.2 25)', name: 'Crimson Red' },
  gold: { hex: '#eab308', oklch: 'oklch(0.8 0.15 85)', name: 'Gold' },
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
  const l_ = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
  const m_ = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
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

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
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

async function main() {
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
  let primaryColorOklch = COLOR_PRESETS.lime.oklch;
  const colorKeys = Object.keys(COLOR_PRESETS);

  if (colorChoice.trim()) {
    const choiceNum = parseInt(colorChoice);
    if (choiceNum >= 1 && choiceNum <= 8) {
      const preset = COLOR_PRESETS[colorKeys[choiceNum - 1]];
      primaryColorHex = preset.hex;
      primaryColorOklch = preset.oklch;
      console.log(`   ✓ Selected: ${preset.name} (${preset.hex})`);
    } else if (choiceNum === 9) {
      const customHex = await question(
        '\n   Enter hex color (e.g., "#ff5500" or "ff5500"):\n   > '
      );
      if (customHex.trim() && isValidHex(customHex.trim())) {
        primaryColorHex = customHex.trim().startsWith('#')
          ? customHex.trim()
          : `#${customHex.trim()}`;
        primaryColorOklch = hexToOklch(primaryColorHex);
        console.log(`   ✓ Using custom color: ${primaryColorHex}`);
        console.log(`   ✓ Converted to OKLCH: ${primaryColorOklch}`);
      } else {
        console.log('   ⚠ Invalid hex color. Using default lime green.');
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

  // 4. Confirm cleanup
  console.log('\n🧹 STEP 4: Cleanup\n');
  console.log('   The following will be removed:');
  console.log('   • Template page (/template)');
  console.log('   • Sample blog post');
  console.log('   • This setup script\n');

  const confirmCleanup = await question('   Proceed with cleanup? (Y/n): ');

  if (confirmCleanup.toLowerCase() === 'n') {
    console.log(
      '   ⚠ Skipping cleanup. You can delete these files manually later.\n'
    );
  }

  const doCleanup = confirmCleanup.toLowerCase() !== 'n';

  // Apply changes
  console.log('\n');
  console.log(
    '═══════════════════════════════════════════════════════════════'
  );
  console.log('   Applying changes...');
  console.log(
    '═══════════════════════════════════════════════════════════════\n'
  );

  // Update Site Settings (content/settings/index.md)
  console.log('📄 Updating site settings...');
  const settingsPath = path.join(ROOT_DIR, 'content/settings/index.md');
  replaceInFile(settingsPath, /sitename: .*/g, `sitename: ${orgName.trim()}`);
  replaceInFile(
    settingsPath,
    /tagline: .*/g,
    `tagline: ${tagline.trim() || 'Your Weekly Guide to Local Events'}`
  );
  replaceInFile(
    settingsPath,
    /copyrightname: .*/g,
    `copyrightname: ${orgName.trim()}`
  );
  replaceInFile(settingsPath, /subscribercount: .*/g, `subscribercount: ''`);
  replaceInFile(
    settingsPath,
    /subscribercounttext: .*/g,
    `subscribercounttext: subscribers getting weekly updates`
  );
  console.log('   ✓ Site settings updated\n');

  // Update Home Content (content/home/index.md)
  console.log('📄 Updating home content...');
  const homePath = path.join(ROOT_DIR, 'content/home/index.md');
  replaceInFile(homePath, /title: Local Agenda/g, `title: ${orgName.trim()}`);
  replaceInFile(
    homePath,
    /tagline: .*/g,
    `tagline: ${tagline.trim() || 'Your Weekly Guide to Local Events'}`
  );
  replaceInFile(
    homePath,
    /footerbiotext: .*/g,
    `footerbiotext: Your weekly guide to local events and community happenings.`
  );
  console.log('   ✓ Home content updated\n');

  // Update globals.css with brand color (OKLCH for CSS)
  console.log('🎨 Updating brand color in CSS...');
  const cssPath = path.join(ROOT_DIR, 'app/globals.css');
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

  // Update site settings with brand color (hex for CMS editing)
  console.log('🎨 Saving brand color to settings...');
  replaceInFile(
    settingsPath,
    /brandcolor: .*/g,
    `brandcolor: '${primaryColorHex}'`
  );
  // If brandcolor doesn't exist, add it after sitename
  const settingsContent = fs.readFileSync(settingsPath, 'utf8');
  if (!settingsContent.includes('brandcolor:')) {
    const updatedSettings = settingsContent.replace(
      /(sitename: .*)$/m,
      `$1\nbrandcolor: '${primaryColorHex}'`
    );
    fs.writeFileSync(settingsPath, updatedSettings);
  }
  console.log('   ✓ Brand color saved to CMS settings\n');

  // Update layout metadata
  console.log('📄 Updating page metadata...');
  const layoutPath = path.join(ROOT_DIR, 'app/layout.tsx');
  replaceInFile(
    layoutPath,
    /title: 'Local Agenda \| Your Weekly Events Newsletter'/g,
    `title: '${orgName.trim()} | Your Weekly Events Newsletter'`
  );
  console.log('   ✓ Metadata updated\n');

  // Update navigation lib
  console.log('📄 Updating navigation defaults...');
  const navPath = path.join(ROOT_DIR, 'lib/navigation.ts');
  replaceInFile(
    navPath,
    /title: 'Local Agenda'/g,
    `title: '${orgName.trim()}'`
  );
  replaceInFile(
    navPath,
    /author: 'Local Agenda Team'/g,
    `author: '${orgName.trim()} Team'`
  );
  console.log('   ✓ Navigation updated\n');

  if (doCleanup) {
    // Remove template page
    console.log('🗑️  Removing template page...');
    deleteDirectory(path.join(ROOT_DIR, 'app/(main)/template'));
    deleteDirectory(path.join(ROOT_DIR, 'content/template'));
    console.log('   ✓ Template page removed\n');

    // Remove sample blog post
    console.log('🗑️  Removing sample blog post...');
    deleteDirectory(path.join(ROOT_DIR, 'content/blog/2026'));
    console.log('   ✓ Sample blog post removed\n');

    // Remove Template from navigation
    console.log('📄 Updating navigation...');
    const homeContentPath = path.join(ROOT_DIR, 'content/home/index.md');
    const homeContent = fs.readFileSync(homeContentPath, 'utf8');
    const updatedHomeContent = homeContent.replace(
      /  - title: Template\n    slug: \/template\n/g,
      ''
    );
    fs.writeFileSync(homeContentPath, updatedHomeContent);

    // Remove from navigation.ts
    const navContent = fs.readFileSync(navPath, 'utf8');
    const updatedNavContent = navContent.replace(
      /  {\n    title: 'Template',\n    slug: '\/template',\n  },\n/g,
      ''
    );
    fs.writeFileSync(navPath, updatedNavContent);
    console.log('   ✓ Navigation cleaned up\n');

    // Remove Template CTA from homepage
    console.log('📄 Removing template CTA from homepage...');
    const homepagePath = path.join(ROOT_DIR, 'app/(main)/page.tsx');
    if (fs.existsSync(homepagePath)) {
      let homepageContent = fs.readFileSync(homepagePath, 'utf8');
      // Remove Code2 import
      homepageContent = homepageContent.replace(/, Code2/g, '');
      // Remove the Template CTA section
      homepageContent = homepageContent.replace(
        /\s*{\/\* Template CTA Section \*\/}[\s\S]*?<\/section>/,
        ''
      );
      fs.writeFileSync(homepagePath, homepageContent);
    }
    console.log('   ✓ Homepage CTA removed\n');

    // Update CMS config to remove template collection
    console.log('📄 Updating CMS config...');
    const cmsConfigPath = path.join(ROOT_DIR, 'public/admin/config.yml');
    if (fs.existsSync(cmsConfigPath)) {
      let cmsContent = fs.readFileSync(cmsConfigPath, 'utf8');
      // Remove template collection (this is a bit tricky with YAML)
      cmsContent = cmsContent.replace(
        /  - name: template[\s\S]*?(?=  - name: home)/,
        ''
      );
      fs.writeFileSync(cmsConfigPath, cmsContent);
    }
    console.log('   ✓ CMS config updated\n');

    // Self-destruct: remove setup script and scripts directory
    console.log('🗑️  Removing setup script...');
    // We'll mark for deletion but can't delete while running
    const packageJsonPath = path.join(ROOT_DIR, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    delete packageJson.scripts.setup;
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n'
    );
    console.log('   ✓ Setup script will be removed\n');
  }

  // Success message
  console.log(
    '═══════════════════════════════════════════════════════════════'
  );
  console.log('');
  console.log('   ✅ Setup complete!');
  console.log('');
  console.log(`   Your newsletter "${orgName.trim()}" is ready to go.`);
  console.log('');
  console.log('   Next steps:');
  console.log('   1. Run `pnpm dev:all` to start developing');
  console.log('   2. Visit http://localhost:3001/admin to manage content');
  console.log('   3. Deploy to Netlify when ready');
  console.log('');

  if (doCleanup) {
    console.log('   📌 Remember to delete the scripts/ directory:');
    console.log('      rm -rf scripts/');
    console.log('');
  }

  console.log(
    '═══════════════════════════════════════════════════════════════\n'
  );

  rl.close();
}

main().catch((error) => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
