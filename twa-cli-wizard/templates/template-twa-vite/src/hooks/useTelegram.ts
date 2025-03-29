import { useState, useEffect, useCallback } from "react";

// Mock Telegram WebApp for development
const mockTelegram = {
  WebApp: {
    initData: "mock_init_data",
    initDataUnsafe: {
      query_id: "mock_query_id",
      user: {
        id: 123456789,
        first_name: "Mock",
        last_name: "User",
        username: "mockuser",
        language_code: "en",
      },
      auth_date: Math.floor(Date.now() / 1000),
      hash: "mock_hash",
    },
    version: "6.0",
    platform: "web",
    colorScheme: "dark",
    themeParams: {
      bg_color: "#030d17",
      text_color: "#ffffff",
      hint_color: "#7d7d7d",
      link_color: "#0080FF",
      button_color: "#0080FF",
      button_text_color: "#ffffff",
    },
    isExpanded: false,
    viewportHeight: 600,
    viewportStableHeight: 600,
    headerColor: "#030d17",
    backgroundColor: "#030d17",
    isClosingConfirmationEnabled: false,
    BackButton: {
      isVisible: false,
      onClick: () => {},
      offClick: () => {},
      show: () => {},
      hide: () => {},
    },
    MainButton: {
      text: "CONTINUE",
      color: "#0080FF",
      textColor: "#ffffff",
      isVisible: false,
      isActive: true,
      isProgressVisible: false,
      setText: () => {},
      onClick: () => {},
      offClick: () => {},
      show: () => {},
      hide: () => {},
      enable: () => {},
      disable: () => {},
      showProgress: () => {},
      hideProgress: () => {},
      setParams: () => {},
    },
    HapticFeedback: {
      impactOccurred: () => {},
      notificationOccurred: () => {},
      selectionChanged: () => {},
    },
    isVersionAtLeast: () => true,
    setHeaderColor: () => {},
    setBackgroundColor: () => {},
    enableClosingConfirmation: () => {},
    disableClosingConfirmation: () => {},
    onEvent: () => {},
    offEvent: () => {},
    sendData: () => {},
    openLink: () => {},
    openTelegramLink: () => {},
    openInvoice: () => {},
    showPopup: () => {},
    showAlert: () => {},
    showConfirm: () => {},
    ready: () => {},
    expand: () => {},
    close: () => {},
  },
};

// Check if the code is running on the client side
const isClient = typeof window !== "undefined";

// Check if we should mock Telegram in development
const shouldMockTelegram = () => {
  if (!isClient) return false;
  return import.meta.env.DEV && import.meta.env.VITE_MOCK_TELEGRAM === "true";
};

/**
 * Hook to interact with the Telegram WebApp
 */
export function useTelegram() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Get the Telegram WebApp object
   */
  const getTelegramWebApp = useCallback(() => {
    if (!isClient) return null;

    // Mocking for development
    if (shouldMockTelegram()) {
      window.Telegram = { WebApp: mockTelegram.WebApp };
      setIsMock(true);
      return window.Telegram.WebApp;
    }

    // Real Telegram WebApp
    if (window.Telegram?.WebApp) {
      setIsMock(false);
      return window.Telegram.WebApp;
    }

    // Not available
    return null;
  }, []);

  /**
   * Initialize the Telegram WebApp
   */
  const initialize = useCallback(() => {
    try {
      const telegramWebApp = getTelegramWebApp();

      if (!telegramWebApp) {
        throw new Error("Telegram WebApp is not available");
      }

      // Hook into isExpanded changes
      const handleViewportChanged = () => {
        setIsExpanded(telegramWebApp.isExpanded);
      };

      telegramWebApp.onEvent("viewportChanged", handleViewportChanged);

      // Initialize the app
      telegramWebApp.ready();
      setIsInitialized(true);
      setIsReady(true);
      setIsExpanded(telegramWebApp.isExpanded);

      return () => {
        telegramWebApp.offEvent("viewportChanged", handleViewportChanged);
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      console.error("Telegram initialization error:", err);
      return undefined;
    }
  }, [getTelegramWebApp]);

  // Initialize on mount
  useEffect(() => {
    if (!isInitialized) {
      const cleanup = initialize();
      return cleanup;
    }
  }, [initialize, isInitialized]);

  // Get the current WebApp object
  const tg = isClient ? window.Telegram?.WebApp : null;

  return {
    tg,
    isInitialized,
    isReady,
    isExpanded,
    isMock,
    error,
    expand: useCallback(() => tg?.expand(), [tg]),
    close: useCallback(() => tg?.close(), [tg]),
  };
}
