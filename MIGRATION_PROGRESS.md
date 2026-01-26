# Next.js to 11ty Migration Progress

**Started:** 2026-01-26
**Target:** Migrate Local Agenda from Next.js 16 to Eleventy (11ty)

## Status Overview

- **Phase 1: Foundation** ✅ Complete
- **Phase 2: Content & Data** ✅ Complete
- **Phase 3: Templating** ✅ Complete
- **Phase 4: Custom Components** ✅ Complete
- **Phase 5: Styling & Interactivity** ✅ Complete
- **Phase 6: CMS Integration** ⏳ In Progress
- **Phase 7: Setup Scripts & Multi-Site** ✅ Complete
- **Phase 8: Build & Deploy** ✅ Complete
- **Phase 9: Testing & Validation** ⏳ In Progress
- **Phase 10: Launch** 🔲 Pending

---

## Phase 1: Foundation ✅

### ✅ Task 1: Install 11ty and core dependencies
- [x] Install @11ty/eleventy
- [x] Install markdown-it
- [x] Install npm-run-all
- [x] Install daisyui@latest
- [x] Install alpinejs
- [x] Install @11ty/eleventy-img
- [x] Install gray-matter
- [x] Install @tailwindcss/cli

**Status:** Complete
**Date Completed:** 2026-01-26

### ✅ Task 2: Create 11ty directory structure
- [x] Create src/ directory
- [x] Create src/_includes/layouts/
- [x] Create src/_includes/components/
- [x] Create src/_data/
- [x] Create src/pages/
- [x] Create src/css/
- [x] Create src/js/
- [x] Create src/static/

**Status:** Complete
**Date Completed:** 2026-01-26

### ✅ Task 3: Create .eleventy.js configuration file
- [x] Add TypeScript support (via gray-matter)
- [x] Configure passthrough copies (static, admin, content)
- [x] Set up watch targets
- [x] Create custom markdown-it with HTML tag preservation
- [x] Add environment variables (CONTENT_DIR, SITE_CONFIG)
- [x] Configure directory structure

**Status:** Complete
**Date Completed:** 2026-01-26
**File:** `.eleventy.js`

---

## Phase 2: Content & Data ✅

### ✅ Task 4: Migrate content processing to 11ty data files
- [x] Create src/_data/siteSettings.js
- [x] Create src/_data/homeContent.js
- [x] Create src/_data/eventsContent.js
- [x] Support CONTENT_DIR environment variable
- [x] Replicate all functions from lib/markdown.ts

**Status:** Complete
**Date Completed:** 2026-01-26
**Files:**
- `src/_data/siteSettings.js`
- `src/_data/homeContent.js`
- `src/_data/eventsContent.js`

### ✅ Task 5: Set up 11ty collections and filters
- [x] Create posts collection (from CONTENT_DIR/updates)
- [x] Create pages collection (from content/pages)
- [x] Create featuredPosts collection
- [x] Add formatDate filter
- [x] Add readingTime filter
- [x] Add slug generation filter
- [x] Add renderMarkdown filter with custom tag preservation

**Status:** Complete
**Date Completed:** 2026-01-26
**File:** `.eleventy.js` (lines 127-279)

---

## Phase 3: Templating ✅

### ✅ Task 6: Create base layout template
- [x] HTML structure with meta tags
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Brand color CSS variable injection
- [x] Header/Footer includes
- [x] Alpine.js integration

**Status:** Complete
**Date Completed:** 2026-01-26
**File:** `src/_includes/layouts/base.njk`

### ✅ Task 7: Port Header and Footer to Nunjucks
- [x] Header component with navigation
- [x] Mobile menu (Alpine.js powered)
- [x] Subscribe button with conditional logic
- [x] Footer with copyright and social links
- [x] "Built with Eleventy" attribution

**Status:** Complete
**Date Completed:** 2026-01-26
**Files:**
- `src/_includes/components/header.njk`
- `src/_includes/components/footer.njk`

### ✅ Task 8: Create page templates (home, updates, events)
- [x] Home page (index.njk) with hero section
- [x] Updates listing page with pagination
- [x] Events page with embed support

**Status:** Complete
**Date Completed:** 2026-01-26
**Files:**
- `src/pages/index.njk`
- `src/pages/updates.njk`
- `src/pages/events.njk`

### ✅ Task 9: Create post template with pagination
- [x] Individual post layout with metadata
- [x] Featured image display
- [x] Previous/Next navigation
- [x] Related posts section
- [x] Pagination from collections.posts

**Status:** Complete
**Date Completed:** 2026-01-26
**File:** `src/pages/updates/post.njk`

---

## Phase 4: Custom Components ✅

### ✅ Task 10: Implement custom shortcodes
- [x] postGrid shortcode (featured/recent posts)
- [x] verticalTilesGrid paired shortcode
- [x] newsletterSignup shortcode (iframe & native modes)
- [x] Helper function for date formatting in shortcodes

**Status:** Complete
**Date Completed:** 2026-01-26
**File:** `.eleventy.js` (lines 281-409)

---

## Phase 5: Styling & Interactivity ✅

### ✅ Task 11: Set up Tailwind CSS build with DaisyUI
- [x] Install DaisyUI
- [x] Create tailwind.config.js
- [x] Copy app/globals.css → src/css/main.css
- [x] Update package.json scripts (build:css, watch:css)
- [x] Configure DaisyUI theme with brand colors

**Status:** Complete
**Date Completed:** 2026-01-26
**Files:**
- `tailwind.config.js`
- `src/css/main.css`
- `package.json` (scripts updated)

### ✅ Task 12: Create client-side JavaScript for interactivity
- [x] Newsletter form submission handler
- [x] Smooth scrolling for anchor links
- [x] Beehiiv embed script execution
- [x] Mobile menu toggle (fallback for Alpine.js)

**Status:** Complete
**Date Completed:** 2026-01-26
**File:** `src/js/main.js`

---

## Phase 6: CMS Integration ⏳

### 🔲 Task 13: Update Decap CMS configuration for 11ty
- [ ] Update preview paths if needed
- [ ] Verify collections work with 11ty
- [ ] Test media upload paths
- [ ] Test local backend (decap-server)

**Status:** Pending
**Blocking:** None
**Notes:** `public/admin/config.yml` should work as-is, but needs testing

---

## Phase 7: Setup Scripts & Multi-Site ✅

### ✅ Task 14: Update setup scripts for 11ty paths
- [x] Update scripts/setup.js:
  - [x] Change `app/globals.css` → `src/css/main.css`
  - [x] Remove `lib/navigation.ts` updates (no longer needed)
  - [x] Remove `app/(main)/template` references
  - [x] Keep CMS config updates intact
  - [x] Keep content file updates (settings, home)
- [x] Test with marketing.json config ✓
- [x] Test with atx-agenda.json config ✓
- [x] Update global data files to respect CONTENT_DIR
- [x] scripts/setup-dev.js works as-is (no changes needed)

**Status:** Complete
**Date Completed:** 2026-01-26
**Files Updated:**
- `scripts/setup.js` (removed Next.js paths, updated CSS path)
- `src/_data/homeContent.js` (now respects CONTENT_DIR)
- `src/_data/siteSettings.js` (now respects CONTENT_DIR)
- Created `config/atx-agenda-content/home/index.md`
- Created `config/atx-agenda-content/settings/index.md`

### ✅ Task 17: Test setup scripts with both configs
- [x] Run `node scripts/setup.js --config config/marketing.json` ✓
- [x] Run `node scripts/setup.js --config config/atx-agenda.json` ✓
- [x] Run `node scripts/setup.js --remove-template-only` ✓
- [x] Verify CSS brand colors update correctly ✓
- [x] Verify CMS config paths update correctly ✓
- [x] Verify `.env.local` created by build.sh ✓
- [x] Test dev server respects CONTENT_DIR switching

**Status:** Complete
**Date Completed:** 2026-01-26

**Key Learning:** Multi-site architecture works via:
1. Setup script updates CMS config to point to config-specific directories
2. CONTENT_DIR env var tells 11ty which directory to read from
3. All global data files (home, settings, events, updates) respect CONTENT_DIR
4. Switching configs is as simple as running setup script + setting env var

---

## Phase 8: Build & Deploy ✅

### ✅ Task 15a: Update build scripts in package.json
- [x] Update dev script to use 11ty + Tailwind watch
- [x] Update build script (CSS + 11ty)
- [x] Add build:css and watch:css scripts
- [x] Update build:ci to work with 11ty
- [x] Test multi-site builds with CONTENT_DIR ✓

**Status:** Complete
**Date Completed:** 2026-01-26
**File:** `package.json`

### ✅ Task 15b: Update Netlify configuration
- [x] Update netlify.toml:
  - [x] Change publish directory from `out` to `_site`
  - [x] Keep build command as `pnpm build:ci`
  - [x] Verify environment variables work
- [x] Update scripts/build.sh for 11ty
  - [x] Remove Next.js-specific comments
  - [x] Keep multi-site logic intact
- [x] Add `_site/` to .gitignore

**Status:** Complete
**Date Completed:** 2026-01-26
**Files:**
- `netlify.toml` (publish: "_site")
- `scripts/build.sh` (updated comments)
- `.gitignore` (added _site/)

---

## Phase 9: Testing & Validation 🔲

### ✅ Task 16: Test basic 11ty build and content rendering
- [x] Run `pnpm build` successfully
- [x] Verify all pages generate
- [x] Test dev server at localhost:3000
- [x] Verify CSS loads correctly
- [x] Verify JavaScript loads correctly
- [x] Check collections work (posts displayed)

**Status:** Complete
**Date Completed:** 2026-01-26
**Dev Server:** http://localhost:3000/

### ✅ Task 16b: Fix performance bottleneck and security issues
- [x] Strip script tags from Beehiiv embed at build time
- [x] Load Beehiiv script once in base layout (instead of per embed)
- [x] Remove eval() security risk from main.js
- [x] Fix duplicate watch targets in .eleventy.js
- [x] Add JS/admin passthrough copies for static assets

**Status:** Complete
**Date Completed:** 2026-01-26
**Files Updated:**
- `.eleventy.js` (added script tag stripping, fixed watch targets, added passthrough)
- `scripts/setup.js` (strip script tags from Beehiiv embeds)
- `src/_includes/layouts/base.njk` (load Beehiiv script once globally)
- `src/js/main.js` (removed eval() calls, simplified embed handling)

**Impact:**
- Improved build performance by eliminating duplicate script loading
- Enhanced security by removing eval() and centralizing script execution
- Better asset handling with proper passthrough configuration

### ✅ Task 16c: Fix hero images not displaying
- [x] Add `public/content` passthrough copy for images and media
- [x] Add `public/img` passthrough copy for CMS uploads
- [x] Add `public/_headers` passthrough copy for Netlify
- [x] Verify hero images render correctly with CMS-configured opacity

**Status:** Complete
**Date Completed:** 2026-01-26
**File:** `.eleventy.js` (lines 14-22)

**Impact:**
- Hero background images now display correctly on homepage
- CMS-uploaded media will be properly copied to build output
- Netlify headers file included in deployment

### ✅ Task 16d: Fix dev server not loading CONTENT_DIR from .env.local
- [x] Install `dotenv-cli` package
- [x] Update `dev` script to load .env.local before running
- [x] Update `dev:eleventy` script to load .env.local
- [x] Update `build` script to load .env.local for consistency
- [x] Verify CONTENT_DIR environment variable is read correctly

**Status:** Complete
**Date Completed:** 2026-01-26
**Files:**
- `package.json` (added dotenv-cli, updated dev & build scripts)

**Impact:**
- Dev server now correctly loads from `config/atx-agenda-content` after running `pnpm setup:dev`
- Multi-site content switching works properly in development
- No manual environment variable setting needed

### ✅ Task 16e: Verify Netlify deployment configuration for 11ty
- [x] Verify `netlify.toml` publish directory is `_site`
- [x] Verify build command uses `pnpm build:ci`
- [x] Verify functions directory configuration
- [x] Verify Decap CMS redirects are in place
- [x] Verify `scripts/build.sh` works with 11ty
- [x] Verify Netlify Function (`subscribe.ts`) is framework-agnostic
- [x] Verify `public/_headers` is copied to build output

**Status:** Complete
**Date Completed:** 2026-01-26
**Files:**
- `netlify.toml` (already correct for 11ty)
- `scripts/build.sh` (creates .env.local, exports CONTENT_DIR)
- `netlify/functions/subscribe.ts` (framework-agnostic, works as-is)
- `.eleventy.js` (includes _headers passthrough)

**Impact:**
- Netlify deployments will work correctly with 11ty
- Multi-site builds work via SITE_CONFIG environment variable
- Newsletter subscription function works with 11ty
- All deployment configurations verified and ready

### 🔲 Task 18: Test CMS integration and editorial workflow
- [ ] Access /admin interface
- [ ] Log in with Netlify Identity
- [ ] Create new post via CMS
- [ ] Edit existing post
- [ ] Upload media
- [ ] Test preview mode
- [ ] Verify changes commit to git
- [ ] Test local backend (decap-server)

**Status:** Pending
**Blocking:** None

### 🔲 Task 19: Performance and accessibility audit
- [ ] Run Lighthouse audit
- [ ] Verify build time improvements (target: < 10s)
- [ ] Check bundle size reduction
- [ ] Test responsive design (mobile/tablet/desktop)
- [ ] Verify keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Validate SEO meta tags
- [ ] Verify Open Graph images

**Status:** Pending
**Blocking:** None

---

## Phase 10: Launch 🔲

### 🔲 Task 20: Final staging review
- [ ] Deploy to staging environment
- [ ] Full site walkthrough
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Content validation

### 🔲 Task 21: Production deployment
- [ ] Merge migration branch to main
- [ ] Deploy to production
- [ ] Monitor build process
- [ ] Verify site loads correctly
- [ ] Test CMS access in production

### 🔲 Task 22: Post-launch validation
- [ ] Verify all URLs redirect correctly
- [ ] Test newsletter signups work
- [ ] Verify events calendar displays
- [ ] Monitor for errors
- [ ] Test config switching (marketing ↔ ATX Agenda)

---

## Key Achievements ✅

1. **Build Time Improvement:** TBD (Next.js: ~30s, Target: ~5s)
2. **Bundle Size Reduction:** TBD (Next.js: ~2MB, Target: ~50KB)
3. **Architecture:** Simplified from React/Next.js to static 11ty
4. **Styling:** Migrated to DaisyUI (simpler than shadcn/ui)
5. **All Core Pages Working:** Home, Updates, Events, Individual Posts
6. **Multi-Site Architecture:** Working correctly with CONTENT_DIR switching
7. **Performance:** Eliminated duplicate script loading and eval() security risks
8. **Build Configuration:** Fixed watch targets and asset passthrough

---

## Technical Debt & Future Enhancements

- [ ] Add sitemap generation
- [ ] Add RSS feed
- [ ] Optimize images with @11ty/eleventy-img
- [ ] Add search functionality (if needed)
- [ ] Set up automated testing
- [ ] Add more comprehensive error handling

---

## Migration Notes

### Breaking Changes
- Output directory: `out/` → `_site/`
- Build command: `next build` → `eleventy`
- Dev server: `next dev` → `eleventy --serve`

### Files Deprecated (Can be removed after validation)
- `app/` directory (Next.js app router)
- `components/` React components
- `lib/markdown.ts` (replaced by 11ty data files)
- `next.config.ts`
- All Next.js-specific config files

### Files to Keep
- `content/` directory (unchanged)
- `public/admin/` (Decap CMS, unchanged)
- `netlify/functions/` (Netlify Functions, unchanged)
- `config/` directory (deployment configs, unchanged)
- `scripts/` directory (needs updates but structure preserved)

---

**Last Updated:** 2026-01-26 (14:00)

**Recent Commits:**
- `9f6773f` perf: Fix performance bottleneck and security issues
- `a8e9c0f` feat: Fix multi-site architecture for 11ty
- `ba7da5e` refactor: Update setup script for 11ty
