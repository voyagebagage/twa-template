// Script to create a tunnel for Telegram WebApp development
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, "../.env");
    const envExists = fs.existsSync(envPath);

    if (!envExists) {
      console.log("No .env file found, using default values");
      return { PORT: 3445, HOST: "localhost" };
    }

    const envFile = fs.readFileSync(envPath, "utf8");
    const env = {};

    envFile.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) {
        env[key.trim()] = value.trim();
      }
    });

    return env;
  } catch (error) {
    console.error("Error loading .env file:", error.message);
    return { PORT: 3445, HOST: "localhost" };
  }
}

// Message styling
const cyan = (text) => `\x1b[36m${text}\x1b[0m`;
const green = (text) => `\x1b[32m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;

console.log(yellow("🚀 Starting development tunnel..."));

// Load environment variables
const env = loadEnv();
const PORT = env.PORT || 3445;
const HOST = env.HOST || "localhost";

// Start the tunnel
try {
  // Use cloudflared for tunneling
  const cloudflared = spawn("cloudflared", [
    "tunnel",
    "--url",
    `http://${HOST}:${PORT}`,
  ]);

  let tunnelUrl = "";

  cloudflared.stdout.on("data", (data) => {
    const output = data.toString();
    console.log(output);

    // Extract tunnel URL from the output
    const match = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (match && !tunnelUrl) {
      tunnelUrl = match[0];
      console.log(green(`✅ Tunnel established at: ${tunnelUrl}`));
      console.log(cyan("ℹ️  Use this URL in your Telegram Bot settings"));
      console.log(cyan("ℹ️  Press Ctrl+C to stop the tunnel"));
    }
  });

  cloudflared.stderr.on("data", (data) => {
    console.error(`❌ ${data.toString()}`);
  });

  cloudflared.on("close", (code) => {
    if (code !== 0) {
      console.log(yellow(`Child process exited with code ${code}`));
    }
  });

  // Handle process termination
  process.on("SIGINT", () => {
    console.log(yellow("\n⏹️  Stopping tunnel..."));
    cloudflared.kill();
    process.exit(0);
  });
} catch (error) {
  console.error(`❌ Failed to start tunnel: ${error.message}`);

  // Suggest installation if cloudflared is not found
  console.log(yellow("\n📌 Cloudflared not found. Install it with:"));
  console.log(cyan("brew install cloudflared"));
  console.log(cyan("npm install -g cloudflared"));
  console.log(
    yellow(
      "\nOr download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation"
    )
  );

  process.exit(1);
}
