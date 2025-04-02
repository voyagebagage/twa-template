# create-twa

A command-line interface (CLI) wizard for creating Telegram Web App (TWA) projects with different templates and configurations.

## Features

- Interactive wizard to guide you through creating TWA projects
- Multiple template options:
  - Next.js (server + client)
  - Vite (client-only)
  - Next.js with Hono for API routes
- Package manager options: pnpm, Bun, or npm
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
# Using npm
npm install -g create-twa

# Using pnpm
pnpm add -g create-twa

# Using Bun
bun add -g create-twa
```

### Usage Without Installation

```bash
# Using npx (npm)
npx create-twa my-twa-app

# Using pnpm
pnpm dlx create-twa my-twa-app

# Using Bun
bunx create-twa my-twa-app
```

## Usage

```bash
create-twa [project-name]
```

If you don't provide a project name, the wizard will prompt you for one.

Follow the interactive prompts to configure your project:

1. Choose a package manager (pnpm, Bun, or npm)
2. Select a template (Next.js or Vite)
3. Choose whether to use TypeScript
4. Configure additional libraries (Zod, TanStack Query, Tailwind CSS)
5. For Next.js, decide if you want API routes
6. For Next.js with API routes, choose whether to use Hono
7. Enter your Telegram bot username

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

### Next.js with Hono Template

- Server-side rendering with Next.js
- API routes powered by Hono framework
- More efficient API handling with Hono middleware
- All the benefits of the standard Next.js template

### Vite Template

- Client-only (lighter and faster)
- Full integration with Telegram Mini App API
- Mobile-optimized layout
- Zustand for state management
- Tailwind CSS for styling
- TypeScript and Zod for type safety

## Development

To develop the CLI tool:

1. Clone the repository
   ```bash
   git clone https://github.com/voyagebagage/twa-template.git
   cd twa-template/twa-cli-wizard
   ```
2. Install dependencies with `pnpm install` or `bun install`
3. Make your changes
4. Test locally with `pnpm start my-test-app` or `bun start my-test-app`

## License

MIT
