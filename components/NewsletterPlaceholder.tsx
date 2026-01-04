'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';

interface NewsletterPlaceholderProps {
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
}

export default function NewsletterPlaceholder({
  title = 'Subscribe to our newsletter',
  description = 'Get the latest updates delivered to your inbox',
  buttonText = 'Subscribe',
  className = '',
}: NewsletterPlaceholderProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with Beehiiv integration
    alert('Newsletter signup coming soon! This is a placeholder.');
  };

  return (
    <div className={className}>
      {title && (
        <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
      )}
      {description && (
        <p className="mb-4 text-muted-foreground">{description}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          placeholder="Enter your email address"
          required
          className="h-12 flex-1 border-border bg-input text-foreground placeholder:text-muted-foreground"
        />
        <Button
          type="submit"
          size="lg"
          className="h-12 bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {buttonText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      {/* Placeholder notice - remove when Beehiiv is integrated */}
      <p className="mt-2 text-xs text-muted-foreground/60">
        Newsletter integration placeholder - connect Beehiiv to activate
      </p>
    </div>
  );
}

