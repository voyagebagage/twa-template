#!/usr/bin/env node

import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import chalk from "chalk";
import inquirer from "inquirer";
import { program } from "commander";
import ora from "ora";
import { execSync } from "child_process";

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

// Detect if Bun is available
const isBunAvailable = () => {
  try {
    execSync("bun --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
};

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

    // Ask for package manager
    const bunAvailable = isBunAvailable();
    const defaultPackageManager = bunAvailable ? "bun" : "pnpm";

    const { packageManager } = await inquirer.prompt([
      {
        type: "list",
        name: "packageManager",
        message: "Which package manager would you like to use?",
        choices: [
          { name: "pnpm", value: "pnpm" },
          {
            name: "bun",
            value: "bun",
            disabled: !bunAvailable && "Bun is not installed",
          },
          { name: "npm", value: "npm" },
        ],
        default: defaultPackageManager,
      },
    ]);

    // Create the project directory
    await fs.ensureDir(projectPath);

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
      const { useApiRoutes } = await inquirer.prompt([
        {
          type: "confirm",
          name: "useApiRoutes",
          message: "Do you want to include API routes?",
          default: true,
        },
      ]);
      apiRoutes = useApiRoutes;

      if (apiRoutes) {
        const { withHono } = await inquirer.prompt([
          {
            type: "confirm",
            name: "withHono",
            message: "Do you want to use Hono in Next.js API routes?",
            default: false,
          },
        ]);
        useHono = withHono;
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

    // Handle Hono integration if needed
    if (useHono) {
      const spinner = ora("Setting up Hono for Next.js API routes...").start();

      try {
        // Create a temporary directory for Hono setup
        const tempHonoDir = path.join(__dirname, "..", "temp", "hono-setup");
        await fs.ensureDir(tempHonoDir);

        // Run Hono CLI to generate a Next.js app with Hono
        const honoCreateCmd = `${packageManager}${
          packageManager === "npm" ? " exec " : " "
        }create-hono@latest ${projectDirectory} --template nextjs`;

        spinner.text = `Running: ${honoCreateCmd}`;
        execSync(honoCreateCmd, {
          stdio: "ignore",
          cwd: process.cwd(),
        });

        spinner.succeed("Hono for Next.js API routes set up successfully.");

        // Continue with TWA template integration
        spinner.text = "Integrating Telegram Web App template...";
        spinner.start();

        // Get source template path
        let templatePath = path.join(templatesDir, "template-twa");

        // Check if template exists locally
        if (!fs.existsSync(templatePath)) {
          templatePath = path.join(__dirname, "..", "..", "template-twa");

          if (!fs.existsSync(templatePath)) {
            // Download from GitHub
            spinner.text =
              "Template not found locally. Downloading from GitHub...";

            try {
              const tempDir = path.join(__dirname, "..", "temp");
              await fs.ensureDir(tempDir);

              execSync(
                `git clone --depth 1 https://github.com/voyagebagage/twa-template.git ${tempDir}/repo`,
                { stdio: "ignore" }
              );

              const clonedTemplatePath = path.join(
                tempDir,
                "repo",
                "template-twa"
              );
              if (!fs.existsSync(clonedTemplatePath)) {
                spinner.fail(`Template "template-twa" not found.`);
                process.exit(1);
              }

              templatePath = clonedTemplatePath;
              spinner.text = "Integrating Telegram Web App template...";
            } catch (error) {
              spinner.fail(`Failed to download template: ${error.message}`);
              process.exit(1);
            }
          }
        }

        // Integrate TWA template with Hono project
        // Copy components, styles, hooks, but keep Hono's app structure
        const componentSrc = path.join(templatePath, "src", "components");
        const componentDest = path.join(projectPath, "components");
        await fs.copy(componentSrc, componentDest);

        // Copy hooks
        const hooksSrc = path.join(templatePath, "src", "hooks");
        const hooksDest = path.join(projectPath, "hooks");
        await fs.copy(hooksSrc, hooksDest);

        // Copy lib utilities
        const libSrc = path.join(templatePath, "src", "lib");
        const libDest = path.join(projectPath, "lib");
        await fs.copy(libSrc, libDest);

        // Copy schemas
        if (useZod) {
          const schemasSrc = path.join(templatePath, "src", "schemas");
          const schemasDest = path.join(projectPath, "schemas");
          await fs.copy(schemasSrc, schemasDest);
        }

        // Copy stores
        const storesSrc = path.join(templatePath, "src", "stores");
        const storesDest = path.join(projectPath, "stores");
        await fs.copy(storesSrc, storesDest);

        // Copy types
        const typesSrc = path.join(templatePath, "src", "types");
        const typesDest = path.join(projectPath, "types");
        await fs.copy(typesSrc, typesDest);

        // Update homepage to match the screenshot
        const appPagePath = path.join(projectPath, "app", "page.tsx");
        if (fs.existsSync(appPagePath)) {
          let pageContent = `
import { message } from '@/components/ui/message';

export default async function Home() {
  const res = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL}/api/hello\`);
  const { message } = await res.json();

  if (!message) return <p>Loading...</p>;

  return <p>{message}</p>;
}
`;
          await fs.writeFile(appPagePath, pageContent);
        }

        // Update package.json with bot name and dev:tunnel script
        const packageJsonPath = path.join(projectPath, "package.json");
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = await fs.readJson(packageJsonPath);
          packageJson.name = projectDirectory.toLowerCase();

          // Add dev:tunnel script
          if (!packageJson.scripts["dev:tunnel"]) {
            packageJson.scripts["dev:tunnel"] =
              "cross-env NEXT_PUBLIC_ENV=production ts-node scripts/dev-tunnel.ts";
          }

          await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
        }

        // Create .env file with bot name
        const envContent = `
# Application settings
PORT=3445
HOST=localhost

# Environment
NODE_ENV=development
NEXT_PUBLIC_ENV=development

# Telegram Bot
NEXT_PUBLIC_TELEGRAM_BOT_NAME=${botName}
TELEGRAM_BOT_TOKEN=

# Development settings
NEXT_PUBLIC_MOCK_TELEGRAM=true
NEXT_PUBLIC_API_URL=http://localhost:3000
`;
        await fs.writeFile(path.join(projectPath, ".env"), envContent);

        // Update dependencies
        spinner.text = `Updating dependencies with ${packageManager}...`;

        try {
          const updateCmd =
            packageManager === "bun"
              ? "bun update"
              : `${packageManager} update --latest`;
          execSync(updateCmd, {
            stdio: "ignore",
            cwd: projectPath,
          });

          spinner.succeed("Dependencies updated successfully.");
        } catch (error) {
          spinner.warn(`Failed to update dependencies: ${error.message}`);
        }

        spinner.succeed(
          "Telegram Web App template integrated with Hono successfully."
        );
      } catch (error) {
        spinner.fail(`Failed to set up Hono: ${error.message}`);
        console.error(chalk.red(`\nError: ${error.message}`));
        process.exit(1);
      }
    } else {
      // Regular template setup without Hono
      // Determine which template to use
      const templateName =
        templateType === "nextjs" ? "template-twa" : "template-twa-vite";

      // Create a loading spinner
      const spinner = ora("Copying template files...").start();

      try {
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
              execSync(
                `git clone --depth 1 https://github.com/voyagebagage/twa-template.git ${tempDir}`,
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

        // Copy template files to the project directory
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

            // Update API URL
            envContent = envContent.replace(
              /NEXT_PUBLIC_API_URL=.*/,
              `NEXT_PUBLIC_API_URL=http://localhost:3000`
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
          await fs.remove(path.join(projectPath, "src", "schemas"));
        }

        if (!useTanstack) {
          await fs.remove(
            path.join(
              projectPath,
              "src",
              "components",
              "providers",
              "query-provider.tsx"
            )
          );
        }

        // Handle API routes for Next.js template
        if (!apiRoutes && templateType === "nextjs") {
          await fs.remove(path.join(projectPath, "src", "app", "api"));

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
        } else if (apiRoutes && templateType === "nextjs") {
          // Update the home page to match the screenshot
          const homePagePath = path.join(projectPath, "src", "app", "page.tsx");
          if (fs.existsSync(homePagePath)) {
            let homeContent = await fs.readFile(homePagePath, "utf8");

            // Replace the content with the screenshot example
            const newHomeContent = `
export default async function Home() {
  const res = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL}/api/hello\`);
  const { message } = await res.json();

  if (!message) return <p>Loading...</p>;

  return <p>{message}</p>;
}
`;
            await fs.writeFile(homePagePath, newHomeContent);
          }
        }

        // Update dependencies to latest versions
        spinner.text = `Updating dependencies with ${packageManager}...`;

        try {
          const updateCmd =
            packageManager === "bun"
              ? "bun update"
              : `${packageManager} update --latest`;
          execSync(updateCmd, {
            stdio: "ignore",
            cwd: projectPath,
          });

          spinner.succeed("Dependencies updated successfully.");
        } catch (error) {
          spinner.warn(`Failed to update dependencies: ${error.message}`);
        }

        spinner.succeed("Template files copied successfully.");

        // Final instructions
        console.log(
          chalk.green(
            "\n✅ Your Telegram Web App project has been created successfully!"
          )
        );
        console.log("\nNext steps:");
        console.log(`1. ${chalk.cyan(`cd ${projectDirectory}`)}`);
        console.log(`2. ${chalk.cyan(`${packageManager} install`)}`);
        console.log(
          `3. ${chalk.cyan(
            `${packageManager} run dev`
          )} to start the development server`
        );
        console.log(
          `4. ${chalk.cyan(
            `${packageManager} run dev:tunnel`
          )} to expose your local server for testing with Telegram\n`
        );

        console.log(chalk.blue("Happy coding! 🚀"));
      } catch (error) {
        spinner.fail("Failed to create project.");
        console.error(chalk.red(`\nError: ${error.message}`));
        process.exit(1);
      }
    }
  });

program.parse(process.argv);
