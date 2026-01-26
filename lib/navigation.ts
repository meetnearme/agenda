import { NavItem } from '@/types/navigation.types';

/**
 * Fallback navigation items - actual navigation now comes from CMS (content/home/index.md)
 * These are used as defaults if CMS data is unavailable
 */
export const navigationItems: NavItem[] = [
  {
    title: 'Home',
    slug: '/',
  },
  {
    title: 'Updates',
    slug: '/updates',
  },
  {
    title: 'Events',
    slug: '/events',
  },
];

/**
 * Site metadata - title remains static, description used as fallback
 * Actual site description (tagline) now comes from CMS (content/home/index.md)
 */
export const siteMetadata = {
  title: 'ATX Agenda',
  description: 'Your weekly guide to local events',
  author: 'ATX Agenda Team',
};

