# Telegram Web App Template with Vite

A lightweight client-side template for building Telegram Web Apps (TWA) using Vite, React, and Tailwind CSS.

## Features

- 📱 Mobile-first design optimized for Telegram Web Apps
- 🔄 Full integration with Telegram Mini App API
- 💾 State management with Zustand
- 📱 Optimized for performance
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
git clone https://github.com/yourusername/template-twa-vite.git
cd template-twa-vite
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

To test your Telegram Web App during development, you need to expose your local server to the internet:

```bash
pnpm dev:tunnel
```

Then, set the generated URL in your Telegram bot's Web App settings.

## Project Structure

```
template-twa-vite/
├── public/          # Static assets
├── scripts/         # Utility scripts
├── src/             # Source code
│   ├── components/  # React components
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utility functions
│   ├── stores/      # Zustand stores
│   └── styles/      # CSS styles
└── ...              # Configuration files
```

## Deployment

### Production Build

```bash
pnpm build
```

The build output will be in the `dist` directory.

## License

MIT

## Acknowledgements

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Zod](https://github.com/colinhacks/zod)
