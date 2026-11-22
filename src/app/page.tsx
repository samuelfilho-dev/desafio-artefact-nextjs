import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { TaskList } from "./_components/task-list";

export const dynamic = "force-dynamic";

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.query(trpc.tasks.list.queryOptions());

  return (
    <HydrateClient>
      <TaskList />
    </HydrateClient>
  );
}
