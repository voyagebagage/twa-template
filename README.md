# Telegram Web App Templates and CLI Wizard

This project provides templates and tools for easily creating Telegram Web Apps (TWA) with modern technologies.

## Quick Start

The fastest way to create a new Telegram Web App is with our CLI wizard:

```bash
# Using npx (no installation required)
npx create-twa my-twa-app

# Using pnpm
pnpm dlx create-twa my-twa-app

# Using Bun
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
- 🔥 Optional Hono integration for more efficient API routes
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
# Global installation with npm
npm install -g create-twa

# Global installation with pnpm
pnpm add -g create-twa

# Global installation with Bun
bun add -g create-twa

# Then create new projects with:
create-twa my-new-app
```

The wizard will guide you through selecting:

- Your preferred package manager (pnpm, Bun, or npm)
- Template type (Next.js or Vite)
- For Next.js: API routes configuration and optional Hono integration
- Additional dependencies and features

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
pnpm install  # or bun install
```

## Development

Both templates include development tunnels for testing with Telegram:

```bash
# Start development server
pnpm dev  # or bun dev

# Start development tunnel for testing with Telegram
pnpm dev:tunnel  # or bun dev:tunnel
```

Use the tunnel URL in your Telegram Bot settings for testing.

## API Routes Configuration

The Next.js template supports API routes for backend functionality. You can:

1. Use the CLI wizard and select whether to include API routes
2. Choose Hono integration for more efficient API handling
3. Manually remove the `/src/app/api` directory if you don't need them

## Hono Integration

When you choose to use Hono with Next.js, the CLI will:

1. Create a Next.js + Hono project using Hono's CLI
2. Integrate the Telegram Web App components
3. Set up a sample Hono API route at `/api/hello`
4. Configure the home page to display the API response
5. Update all dependencies to the latest versions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
