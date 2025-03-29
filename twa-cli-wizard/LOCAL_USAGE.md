# Local Usage Instructions

Since this package hasn't been published to npm yet, you can use it locally in the following ways:

## Method 1: Run Directly

Navigate to the CLI wizard directory and run it directly:

```bash
cd twa-cli-wizard
node bin/index.js my-project-name
```

## Method 2: Use npm link

Link the package globally and use it from anywhere:

```bash
cd twa-cli-wizard
npm link
# Now you can run from anywhere:
create-twa my-project-name
```

For Bun users:

```bash
cd twa-cli-wizard
bun link
# Now you can run from anywhere:
create-twa my-project-name
```

## Method 3: Run through npm scripts

```bash
cd twa-cli-wizard
npm run start my-project-name
# or
npm run dev my-project-name
```

## Debugging

If you encounter problems, you can run in debug mode:

```bash
cd twa-cli-wizard
npm run debug my-project-name
```

## Notes

- The CLI expects to find templates in `twa-cli-wizard/templates/` directory
- If templates are not found, it will try the parent directory or download from GitHub
- Make sure all dependencies are installed:
  ```bash
  cd twa-cli-wizard
  npm install  # or bun install, pnpm install
  ```
