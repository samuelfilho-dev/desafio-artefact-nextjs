import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import superjson from "superjson";

/**
 * Create a new QueryClient instance for React Query with custom default options.
 * This function sets up the QueryClient with a stale time of 30 seconds for queries,
 * and configures serialization and deserialization of query data using superjson.
 * @returns {QueryClient} A new QueryClient instance for managing queries.
 * @see https://trpc.io/docs/react-query
 * @see https://trpc.io/docs/data-transformers
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30 * 1000 },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}
