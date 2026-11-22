import type { Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/client";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Plus } from "lucide-react";
import { Toaster } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { TaskFormDialog } from "./_components/task-form-dialog";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css"; 

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Gerenciador de Tarefas",
  description: "Desafio técnico com Next.js 15 + tRPC",
};

/**
 * Global layout component for the application.
 * This component wraps the entire application with providers for tRPC, theming, and tooltips.
 * It also includes a header with a title, theme toggle, and a button to add new tasks.
 * The main content area is styled and contains the children components passed to this layout.
 * @param {Object} props - The props for the RootLayout component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The rendered RootLayout component.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={cn("font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <TooltipProvider>
              <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-16 w-full items-center gap-3 px-4">
                  <h1 className="mr-auto text-lg font-semibold tracking-tight">
                    Minhas Tarefas
                  </h1>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />

                    <TaskFormDialog className="gap-2">
                      <Plus />
                      <span className="hidden sm:inline">Adicionar tarefa</span>
                    </TaskFormDialog>
                  </div>
                </div>
              </header>
              <main className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
                <div className="min-h-[calc(100vh-7rem)] rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
                  {children}
                </div>
              </main>
              <Toaster position="top-right" richColors />
            </TooltipProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
