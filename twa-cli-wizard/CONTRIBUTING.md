# Contributing to create-twa

Thank you for your interest in contributing to our Telegram Web App template generator!

## Development Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/voyagebagage/twa-template.git
   cd twa-template/twa-cli-wizard
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   bun install
   # or
   pnpm install
   ```

3. Link the package to test locally:

   ```bash
   npm link
   ```

4. Test the CLI by running:
   ```bash
   create-twa my-test-app
   ```

## Project Structure

- `bin/index.js` - Main CLI entry point
- `templates/` - Template directories
  - `template-twa/` - Next.js template
  - `template-twa-vite/` - Vite template
- `__tests__/` - Test files

## Working with Templates

If you're making changes to the templates, make sure to test both the Next.js and Vite templates with various option combinations.

## Pull Requests

When submitting a PR, please:

1. Include a clear description of the changes
2. Update documentation if necessary
3. Add tests for new functionality
4. Make sure all tests pass

## Adding New Features

If you want to add a new feature:

1. Open an issue to discuss the feature before implementation
2. Follow the existing code style
3. Add appropriate documentation
4. Add tests for the new functionality

## Template Guidelines

When working with templates:

1. Keep them clean and well-organized
2. Follow best practices for the respective frameworks
3. Ensure they work with the selected options
4. Add helpful comments for users to understand the code

## Running Tests

```bash
npm test
```

## Versioning

We use semantic versioning. Please update version numbers according to:

- MAJOR: Breaking changes
- MINOR: New features in a backward-compatible manner
- PATCH: Backward-compatible bug fixes
