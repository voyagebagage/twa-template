"use client";

import { useEffect, useCallback } from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import I18nProvider from "@/components/providers/i18n-provider";
import { AuthCheck } from "@/components/auth/auth-check";
import TabBar from "@/components/layout/tab-bar";
import { isProduction } from "@/lib/env";
import { ErrorBoundary } from "../error-boundaries";
import { useDevMode } from "@/hooks/use-dev-mode";
import { useTelegram } from "@/hooks/use-telegram";
import { Header } from "@/components/header";
import { PhoneContainer } from "./phone-container";

/**
 * Main app content wrapper that includes the layout structure
 * Uses AuthCheck for authentication flow
 */
function AppContent({ children }: { children: React.ReactNode }) {
  const { tg, isMock, isInitialized, isExpanded } = useTelegram();
  const { bypassAuth } = useDevMode();
  // Check if platform is iOS
  const isIOS = tg?.platform?.includes("ios");
  const paddingTop = isIOS ? "pt-[95px]" : "pt-[65px]";

  // Initialize the app state - only run once
  const initializeApp = useCallback(async () => {
    try {
      // In development mode on localhost, we skip the normal initialization
      if (bypassAuth) {
        console.log(
          "[LAYOUT] 🔓 Development mode - bypassing Telegram initialization"
        );
        return;
      }

      // Log Telegram WebApp state
      console.log("[LAYOUT] 📱 Telegram WebApp initializing:", {
        exists: !!tg,
        isInitialized,
        isExpanded,
        platform: tg?.platform || "unknown",
      });
    } catch (error) {
      console.error("[LAYOUT] ❌ Initialization error:", error);
    }
  }, [bypassAuth, tg, isInitialized, isExpanded]);

  // Run initialization once
  useEffect(() => {
    console.log("[LAYOUT] 🚀 Starting app initialization");
    initializeApp();
  }, [initializeApp]);

  // Return the app content wrapped in AuthCheck
  return (
    <AuthCheck>
      <PhoneContainer fullWidth>
        <Header title="Telegram Web App" />
        <main className={`flex-1 w-full pb-16 ${paddingTop}`}>{children}</main>
        <TabBar />
      </PhoneContainer>
    </AuthCheck>
  );
}

/**
 * Client-side layout wrapper that handles provider initialization
 * Follows strict initialization order:
 * 1. I18n (for translations)
 * 2. Query (for data fetching)
 * 3. Auth (for user session)
 */
export function AppLayout({ children }: { children: React.ReactNode }) {
  console.log("[LAYOUT] 🔄 Environment initialized:", {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    isProduction,
  });

  return (
    <ErrorBoundary>
      <I18nProvider>
        <QueryProvider>
          <AppContent>{children}</AppContent>
        </QueryProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}
