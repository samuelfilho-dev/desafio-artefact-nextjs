/**
 * Represents a task in the application.
 * @property {string} id - The unique identifier for the task.
 * @property {string} title - The title of the task.
 * @property {string} description - The description of the task.
 * @property {boolean} isCompleted - Indicates if the task is completed.
 * @property {number} timeSpentMs - The time spent on the task in milliseconds.
 * @property {Date} createdAt - The date and time when the task was created.
 */
export type Task = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  timeSpentMs: number;
  createdAt: Date;
};

/**
 * Global store for tasks in the application.
 * This store is used to persist tasks across different parts of the application.
 * It is initialized as an empty array if it does not already exist in the global context.
 * @type {Task[]}
 */
const globalForStore = globalThis as unknown as { tasks?: Task[] };

/**
 * The main in-memory store for tasks in the application.
 * It is initialized as an empty array if it does not already exist in the global context.
 * This store is used to persist tasks across different parts of the application.
 * @type {Task[]}
 */
export const tasks: Task[] = (globalForStore.tasks ??= []);
