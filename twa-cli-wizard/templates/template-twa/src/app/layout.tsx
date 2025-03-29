import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";

/**
 * Font configurations
 */
const geistSans = GeistSans;
const geistMono = GeistMono;

/**
 * Viewport configuration for mobile
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

/**
 * Metadata configuration
 */
export const metadata: Metadata = {
  title: "Telegram Web App",
  description: "Telegram Web App Template",
  applicationName: "TWA Template",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  themeColor: "#030d17",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TWA Template",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

/**
 * Root layout component (Server Component)
 * Handles:
 * - HTML structure
 * - Font loading
 * - Theme setup
 * - Client-side layout wrapper
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontClassName = `dark ${geistSans.variable} ${geistMono.variable}`;

  return (
    <html lang="en" className={fontClassName} suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#030d17" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta content="true" name="HandheldFriendly" />
        <meta content="width" name="MobileOptimized" />
      </head>
      <body
        suppressHydrationWarning
        className="font-sans antialiased bg-app-background-primary">
        <AppLayout>{children}</AppLayout>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
