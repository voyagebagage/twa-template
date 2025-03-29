// Basic smoke test to ensure the CLI can be required
// This will be expanded in the future

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const binPath = path.join(__dirname, "..", "bin", "index.js");

// Simple test to make sure the CLI entry point exists
if (!fs.existsSync(binPath)) {
  console.error("CLI entry point not found at:", binPath);
  process.exit(1);
}

console.log("✅ CLI entry point exists at:", binPath);

// Check package.json configuration
const packagePath = path.join(__dirname, "..", "package.json");
if (!fs.existsSync(packagePath)) {
  console.error("package.json not found at:", packagePath);
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
if (!packageJson.bin || !packageJson.bin["create-twa"]) {
  console.error("Missing bin configuration in package.json");
  process.exit(1);
}

console.log("✅ package.json bin configuration is valid");

// All tests passed
console.log("✅ All basic tests passed");
