"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import superjson from "superjson";
import type { AppRouter } from "@/server/routers/_app";
import { makeQueryClient } from "./query-client";


/**
 * Create a tRPC context and provider for React Query integration.
 * This setup allows for easy access to tRPC procedures and query management within React components.
 * The `createTRPCContext` function creates a context that can be used to provide the tRPC client and query client to the application.
 * @see https://trpc.io/docs/react-query
 * @see https://trpc.io/docs/contexts
 * @returns {Object} An object containing the TRPCProvider and useTRPC hook for accessing tRPC procedures.
 */
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

/**
 * Get or create a QueryClient instance for React Query.
 * This function ensures that a single QueryClient instance is used in the browser, while a new instance is created for server-side rendering.
 * The QueryClient is responsible for managing the cache and state of queries in the application.
 * @returns {QueryClient} A QueryClient instance for managing queries.
 * @see https://trpc.io/docs/react-query
 */
let browserQueryClient: QueryClient | undefined;

/**
 * Get or create a QueryClient instance for React Query.
 * This function ensures that a single QueryClient instance is used in the browser, while a new instance is created for server-side rendering.
 * The QueryClient is responsible for managing the cache and state of queries in the application.
 * @returns {QueryClient} A QueryClient instance for managing queries.
 * @see https://trpc.io/docs/react-query
 */
function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  return (browserQueryClient ??= makeQueryClient());
}

/**
 * TRPCReactProvider component wraps the application with tRPC and React Query providers.
 * It initializes the tRPC client and QueryClient, providing them to the application context.
 * This allows for easy access to tRPC procedures and query management throughout the application.
 * @param {Object} props - The props for the TRPCReactProvider component.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The TRPCReactProvider component.
 */
export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
