"use client";

/**
 * A theme-toggle component has been added to the project, allowing users to switch between light and dark themes.
 * The ThemeToggle component uses the `useTheme` hook from the `next-themes` package to retrieve the current theme and a function to change it.
 * The button displays a sun icon when the theme is dark and a moon icon when the theme is light.
 * This allows users to customize the appearance of the user interface according to their preferences.
 */

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

/**
 * ThemeToggle component provides a button to toggle between light and dark themes.
 * It uses the `useTheme` hook from `next-themes` to get the current theme and a function to change it. 
 * The button displays a sun icon when the theme is dark and a moon icon when the theme is light.
 * @returns {JSX.Element} The rendered ThemeToggle component.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Alternar tema"
      title="Alternar tema"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </Button>
  );
}
