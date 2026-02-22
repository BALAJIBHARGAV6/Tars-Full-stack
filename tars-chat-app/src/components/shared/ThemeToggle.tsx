/* ========================================================
   THEME TOGGLE - Dark/Light Mode Switch Button
   
   A button that toggles between light and dark themes.
   Shows sun icon in dark mode, moon icon in light mode.
   Uses CSS transitions for smooth switching.
   ======================================================== */

"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-violet-900/50 dark:hover:text-violet-400 active:scale-95 transition-all duration-200"
      title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
