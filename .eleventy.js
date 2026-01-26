const markdownIt = require('markdown-it');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

module.exports = function(eleventyConfig) {
  // Environment variables
  const CONTENT_DIR = process.env.CONTENT_DIR || 'content';
  const SITE_CONFIG = process.env.SITE_CONFIG;

  console.log('[11ty] CONTENT_DIR:', CONTENT_DIR);
  console.log('[11ty] SITE_CONFIG:', SITE_CONFIG);

  // Pass-through copies
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });
  eleventyConfig.addPassthroughCopy("public/admin");
  eleventyConfig.addPassthroughCopy({ "content": "/content" });
  eleventyConfig.addPassthroughCopy({ [CONTENT_DIR]: `/${CONTENT_DIR}` });

  // Watch targets
  eleventyConfig.addWatchTarget("./src/css/");
  eleventyConfig.addWatchTarget("./content/**/*.md");
  eleventyConfig.addWatchTarget(`./${CONTENT_DIR}/**/*.md`);

  // Custom markdown-it instance with plugin to preserve custom HTML tags
  const md = markdownIt({
    html: true,
    breaks: false,
    linkify: true
  });

  // Custom plugin to preserve custom tags
  md.core.ruler.before('normalize', 'preserve_custom_tags', (state) => {
    const customTagsMap = new Map();
    let tagCounter = 0;

    // Preserve custom tags by replacing with placeholders
    state.src = state.src.replace(
      /<(vertical-tiles-grid|post-grid|newsletter-signup|featured-products|calendly-button)([^>]*)>([\s\S]*?)<\/\1>|<(vertical-tiles-grid|post-grid|newsletter-signup|featured-products|calendly-button)([^>]*?)\/>/gi,
      (match) => {
        const placeholder = `CUSTOM_TAG_PLACEHOLDER_${tagCounter++}`;
        customTagsMap.set(placeholder, match);
        state.env.customTagsMap = state.env.customTagsMap || new Map();
        state.env.customTagsMap.set(placeholder, match);
        return placeholder;
      }
    );
  });

  // Restore custom tags after markdown processing
  md.core.ruler.after('block', 'restore_custom_tags', (state) => {
    if (!state.env.customTagsMap) return;

    for (const [placeholder, originalTag] of state.env.customTagsMap) {
      state.src = state.src.replace(placeholder, originalTag);
    }
  });

  eleventyConfig.setLibrary('md', md);

  // Custom filter to render markdown with custom tags preserved
  eleventyConfig.addFilter('renderMarkdown', (content) => {
    if (!content) return '';

    const env = {};
    const rendered = md.render(content, env);

    // Restore any custom tags that were preserved
    let finalHtml = rendered;
    if (env.customTagsMap) {
      for (const [placeholder, originalTag] of env.customTagsMap) {
        finalHtml = finalHtml.replace(placeholder, originalTag);
      }
    }

    // Process images with CSS attributes (e.g., ![](image.jpg '#css-here'))
    finalHtml = finalHtml.replace(
      /<img([^>]*?)>/gi,
      (match, attributes) => {
        const srcMatch = attributes.match(/src="([^"]*?)"/);
        const titleMatch = attributes.match(/title="([^"]*?)"/);

        if (!srcMatch || !titleMatch) return match;

        const src = srcMatch[1];
        const title = titleMatch[1];

        // Check if the title contains CSS attributes with # prefix
        const cssMatch = title.match(/^#(.+)$/);
        if (cssMatch) {
          const cssStyles = cssMatch[1];
          const wrapperClasses = [];

          if (cssStyles.includes('position=relative') || cssStyles.includes('position:relative')) {
            wrapperClasses.push('relative');
          }
          if (cssStyles.includes('float=right') || cssStyles.includes('float:right')) {
            wrapperClasses.push('float-right');
          }
          if (cssStyles.includes('width=50%') || cssStyles.includes('width:50%')) {
            wrapperClasses.push('w-1/2');
          }
          if (cssStyles.includes('margin=0 0 20px 20px') || cssStyles.includes('margin:0 0 20px 20px')) {
            wrapperClasses.push('mb-5 ml-5');
          }

          return `<div class="${wrapperClasses.join(' ')}"><img src="${src}" alt="" class="w-full h-auto"></div>`;
        }
        return match;
      }
    );

    // Add clear div before vertical tiles
    finalHtml = finalHtml.replace(
      /(<p>)?<vertical-tiles-grid>/gi,
      '<div class="clear-both"></div><vertical-tiles-grid>'
    );

    // Remove empty p tags
    finalHtml = finalHtml.replace(/<p>\s*<\/p>/gi, '');

    return finalHtml;
  });

  // Date formatting filter
  eleventyConfig.addFilter('formatDate', (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Reading time filter
  eleventyConfig.addFilter('readingTime', (content) => {
    if (!content) return 0;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
  });

  // Slug generation filter
  eleventyConfig.addFilter('slug', (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  });

  // Current year filter for copyright
  eleventyConfig.addShortcode('now', (format) => {
    const now = new Date();
    if (format === 'year') {
      return now.getFullYear();
    }
    return now.toISOString();
  });

  // Collections

  // Posts collection (from config-driven directory)
  eleventyConfig.addCollection('posts', (collectionApi) => {
    const updatesDir = path.join(process.cwd(), CONTENT_DIR, 'updates');

    if (!fs.existsSync(updatesDir)) {
      console.warn('[11ty] Updates directory not found:', updatesDir);
      return [];
    }

    const posts = [];

    function findMarkdownFiles(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          findMarkdownFiles(fullPath);
        } else if (entry.name === 'index.md' || entry.name.endsWith('.md')) {
          try {
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content, excerpt } = matter(fileContents, { excerpt: true });

            // Generate slug from path
            const relativePath = path.relative(updatesDir, fullPath);
            const dirPath = path.dirname(relativePath);
            const pathParts = dirPath.split(path.sep).filter(p => p !== '.' && p !== '');
            const slug = pathParts.length > 0 ? pathParts[pathParts.length - 1] : '';

            // Calculate reading time
            const words = content.split(/\s+/).length;
            const readingTime = Math.ceil(words / 200);

            // Get image base path
            const imageBasePath = path.dirname(relativePath);

            posts.push({
              data: data,
              content: content,
              excerpt: excerpt || data.description || '',
              slug: slug,
              url: `/updates/${slug}/`,
              readingTime: readingTime,
              imageBasePath: imageBasePath,
              filePath: fullPath
            });
          } catch (error) {
            console.error(`Error processing ${fullPath}:`, error);
          }
        }
      }
    }

    findMarkdownFiles(updatesDir);

    // Sort by date (newest first)
    return posts.sort((a, b) => {
      const dateA = new Date(a.data.date).getTime();
      const dateB = new Date(b.data.date).getTime();
      return dateB - dateA;
    });
  });

  // Featured posts collection
  eleventyConfig.addCollection('featuredPosts', (collectionApi) => {
    return collectionApi.getFilteredByTag('posts')
      .filter(post => post.data.featuredpost === true)
      .slice(0, 3);
  });

  // Pages collection (from default content directory)
  eleventyConfig.addCollection('pages', (collectionApi) => {
    const pagesDir = path.join(process.cwd(), 'content', 'pages');

    if (!fs.existsSync(pagesDir)) {
      console.warn('[11ty] Pages directory not found:', pagesDir);
      return [];
    }

    const pages = [];

    function findMarkdownFiles(dir, basePath = '') {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(basePath, entry.name);

        if (entry.isDirectory()) {
          findMarkdownFiles(fullPath, relativePath);
        } else if (entry.name === 'index.md' || entry.name.endsWith('.md')) {
          try {
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            // Generate slug from path
            const dirPath = path.dirname(relativePath);
            const slug = dirPath === '.' ? '' : dirPath.replace(/\\/g, '/');

            pages.push({
              data: data,
              content: content,
              slug: slug,
              url: slug ? `/${slug}/` : '/',
              filePath: fullPath
            });
          } catch (error) {
            console.error(`Error processing ${fullPath}:`, error);
          }
        }
      }
    }

    findMarkdownFiles(pagesDir);
    return pages;
  });

  // Shortcodes

  // Helper function for date formatting (used in shortcodes)
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Post Grid Shortcode
  eleventyConfig.addShortcode('postGrid', function(featured = true, count = 3, excludeSlug = '') {
    const posts = this.ctx.collections.posts || [];

    let filteredPosts = posts;
    if (featured) {
      filteredPosts = posts.filter(post => post.data.featuredpost === true);
    }
    if (excludeSlug) {
      filteredPosts = filteredPosts.filter(post => post.slug !== excludeSlug);
    }

    const selectedPosts = filteredPosts.slice(0, count);

    if (selectedPosts.length === 0) {
      return '<div class="mb-8"><div class="rounded-lg border-2 border-dashed border-border bg-card p-8 text-center"><p class="text-muted-foreground">No posts available</p></div></div>';
    }

    let html = '<div class="mb-8"><div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">';

    selectedPosts.forEach(post => {
      const featuredImage = post.data.featuredimage
        ? `/${CONTENT_DIR}/updates/${post.imageBasePath}/${post.data.featuredimage}`
        : '';

      html += `
        <a href="${post.url}" class="group block">
          <div class="card border-border bg-card hover:border-primary/50 overflow-hidden transition-colors rounded-lg border">
            ${featuredImage ? `
              <div class="relative aspect-video overflow-hidden">
                <img src="${featuredImage}" alt="${post.data.title}" class="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </div>
            ` : `
              <div class="bg-muted relative aspect-video flex items-center justify-center">
                <span class="text-muted-foreground">No image</span>
              </div>
            `}
            <div class="p-6">
              <div class="text-primary mb-2 text-sm font-semibold">${formatDate(post.data.date)}</div>
              <h3 class="text-card-foreground group-hover:text-primary mb-2 text-xl font-bold transition-colors">${post.data.title}</h3>
              <p class="text-muted-foreground text-sm">${post.data.description || post.excerpt}</p>
            </div>
          </div>
        </a>
      `;
    });

    html += '</div></div>';
    return html;
  });

  // Vertical Tiles Grid Shortcode (paired)
  eleventyConfig.addPairedShortcode('verticalTilesGrid', function(content) {
    // Extract anchor tags from content
    const tileMatches = content.match(/<a[^>]*>[\s\S]*?<\/a>/gi) || [];

    let html = '<div class="mb-8"><ol class="grid list-none gap-5 p-0 lg:grid-rows-3">';

    tileMatches.forEach((tileHtml, index) => {
      const gradientClass = index === 0
        ? 'bg-gradient-to-br from-transparent to-primary/30'
        : index === 1
          ? 'bg-gradient-to-br from-transparent to-muted/50'
          : 'bg-gradient-to-br from-transparent to-primary/20';

      html += `
        <li class="relative p-0">
          <article class="post-list-item">
            <div class="featured-post-wrapper relative block h-auto min-w-full overflow-hidden rounded-lg border border-border pl-2 transition-opacity hover:opacity-70 sm:h-40 lg:h-56 ${gradientClass}">
              ${tileHtml}
            </div>
          </article>
        </li>
      `;
    });

    html += '</ol></div>';
    return html;
  });

  // Newsletter Signup Shortcode
  eleventyConfig.addShortcode('newsletterSignup', function(variant = 'card') {
    const siteSettings = this.ctx.siteSettings || {};
    const newsletter = siteSettings.newsletter || {};

    const mode = newsletter.mode || 'iframe';
    const embedCode = newsletter.embedCode || '';
    const hasValidEmbed = embedCode.includes('beehiiv') || embedCode.includes('<iframe') || embedCode.includes('<script');

    if (mode === 'iframe' && hasValidEmbed) {
      return `
        <div class="newsletter-signup-iframe my-8">
          <div class="beehiiv-embed-container overflow-hidden rounded-lg" style="min-height: 320px">
            ${embedCode}
          </div>
        </div>
      `;
    }

    // Native form mode (requires client-side JS)
    return `
      <div class="newsletter-signup-native my-8 ${variant === 'card' ? 'rounded-xl border border-border bg-card p-6' : ''}">
        <form class="newsletter-form flex flex-col gap-3 sm:flex-row" data-publication-id="${newsletter.publicationId || ''}" data-api-key="${newsletter.apiKey || ''}">
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            required
            class="h-12 flex-1 rounded-md border border-border bg-input px-4 text-foreground placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            class="h-12 rounded-md bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Subscribe
          </button>
        </form>
        <div class="newsletter-message mt-3 hidden"></div>
      </div>
    `;
  });

  // Global data
  eleventyConfig.addGlobalData('env', {
    CONTENT_DIR,
    SITE_CONFIG
  });

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data',
      layouts: '_includes/layouts'
    },
    templateFormats: ['md', 'njk', 'html', 'liquid'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk'
  };
};
