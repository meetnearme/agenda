const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

module.exports = () => {
  try {
    // Home content respects CONTENT_DIR for config-driven deployments
    const CONTENT_DIR = process.env.CONTENT_DIR || 'content';
    const homePath = path.join(process.cwd(), CONTENT_DIR, 'home', 'index.md');

    console.log('[11ty] Loading home content from:', homePath);

    if (!fs.existsSync(homePath)) {
      console.warn('[11ty] Home content file not found:', homePath);
      return {
        navigation: [],
        tagline: 'Your Weekly Guide to Local Events'
      };
    }

    const fileContents = fs.readFileSync(homePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      ...data,
      content
    };
  } catch (error) {
    console.error('[11ty] Error reading home content:', error);
    return {};
  }
};
