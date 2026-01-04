'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { BlogCardVariantProps } from './BlogCard.types';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const BlogCard: React.FC<BlogCardVariantProps> = ({
  post,
  className,
  variant = 'default',
  showDate = true,
  priority = false,
}) => {
  const { frontmatter, slug, formattedDate, excerpt, imageBasePath } = post;
  const { title, description, featuredimage } = frontmatter;

  // Build image path to match blog page implementation
  const imageSrc =
    featuredimage && imageBasePath
      ? `/content/blog/${imageBasePath}/${featuredimage}`
      : featuredimage
        ? `/content/blog/${featuredimage}`
        : null;

  const displayDescription = description || excerpt || '';
  const displayTitle = title || 'Untitled Post';

  const cardVariants = {
    default: '',
    featured: '',
    compact: '',
    vertical: '',
  };

  return (
    <article
      className={cn('group h-full', cardVariants[variant], className)}
      itemScope
      itemType="http://schema.org/Article"
    >
      <Link href={slug} className="block h-full" itemProp="url">
        <Card className="h-full cursor-pointer overflow-hidden border-border bg-card transition-colors hover:border-primary/50">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden bg-muted">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={displayTitle}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={priority}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Calendar className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {showDate && formattedDate && (
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                <Calendar className="h-4 w-4" />
                <time dateTime={frontmatter.date}>{formattedDate}</time>
              </div>
            )}

            <h3
              className="text-balance mb-2 text-xl font-bold text-card-foreground transition-colors group-hover:text-primary"
              itemProp="headline"
            >
              {displayTitle}
            </h3>

            {displayDescription && (
              <p
                className="line-clamp-2 text-sm text-muted-foreground"
                itemProp="description"
              >
                {displayDescription}
              </p>
            )}
          </div>
        </Card>
      </Link>
    </article>
  );
};

export default BlogCard;

