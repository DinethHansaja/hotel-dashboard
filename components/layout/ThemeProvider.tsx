"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type ThemePreference = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  reduceMotion: boolean;
  setReduceMotion: (enabled: boolean) => void;
  resetPreferences: () => void;
};

const THEME_KEY = "colombo-guide-theme";
const MOTION_KEY = "colombo-guide-reduce-motion";

const ThemeContext = createContext<ThemeContextValue | null>(null);
const subscribers = new Set<() => void>();

function subscribeToPreferences(callback: () => void) {
  subscribers.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    subscribers.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function notifyPreferenceChange() {
  subscribers.forEach((callback) => callback());
}

function getThemeSnapshot(): ThemePreference {
  const storedTheme = localStorage.getItem(THEME_KEY);
  return storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
    ? storedTheme
    : "system";
}

function getMotionSnapshot() {
  return localStorage.getItem(MOTION_KEY) === "true";
}

function applyTheme(theme: ThemePreference) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolvedTheme = theme === "system" ? (prefersDark ? "dark" : "light") : theme;

  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.style.colorScheme = resolvedTheme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToPreferences,
    getThemeSnapshot,
    (): ThemePreference => "system"
  );
  const reduceMotion = useSyncExternalStore(
    subscribeToPreferences,
    getMotionSnapshot,
    () => false
  );

  useEffect(() => {
    applyTheme(theme);

    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handlePreferenceChange = () => applyTheme("system");
    mediaQuery.addEventListener("change", handlePreferenceChange);

    return () => mediaQuery.removeEventListener("change", handlePreferenceChange);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(reduceMotion);
  }, [reduceMotion]);

  const setTheme = useCallback((nextTheme: ThemePreference) => {
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
    notifyPreferenceChange();
  }, []);

  const setReduceMotion = useCallback((enabled: boolean) => {
    localStorage.setItem(MOTION_KEY, String(enabled));
    document.documentElement.dataset.reduceMotion = String(enabled);
    notifyPreferenceChange();
  }, []);

  const resetPreferences = useCallback(() => {
    localStorage.removeItem(THEME_KEY);
    localStorage.removeItem(MOTION_KEY);
    document.documentElement.dataset.reduceMotion = "false";
    applyTheme("system");
    notifyPreferenceChange();
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, reduceMotion, setReduceMotion, resetPreferences }),
    [theme, setTheme, reduceMotion, setReduceMotion, resetPreferences]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemePreferences() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemePreferences must be used within ThemeProvider");
  }
  return context;
}
