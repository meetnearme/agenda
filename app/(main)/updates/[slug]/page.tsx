import {
  getPostBySlug,
  getAdjacentPosts,
  getPostPaths,
  getAllPosts,
  getSiteSettings,
} from '@/lib/markdown';
import MarkdownRenderer from '@/lib/markdown-renderer';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogPostGrid } from '@/components/blog';

interface UpdatePostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all update posts
export async function generateStaticParams() {
  const paths = getPostPaths();

  return paths.map((path) => ({
    slug: path,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: UpdatePostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(`/updates/${slug}`);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const { frontmatter, imageBasePath } = post;

  return {
    title: `${frontmatter.title}`,
    description: frontmatter.description || post.excerpt,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description || post.excerpt,
      type: 'article',
      publishedTime: frontmatter.date,
      ...(frontmatter.featuredimage && {
        images: [
          {
            url: `/content/updates/${imageBasePath}/${frontmatter.featuredimage}`,
            alt: frontmatter.title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description || post.excerpt,
      ...(frontmatter.featuredimage && {
        images: [
          `/content/updates/${imageBasePath}/${frontmatter.featuredimage}`,
        ],
      }),
    },
  };
}

export default async function UpdatePostPage({ params }: UpdatePostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(`/updates/${slug}`);

  if (!post) {
    notFound();
  }

  const { frontmatter, htmlContent, formattedDate, readingTime, imageBasePath } =
    post;

  const [adjacentPosts, allPosts, siteSettings] = await Promise.all([
    getAdjacentPosts(post.slug),
    getAllPosts(),
    getSiteSettings(),
  ]);
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-background">
      <article itemScope itemType="http://schema.org/Article">
        {/* Featured Image */}
        {frontmatter.featuredimage && (
          <div className="relative h-64 w-full overflow-hidden md:h-80 lg:h-96">
            <Image
              src={`/content/updates/${imageBasePath}/${frontmatter.featuredimage}`}
              alt={frontmatter.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
        )}

        {/* Article Header */}
        <header className="container mx-auto max-w-4xl px-4 py-8">
          {/* Back link */}
          <Link
            href="/updates"
            className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Updates
          </Link>

          {/* Date and reading time */}
          <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={frontmatter.date} itemProp="datePublished">
                {formattedDate}
              </time>
            </span>
            {readingTime && <span>{readingTime} min read</span>}
          </div>

          <h1
            className="mb-4 text-4xl font-bold text-foreground md:text-5xl"
            itemProp="headline"
          >
            {frontmatter.title}
          </h1>

          {frontmatter.description && (
            <p className="text-xl text-muted-foreground">
              {frontmatter.description}
            </p>
          )}
        </header>

        {/* Article Body */}
        <section
          className="container mx-auto max-w-4xl px-4 pb-12"
          itemProp="articleBody"
        >
          <div className="prose prose-lg prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-primary">
            <MarkdownRenderer
              content={htmlContent || ''}
              newsletterSettings={siteSettings?.newsletter}
            />
          </div>

          {/* Post Navigation */}
          <nav
            aria-label="Update navigation"
            className="mt-12 border-t border-border pt-8"
          >
            <div className="flex flex-wrap justify-between gap-4">
              {adjacentPosts.previous ? (
                <Link
                  href={adjacentPosts.previous.slug}
                  rel="prev"
                  className="group flex min-w-0 flex-1 items-center text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wide">
                      Previous
                    </div>
                    <div className="truncate font-medium text-foreground group-hover:text-primary">
                      {adjacentPosts.previous.frontmatter.title}
                    </div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {adjacentPosts.next && (
                <Link
                  href={adjacentPosts.next.slug}
                  rel="next"
                  className="group flex min-w-0 flex-1 items-center justify-end text-right text-muted-foreground transition-colors hover:text-primary"
                >
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wide">Next</div>
                    <div className="truncate font-medium text-foreground group-hover:text-primary">
                      {adjacentPosts.next.frontmatter.title}
                    </div>
                  </div>
                  <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                </Link>
              )}
            </div>
          </nav>
        </section>

        {/* Related Updates */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-border px-4 py-16">
            <div className="container mx-auto max-w-6xl">
              <h2 className="mb-8 text-2xl font-bold text-foreground">
                MORE UPDATES
              </h2>
              <BlogPostGrid posts={relatedPosts} variant="horizontal" />
            </div>
          </section>
        )}

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: frontmatter.title,
              datePublished: frontmatter.date,
              dateModified: frontmatter.date,
              description: frontmatter.description || post.excerpt,
              ...(frontmatter.featuredimage && {
                image: `/content/updates/${imageBasePath}/${frontmatter.featuredimage}`,
              }),
            }),
          }}
        />
      </article>
    </main>
  );
}

