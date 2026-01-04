'use client';

import React from 'react';
import { BlogPostGrid } from '@/components/blog';
import NewsletterSignup from '@/components/NewsletterSignup';
import type { BlogPostWithMetadata } from '@/types/content.types';
import type { NewsletterSettings } from '@/lib/markdown';

// Component for vertical tiles grid specific to markdown parsing
interface VerticalTilesGridProps {
  content: string;
}

const VerticalTilesGrid: React.FC<VerticalTilesGridProps> = ({ content }) => {
  // Parse individual tiles from the content
  const tileMatches = content.match(/<a[^>]*>[\s\S]*?<\/a>/gi) || [];

  return (
    <div className="mb-8">
      <ol className="grid list-none gap-5 p-0 lg:grid-rows-3">
        {tileMatches.map((tileHtml, index) => (
          <li key={index} className="relative p-0">
            <article className="post-list-item">
              <div
                className={`featured-post-wrapper relative block h-auto min-w-full overflow-hidden rounded-lg border border-border pl-2 transition-opacity hover:opacity-70 sm:h-40 lg:h-56 ${
                  index === 0
                    ? 'bg-gradient-to-br from-transparent to-primary/30'
                    : index === 1
                      ? 'bg-gradient-to-br from-transparent to-muted/50'
                      : 'bg-gradient-to-br from-transparent to-primary/20'
                }`}
                dangerouslySetInnerHTML={{ __html: tileHtml }}
              />
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
};

// Component for post grid with server-side data fetching
interface PostGridProps {
  featured?: boolean;
  count?: number;
  slug?: string;
  posts?: BlogPostWithMetadata[];
}

const PostGrid: React.FC<PostGridProps> = ({
  featured = true,
  count = 3,
  slug,
  posts,
}) => {
  // If posts are provided, render the actual BlogPostGrid
  if (posts && posts.length > 0) {
    return (
      <div className="mb-8">
        <BlogPostGrid
          posts={posts}
          featured={featured}
          count={count}
          excludeSlug={slug}
          variant="horizontal"
        />
      </div>
    );
  }

  // Fallback placeholder when no posts are provided
  return (
    <div className="mb-8">
      <div className="rounded-lg border-2 border-dashed border-border bg-card p-8 text-center">
        <div className="mb-4 text-muted-foreground">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Blog Post Grid
        </h3>
        <p className="mb-1 text-muted-foreground">
          {featured ? 'Featured' : 'Recent'} Blog Posts ({count} posts)
        </p>
        <p className="mb-3 text-sm text-muted-foreground/70">
          No posts data provided to MarkdownRenderer
        </p>
      </div>
    </div>
  );
};

// Helper function to process images in markdown content
const processImagePaths = (content: string, imagePath: string = '') => {
  if (!imagePath) return content;

  // Replace relative image paths with absolute paths
  return content.replace(
    /<img([^>]*?)src="([^"]*?)"([^>]*?)>/gi,
    (match, beforeSrc, src, afterSrc) => {
      // Skip if already processed or is external URL
      if (src.startsWith('http') || src.startsWith('/')) {
        return match;
      }

      // Convert relative path to absolute path
      const absoluteSrc = `${imagePath}/${src}`;
      return `<img${beforeSrc}src="${absoluteSrc}"${afterSrc}>`;
    }
  );
};

// Enhanced markdown renderer with custom components
interface MarkdownRendererProps {
  content: string;
  className?: string;
  imagePath?: string;
  posts?: BlogPostWithMetadata[];
  newsletterSettings?: NewsletterSettings;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  imagePath = '',
  posts = [],
  newsletterSettings,
}) => {
  // Process the content to handle custom components
  const processedContent = React.useMemo(() => {
    const processed = processImagePaths(content, imagePath);

    // Function to split content around a tag and render components in correct position
    const renderContentWithCustomTags = (htmlContent: string) => {
      const parts: React.ReactNode[] = [];
      let currentContent = htmlContent;
      let partIndex = 0;

      // Handle vertical-tiles-grid
      const verticalTilesMatch = currentContent.match(
        /<vertical-tiles-grid>([\s\S]*?)<\/vertical-tiles-grid>/i
      );
      if (verticalTilesMatch) {
        const beforeVerticalTiles = currentContent.substring(
          0,
          verticalTilesMatch.index
        );
        const afterVerticalTiles = currentContent.substring(
          verticalTilesMatch.index! + verticalTilesMatch[0].length
        );

        // Parse the actual content between vertical-tiles-grid tags
        const innerContent = verticalTilesMatch[1];

        // Add content before vertical tiles
        if (beforeVerticalTiles.trim()) {
          parts.push(
            <div
              key={`before-vertical-${partIndex++}`}
              dangerouslySetInnerHTML={{ __html: beforeVerticalTiles }}
            />
          );
        }

        // Add vertical tiles with raw content
        parts.push(
          <VerticalTilesGrid
            key={`vertical-tiles-${partIndex++}`}
            content={innerContent}
          />
        );

        currentContent = afterVerticalTiles;
      }

      // Handle post-grid
      const postGridMatch = currentContent.match(
        /<post-grid([^>]*?)><\/post-grid>/i
      );
      if (postGridMatch) {
        const beforePostGrid = currentContent.substring(0, postGridMatch.index);
        const afterPostGrid = currentContent.substring(
          postGridMatch.index! + postGridMatch[0].length
        );

        const attributes = postGridMatch[1];
        const featuredMatch = attributes.match(/featured="([^"]*?)"/);
        const countMatch = attributes.match(/count="([^"]*?)"/);
        const slugMatch = attributes.match(/slug="([^"]*?)"/);

        const postGridProps = {
          featured: featuredMatch ? featuredMatch[1] === 'true' : true,
          count: countMatch ? parseInt(countMatch[1]) : 3,
          slug: slugMatch ? slugMatch[1] : undefined,
        };

        // Add content before post grid
        if (beforePostGrid.trim()) {
          parts.push(
            <div
              key={`before-post-${partIndex++}`}
              dangerouslySetInnerHTML={{ __html: beforePostGrid }}
            />
          );
        }

        // Add post grid
        parts.push(
          <PostGrid
            key={`post-grid-${partIndex++}`}
            {...postGridProps}
            posts={posts}
          />
        );

        currentContent = afterPostGrid;
      }

      // Handle newsletter-signup
      const newsletterMatch = currentContent.match(
        /<newsletter-signup\s*\/>/i
      );
      if (newsletterMatch) {
        const beforeNewsletter = currentContent.substring(
          0,
          newsletterMatch.index
        );
        const afterNewsletter = currentContent.substring(
          newsletterMatch.index! + newsletterMatch[0].length
        );

        // Add content before newsletter
        if (beforeNewsletter.trim()) {
          parts.push(
            <div
              key={`before-newsletter-${partIndex++}`}
              dangerouslySetInnerHTML={{ __html: beforeNewsletter }}
            />
          );
        }

        // Add newsletter signup component
        parts.push(
          <div key={`newsletter-${partIndex++}`} className="my-8">
            <NewsletterSignup
              settings={newsletterSettings}
              variant="card"
            />
          </div>
        );

        currentContent = afterNewsletter;
      }

      // Add any remaining content
      if (currentContent.trim()) {
        parts.push(
          <div
            key={`remaining-${partIndex++}`}
            dangerouslySetInnerHTML={{ __html: currentContent }}
          />
        );
      }

      return parts.length > 0 ? parts : null;
    };

    const customTagsContent = renderContentWithCustomTags(processed);

    if (customTagsContent) {
      return <div className={className}>{customTagsContent}</div>;
    }

    // Default: render as HTML
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: processed }}
      />
    );
  }, [content, className, imagePath, posts, newsletterSettings]);

  return <>{processedContent}</>;
};

export default MarkdownRenderer;

// Named exports for individual components
export { VerticalTilesGrid, PostGrid };

