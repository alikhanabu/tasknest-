"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-700 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition text-sm font-medium"
      title="Переключить тему"
    >
      <span className="text-base">{isDark ? "☀️" : "🌙"}</span>
      <span className="text-zinc-700 dark:text-zinc-300">
        {isDark ? "Светлая" : "Тёмная"}
      </span>
    </button>
  );
}
