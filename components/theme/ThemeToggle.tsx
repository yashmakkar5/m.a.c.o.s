"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({ showLabel = false, className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`h-9 w-9 rounded-full border border-white/10 bg-white/[0.04] ${className}`} />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative inline-flex items-center justify-center h-9 rounded-full border transition-all duration-200 active:scale-95 ${
        showLabel ? "px-3 gap-2" : "w-9"
      } ${
        isDark
          ? "border-white/10 bg-white/[0.04] text-[#d5d0dd] hover:bg-white/[0.08] hover:text-white hover:border-white/20"
          : "border-black/10 bg-black/[0.04] text-[#3a3347] hover:bg-black/[0.08] hover:text-[#15111e] hover:border-black/20 shadow-sm"
      } ${className}`}
    >
      <div className="relative h-4 w-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-300 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Moon className="h-4 w-4 text-indigo-600 transition-transform duration-300 rotate-0 scale-100" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
