import "server-only";

import { cache } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { appRouter } from "@/server/routers/_app";
import { makeQueryClient } from "./query-client";

/**
 * Get or create a QueryClient instance for React Query.
 * This function ensures that a single QueryClient instance is used in the browser, while a new instance is created for server-side rendering.
 * The QueryClient is responsible for managing the cache and state of queries in the application.
 * @returns {QueryClient} A QueryClient instance for managing queries.
 * @see https://trpc.io/docs/react-query
 */
export const getQueryClient = cache(makeQueryClient);

/**
 * Create a tRPC options proxy for the application.
 * This function creates a proxy that allows for easy access to tRPC procedures and query management.
 * @returns {Object} An object containing the tRPC options for the application.
 * @see https://trpc.io/docs/react-query
 */
export const trpc = createTRPCOptionsProxy({
  router: appRouter,
  ctx: async () => ({}),
  queryClient: getQueryClient(),
});

/**
 * HydrateClient component.
 * This component is used to hydrate the client-side cache with the server-side data.
 * @param {Object} props - The props for the HydrateClient component.
 * @param {React.ReactNode} props.children - The child components to be hydrated.
 * @returns {JSX.Element} The HydrateClient component.
 * @see https://trpc.io/docs/react-query
 */
export function HydrateClient({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
