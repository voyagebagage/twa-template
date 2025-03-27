import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS utility classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check if the code is running on the server side
 */
export const isServer = typeof window === "undefined";

/**
 * Check if the code is running on the client side
 */
export const isClient = !isServer;

/**
 * Format a number with commas
 */
export function formatNumber(number: number): string {
  return new Intl.NumberFormat().format(number);
}

/**
 * Format a number with a specific precision
 */
export function formatNumberWithPrecision(
  number: number,
  precision: number = 2
): string {
  return number.toFixed(precision);
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Get query parameters from a URL
 */
export function getQueryParams(url: string): Record<string, string> {
  const params = new URLSearchParams(url.split("?")[1]);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

/**
 * Delay execution for a specified amount of time
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if the app is running in Telegram WebApp environment
 */
export function isTelegramWebApp(): boolean {
  if (isServer) return false;
  return !!window.Telegram?.WebApp;
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Check if the platform is iOS
 */
export function isIOS(): boolean {
  if (isServer) return false;
  const platform = window.Telegram?.WebApp?.platform || navigator.userAgent;
  return /iPhone|iPad|iPod|iOS/i.test(platform);
}

/**
 * Check if the platform is Android
 */
export function isAndroid(): boolean {
  if (isServer) return false;
  const platform = window.Telegram?.WebApp?.platform || navigator.userAgent;
  return /Android/i.test(platform);
}
