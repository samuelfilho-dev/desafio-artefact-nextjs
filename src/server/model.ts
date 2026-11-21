export type Task = {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
}

// Save on globalThis to survive hot reloads at Dev environment.
const globalForStore = globalThis as unknown as { tasks?: Task[] };

export const tasks: Task[] = (globalForStore.tasks ??= []);

