import Link from 'next/link';

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterProps {
  siteName?: string;
  footerText?: string;
  socialLinks?: SocialLink[];
}

export default function Footer({
  siteName = 'Local Agenda',
  footerText,
  socialLinks,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Filter out social links with empty URLs
  const activeSocialLinks = socialLinks?.filter((link) => link.url) || [];

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <div className="text-sm text-muted-foreground">
              © {currentYear} {siteName}. All rights reserved.
            </div>
            {footerText && (
              <div className="mt-1 text-xs text-muted-foreground/70">
                {footerText}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <Link
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              href="/updates"
            >
              Updates
            </Link>
            <Link
              href="/events"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Events
            </Link>
            {activeSocialLinks.length > 0 && (
              <>
                {activeSocialLinks.map((link) => (
                  <Link
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.platform}
                  </Link>
                ))}
              </>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            Built with{' '}
            <Link
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary transition-colors hover:text-primary/80"
            >
              Next.js
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
