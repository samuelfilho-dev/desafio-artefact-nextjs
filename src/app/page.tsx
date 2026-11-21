import Link from "next/link";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { TaskList } from "./_components/task-list";

export const dynamic = "force-dynamic";

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.query(trpc.tasks.list.queryOptions());

  return (
    <HydrateClient>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <Link
          href="/tasks/new"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Nova tarefa
        </Link>
      </div>
      <TaskList />
    </HydrateClient>
  );
}
