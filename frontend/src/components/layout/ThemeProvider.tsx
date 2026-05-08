"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDark } = useThemeStore();

  useEffect(() => {
    // Apply saved theme on mount
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
  }, [isDark]);

  return <>{children}</>;
}