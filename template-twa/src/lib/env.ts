/**
 * Environment variables and configuration settings
 */

export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development";
export const isTest = process.env.NODE_ENV === "test";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3445";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const TELEGRAM_BOT_NAME =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "";
export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";

export const MOCK_TELEGRAM_IN_DEV =
  process.env.NEXT_PUBLIC_MOCK_TELEGRAM === "true";
