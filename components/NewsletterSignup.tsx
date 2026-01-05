'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import type { NewsletterSettings } from '@/lib/markdown';

interface NewsletterSignupProps {
  settings?: NewsletterSettings;
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'card';
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Check if embed code contains valid Beehiiv embed
 */
function hasValidEmbedCode(embedCode: string): boolean {
  if (!embedCode) return false;
  const trimmed = embedCode.trim();
  // Check for iframe or script tags from Beehiiv
  return (
    trimmed.includes('beehiiv') ||
    trimmed.includes('<iframe') ||
    trimmed.includes('<script')
  );
}

/**
 * NewsletterSignup Component
 *
 * A dual-mode newsletter signup component that supports:
 * - iframe mode: Embeds Beehiiv's hosted form (works on all tiers)
 * - native mode: Custom styled form using Beehiiv API (requires API access)
 */
export default function NewsletterSignup({
  settings,
  title,
  description,
  buttonText = 'Subscribe',
  className = '',
  variant = 'default',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const embedContainerRef = useRef<HTMLDivElement>(null);

  const mode = settings?.mode || 'iframe';
  const embedCode = settings?.embedCode;
  const publicationId = settings?.publicationId;
  const apiKey = settings?.apiKey;

  // Check if we have the required configuration
  const isConfigured =
    mode === 'iframe' ? hasValidEmbedCode(embedCode || '') : !!(publicationId && apiKey);

  // Effect to inject and execute the Beehiiv embed code (including script)
  useEffect(() => {
    if (mode !== 'iframe' || !embedCode || !embedContainerRef.current) return;

    const container = embedContainerRef.current;

    // Clear previous content
    container.innerHTML = '';

    // Parse the embed code and inject it properly
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = embedCode;

    // Extract and execute scripts separately (scripts inserted via innerHTML don't execute)
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      if (script.src) {
        newScript.src = script.src;
        newScript.async = true;
      } else {
        newScript.textContent = script.textContent;
      }
      // Remove original script from tempDiv
      script.remove();
    });

    // Append non-script content first
    container.innerHTML = tempDiv.innerHTML;

    // Then append and execute scripts
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      if (script.src) {
        newScript.src = script.src;
        newScript.async = true;
      } else {
        newScript.textContent = script.textContent;
      }
      container.appendChild(newScript);
    });

    // Cleanup on unmount
    return () => {
      container.innerHTML = '';
    };
  }, [mode, embedCode]);

  // Handle native form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'iframe' || !email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          publicationId,
          apiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'An error occurred'
      );
    }
  };

  // Render placeholder if not configured
  if (!isConfigured) {
    return (
      <div
        className={`rounded-lg border-2 border-dashed border-border bg-card/50 p-6 text-center ${className}`}
      >
        <div className="mb-3 text-muted-foreground">
          <AlertCircle className="mx-auto h-8 w-8" />
        </div>
        <h3 className="mb-2 font-semibold text-foreground">
          Newsletter Not Configured
        </h3>
        <p className="text-sm text-muted-foreground">
          {mode === 'iframe'
            ? 'Add your Beehiiv Embed Code in Site Settings to enable newsletter signup.'
            : 'Add your Beehiiv Publication ID and API Key in Site Settings to enable newsletter signup.'}
        </p>
      </div>
    );
  }

  // Render iframe mode - uses full embed code with script
  if (mode === 'iframe' && hasValidEmbedCode(embedCode || '')) {
    return (
      <div className={`newsletter-signup-iframe ${className}`}>
        {title && (
          <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
        )}
        {description && (
          <p className="mb-4 text-muted-foreground">{description}</p>
        )}
        <div
          ref={embedContainerRef}
          className="beehiiv-embed-container overflow-hidden rounded-lg"
          style={{ minHeight: '320px' }}
        />
      </div>
    );
  }

  // Render native form mode
  const variantStyles = {
    default: '',
    compact: 'max-w-md',
    card: 'rounded-xl border border-border bg-card p-6',
  };

  return (
    <div className={`newsletter-signup-native ${variantStyles[variant]} ${className}`}>
      {title && (
        <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
      )}
      {description && (
        <p className="mb-4 text-muted-foreground">{description}</p>
      )}

      {status === 'success' ? (
        <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-4 text-primary">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">You&apos;re subscribed!</p>
            <p className="text-sm opacity-80">
              Check your inbox for a welcome email.
            </p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
            className="h-12 flex-1 border-border bg-input text-foreground placeholder:text-muted-foreground disabled:opacity-50"
          />
          <Button
            type="submit"
            size="lg"
            disabled={status === 'loading'}
            className="h-12 bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                {buttonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      )}

      {status === 'error' && errorMessage && (
        <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

