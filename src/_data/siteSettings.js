const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

module.exports = () => {
  try {
    // Settings respect CONTENT_DIR for config-driven deployments
    const CONTENT_DIR = process.env.CONTENT_DIR || 'content';
    const settingsPath = path.join(process.cwd(), CONTENT_DIR, 'settings', 'index.md');

    console.log('[11ty] Loading site settings from:', settingsPath);

    if (!fs.existsSync(settingsPath)) {
      console.warn('[11ty] Settings file not found:', settingsPath);
      return {
        sitename: 'Local Agenda',
        brandcolor: 'oklch(0.85 0.21 129)',
        tagline: 'Your Weekly Guide to Local Events',
        description: 'Discover the best events in your city',
        footertext: '',
        copyrightname: 'Local Agenda',
        sociallinks: [],
        newsletterbutton: 'Subscribe Now',
        subscribercount: '5,000+',
        subscribercounttext: 'locals getting weekly event updates',
        newsletter: {
          mode: 'iframe',
          embedCode: ''
        }
      };
    }

    const fileContents = fs.readFileSync(settingsPath, 'utf8');
    const { data } = matter(fileContents);

    return data;
  } catch (error) {
    console.error('[11ty] Error reading site settings:', error);
    return {};
  }
};
