# Local Agenda - Community Newsletter Template

A free, open-source template for creating hyper-local community newsletters. Built with Eleventy (11ty), Tailwind CSS, and Decap CMS.

<!-- Netlify Status Badge -->

[![Netlify Status](https://api.netlify.com/api/v1/badges/a6d8aaf6-6c2f-43c5-82a2-a1a050e4f1bc/deploy-status)](https://app.netlify.com/projects/atxagenda/deploys)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/local-newsletter)

## Features

- ⚡ **Blazing Fast** - Built with Eleventy for sub-second build times
- 🆓 **100% Free Hosting** - No monthly fees with Netlify's free tier
- 📦 **Tiny Bundle Size** - ~50KB total (vs 2MB+ with React frameworks)
- 📅 **Local Events Integration** - Built-in support for Meet Near Me platform
- ✏️ **Easy Content Management** - Decap CMS for non-technical users
- 🎨 **No-Code Branding** - Change site name, colors, and social links via CMS
- 🔒 **More Secure Than WordPress** - No database = no database attacks
- 🚀 **Multi-Site Support** - Deploy multiple sites from one repository

## Quick Start

### Option 1: Deploy to Netlify (Recommended)

1. Click the "Deploy to Netlify" button above
2. Connect your GitHub account
3. Netlify will create a copy of this repo and deploy it automatically
4. Enable Netlify Identity for CMS access (see setup below)

### Option 2: Manual Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/local-newsletter.git
cd local-newsletter

# Install dependencies
pnpm install

# Run the setup wizard (customize your newsletter)
pnpm setup

# Start development (runs both 11ty and CMS proxy)
pnpm dev:all

# Start dev server and CMS proxy after building for target
SITE_CONFIG=santa-fe-agenda pnpm dev:all
```

Visit `http://localhost:3002` to see your site, and `http://localhost:3002/admin` to access the CMS.

> **Note:** `pnpm dev:all` is the recommended way to start development. It runs both the 11ty dev server and the Decap CMS local proxy together, allowing you to edit content via the CMS without needing Netlify authentication.

## Setup Wizard

Run `pnpm setup` to customize the template for your newsletter. The wizard will:

1. **Set your organization name** - Updates header, footer, and metadata
2. **Choose your brand color** - Pick from presets or enter custom OKLCH
3. **Set your tagline** - Your newsletter's subtitle
4. **Clean up boilerplate** - Removes template page, sample posts, and setup files

After running setup, your newsletter is ready to customize via the CMS!

## CI/CD & Multiple Deployments

This template supports multiple Netlify deployments from a single repository using environment variables.

### Environment-Based Builds

Set the `SITE_CONFIG` environment variable in your Netlify site settings to control which configuration is used:

| Netlify Site    | Environment Variable          | Behavior                                              |
| --------------- | ----------------------------- | ----------------------------------------------------- |
| Production Site | `SITE_CONFIG=atx-agenda`      | Uses `config/atx-agenda.json`, removes template page  |
| Marketing Site  | `SITE_CONFIG=marketing`       | Uses `config/marketing.json`, keeps template page     |
| Santa Fe Site   | `SITE_CONFIG=santa-fe-agenda` | Uses `config/santa-fe-agenda.json`, light theme       |
| Customer Forks  | _(not set)_                   | Removes template, uses defaults for CMS configuration |

### Configuration Files

Pre-configured settings are stored in `config/`:

- `config/atx-agenda.json` - Production site configuration
- `config/marketing.json` - Marketing/demo site configuration
- `config/santa-fe-agenda.json` - Santa Fe site configuration (light theme)

### Local Testing

```bash
# Test ATX Agenda build
pnpm build:atx-agenda

# Test Santa Fe Agenda build
pnpm build:santa-fe-agenda

# Test Marketing build
pnpm build:marketing

# Test Fork build (no config)
pnpm build:fork
```

### Local Development with ATX Agenda Config

To set up for local development using the demo ATX Agenda config (with the events embed pointing to localhost:8001):

```bash
pnpm setup:dev
pnpm dev:all
```

This runs `setup.js` with `config/atx-agenda.json`, creates `.env.local` with the correct content directory, and runs the dev server alongside a Decap CMS local proxy.

## CMS Setup (Netlify Identity)

After deploying to Netlify:

1. Go to your Netlify site dashboard
2. Navigate to **Site configuration** → **Identity**
3. Click **Enable Identity**
4. Under **Registration**, select **Invite only**
5. Go to **Services** → **Git Gateway** and click **Enable Git Gateway**
6. Invite yourself via **Identity** → **Invite users**
7. Check your email and set your password
8. Visit `yoursite.netlify.app/admin` to log in

## Project Structure

```
├── src/                    # 11ty source files
│   ├── pages/             # Page templates (Nunjucks)
│   │   ├── index.njk      # Homepage
│   │   ├── updates.njk    # Updates listing
│   │   ├── events.njk     # Events page
│   │   └── updates/
│   │       └── post.njk   # Individual post template
│   ├── _includes/         # Layouts and components
│   │   ├── layouts/
│   │   │   └── base.njk   # Base HTML layout
│   │   └── components/
│   │       ├── header.njk # Site header
│   │       └── footer.njk # Site footer
│   ├── _data/             # Global data files (JavaScript)
│   │   ├── siteSettings.js   # Site branding & settings
│   │   ├── homeContent.js    # Homepage content
│   │   └── eventsContent.js  # Events page content
│   ├── css/
│   │   └── main.css       # Tailwind CSS entry point
│   ├── js/
│   │   └── main.js        # Client-side JavaScript
│   └── static/            # Static assets
├── content/               # Markdown content (CMS-managed, default)
│   ├── updates/           # Update posts
│   ├── events/            # Events page content
│   ├── home/              # Homepage content & navigation
│   ├── settings/          # Site branding & settings
│   └── pages/             # Additional pages
├── config/                # Multi-site configurations
│   ├── atx-agenda.json    # ATX Agenda config
│   ├── marketing.json     # Marketing site config
│   └── atx-agenda-content/   # ATX-specific content
├── public/
│   ├── admin/             # Decap CMS configuration
│   └── content/           # Media uploads (images)
├── netlify/
│   └── functions/         # Netlify Functions (TypeScript)
└── _site/                 # Build output (ignored in git)
```

## Branding & Customization

### Site Settings (No Code Required!)

All branding can be changed directly in the CMS at `/admin` under **⚙️ Site Settings**:

| Setting               | What It Changes                              |
| --------------------- | -------------------------------------------- |
| **Site Name**         | Header logo text, browser tab title          |
| **Tagline**           | Subtitle shown in header                     |
| **Site Description**  | SEO & social media previews                  |
| **Footer Text**       | Message in the footer                        |
| **Copyright Name**    | "© 2026 Your Name"                           |
| **Social Links**      | Twitter, Instagram, Facebook links in footer |
| **Newsletter Button** | Subscribe button text                        |
| **Subscriber Count**  | "Join 5,000+ locals..." number               |

### Changing Colors

**Via CMS (Recommended):**
Go to `/admin` → **⚙️ Site Settings** → **Brand Color** and choose from presets or enter a custom hex color.

**Via Code:**
Edit the CSS variables in `src/css/main.css`:

```css
:root {
    --color-primary: oklch(0.87 0.18 127); /* Lime green accent */
    /* Theme is automatically injected by setup script */
}
```

**Color Tips:**

- The setup script converts hex colors to OKLCH automatically
- OKLCH provides better color consistency across themes
- Try these accent colors:
    - Blue: `#3b82f6`
    - Orange: `#f97316`
    - Purple: `#8b5cf6`

### Navigation

Edit navigation in the CMS under **Home → Home Page → Main Navigation**, or directly in `content/home/index.md`.

### Events Page

The events page supports embedding external event widgets (like Meet Near Me). Configure via CMS at `/admin` under **Events → Events Page**:

1. Get your embed code from your events platform
2. Paste it into the "Embed Code" field
3. Toggle off "Show Instructions" to hide the setup guide

## Tech Stack

- **Framework**: [Eleventy (11ty)](https://www.11ty.dev/) - Fast, simple static site generator
- **Templating**: [Nunjucks](https://mozilla.github.io/nunjucks/) - Powerful templating language
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [DaisyUI](https://daisyui.com/) - Tailwind component library
- **Interactivity**: [Alpine.js](https://alpinejs.dev/) - Lightweight JavaScript framework
- **CMS**: [Decap CMS](https://decapcms.org/) (formerly Netlify CMS)
- **Hosting**: [Netlify](https://netlify.com/)
- **Functions**: TypeScript (for Netlify Functions)

## Why Eleventy?

This template was migrated from Next.js to Eleventy for several key reasons:

- **Faster builds**: ~5 seconds vs ~30 seconds with Next.js
- **Simpler architecture**: No React complexity for a content-focused site
- **Smaller bundles**: ~50KB vs 2MB+ JavaScript payload
- **Better for SEO**: True static HTML, no hydration delays
- **Lower barrier to entry**: HTML + Nunjucks is easier than React/TSX
- **Perfect for newsletters**: Content-first sites don't need a full React framework

## Scripts

| Command                 | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `pnpm setup`            | **Run first** - Customize for your newsletter     |
| `pnpm setup:dev`        | Setup with ATX Agenda config (localhost embed)    |
| `pnpm dev:all`          | **Recommended** - Start 11ty + CMS proxy together |
| `pnpm dev`              | Start 11ty development server only                |
| `pnpm dev:cms`          | Start Decap CMS local proxy only                  |
| `pnpm build`            | Build for production (generates `_site/`)         |
| `pnpm build:ci`         | Build for Netlify CI/CD                           |
| `pnpm build:atx-agenda` | Build with ATX Agenda config                      |
| `pnpm build:marketing`  | Build with Marketing config                       |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this template for your community newsletter!

---

Built with ❤️ for local communities everywhere.
