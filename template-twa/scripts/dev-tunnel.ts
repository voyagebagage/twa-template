// Script to create a tunnel for Telegram WebApp development
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { spawn } from "child_process";

// Load environment variables
dotenv.config();
const PORT = parseInt(process.env.PORT || "3445");
const HOST = process.env.HOST || "localhost";

// Message styling
const cyan = (text: string) => `\x1b[36m${text}\x1b[0m`;
const green = (text: string) => `\x1b[32m${text}\x1b[0m`;
const yellow = (text: string) => `\x1b[33m${text}\x1b[0m`;

console.log(yellow("🚀 Starting development tunnel..."));

// Start the tunnel
try {
  // Create a tunnel to expose localhost to the internet
  const subdomain = "twa-" + Math.random().toString(36).substring(2, 10);

  // Use cloudflared service
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
  console.error(
    `❌ Failed to start tunnel: ${
      error instanceof Error ? error.message : String(error)
    }`
  );

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
