import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";

/**
 * Handle incoming requests to the tRPC API endpoint.
 * This function uses the tRPC fetchRequestHandler to process requests and route them to the appropriate procedure in the appRouter.
 * It creates a context for each request, which can be used for authentication, database access, etc.
 * @param req - The incoming Request object from the client.
 * @returns A Response object containing the result of the tRPC procedure call.
 * @see https://trpc.io/docs/server/adapters/fetch
 * @see https://trpc.io/docs/routers
 * @see https://trpc.io/docs/context
 */
const handler = (req: Request) => {
    return fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: () => ({}),
    });
}

export { handler as GET, handler as POST };