const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

module.exports = () => {
  try {
    // Home content always comes from the default content directory
    const homePath = path.join(process.cwd(), 'content', 'home', 'index.md');

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
