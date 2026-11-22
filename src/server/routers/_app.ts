import { router } from "../trpc";
import { tasksRouter } from "./tasks";

/**
 * The main application router that combines all individual routers.
 * It serves as the entry point for all tRPC procedures in the application.
 * @returns {typeof router} The main application router.
 */
export const appRouter = router({
    tasks: tasksRouter,
})

export type AppRouter = typeof appRouter;