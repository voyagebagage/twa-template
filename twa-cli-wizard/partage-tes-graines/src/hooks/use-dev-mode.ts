"use client";

import { useState, useEffect } from "react";
import { isClient } from "@/lib/utils";
import { isDevelopment } from "@/lib/env";

interface DevModeState {
  isDevMode: boolean;
  bypassAuth: boolean;
  toggleBypassAuth: () => void;
}

/**
 * Hook to manage development mode settings
 */
export function useDevMode(): DevModeState {
  const [isDevMode, setIsDevMode] = useState(isDevelopment);
  const [bypassAuth, setBypassAuth] = useState(false);

  // Load state from localStorage on mount (client-side only)
  useEffect(() => {
    if (isClient && isDevelopment) {
      try {
        const storedBypassAuth = localStorage.getItem("dev_bypass_auth");
        if (storedBypassAuth) {
          setBypassAuth(storedBypassAuth === "true");
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }
  }, []);

  // Toggle bypass auth function
  const toggleBypassAuth = () => {
    if (isClient && isDevelopment) {
      const newValue = !bypassAuth;
      setBypassAuth(newValue);
      try {
        localStorage.setItem("dev_bypass_auth", String(newValue));
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }
  };

  return {
    isDevMode,
    bypassAuth,
    toggleBypassAuth,
  };
}
