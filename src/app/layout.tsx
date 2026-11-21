import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

export const metadata: Metadata = { title: "Task Manager" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900">
        <TRPCReactProvider>
          <header className="border-b bg-white">
            <div className="mx-auto flex max-w-2xl items-center justify-between p-4">
              <Link href="/" className="text-lg font-semibold">
                Task Manager
              </Link>
            </div>
          </header>
          <main className="mx-auto max-w-2xl p-4">{children}</main>
          <Toaster richColors position="top-right" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
