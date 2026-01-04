import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Calendar, Mail, Users, Code2 } from 'lucide-react';
import Link from 'next/link';
import { getAllPosts, getSiteSettings } from '@/lib/markdown';
import { BlogPostGrid } from '@/components/blog';
import NewsletterSignup from '@/components/NewsletterSignup';

export default async function HomePage() {
  const [posts, siteSettings] = await Promise.all([
    getAllPosts(),
    getSiteSettings(),
  ]);
  const featuredPosts = posts.slice(0, 3);

  const subscriberCount = siteSettings?.subscribercount || '5,000+';
  const subscriberText =
    siteSettings?.subscribercounttext || 'locals getting weekly event updates';
  const newsletterButton = siteSettings?.newsletterbutton || 'Subscribe Now';

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-6 text-center">
            <h1 className="text-balance text-5xl font-bold tracking-tight md:text-7xl">
              YOUR WEEKLY GUIDE TO
              <br />
              <span className="text-primary">LOCAL EVENTS</span>
            </h1>
            <p className="text-balance mx-auto max-w-2xl text-xl text-muted-foreground md:text-2xl">
              Discover the best live music, food festivals, art shows, and
              community gatherings happening every week.
            </p>

            {/* Newsletter Signup */}
            <div id="newsletter-signup" className="mx-auto max-w-xl pt-8">
              <NewsletterSignup
                settings={siteSettings?.newsletter}
                buttonText={newsletterButton}
                variant="compact"
              />
              <p className="mt-3 text-sm text-muted-foreground">
                Join {subscriberCount} {subscriberText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-border bg-card p-6">
              <Calendar className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-xl font-bold text-card-foreground">
                Curated Weekly
              </h3>
              <p className="text-muted-foreground">
                Hand-picked events delivered every Monday morning so you never
                miss out on the best happenings.
              </p>
            </Card>

            <Card className="border-border bg-card p-6">
              <Users className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-xl font-bold text-card-foreground">
                Hyper Local
              </h3>
              <p className="text-muted-foreground">
                We cover all neighborhoods and communities across the city, from
                downtown to the suburbs.
              </p>
            </Card>

            <Card className="border-border bg-card p-6">
              <Mail className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-xl font-bold text-card-foreground">
                Zero Spam
              </h3>
              <p className="text-muted-foreground">
                Just one email per week with quality content. Unsubscribe
                anytime, no hard feelings.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              LATEST UPDATES
            </h2>
            <Link href="/blog">
              <Button
                variant="outline"
                className="border-border bg-transparent text-foreground"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {featuredPosts.length > 0 ? (
            <BlogPostGrid posts={featuredPosts} variant="horizontal" />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="group cursor-pointer overflow-hidden border-border bg-card transition-colors hover:border-primary/50"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-2 text-sm font-semibold text-primary">
                      Sample Date
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-card-foreground transition-colors group-hover:text-primary">
                      Sample Update Title
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This is a placeholder update. Add updates via the CMS.
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Template CTA Section */}
      <section className="border-y border-primary/20 bg-primary/5 px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="flex-1 space-y-4">
              <div className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                Open Source Template
              </div>
              <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
                CREATE YOUR OWN HYPER LOCAL EVENTS NEWSLETTER
              </h2>
              <p className="text-balance text-lg text-muted-foreground">
                This entire site is free and open source. Fork it to create your
                own community newsletter in minutes.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link href="/template">
                <Button
                  size="lg"
                  className="h-14 bg-primary px-10 font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Code2 className="mr-2 h-5 w-5" />
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-balance mb-6 text-4xl font-bold text-foreground md:text-5xl">
            NEVER MISS AN EVENT AGAIN
          </h2>
          <p className="text-balance mb-8 text-xl text-muted-foreground">
            Get the best events delivered to your inbox every Monday
          </p>

          <div className="mx-auto max-w-xl">
            <NewsletterSignup
              settings={siteSettings?.newsletter}
              buttonText="Subscribe Free"
              variant="compact"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

