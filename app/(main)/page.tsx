import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Calendar, Mail, Users } from 'lucide-react';
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
    <main className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-6 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-balance md:text-7xl">
              YOUR WEEKLY GUIDE TO
              <br />
              <span className="text-primary">LOCAL EVENTS</span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl text-balance md:text-2xl">
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
              <p className="text-muted-foreground mt-3 text-sm">
                Join {subscriberCount} {subscriberText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-border border-t px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-border bg-card p-6">
              <Calendar className="text-primary mb-4 h-10 w-10" />
              <h3 className="text-card-foreground mb-2 text-xl font-bold">
                Curated Weekly
              </h3>
              <p className="text-muted-foreground">
                Hand-picked events delivered every Monday morning so you never
                miss out on the best happenings.
              </p>
            </Card>

            <Card className="border-border bg-card p-6">
              <Users className="text-primary mb-4 h-10 w-10" />
              <h3 className="text-card-foreground mb-2 text-xl font-bold">
                Hyper Local
              </h3>
              <p className="text-muted-foreground">
                We cover all neighborhoods and communities across the city, from
                downtown to the suburbs.
              </p>
            </Card>

            <Card className="border-border bg-card p-6">
              <Mail className="text-primary mb-4 h-10 w-10" />
              <h3 className="text-card-foreground mb-2 text-xl font-bold">
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
            <h2 className="text-foreground text-3xl font-bold md:text-4xl">
              LATEST UPDATES
            </h2>

            <Link href="/updates">
              <Button
                variant="outline"
                className="border-border text-foreground bg-transparent"
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
                  className="group border-border bg-card hover:border-primary/50 cursor-pointer overflow-hidden transition-colors"
                >
                  <div className="bg-muted relative aspect-video overflow-hidden">
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-primary mb-2 text-sm font-semibold">
                      Sample Date
                    </div>
                    <h3 className="text-card-foreground group-hover:text-primary mb-2 text-xl font-bold transition-colors">
                      Sample Update Title
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      This is a placeholder update. Add updates via the CMS.
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-border border-t px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-foreground mb-6 text-4xl font-bold text-balance md:text-5xl">
            NEVER MISS AN EVENT AGAIN
          </h2>
          <p className="text-muted-foreground mb-8 text-xl text-balance">
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
