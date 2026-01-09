import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import type {
    BlogPost,
    Page,
    HomeContent,
    BlogPostWithMetadata,
    PageWithMetadata,
    HomeContentWithMetadata
} from '../types/content.types';

/**
 * Get the base content directory - reads env var dynamically to ensure
 * it's available after Next.js loads .env.local
 *
 * Only 'updates' and 'events' are config-driven (from CONTENT_DIR env var)
 * Other content types (home, pages, settings) always use default 'content/'
 */
function getBaseContentDirectory(configDriven: boolean = false): string {
    if (configDriven) {
        const contentDir = process.env.CONTENT_DIR || 'content';
        console.log('[markdown.ts] Config-driven CONTENT_DIR:', contentDir);
        return path.join(process.cwd(), contentDir);
    }
    return path.join(process.cwd(), 'content');
}

/**
 * Get the content directory path for a specific content type
 * - 'updates': config-driven (uses CONTENT_DIR env var)
 * - 'pages', 'home': always from default content/
 */
function getContentDirectory(
    contentType: 'updates' | 'pages' | 'home'
): string {
    // Only updates are config-driven; pages and home use default content/
    const isConfigDriven = contentType === 'updates';
    return path.join(getBaseContentDirectory(isConfigDriven), contentType);
}

/**
 * Recursively find all markdown files in a directory
 */
function findMarkdownFiles(dir: string): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) {
        return files;
    }

    function traverse(currentPath: string) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);

            if (entry.isDirectory()) {
                traverse(fullPath);
            } else if (
                entry.name === 'index.md' ||
                entry.name.endsWith('.md')
            ) {
                files.push(fullPath);
            }
        }
    }

    traverse(dir);
    return files;
}

/**
 * Generate a slug from a file path
 * Creates flat slugs compatible with /updates/[slug] routing
 */
function generateSlugFromPath(
    filePath: string,
    contentType: 'updates' | 'pages' | 'home'
): string {
    const relativePath = path.relative(
        getContentDirectory(contentType),
        filePath
    );
    const dirPath = path.dirname(relativePath);

    let slug: string;

    if (contentType === 'updates') {
        // For update posts, use only the final directory name to create flat slugs
        // This converts paths like "2021/12/blessing-for-a-new-year" to just "blessing-for-a-new-year"
        const pathParts = dirPath
            .split(path.sep)
            .filter((part) => part !== '.' && part !== '');
        slug = pathParts.length > 0 ? pathParts[pathParts.length - 1] : '';
        slug = `/updates/${slug}`;
    } else if (contentType === 'pages') {
        // For pages, use the directory name as the slug
        slug = dirPath === '.' ? '' : dirPath;
        // Replace backslashes with forward slashes (for Windows compatibility)
        slug = slug.replace(/\\/g, '/');
        // Pages don't include '/pages' in their slug (matches Gatsby behavior)
        slug = `/${slug}`;
    } else if (contentType === 'home') {
        slug = '/';
    } else {
        slug = '';
    }

    // Clean up any double slashes
    slug = slug.replace(/\/+/g, '/');

    return slug;
}

/**
 * Process markdown content to HTML
 */
async function markdownToHtml(markdown: string): Promise<string> {
    // Preserve custom HTML tags by temporarily replacing them with placeholders
    const customTagsMap = new Map<string, string>();
    let tagCounter = 0;

    // Extract and preserve custom tags (without audio-player)
    const processedMarkdown = markdown.replace(
        /<(vertical-tiles-grid|post-grid|featured-products|calendly-button)([^>]*)>([\s\S]*?)<\/\1>/gi,
        (match) => {
            const placeholder = `CUSTOM_TAG_PLACEHOLDER_${tagCounter++}`;
            customTagsMap.set(placeholder, match);
            return placeholder;
        }
    );

    // Process markdown to HTML
    const result = await remark().use(html).process(processedMarkdown);
    let htmlContent = result.toString();

    // Process images with CSS attributes (e.g., ![](image.jpg '#css-here'))
    htmlContent = htmlContent.replace(
        /<img([^>]*?)>/gi,
        (match, attributes) => {
            // Extract src and title attributes
            const srcMatch = attributes.match(/src="([^"]*?)"/);
            const titleMatch = attributes.match(/title="([^"]*?)"/);

            if (!srcMatch || !titleMatch) return match;

            const src = srcMatch[1];
            const title = titleMatch[1];

            // Check if the title contains CSS attributes with # prefix
            const cssMatch = title.match(/^#(.+)$/);
            if (cssMatch) {
                const cssStyles = cssMatch[1];

                // Use wrapper div approach for cleaner styling
                const wrapperClasses = [];

                if (
                    cssStyles.includes('position=relative') ||
                    cssStyles.includes('position:relative')
                ) {
                    wrapperClasses.push('relative');
                }
                if (
                    cssStyles.includes('float=right') ||
                    cssStyles.includes('float:right')
                ) {
                    wrapperClasses.push('float-right');
                }
                if (
                    cssStyles.includes('width=50%') ||
                    cssStyles.includes('width:50%')
                ) {
                    wrapperClasses.push('w-1/2');
                }
                if (
                    cssStyles.includes('margin=0 0 20px 20px') ||
                    cssStyles.includes('margin:0 0 20px 20px')
                ) {
                    wrapperClasses.push('mb-5 ml-5');
                }

                // Wrap image in a div with the styling
                return `<div class="${wrapperClasses.join(' ')}"><img src="${src}" alt="" class="w-full h-auto"></div>`;
            }
            return match;
        }
    );

    // Add clear div before vertical tiles since remark strips the clear br tag
    htmlContent = htmlContent.replace(
        /(<p>CUSTOM_TAG_PLACEHOLDER_0<\/p>)/gi,
        '<div class="clear-both"></div>$1'
    );

    // Remove empty p tags that cause layout issues
    htmlContent = htmlContent.replace(/<p>\s*<\/p>/gi, '');

    // Restore custom tags
    for (const [placeholder, originalTag] of customTagsMap) {
        htmlContent = htmlContent.replace(placeholder, originalTag);
    }

    return htmlContent;
}

/**
 * Get a single update post by slug
 */
export async function getPostBySlug(
    slug: string
): Promise<BlogPostWithMetadata | null> {
    try {
        const updatesDir = getContentDirectory('updates');
        const normalizedSlug = slug
            .replace(/^\/updates\//, '')
            .replace(/\/$/, '');
        const targetSlug = `/updates/${normalizedSlug}`;

        // Find all markdown files and search for the one with matching slug
        const markdownFiles = findMarkdownFiles(updatesDir);

        let matchingFilePath: string | null = null;
        for (const filePath of markdownFiles) {
            const generatedSlug = generateSlugFromPath(filePath, 'updates');
            if (generatedSlug === targetSlug) {
                matchingFilePath = filePath;
                break;
            }
        }

        if (!matchingFilePath) {
            return null;
        }

        const fileContents = fs.readFileSync(matchingFilePath, 'utf8');
        const { data, content, excerpt } = matter(fileContents, {
            excerpt: true
        });

        const frontmatter = data as BlogPost;
        const htmlContent = await markdownToHtml(content);

        // Calculate reading time (average 200 words per minute)
        const words = content.split(/\s+/).length;
        const readingTime = Math.ceil(words / 200);

        // Format date
        const date = new Date(frontmatter.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Get the actual directory path for images
        const relativePath = path.relative(updatesDir, matchingFilePath);
        const imageBasePath = path.dirname(relativePath);

        return {
            frontmatter,
            content,
            htmlContent,
            excerpt: excerpt || frontmatter.description || '',
            slug: targetSlug,
            readingTime,
            formattedDate,
            imageBasePath
        };
    } catch (error) {
        console.error(`Error reading post with slug ${slug}:`, error);
        return null;
    }
}

/**
 * Get all update posts sorted by date (newest first)
 */
export async function getAllPosts(): Promise<BlogPostWithMetadata[]> {
    const updatesDir = getContentDirectory('updates');
    const markdownFiles = findMarkdownFiles(updatesDir);

    const posts = await Promise.all(
        markdownFiles.map(async (filePath) => {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data, content, excerpt } = matter(fileContents, {
                excerpt: true
            });

            const frontmatter = data as BlogPost;
            const slug = generateSlugFromPath(filePath, 'updates');
            const htmlContent = await markdownToHtml(content);

            // Calculate reading time
            const words = content.split(/\s+/).length;
            const readingTime = Math.ceil(words / 200);

            // Format date
            const date = new Date(frontmatter.date);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Get the actual directory path for images
            const imageBasePath = path.dirname(
                path.relative(updatesDir, filePath)
            );

            return {
                frontmatter,
                content,
                htmlContent,
                excerpt: excerpt || frontmatter.description || '',
                slug,
                readingTime,
                formattedDate,
                imageBasePath
            };
        })
    );

    // Sort posts by date (newest first)
    return posts.sort((a, b) => {
        const dateA = new Date(a.frontmatter.date).getTime();
        const dateB = new Date(b.frontmatter.date).getTime();
        return dateB - dateA;
    });
}

/**
 * Get all update post paths for static generation
 */
export function getPostPaths(): string[] {
    const updatesDir = getContentDirectory('updates');
    const markdownFiles = findMarkdownFiles(updatesDir);

    return markdownFiles.map((filePath) => {
        const slug = generateSlugFromPath(filePath, 'updates');
        // Remove leading /updates/ for the path segments
        return slug.replace(/^\/updates\//, '');
    });
}

/**
 * Get featured update posts
 */
export async function getFeaturedPosts(
    limit: number = 3
): Promise<BlogPostWithMetadata[]> {
    const allPosts = await getAllPosts();
    return allPosts
        .filter((post) => post.frontmatter.featuredpost === true)
        .slice(0, limit);
}

/**
 * Get a page by slug
 */
export async function getPageBySlug(
    slug: string
): Promise<PageWithMetadata | null> {
    try {
        const pagesDir = getContentDirectory('pages');
        const normalizedSlug = slug.replace(/^\//, '').replace(/\/$/, '');

        const possiblePaths = [
            path.join(pagesDir, normalizedSlug, 'index.md'),
            path.join(pagesDir, `${normalizedSlug}.md`)
        ];

        let filePath: string | null = null;
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                filePath = p;
                break;
            }
        }

        if (!filePath) {
            return null;
        }

        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        const frontmatter = data as Page;
        const htmlContent = await markdownToHtml(content);

        return {
            frontmatter,
            content,
            htmlContent,
            slug: `/${normalizedSlug}`
        };
    } catch (error) {
        console.error(`Error reading page with slug ${slug}:`, error);
        return null;
    }
}

/**
 * Get all pages
 */
export async function getAllPages(): Promise<PageWithMetadata[]> {
    const pagesDir = getContentDirectory('pages');
    const markdownFiles = findMarkdownFiles(pagesDir);

    const pages = await Promise.all(
        markdownFiles.map(async (filePath) => {
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data, content } = matter(fileContents);

            const frontmatter = data as Page;
            const slug = generateSlugFromPath(filePath, 'pages');
            const htmlContent = await markdownToHtml(content);

            return {
                frontmatter,
                content,
                htmlContent,
                slug
            };
        })
    );

    return pages;
}

/**
 * Get page paths for static generation
 */
export function getPagePaths(): string[] {
    const pagesDir = getContentDirectory('pages');
    const markdownFiles = findMarkdownFiles(pagesDir);

    return markdownFiles.map((filePath) => {
        const slug = generateSlugFromPath(filePath, 'pages');
        // Remove leading slash for the path segments
        return slug.replace(/^\//, '');
    });
}

/**
 * Get home page content
 */
export async function getHomeContent(): Promise<HomeContentWithMetadata | null> {
    try {
        const homeDir = getContentDirectory('home');
        const filePath = path.join(homeDir, 'index.md');

        if (!fs.existsSync(filePath)) {
            return null;
        }

        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        const frontmatter = data as HomeContent;
        const htmlContent = await markdownToHtml(content);

        return {
            frontmatter,
            content,
            htmlContent
        };
    } catch (error) {
        console.error('Error reading home content:', error);
        return null;
    }
}

/**
 * Events page content type
 */
export interface EventsContent {
    templatekey: string;
    title: string;
    subtitle: string;
    embedcode: string;
    instructionstitle: string;
    instructions: string[];
    showInstructions: boolean;
}

export interface EventsContentWithMetadata {
    frontmatter: EventsContent;
    content: string;
    htmlContent: string;
}

/**
 * Get events page content
 */
export async function getEventsContent(): Promise<EventsContentWithMetadata | null> {
    try {
        // Events are config-driven (uses CONTENT_DIR env var)
        const eventsDir = path.join(getBaseContentDirectory(true), 'events');
        const filePath = path.join(eventsDir, 'index.md');

        if (!fs.existsSync(filePath)) {
            return null;
        }

        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        const frontmatter = data as EventsContent;
        const htmlContent = await markdownToHtml(content);

        return {
            frontmatter,
            content,
            htmlContent
        };
    } catch (error) {
        console.error('Error reading events content:', error);
        return null;
    }
}

/**
 * Newsletter integration settings
 */
export interface NewsletterSettings {
    mode: 'iframe' | 'native';
    embedCode?: string;
    publicationId?: string;
    apiKey?: string;
    subscribeUrl?: string;
}

/**
 * Site settings content type
 */
export interface HeroImages {
    left?: string;
    right?: string;
    opacity?: number;
}

export interface SiteSettings {
    sitename: string;
    brandcolor: string;
    heroimages?: HeroImages;
    herotext?: string;
    tagline: string;
    description: string;
    footertext: string;
    copyrightname: string;
    sociallinks: { platform: string; url: string }[];
    newsletterbutton: string;
    subscribercount: string;
    subscribercounttext: string;
    newsletter?: NewsletterSettings;
}

/**
 * Get site settings
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
    try {
        // Settings always come from the default content directory, not config-specific
        const settingsDir = path.join(process.cwd(), 'content', 'settings');
        const filePath = path.join(settingsDir, 'index.md');

        if (!fs.existsSync(filePath)) {
            return null;
        }

        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);

        return data as SiteSettings;
    } catch (error) {
        console.error('Error reading site settings:', error);
        return null;
    }
}

/**
 * Get adjacent posts for navigation
 */
export async function getAdjacentPosts(currentSlug: string): Promise<{
    previous: BlogPostWithMetadata | null;
    next: BlogPostWithMetadata | null;
}> {
    const allPosts = await getAllPosts();
    const currentIndex = allPosts.findIndex(
        (post) => post.slug === currentSlug
    );

    if (currentIndex === -1) {
        return { previous: null, next: null };
    }

    return {
        previous: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
        next:
            currentIndex < allPosts.length - 1
                ? allPosts[currentIndex + 1]
                : null
    };
}

/**
 * Search posts by query
 */
export async function searchPosts(
    query: string
): Promise<BlogPostWithMetadata[]> {
    const allPosts = await getAllPosts();
    const lowercaseQuery = query.toLowerCase();

    return allPosts.filter((post) => {
        const searchableContent = [
            post.frontmatter.title,
            post.frontmatter.description || '',
            post.content
        ]
            .join(' ')
            .toLowerCase();

        return searchableContent.includes(lowercaseQuery);
    });
}
