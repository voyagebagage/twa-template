# Telegram Web App Template with Next.js

A modern template for building Telegram Web Apps (TWA) using Next.js, React, and Tailwind CSS.

## Features

- 📱 Mobile-first design optimized for Telegram Web Apps
- 🔄 Full integration with Telegram Mini App API
- 🌐 Internationalization (i18n) support
- 🔄 Server-side rendering with Next.js
- 📊 API routes for backend functionality
- 💾 State management with Zustand
- ✅ Schema validation with Zod
- 🎯 TypeScript support

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.0 or newer
- [pnpm](https://pnpm.io/) (recommended) or npm
- A Telegram bot for testing

### Installation

1. Clone this repository:

```bash
git clone https://github.com/yourusername/twa-template.git
cd twa-template
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
pnpm dev
```

### Development with Tunnel

To test your Telegram Web App during development, you need to expose your local server to the internet. This template includes a Deno script for creating a tunnel:

```bash
pnpm dev:tunnel
```

Then, set the generated URL in your Telegram bot's Web App settings.

## Project Structure

```
@template-twa/
├── public/          # Static assets
├── scripts/         # Utility scripts
├── src/             # Source code
│   ├── app/         # Next.js App Router
│   │   ├── api/     # API Routes
│   │   └── ...      # Page routes
│   ├── components/  # React components
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utility functions
│   ├── schemas/     # Zod schemas
│   ├── stores/      # Zustand stores
│   └── types/       # TypeScript type definitions
└── ...              # Configuration files
```

## Customization

- **Colors**: Modify `tailwind.config.ts` for theme colors
- **Header**: Customize the header in `src/components/header.tsx`
- **Tabs**: Edit tabs in `src/components/layout/tab-bar.tsx`

## Deployment

### Production Build

```bash
pnpm build
```

### Deploy to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

## License

MIT

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Zod](https://github.com/colinhacks/zod)
