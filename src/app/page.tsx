import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { TaskList } from "./_components/task-list";

export const dynamic = "force-dynamic";

/**
 * Home page component that displays a list of tasks.
 * It prefetches the first page of tasks on the server side and hydrates the client with this data.
 * The TaskList component is rendered within a HydrateClient wrapper to ensure that the initial data is available on the client.
 * @returns {JSX.Element} The rendered Home page component.
 *  
 */
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
