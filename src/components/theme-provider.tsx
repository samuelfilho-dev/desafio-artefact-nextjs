"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * ThemeProvider component wraps the application with a theme provider from next-themes.
 * It allows for theme switching and provides the necessary context for theming throughout the application.
 * @param {Object} props - The props for the ThemeProvider component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the theme provider.
 * @returns {JSX.Element} The rendered ThemeProvider component.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
