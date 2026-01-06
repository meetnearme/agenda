# Local Agenda - Community Newsletter Template

A free, open-source template for creating hyper-local community newsletters. Built with Next.js 16, Tailwind CSS, and Decap CMS.

<!-- Netlify Status Badges (update URLs after creating Netlify sites) -->

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE-NAME/deploys)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/local-newsletter)

## Features

- ⚡ **One-Click Deploy** - Get your site live in minutes with Netlify
- 🆓 **100% Free Hosting** - No monthly fees with Netlify's free tier
- 📅 **Local Events Integration** - Built-in support for Meet Near Me platform
- ✏️ **Easy Content Management** - Decap CMS for non-technical users
- 🎨 **No-Code Branding** - Change site name, colors, and social links via CMS
- 🔒 **More Secure Than WordPress** - No database = no database attacks

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

# Start development (runs both Next.js and CMS proxy)
pnpm dev:all
```

Visit `http://localhost:3001` to see your site, and `http://localhost:3001/admin` to access the CMS.

> **Note:** `pnpm dev:all` is the recommended way to start development. It runs both the Next.js dev server and the Decap CMS local proxy together, allowing you to edit content via the CMS without needing Netlify authentication.

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

| Netlify Site    | Environment Variable     | Behavior                                              |
| --------------- | ------------------------ | ----------------------------------------------------- |
| Production Site | `SITE_CONFIG=atx-agenda` | Uses `config/atx-agenda.json`, removes template page  |
| Marketing Site  | `SITE_CONFIG=marketing`  | Uses `config/marketing.json`, keeps template page     |
| Customer Forks  | _(not set)_              | Removes template, uses defaults for CMS configuration |

### Configuration Files

Pre-configured settings are stored in `config/`:

- `config/atx-agenda.json` - Production site configuration
- `config/marketing.json` - Marketing/demo site configuration

### Local Testing

```bash
# Test ATX Agenda build
pnpm build:atx-agenda

# Test Marketing build
pnpm build:marketing

# Test Fork build (no config)
pnpm build:fork
```

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
├── app/                    # Next.js App Router pages
│   ├── (main)/            # Main site routes
│   │   ├── page.tsx       # Homepage
│   │   ├── updates/          # Updates listing & posts
│   │   ├── events/        # Events page
│   │   └── template/      # Template info page
│   └── globals.css        # Global styles & theme
├── components/            # React components
├── content/               # Markdown content (CMS-managed)
│   ├── updates/             # Update posts
│   ├── events/           # Events page content
│   ├── home/             # Homepage content & navigation
│   └── settings/         # Site branding & settings
├── lib/                   # Utility functions
├── public/
│   └── admin/            # Decap CMS configuration
└── types/                 # TypeScript types
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

### Changing Colors (Code)

For deeper customization, edit the CSS variables in `app/globals.css`:

```css
:root {
  --primary: oklch(0.87 0.18 127); /* Lime green accent */
  --background: oklch(0.12 0 0); /* Dark background */
  --foreground: oklch(0.98 0 0); /* Text color */
  --card: oklch(0.16 0 0); /* Card backgrounds */
  /* ... other colors */
}
```

**Color Tips:**

- Change `--primary` to match your brand color
- The template uses [OKLCH color space](https://oklch.com/) for better color consistency
- Try these accent colors:
  - Blue: `oklch(0.7 0.15 250)`
  - Orange: `oklch(0.75 0.18 50)`
  - Purple: `oklch(0.65 0.2 300)`

### Navigation

Edit navigation in the CMS under **Home → Home Page → Main Navigation**, or directly in `content/home/index.md`.

### Events Page

The events page supports embedding external event widgets (like Meet Near Me). Configure via CMS at `/admin` under **Events → Events Page**:

1. Get your embed code from your events platform
2. Paste it into the "Embed Code" field
3. Toggle off "Show Instructions" to hide the setup guide

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **CMS**: [Decap CMS](https://decapcms.org/) (formerly Netlify CMS)
- **Hosting**: [Netlify](https://netlify.com/)
- **Language**: TypeScript

## Scripts

| Command        | Description                                    |
| -------------- | ---------------------------------------------- |
| `pnpm setup`   | **Run first** - Customize for your newsletter  |
| `pnpm dev:all` | **Recommended** - Start dev server + CMS proxy |
| `pnpm dev`     | Start Next.js development server only          |
| `pnpm dev:cms` | Start Decap CMS local proxy only               |
| `pnpm build`   | Build for production (static export)           |
| `pnpm start`   | Start production server                        |
| `pnpm lint`    | Run ESLint                                     |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this template for your community newsletter!

---

Built with ❤️ for local communities everywhere.
