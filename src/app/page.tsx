import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { TaskList } from "./_components/task-list";

export const dynamic = "force-dynamic";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.infiniteQuery(
    trpc.tasks.list.infiniteQueryOptions(
      { limit: 20 },
      {
        initialCursor: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );

  return (
    <HydrateClient>
      <TaskList />
    </HydrateClient>
  );
}
