import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import { tasks, type Task } from "../model";

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
  list: publicProcedure.query(() =>
    [...tasks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  ),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => findOrThrow(input.id)),

  create: publicProcedure.input(taskInput).mutation(({ input }) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description ?? "",
      createdAt: new Date(),
    };

    tasks.push(task);
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

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      findOrThrow(input.id);

      const index = tasks.findIndex((t) => t.id === input.id);
      tasks.splice(index, 1);

      return { id: input.id };
    }),
});
