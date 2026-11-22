import { initTRPC } from "@trpc/server";
import superjson from "superjson";

/**
 * Initialize tRPC with superjson as the data transformer.
 * This setup allows for serialization and deserialization of complex data types like Dates, Maps, Sets, etc.
 * The `initTRPC` function creates a tRPC instance that can be used to define routers and procedures.
 * @see https://trpc.io/docs/data-transformers
 */
const t = initTRPC.create({ transformer: superjson });

/**
 * Export the tRPC router and publicProcedure for use in defining API endpoints.
 * The `router` is used to create a new tRPC router, which can contain multiple procedures.
 * The `publicProcedure` is a helper for defining procedures that do not require authentication.
 * @see https://trpc.io/docs/routers
 * @see https://trpc.io/docs/procedures
 */
export const router = t.router;
export const publicProcedure = t.procedure;
