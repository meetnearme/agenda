import { Calendar } from 'lucide-react';
import type { Metadata } from 'next';
import { getEventsContent } from '@/lib/markdown';

export const metadata: Metadata = {
  title: 'Events - Explore Local Events',
  description: 'Browse and discover events happening in your area right now.',
};

export default async function EventsPage() {
  const eventsContent = await getEventsContent();

  const title = eventsContent?.frontmatter?.title || 'Explore Local Events';
  const subtitle =
    eventsContent?.frontmatter?.subtitle ||
    'Browse and discover events happening in your area right now';
  const embedCode = eventsContent?.frontmatter?.embedcode || '';
  const instructionsTitle =
    eventsContent?.frontmatter?.instructionstitle ||
    'How to add your Meet Near Me embed';
  const instructions = eventsContent?.frontmatter?.instructions || [];
  const showInstructions = eventsContent?.frontmatter?.showInstructions ?? true;

  // Check if embed code is just the placeholder or actual content
  const hasRealEmbed =
    embedCode &&
    !embedCode.includes('placeholder-embed') &&
    !embedCode.includes('Replace this with');

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-balance mb-4 text-4xl font-bold uppercase text-foreground md:text-6xl">
            {title}
          </h1>
          <p className="text-balance text-xl text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Embed Section */}
      <div className="px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-lg border border-border bg-card p-8">
            <div className="space-y-6">
              {/* Embed Area */}
              <div className="py-4">
                {hasRealEmbed ? (
                  // Render the actual embed code from CMS
                  <div
                    className="events-embed"
                    dangerouslySetInnerHTML={{ __html: embedCode }}
                  />
                ) : (
                  // Show placeholder when no real embed is configured
                  <div className="text-center">
                    <p className="mb-4 text-muted-foreground">
                      Configure your events embed in the CMS to display live
                      events
                    </p>
                    <div className="flex min-h-[500px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-12">
                      <div className="text-center">
                        <Calendar className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                        <p className="font-medium text-muted-foreground">
                          Events Embed Placeholder
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Go to the CMS at /admin to add your embed code
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions - only show if enabled and no real embed yet */}
              {showInstructions && !hasRealEmbed && instructions.length > 0 && (
                <div className="border-t border-border pt-6">
                  <h3 className="mb-3 text-lg font-bold text-card-foreground">
                    {instructionsTitle}
                  </h3>
                  <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
                    {instructions.map((instruction: string, index: number) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
