"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/theme/themeStore";
import { buttonAnimations } from "@/lib/animations";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, toggleTheme, initializeTheme, isInitialized } = useThemeStore();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Don't render until initialized to prevent hydration mismatch
  if (!isInitialized) {
    return null;
  }

  const isDark = theme === 'dark';

  // Button hover animations
  const handleButtonHover = () => {
    if (buttonRef.current) {
      buttonAnimations.hover(buttonRef.current);
    }
  };

  const handleButtonLeave = () => {
    if (buttonRef.current) {
      buttonAnimations.leave(buttonRef.current);
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <Button
        ref={buttonRef}
        variant="outline"
        className="min-w-[80px] h-10 p-0 rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-accent/30 group theme-transition shadow-sm hover:shadow-md transition-all duration-200"
        onClick={handleThemeToggle}
        onMouseEnter={handleButtonHover}
        onMouseLeave={handleButtonLeave}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-yellow-500 dark:text-yellow-400 group-hover:text-yellow-400 transition-all duration-200 group-hover:rotate-180" />
        ) : (
          <Moon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all duration-200 group-hover:rotate-12" />
        )}
      </Button>
  );
}