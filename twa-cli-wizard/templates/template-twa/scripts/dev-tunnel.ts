// Deno script to create a tunnel for Telegram WebApp development
import { serve } from "https://deno.land/std@0.198.0/http/server.ts";
import { load } from "https://deno.land/std@0.198.0/dotenv/mod.ts";

// Load environment variables
const env = await load();
const PORT = parseInt(env["PORT"] || "3445");
const HOST = env["HOST"] || "localhost";

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
  const process = Deno.run({
    cmd: ["cloudflared", "tunnel", "--url", `http://${HOST}:${PORT}`],
    stdout: "piped",
    stderr: "piped",
  });

  // Read and process the output to extract the public URL
  const decoder = new TextDecoder();
  const buffer = new Uint8Array(1024);

  let tunnelUrl = "";

  while (true) {
    const { nread } = await process.stdout.read(buffer);
    if (nread === null) break;

    const chunk = decoder.decode(buffer.subarray(0, nread));
    console.log(chunk);

    // Extract tunnel URL from the output
    const match = chunk.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (match && !tunnelUrl) {
      tunnelUrl = match[0];
      console.log(green(`✅ Tunnel established at: ${tunnelUrl}`));
      console.log(cyan("ℹ️  Use this URL in your Telegram Bot settings"));
      console.log(cyan("ℹ️  Press Ctrl+C to stop the tunnel"));
    }
  }

  // Handle errors
  const { code } = await process.status();
  if (code !== 0) {
    const errorOutput = decoder.decode(await process.stderrOutput());
    console.error(`❌ Tunnel process exited with code ${code}: ${errorOutput}`);
  }

  process.close();
} catch (error) {
  console.error(`❌ Failed to start tunnel: ${error.message}`);

  // If cloudflared is not available, suggest installation
  if (error.name === "NotFound") {
    console.log(yellow("\n📌 Cloudflared not found. Install it with:"));
    console.log(cyan("brew install cloudflared"));
    console.log(cyan("npm install -g cloudflared"));
    console.log(
      yellow(
        "\nOr download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation"
      )
    );
  }

  Deno.exit(1);
}
