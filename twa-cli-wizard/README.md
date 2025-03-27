# TWA CLI Wizard

A command-line interface (CLI) wizard for creating Telegram Web App (TWA) projects with different templates and configurations.

## Features

- Interactive wizard to guide you through creating TWA projects
- Multiple template options: Next.js (server + client) or Vite (client-only)
- Customizable configuration:
  - TypeScript support
  - Zod for schema validation
  - TanStack Query for data fetching
  - Tailwind CSS for styling
  - API routes (for Next.js)
- Automatic project setup and dependency installation
- Development tunnel for testing with Telegram

## Installation

### Global Installation

```bash
npm install -g twa-cli
```

Or using pnpm:

```bash
pnpm add -g twa-cli
```

### Usage Without Installation

Using npx:

```bash
npx twa-cli my-twa-app
```

## Usage

```bash
twa-create [project-name]
```

If you don't provide a project name, the wizard will prompt you for one.

Follow the interactive prompts to configure your project:

1. Select a template (Next.js or Vite)
2. Choose whether to use TypeScript
3. Configure additional libraries (Zod, TanStack Query, Tailwind CSS)
4. For Next.js, decide if you want API routes
5. Enter your Telegram bot username

After completing the wizard, your project will be created with all selected features.

## Templates

### Next.js Template

- Server-side rendering capabilities
- API routes (optional)
- Full integration with Telegram Mini App API
- Mobile-optimized layout
- TanStack Query for data fetching
- Zustand for state management
- Tailwind CSS for styling
- TypeScript and Zod for type safety

### Vite Template

- Client-side only (lighter and faster)
- Full integration with Telegram Mini App API
- Mobile-optimized layout
- Zustand for state management
- Tailwind CSS for styling
- TypeScript and Zod for type safety

## Development

To develop the CLI tool:

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Make your changes
4. Test locally with `pnpm start`

## License

MIT
