const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

module.exports = () => {
  try {
    // Events content is config-driven (uses CONTENT_DIR env var)
    const CONTENT_DIR = process.env.CONTENT_DIR || 'content';
    const eventsPath = path.join(process.cwd(), CONTENT_DIR, 'events', 'index.md');

    if (!fs.existsSync(eventsPath)) {
      console.warn('[11ty] Events content file not found:', eventsPath);
      return {
        title: 'Events',
        subtitle: 'Discover what\'s happening',
        embedcode: '',
        instructionstitle: 'How to Submit an Event',
        instructions: [],
        showInstructions: false
      };
    }

    const fileContents = fs.readFileSync(eventsPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      ...data,
      content
    };
  } catch (error) {
    console.error('[11ty] Error reading events content:', error);
    return {};
  }
};
