'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import BlogCard from '../BlogCard';
import {
  BlogPostGridProps,
  VerticalTilesGridProps,
} from './BlogPostGrid.types';

const BlogPostGrid: React.FC<BlogPostGridProps> = ({
  posts,
  count = 3,
  featured = false,
  className,
  variant = 'horizontal',
  excludeSlug,
}) => {
  // Filter posts based on criteria
  const filteredPosts = posts
    .filter((post) => {
      // Exclude current post if specified
      if (excludeSlug && post.slug === excludeSlug) return false;

      // Filter by featured status if requested
      if (featured) {
        return post.frontmatter.featuredpost && post.frontmatter.featuredimage;
      }

      return true;
    })
    .slice(0, count);

  if (filteredPosts.length === 0) {
    return null;
  }

  const gridVariants = {
    horizontal: cn(
      'grid gap-6',
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      'auto-rows-auto'
    ),
    vertical: cn('grid gap-6', 'grid-cols-1', 'auto-rows-auto'),
    masonry: cn('columns-1 sm:columns-2 lg:columns-3', 'gap-6'),
  };

  return (
    <div className={cn('w-full', className)}>
      <ol className={cn(gridVariants[variant], 'list-none p-0')}>
        {filteredPosts.map((post, index) => (
          <li key={post.slug} className="list-none">
            <BlogCard
              post={post}
              variant={variant === 'vertical' ? 'vertical' : 'featured'}
              featured={featured}
              priority={index < 3}
              showDate={true}
              className="h-full"
            />
          </li>
        ))}
      </ol>
    </div>
  );
};

export const VerticalTilesGrid: React.FC<VerticalTilesGridProps> = ({
  children,
  className,
}) => {
  // Gradient backgrounds for vertical tiles (using primary color)
  const getGradientBackground = (index: number): string => {
    const gradients = [
      'bg-gradient-to-br from-transparent to-primary/30',
      'bg-gradient-to-br from-transparent to-muted/50',
      'bg-gradient-to-br from-transparent to-primary/20',
    ];
    return gradients[index % gradients.length];
  };

  const validChildren = React.Children.toArray(children).filter(
    (child) => child !== '\n' && React.isValidElement(child)
  );

  return (
    <div className={cn('w-full', className)}>
      <ol className="grid list-none auto-rows-auto grid-cols-1 gap-6 p-0">
        {validChildren.map((child, index) => {
          if (!React.isValidElement(child)) return null;

          const childProps = child.props as {
            className?: string;
            href?: string;
            children?: React.ReactNode;
          };

          return (
            <li key={index} className="list-none">
              <article className="group">
                <a
                  href={childProps.href}
                  className={cn(
                    'relative block h-56 w-full overflow-hidden rounded-lg p-6 transition-all duration-300 hover:scale-[1.02] md:h-64',
                    getGradientBackground(index),
                    'border border-border'
                  )}
                >
                  <div className="relative z-10 flex h-full flex-col justify-center text-foreground">
                    {childProps.children}
                  </div>
                </a>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default BlogPostGrid;

