import { getAllPosts } from '@/lib/markdown';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Updates - Weekly Event Guides',
  description:
    'Curated lists of the best events happening around your city, published every Monday.',
};

export default async function UpdatesPage() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            WEEKLY EVENT GUIDES
          </h1>
          <p className="text-balance text-xl text-muted-foreground">
            Curated lists of the best events happening around the city,
            published every Monday
          </p>
        </div>

        {/* Blog Grid */}
        {posts.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              No updates found. Add updates via the CMS.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const hasImage = post.frontmatter.featuredimage;

              return (
                <Link key={post.slug} href={post.slug}>
                  <Card className="group h-full cursor-pointer overflow-hidden border-border bg-card transition-colors hover:border-primary/50">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {hasImage ? (
                        <Image
                          src={`/content/updates/${post.imageBasePath}/${post.frontmatter.featuredimage}`}
                          alt={post.frontmatter.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Calendar className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                        <Calendar className="h-4 w-4" />
                        {post.formattedDate}
                      </div>
                      <h3 className="text-balance mb-3 text-xl font-bold text-card-foreground transition-colors group-hover:text-primary">
                        {post.frontmatter.title}
                      </h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        {post.frontmatter.description || post.excerpt}
                      </p>
                      <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold text-primary hover:bg-primary/10 hover:text-primary"
                      >
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

