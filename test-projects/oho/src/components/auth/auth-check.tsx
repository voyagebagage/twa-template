"use client";

import { useState, useEffect } from "react";
import { useDevMode } from "@/hooks/use-dev-mode";
import { useTelegram } from "@/hooks/use-telegram";
import { isDevelopment } from "@/lib/env";

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-app-background-primary">
      <div className="w-12 h-12 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
}

interface AuthCheckProps {
  children: React.ReactNode;
}

/**
 * Component that checks if user is authenticated with Telegram
 * Shows loading state during initialization
 */
export function AuthCheck({ children }: AuthCheckProps) {
  const { tg, isInitialized, isMock } = useTelegram();
  const { bypassAuth } = useDevMode();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're in development mode with bypass enabled
    if (isDevelopment && bypassAuth) {
      console.log("🔓 Development mode - bypassing auth check");
      setIsLoading(false);
      return;
    }

    // Continue with regular auth flow
    if (isInitialized || isMock) {
      // Simulate a minimum loading time for better UX
      const minLoadingTime = setTimeout(() => {
        setIsLoading(false);
      }, 800);

      return () => clearTimeout(minLoadingTime);
    }
  }, [isInitialized, isMock, bypassAuth]);

  // If still loading, show loading spinner
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // In production, if no Telegram WebApp is available, show error
  if (!isDevelopment && !tg && !isMock) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 bg-app-background-primary">
        <div className="p-6 bg-red-900/20 rounded-lg border border-red-800 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-500 mb-4">
            Not available outside Telegram
          </h2>
          <p className="text-white mb-4">
            This app must be opened from a Telegram chat.
          </p>
        </div>
      </div>
    );
  }

  // If authenticated or in dev mode with bypass, render children
  return <>{children}</>;
}
