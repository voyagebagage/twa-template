#!/usr/bin/env node

import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import chalk from "chalk";
import inquirer from "inquirer";
import { program } from "commander";
import ora from "ora";

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
            const { execSync } = await import("child_process");

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
      console.log(`2. ${chalk.cyan("pnpm install")} (or npm install)`);
      console.log(
        `3. ${chalk.cyan("pnpm dev")} to start the development server`
      );
      console.log(
        `4. ${chalk.cyan(
          "pnpm dev:tunnel"
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
