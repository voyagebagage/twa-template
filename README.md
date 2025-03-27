# Telegram Web App Templates and CLI Wizard

This project provides a collection of templates and tools for creating Telegram Web Apps (TWA) quickly and efficiently.

## Project Structure

- **twa-cli-wizard/** - CLI tool for creating new Telegram Web App projects
- **template-twa/** - Next.js template with server-side rendering and API routes
- **template-twa-vite/** - Vite template for client-side only Telegram Web Apps

## Getting Started

### Using the CLI Wizard

The easiest way to create a new Telegram Web App is by using the CLI wizard:

```bash
# Navigate to the CLI directory
cd twa-cli-wizard

# Install dependencies
pnpm install

# Run the wizard
pnpm start my-twa-app
```

Follow the interactive prompts to configure your project. You can choose between:

- **Next.js template** - Full-featured with server-side rendering and API routes
- **Vite template** - Lightweight client-side only template

### Using Templates Directly

If you prefer to use the templates directly:

#### Next.js Template

```bash
# Copy the template
cp -r template-twa my-nextjs-twa

# Navigate to project directory
cd my-nextjs-twa

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

#### Vite Template

```bash
# Copy the template
cp -r template-twa-vite my-vite-twa

# Navigate to project directory
cd my-vite-twa

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Features

### Next.js Template

- Server-side rendering
- API routes
- Full Telegram Web App integration
- TypeScript, Zod, TanStack Query
- Tailwind CSS for styling

### Vite Template

- Lightweight and fast
- Client-side only
- Full Telegram Web App integration
- TypeScript, Zod
- Tailwind CSS for styling

### Both Templates Include

- Ready-to-use Telegram Web App integration
- Mobile-optimized UI for iOS and Android
- Development tunnels for testing with Telegram
- Responsive layouts with proper safe area handling

## Development

To expose your local server for testing with Telegram:

```bash
pnpm dev:tunnel
```

Use the generated URL in your Telegram Bot settings.

## License

MIT
