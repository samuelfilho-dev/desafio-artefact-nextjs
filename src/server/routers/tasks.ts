import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import { tasks, type Task } from "../model";
import { mockTasks } from "./mock";

const taskInput = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.optional(z.string().trim()),
});

const findOrThrow = (id: string) => {
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Task not found`,
    });
  }

  return task;
};

export const tasksRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().int().positive().max(100).default(20),
        cursor: z.number().int().nonnegative().nullish(),
      }),
    )
    .query(({ input }) => {
      const sortedTasks = [...tasks].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );

      // // --- Mock
      // const sortedTasks = [...mockTasks].sort(
      //   (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      // );

      const cursor = input.cursor ?? 0;
      const items = sortedTasks.slice(cursor, cursor + input.limit);

      return {
        items,
        nextCursor:
          cursor + input.limit < sortedTasks.length
            ? cursor + input.limit
            : null,
      };
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => findOrThrow(input.id)),

  create: publicProcedure.input(taskInput).mutation(({ input }) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description ?? "",
      timeSpentMs: 0,
      isCompleted: false,
      createdAt: new Date(),
    };

    tasks.push(task);
    return task;
  }),

  toggle: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const task = findOrThrow(input.id);
      task.isCompleted = !task.isCompleted;
      return task;
    }),

  update: publicProcedure
    .input(taskInput.extend({ id: z.string() }))
    .mutation(({ input }) => {
      const task = findOrThrow(input.id);
      task.title = input.title;
      task.description = input.description ?? "";
      return task;
    }),

  updateTimeSpent: publicProcedure
    .input(z.object({ id: z.string(), timeSpentMs: z.number() }))
    .mutation(({ input }) => {
      const task = findOrThrow(input.id);
      task.timeSpentMs = input.timeSpentMs;
      return task;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      findOrThrow(input.id);

      const index = tasks.findIndex((t) => t.id === input.id);
      tasks.splice(index, 1);

      return { id: input.id };
    }),
});
