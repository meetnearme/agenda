import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Github,
  Zap,
  Database,
  Edit3,
  Globe,
  Palette,
  ArrowRight,
  Check,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Template - Build Your Own Local Newsletter',
  description:
    'Everything you need to launch a hyper-local events newsletter for your community. Deploy in minutes with GitHub and Netlify.',
};

export default function TemplatePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b border-border px-4 py-20 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-6 text-center">
            <div className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-2 text-sm font-bold uppercase tracking-wide text-primary">
              Free Open Source Template
            </div>
            <h1 className="text-balance text-5xl font-bold tracking-tight md:text-7xl">
              BUILD YOUR OWN
              <br />
              <span className="text-primary">LOCAL NEWSLETTER</span>
            </h1>
            <p className="text-balance mx-auto max-w-3xl text-xl text-muted-foreground md:text-2xl">
              Everything you need to launch a hyper-local events newsletter for
              your community. Deploy in minutes with GitHub and Netlify.
            </p>
            <div className="flex flex-col justify-center gap-4 pt-8 sm:flex-row">
              <a
                href="https://github.com/yourusername/atx-agenda"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="h-14 w-full bg-primary px-10 font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto"
                >
                  <Github className="mr-2 h-5 w-5" />
                  Fork on GitHub
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a
                href="https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/atx-agenda"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 w-full border-2 border-primary bg-transparent px-10 font-semibold text-primary hover:bg-primary/10 sm:w-auto"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Deploy to Netlify
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
              POWERFUL FEATURES
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything included out of the box
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border bg-card p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-card-foreground">
                Launch in One Click
              </h3>
              <p className="text-muted-foreground">
                Create a free GitHub account and deploy your site instantly. No
                technical skills needed - just click and go live.
              </p>
            </Card>

            <Card className="border-border bg-card p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-card-foreground">
                100% Free Hosting
              </h3>
              <p className="text-muted-foreground">
                Netlify hosts your site for free forever. No monthly fees, no
                surprise charges - just free, fast, and reliable hosting.
              </p>
            </Card>

            <Card className="border-border bg-card p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-card-foreground">
                Local Events Integration
              </h3>
              <p className="text-muted-foreground">
                Built-in support for Meet Near Me platform. Show your community
                what&apos;s happening nearby with automatic event updates.
              </p>
            </Card>

            <Card className="border-border bg-card p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                <Edit3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-card-foreground">
                Easy Content Management
              </h3>
              <p className="text-muted-foreground">
                Write and publish posts with Decap CMS - a simple, free editor
                that anyone can use. No coding required to manage your content.
              </p>
            </Card>

            <Card className="border-border bg-card p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-card-foreground">
                More Secure Than WordPress
              </h3>
              <p className="text-muted-foreground">
                No database means no database attacks. Your site is protected
                from the most common security threats that plague traditional
                websites.
              </p>
            </Card>

            <Card className="border-border bg-card p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-card-foreground">
                Make It Your Own
              </h3>
              <p className="text-muted-foreground">
                Customize colors, fonts, and layout to match your
                community&apos;s style. Built with modern tools that make
                changes easy.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border bg-muted/30 px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
              HOW IT WORKS
            </h2>
            <p className="text-xl text-muted-foreground">
              Get your newsletter site live in 3 simple steps
            </p>
          </div>
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="mb-2 text-2xl font-bold text-foreground">
                  Fork the Repository
                </h3>
                <p className="text-lg text-muted-foreground">
                  Click &quot;Fork on GitHub&quot; to create your own copy of
                  the ATX Agenda template. It&apos;s completely free and open
                  source.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="mb-2 text-2xl font-bold text-foreground">
                  Deploy to Netlify
                </h3>
                <p className="text-lg text-muted-foreground">
                  Connect your GitHub repo to Netlify with one click. Netlify
                  handles hosting, SSL, and automatic deployments for free.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                3
              </div>
              <div>
                <h3 className="mb-2 text-2xl font-bold text-foreground">
                  Customize & Launch
                </h3>
                <p className="text-lg text-muted-foreground">
                  Use Decap CMS to manage content, customize the design to match
                  your community, and start growing your newsletter audience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
              BUILT WITH MODERN TOOLS
            </h2>
            <p className="text-xl text-muted-foreground">
              Production-ready tech stack
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <Card className="border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="mb-1 text-lg font-bold text-card-foreground">
                    Next.js 16
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    React framework with App Router, Server Components, and
                    best-in-class performance
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="mb-1 text-lg font-bold text-card-foreground">
                    Tailwind CSS
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Utility-first CSS framework for rapid UI development and
                    easy customization
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="mb-1 text-lg font-bold text-card-foreground">
                    Decap CMS
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Open source content management with Git-based workflow, no
                    database required
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="mb-1 text-lg font-bold text-card-foreground">
                    Netlify
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Free hosting with automatic SSL, CDN, and continuous
                    deployment from GitHub
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="mb-1 text-lg font-bold text-card-foreground">
                    TypeScript
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Type-safe development for better code quality and developer
                    experience
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="mb-1 text-lg font-bold text-card-foreground">
                    shadcn/ui
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Beautiful, accessible components built with Radix UI and
                    Tailwind CSS
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-primary/20 bg-primary/5 px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-balance mb-6 text-4xl font-bold text-foreground md:text-5xl">
            START YOUR COMMUNITY NEWSLETTER TODAY
          </h2>
          <p className="text-balance mb-8 text-xl text-muted-foreground">
            Join communities around the world using this template to keep their
            neighbors connected
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="https://github.com/yourusername/atx-agenda"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="h-14 w-full bg-primary px-10 font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto"
              >
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a
              href="https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/atx-agenda"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-full border-2 border-primary bg-transparent px-10 font-semibold text-primary hover:bg-primary/10 sm:w-auto"
              >
                <Zap className="mr-2 h-5 w-5" />
                Deploy Now
              </Button>
            </a>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Free forever. No credit card required. Takes less than 5 minutes.
          </p>
        </div>
      </section>
    </main>
  );
}
