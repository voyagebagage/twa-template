import { create } from "zustand";
import { persist } from "zustand/middleware";

// Interface for the app state
interface AppState {
  isDarkMode: boolean;
  lastVisitedTab: string;

  // Actions
  setDarkMode: (isDarkMode: boolean) => void;
  setLastVisitedTab: (tab: string) => void;
}

// Create store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      isDarkMode: true,
      lastVisitedTab: "/",

      // Actions
      setDarkMode: (isDarkMode) => set({ isDarkMode }),
      setLastVisitedTab: (lastVisitedTab) => set({ lastVisitedTab }),
    }),
    {
      name: "app-storage", // name of the item in storage
      // Only persist the specified fields
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        lastVisitedTab: state.lastVisitedTab,
      }),
    }
  )
);
