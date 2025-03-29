# Telegram Web App Templates and CLI Wizard

This project provides templates and tools for easily creating Telegram Web Apps (TWA) with modern technologies.

## Quick Start

The fastest way to create a new Telegram Web App is with our CLI wizard:

```bash
# Using npx (no installation required)
npx create-twa my-twa-app

# Using pnpm
pnpm dlx create-twa my-twa-app

# Using bun
bunx create-twa my-twa-app
```

## Project Structure

- **twa-cli-wizard/** - CLI tool for creating new TWA projects (`create-twa`)
- **template-twa/** - Next.js template with server-side rendering and API routes
- **template-twa-vite/** - Vite template for client-side only applications

## Templates

### Next.js Template

Full-featured template with server-side capabilities:

- ⚡ Server-side rendering for better SEO and performance
- 🔌 API routes (optional) for backend functionality
- 🔥 Hono integration (optional) for high-performance API routes
- 📱 Full Telegram WebApp integration with platform-specific styling
- 🔄 TanStack Query for data fetching
- 🧁 Zustand for state management
- 🎨 Tailwind CSS v4 for styling
- 🧰 TypeScript and Zod for type safety

### Vite Template

Lightweight client-only template:

- 🚀 Fast development and build times with Vite
- 📱 Full Telegram WebApp integration
- 🧁 Zustand for state management
- 🎨 Tailwind CSS for styling
- 🧰 TypeScript and Zod for type safety

## Installation

### Using The CLI Wizard

```bash
# Global installation

# npm
npm install -g create-twa

# pnpm
pnpm add -g create-twa

# bun
bun add -g create-twa

# Then create new projects with:
create-twa my-new-app
```

The wizard will guide you through selecting:

- Your preferred package manager (pnpm, bun, npm)
- Template type (Next.js or Vite)
- TypeScript, Zod, TanStack Query options
- For Next.js, API routes and optional Hono integration
- Telegram bot username

### Using Templates Directly

If you prefer to use the templates without the wizard:

```bash
# Clone the repository
git clone https://github.com/voyagebagage/twa-template.git

# Copy the template you want to use
cp -r twa-template/template-twa my-nextjs-twa
# OR
cp -r twa-template/template-twa-vite my-vite-twa

# Navigate to your project and install dependencies
cd my-nextjs-twa
pnpm install  # or npm install, bun install
```

## Development

Both templates include development tunnels for testing with Telegram:

```bash
# Start development server
pnpm dev  # or npm run dev, bun dev

# Start development tunnel for testing with Telegram
pnpm dev:tunnel  # or npm run dev:tunnel, bun dev:tunnel
```

Use the tunnel URL in your Telegram Bot settings for testing.

## API Routes Configuration

The Next.js template supports API routes for backend functionality. You can:

1. Use the CLI wizard and select whether to include API routes
2. Choose to integrate Hono for high-performance API routes
3. Manually remove the `/src/app/api` directory if you don't need them

## Hono Integration

If you choose to use Hono with Next.js, the wizard will:

1. Initialize a Hono project with Next.js template
2. Add Telegram Web App specific components and hooks
3. Update the home page to fetch from the API
4. Configure environment variables for API URLs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
