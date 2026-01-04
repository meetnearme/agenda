'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { NewsletterSettings } from '@/lib/markdown';

interface NavItem {
  title: string;
  slug: string;
  subnav?: {
    title: string;
    slug: string;
    description?: string;
  }[];
}

interface HeaderProps {
  siteTitle: string;
  siteDescription?: string;
  nav: NavItem[];
  newsletterSettings?: NewsletterSettings;
}

export default function Header({ siteTitle, nav, newsletterSettings }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get the subscribe URL from settings, or fallback to scrolling to form
  const subscribeUrl = newsletterSettings?.subscribeUrl;

  const handleSubscribeClick = () => {
    if (subscribeUrl) {
      window.open(subscribeUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Scroll to newsletter section on the page
      document.getElementById('newsletter-signup')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {siteTitle}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((item) => (
              <Link
                key={item.slug}
                href={item.slug}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Subscribe Button (Desktop) */}
          <div className="hidden md:block">
            <Button
              size="sm"
              className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
              onClick={handleSubscribeClick}
            >
              Subscribe
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="border-t border-border pb-4 pt-4 md:hidden">
            <div className="flex flex-col gap-4">
              {nav.map((item) => (
                <Link
                  key={item.slug}
                  href={item.slug}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              <Button
                size="sm"
                className="mt-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSubscribeClick();
                }}
              >
                Subscribe
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

