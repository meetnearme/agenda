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
- **Phase 7: Setup Scripts & Multi-Site** 🔲 Pending
- **Phase 8: Build & Deploy** 🔲 Pending
- **Phase 9: Testing & Validation** 🔲 Pending
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

## Phase 7: Setup Scripts & Multi-Site 🔲

### 🔲 Task 14: Update setup scripts for 11ty paths
- [ ] Update scripts/setup.js:
  - [ ] Change `app/globals.css` → `src/css/main.css`
  - [ ] Remove `lib/navigation.ts` updates (no longer needed)
  - [ ] Keep CMS config updates
  - [ ] Keep content file updates (settings, home)
- [ ] Test with marketing.json config
- [ ] Test with atx-agenda.json config
- [ ] Update scripts/setup-dev.js if needed

**Status:** Pending
**Blocking:** None
**Files to Update:**
- `scripts/setup.js`
- `scripts/setup-dev.js` (minimal changes)

### 🔲 Task 17: Test setup scripts with both configs
- [ ] Run `pnpm setup` interactively
- [ ] Run `node scripts/setup.js --config config/marketing.json`
- [ ] Run `node scripts/setup.js --config config/atx-agenda.json`
- [ ] Verify CSS brand colors update correctly
- [ ] Verify CMS config paths update correctly
- [ ] Verify `.env.local` created by setup:dev

**Status:** Pending
**Blocking:** Task 14 must be completed first

---

## Phase 8: Build & Deploy 🔲

### ✅ Task 15a: Update build scripts in package.json (Partial)
- [x] Update dev script to use 11ty
- [x] Update build script
- [x] Add build:css and watch:css scripts
- [ ] Update build:ci script for 11ty
- [ ] Update Netlify-specific scripts

**Status:** Partially Complete
**Remaining Work:**
- Update build:ci script
- Test multi-site builds with CONTENT_DIR

### 🔲 Task 15b: Update Netlify configuration
- [ ] Update netlify.toml:
  - [ ] Change publish directory to `_site`
  - [ ] Update build command to use 11ty
  - [ ] Verify environment variables
- [ ] Test Netlify Functions still work
- [ ] Test multi-site deployments

**Status:** Pending
**File:** `netlify.toml`

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

**Last Updated:** 2026-01-26
