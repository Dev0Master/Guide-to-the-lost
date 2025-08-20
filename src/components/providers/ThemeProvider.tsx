"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme/themeStore";
import { useLanguageStore } from "@/store/language/languageStore";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, initializeTheme } = useThemeStore();
  const { currentLanguage, direction, initializeLanguage } = useLanguageStore();

  useEffect(() => {
    initializeTheme();
    initializeLanguage();
  }, [initializeTheme, initializeLanguage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Apply theme class to html element
      document.documentElement.classList.toggle('dark', theme === 'dark');
      
      // Apply language and direction to html element
      document.documentElement.lang = currentLanguage;
      document.documentElement.dir = direction;
    }
  }, [theme, currentLanguage, direction]);

  return <>{children}</>;
}