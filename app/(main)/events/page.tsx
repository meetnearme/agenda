import { Calendar } from 'lucide-react';
import type { Metadata } from 'next';
import { getEventsContent } from '@/lib/markdown';
import { EventsEmbed } from '@/components/EventsEmbed';

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
    <main className="bg-background min-h-screen">
      {/* Header */}
      <div className="border-border border-b px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-foreground mb-4 text-4xl font-bold text-balance uppercase md:text-6xl">
            {title}
          </h1>
          <p className="text-muted-foreground text-xl text-balance">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Embed Section */}
      <div className="px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="border-border bg-card rounded-lg border p-8">
            <div className="space-y-6">
              {/* Embed Area */}
              <div className="py-4">
                {hasRealEmbed ? (
                  // Render the actual embed code from CMS (client component handles scripts)
                  <EventsEmbed embedCode={embedCode} />
                ) : (
                  // Show placeholder when no real embed is configured
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Configure your events embed in the CMS to display live
                      events
                    </p>
                    <div className="border-border bg-muted/30 flex min-h-[500px] items-center justify-center rounded-lg border-2 border-dashed p-12">
                      <div className="text-center">
                        <Calendar className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                        <p className="text-muted-foreground font-medium">
                          Events Embed Placeholder
                        </p>
                        <p className="text-muted-foreground mt-2 text-sm">
                          Go to the CMS at /admin to add your embed code
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions - only show if enabled and no real embed yet */}
              {showInstructions && !hasRealEmbed && instructions.length > 0 && (
                <div className="border-border border-t pt-6">
                  <h3 className="text-card-foreground mb-3 text-lg font-bold">
                    {instructionsTitle}
                  </h3>
                  <ol className="text-muted-foreground list-inside list-decimal space-y-2">
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
