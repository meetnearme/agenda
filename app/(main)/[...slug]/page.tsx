import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug, getAllPages } from '@/lib/markdown';
import MarkdownRenderer from '@/lib/markdown-renderer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  try {
    const allPages = await getAllPages();

    return allPages.map((page) => {
      const slug = page.slug.replace(/^\//, '');
      const segments = slug.split('/').filter(Boolean);
      return { slug: segments };
    });
  } catch (error) {
    console.error('Error generating static params for pages:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');

  const pageData = await getPageBySlug(slug);

  if (!pageData) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: pageData.frontmatter.title,
    description:
      pageData.content.slice(0, 160) || pageData.frontmatter.title,
  };
}

export default async function DynamicPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');

  const pageData = await getPageBySlug(slug);

  if (!pageData) {
    notFound();
  }

  // Determine image path for this page
  const imagePath = `/content/pages/${slug}`;

  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <header className="container mx-auto max-w-4xl px-4 py-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-foreground md:text-5xl">
          {pageData.frontmatter.title}
        </h1>
      </header>

      {/* Page Body */}
      <article
        className="container mx-auto max-w-4xl px-4 pb-16"
        itemScope
        itemType="http://schema.org/Article"
      >
        <div
          itemProp="articleBody"
          className="prose prose-lg prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-primary"
        >
          <MarkdownRenderer
            content={pageData.htmlContent || ''}
            imagePath={imagePath}
          />
        </div>
      </article>
    </main>
  );
}

