import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BrandStyles } from '@/components/BrandStyles';
import { getHomeContent, getSiteSettings } from '@/lib/markdown';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [homeContent, siteSettings] = await Promise.all([
    getHomeContent(),
    getSiteSettings(),
  ]);

  // Transform CMS navigation to match NavItem interface
  const navigationItems =
    homeContent?.frontmatter?.navigation?.map((item) => ({
      title: item.title,
      slug: item.slug,
      subnav: item.subnav || undefined,
    })) || [];

  return (
    <>
      <BrandStyles brandColor={siteSettings?.brandcolor} />
      <Header
        siteTitle={siteSettings?.sitename || 'Local Agenda'}
        siteDescription={siteSettings?.tagline || ''}
        nav={navigationItems}
        newsletterSettings={siteSettings?.newsletter}
      />
      <main className="min-h-screen">{children}</main>
      <Footer
        siteName={siteSettings?.copyrightname || 'Local Agenda'}
        footerText={siteSettings?.footertext}
        socialLinks={siteSettings?.sociallinks}
      />
    </>
  );
}
