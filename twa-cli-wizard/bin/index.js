#!/usr/bin/env node

import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import chalk from "chalk";
import inquirer from "inquirer";
import { program } from "commander";
import ora from "ora";
import { execa } from "execa";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, "..", "templates");

// ASCII Art Logo
const logo = `
 _______       __    __            _____ _      _____ 
|__   __|     /\\ \\  / /    /\\    / ____| |    |_   _|
   | |       /  \\ \\/ /    /  \\  | |    | |      | |  
   | |  __ _/ /\\ \\  /    / /\\ \\ | |    | |      | |  
   | | |_ |____|  |  |   / ____ \\| |____| |____ _| |_ 
   |_| |_|     |_/|_/  /_/    \\_\\\\_____|______|_____|
                                                                 
 Telegram Web App Template Generator
`;

// CLI version
const version = "1.0.0";

// Helper function to check if a package manager is installed
async function isPackageManagerInstalled(packageManager) {
  try {
    await execa(packageManager, ["--version"]);
    return true;
  } catch (error) {
    return false;
  }
}

// Command line setup
program
  .name("create-twa")
  .description("Create a new Telegram Web App project")
  .version(version)
  .argument("[project-directory]", "Directory to create the project in")
  .action(async (projectDirectory) => {
    console.log(chalk.blue(logo));

    // If no project directory is provided, ask for it
    if (!projectDirectory) {
      const response = await inquirer.prompt([
        {
          type: "input",
          name: "projectDirectory",
          message: "What is the name of your project?",
          default: "my-twa-app",
          validate: (input) => {
            if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
            return "Project name may only include letters, numbers, underscores and hashes.";
          },
        },
      ]);
      projectDirectory = response.projectDirectory;
    }

    // Full path to the project directory
    const projectPath = path.resolve(process.cwd(), projectDirectory);

    // Check if the directory already exists
    if (fs.existsSync(projectPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: `Directory ${projectDirectory} already exists. Do you want to overwrite it?`,
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log(chalk.yellow("Operation cancelled."));
        process.exit(0);
      } else {
        await fs.remove(projectPath);
      }
    }

    // Check package managers availability
    const isPnpmAvailable = await isPackageManagerInstalled("pnpm");
    const isBunAvailable = await isPackageManagerInstalled("bun");

    // Ask for package manager
    const { packageManager } = await inquirer.prompt([
      {
        type: "list",
        name: "packageManager",
        message: "Which package manager would you like to use?",
        choices: [
          ...(isPnpmAvailable ? [{ name: "pnpm", value: "pnpm" }] : []),
          ...(isBunAvailable ? [{ name: "bun", value: "bun" }] : []),
          { name: "npm", value: "npm" },
        ],
        default: isPnpmAvailable ? "pnpm" : isBunAvailable ? "bun" : "npm",
      },
    ]);

    // Ask for template and configuration
    const { templateType, useTypeScript, useZod, useTanstack, useTailwind } =
      await inquirer.prompt([
        {
          type: "list",
          name: "templateType",
          message: "Which template would you like to use?",
          choices: [
            { name: "Next.js (Server-side + Client-side)", value: "nextjs" },
            { name: "Vite (Client-side only)", value: "vite" },
          ],
        },
        {
          type: "confirm",
          name: "useTypeScript",
          message: "Do you want to use TypeScript?",
          default: true,
        },
        {
          type: "confirm",
          name: "useZod",
          message: "Do you want to use Zod for schema validation?",
          default: true,
        },
        {
          type: "confirm",
          name: "useTanstack",
          message: "Do you want to use TanStack Query for data fetching?",
          default: true,
        },
        {
          type: "confirm",
          name: "useTailwind",
          message: "Do you want to use Tailwind CSS?",
          default: true,
        },
      ]);

    // Additional options for Next.js template
    let apiRoutes = false;
    let useHono = false;

    if (templateType === "nextjs") {
      const nextjsOptions = await inquirer.prompt([
        {
          type: "confirm",
          name: "useApiRoutes",
          message: "Do you want to include API routes?",
          default: true,
        },
      ]);

      apiRoutes = nextjsOptions.useApiRoutes;

      if (apiRoutes) {
        const honoOptions = await inquirer.prompt([
          {
            type: "confirm",
            name: "useHono",
            message: "Do you want to use Hono in Next.js API routes?",
            default: false,
          },
        ]);

        useHono = honoOptions.useHono;
      }
    }

    // Bot configuration
    const { botName } = await inquirer.prompt([
      {
        type: "input",
        name: "botName",
        message: "What is your Telegram bot username? (without @)",
        default: "mybot",
      },
    ]);

    // Start creating the project
    console.log(chalk.green("\nCreating your Telegram Web App project...\n"));

    // Create a loading spinner
    const spinner = ora("Setting up your project...").start();

    try {
      // For Hono setup, we'll use Hono's CLI to create the base project
      if (useHono) {
        spinner.text = "Creating Hono project with Next.js...";

        try {
          // Create Hono project with Next.js
          await execa(packageManager, ["create", "hono", projectDirectory], {
            stdio: "ignore",
          });

          // Navigate to the project directory for the next commands
          process.chdir(projectPath);

          // Choose Next.js template
          spinner.text = "Selecting Next.js template...";
          await execa("echo", ["1"], { stdio: ["pipe", "pipe", "pipe"] });

          // Choose package manager
          spinner.text = `Selecting ${packageManager}...`;
          const pmOption =
            packageManager === "pnpm"
              ? "1"
              : packageManager === "bun"
              ? "3"
              : "2";
          await execa("echo", [pmOption], { stdio: ["pipe", "pipe", "pipe"] });

          spinner.succeed("Hono project created successfully!");
          spinner.start("Integrating Telegram Web App template...");
        } catch (error) {
          spinner.fail("Failed to create Hono project");
          console.error(chalk.red(`Error: ${error.message}`));
          process.exit(1);
        }
      } else {
        // Create the project directory for non-Hono setups
        await fs.ensureDir(projectPath);
      }

      // Determine which template to use
      const templateName =
        templateType === "nextjs" ? "template-twa" : "template-twa-vite";

      // Get the source template path
      let templatePath = path.join(templatesDir, templateName);

      // Check if template exists in the templates directory
      if (!fs.existsSync(templatePath)) {
        // If template doesn't exist, try to use the template from the parent directory
        templatePath = path.join(__dirname, "..", "..", templateName);

        // Check if template exists in parent directory
        if (!fs.existsSync(templatePath)) {
          // If the template doesn't exist locally, attempt to download it from GitHub
          spinner.text =
            "Template not found locally. Downloading from GitHub...";

          try {
            const tempDir = path.join(__dirname, "..", "temp");
            await fs.ensureDir(tempDir);

            // Create temp directory to clone the repo
            await execa(
              "git",
              [
                "clone",
                "--depth",
                "1",
                "https://github.com/voyagebagage/twa-template.git",
                tempDir,
              ],
              { stdio: "ignore" }
            );

            // Check if template exists in the cloned repo
            const clonedTemplatePath = path.join(tempDir, templateName);
            if (!fs.existsSync(clonedTemplatePath)) {
              spinner.fail(`Template "${templateName}" not found.`);
              process.exit(1);
            }

            // Use the cloned template
            templatePath = clonedTemplatePath;

            spinner.text = "Copying template files...";
          } catch (error) {
            spinner.fail(`Failed to download template: ${error.message}`);
            process.exit(1);
          }
        }
      }

      // If we're using Hono, merge the TWA template with the Hono project
      // Otherwise, just copy the template files to the project directory
      if (useHono) {
        // Copy specific directories and files from the template to the Hono project
        // We'll want to be selective to not overwrite Hono's setup
        spinner.text = "Merging TWA template with Hono...";

        // Copy TWA components and styles
        if (fs.existsSync(path.join(templatePath, "src", "components"))) {
          await fs.copy(
            path.join(templatePath, "src", "components"),
            path.join(projectPath, "src", "components")
          );
        }

        if (fs.existsSync(path.join(templatePath, "src", "hooks"))) {
          await fs.copy(
            path.join(templatePath, "src", "hooks"),
            path.join(projectPath, "src", "hooks")
          );
        }

        if (fs.existsSync(path.join(templatePath, "src", "lib"))) {
          await fs.copy(
            path.join(templatePath, "src", "lib"),
            path.join(projectPath, "src", "lib")
          );
        }

        if (fs.existsSync(path.join(templatePath, "src", "stores"))) {
          await fs.copy(
            path.join(templatePath, "src", "stores"),
            path.join(projectPath, "src", "stores")
          );
        }

        if (
          useZod &&
          fs.existsSync(path.join(templatePath, "src", "schemas"))
        ) {
          await fs.copy(
            path.join(templatePath, "src", "schemas"),
            path.join(projectPath, "src", "schemas")
          );
        }

        // Copy styles
        if (
          fs.existsSync(path.join(templatePath, "src", "app", "globals.css"))
        ) {
          await fs.copy(
            path.join(templatePath, "src", "app", "globals.css"),
            path.join(projectPath, "src", "app", "globals.css")
          );
        }

        // Copy environment files
        if (fs.existsSync(path.join(templatePath, ".env.example"))) {
          await fs.copy(
            path.join(templatePath, ".env.example"),
            path.join(projectPath, ".env.example")
          );

          // Create .env file from .env.example
          let envContent = await fs.readFile(
            path.join(projectPath, ".env.example"),
            "utf8"
          );
          envContent = envContent.replace(
            /NEXT_PUBLIC_TELEGRAM_BOT_NAME=.*/,
            `NEXT_PUBLIC_TELEGRAM_BOT_NAME=${botName}`
          );
          await fs.writeFile(path.join(projectPath, ".env"), envContent);
        }

        // Create a hello API route using Hono
        const apiDir = path.join(projectPath, "src", "app", "api");
        await fs.ensureDir(apiDir);

        // Create hello route for Hono
        const helloApiDir = path.join(apiDir, "hello");
        await fs.ensureDir(helloApiDir);

        // Create route.ts file for Hono API
        await fs.writeFile(
          path.join(helloApiDir, "route.ts"),
          `import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/hello')

app.get('/', (c) => {
  return c.json({ message: 'Hello from Hono!' })
})

export const GET = handle(app)`
        );

        // Create or update home page to use the API
        const homePage = path.join(projectPath, "src", "app", "page.tsx");
        if (fs.existsSync(homePage)) {
          await fs.writeFile(
            homePage,
            `export default async function Home() {
  const res = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL}/api/hello\`);
  const { message } = await res.json();

  if (!message) return <p>Loading...</p>;

  return <p>{message}</p>;
}`
          );
        }

        // Copy README and other docs
        if (fs.existsSync(path.join(templatePath, "README.md"))) {
          await fs.copy(
            path.join(templatePath, "README.md"),
            path.join(projectPath, "README.md")
          );
        }

        // Update the project's package.json to include TWA dependencies
        const packageJsonPath = path.join(projectPath, "package.json");
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = await fs.readJson(packageJsonPath);

          // Add TWA dependencies
          packageJson.dependencies = {
            ...packageJson.dependencies,
            "@twa-dev/sdk": "^8.0.2",
            "@twa-dev/types": "^8.0.2",
            zustand: "^5.0.3",
          };

          // Update project name
          packageJson.name = projectDirectory.toLowerCase();

          await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
        }

        // Update dependencies to latest versions
        spinner.text = "Updating dependencies to latest versions...";
        try {
          if (packageManager === "pnpm") {
            await execa("pnpm", ["up", "--latest"], { stdio: "ignore" });
          } else if (packageManager === "bun") {
            await execa("bun", ["update"], { stdio: "ignore" });
          }
        } catch (error) {
          spinner.warn(`Failed to update dependencies: ${error.message}`);
        }
      } else {
        // Standard template copy for non-Hono projects
        spinner.text = "Copying template files...";
        await fs.copy(templatePath, projectPath);

        // Update package.json with project name
        const packageJsonPath = path.join(projectPath, "package.json");
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = await fs.readJson(packageJsonPath);
          packageJson.name = projectDirectory.toLowerCase();
          await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
        }

        // Update .env file with bot name
        const envPath = path.join(projectPath, ".env.example");
        if (fs.existsSync(envPath)) {
          let envContent = await fs.readFile(envPath, "utf8");
          if (templateType === "nextjs") {
            envContent = envContent.replace(
              /NEXT_PUBLIC_TELEGRAM_BOT_NAME=.*/,
              `NEXT_PUBLIC_TELEGRAM_BOT_NAME=${botName}`
            );
          } else {
            envContent = envContent.replace(
              /VITE_TELEGRAM_BOT_NAME=.*/,
              `VITE_TELEGRAM_BOT_NAME=${botName}`
            );
          }
          await fs.writeFile(path.join(projectPath, ".env"), envContent);
        }

        // Cleanup unnecessary files based on configuration
        if (!useZod) {
          const schemasPath = path.join(projectPath, "src", "schemas");
          if (fs.existsSync(schemasPath)) {
            await fs.remove(schemasPath);
          }
        }

        if (!useTanstack) {
          const queryProviderPath = path.join(
            projectPath,
            "src",
            "components",
            "providers",
            "query-provider.tsx"
          );
          if (fs.existsSync(queryProviderPath)) {
            await fs.remove(queryProviderPath);
          }
        }

        // Handle API routes for Next.js template
        if (!apiRoutes && templateType === "nextjs") {
          const apiPath = path.join(projectPath, "src", "app", "api");
          if (fs.existsSync(apiPath)) {
            await fs.remove(apiPath);
          }

          // Update the next.config.mjs to disable API routes
          const nextConfigPath = path.join(projectPath, "next.config.mjs");
          if (fs.existsSync(nextConfigPath)) {
            let configContent = await fs.readFile(nextConfigPath, "utf8");

            // Add a comment indicating API routes are disabled
            configContent = configContent.replace(
              "const nextConfig = {",
              "// API routes are disabled based on user configuration\nconst nextConfig = {"
            );

            await fs.writeFile(nextConfigPath, configContent);
          }
        }

        // If using Next.js with API routes (but not Hono), update the home page to use the API
        if (apiRoutes && templateType === "nextjs" && !useHono) {
          const homePage = path.join(projectPath, "src", "app", "page.tsx");
          if (fs.existsSync(homePage)) {
            await fs.writeFile(
              homePage,
              `export default async function Home() {
  const res = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL}/api/hello\`);
  const { message } = await res.json();

  if (!message) return <p>Loading...</p>;

  return <p>{message}</p>;
}`
            );

            // Ensure there's a hello API route
            const apiDir = path.join(projectPath, "src", "app", "api", "hello");
            await fs.ensureDir(apiDir);

            // Create route.ts file
            await fs.writeFile(
              path.join(apiDir, "route.ts"),
              `import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello from Next.js API Route!" });
}`
            );
          }
        }

        // Update dependencies to latest versions using the selected package manager
        spinner.text = "Updating dependencies to latest versions...";
        try {
          if (packageManager === "pnpm") {
            await execa("pnpm", ["up", "--latest"], {
              cwd: projectPath,
              stdio: "ignore",
            });
          } else if (packageManager === "bun") {
            await execa("bun", ["update"], {
              cwd: projectPath,
              stdio: "ignore",
            });
          }
        } catch (error) {
          spinner.warn(`Failed to update dependencies: ${error.message}`);
        }
      }

      spinner.succeed("Project setup completed successfully!");

      // Final instructions
      console.log(
        chalk.green(
          "\n✅ Your Telegram Web App project has been created successfully!"
        )
      );
      console.log("\nNext steps:");
      console.log(`1. ${chalk.cyan(`cd ${projectDirectory}`)}`);

      if (!useHono) {
        // Skip this for Hono projects as they should already have dependencies installed
        console.log(`2. ${chalk.cyan(`${packageManager} install`)}`);
      }

      console.log(
        `3. ${chalk.cyan(
          `${packageManager} dev`
        )} to start the development server`
      );
      console.log(
        `4. ${chalk.cyan(
          `${packageManager} dev:tunnel`
        )} to expose your local server for testing with Telegram\n`
      );

      console.log(chalk.blue("Happy coding! 🚀"));
    } catch (error) {
      spinner.fail("Failed to create project.");
      console.error(chalk.red(`\nError: ${error.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
