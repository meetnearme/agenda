import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { getSiteSettings } from '@/lib/markdown';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const siteName = settings?.sitename || 'Local Agenda';
  const tagline = settings?.tagline || 'Your Weekly Events Newsletter';
  const description = settings?.description ||
    'Discover the best local events every week. Subscribe for curated weekly event guides delivered to your inbox.';

  return {
    title: `${siteName} | ${tagline}`,
    description,
    openGraph: {
      title: `${siteName} | ${tagline}`,
      description,
      siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteName} | ${tagline}`,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

