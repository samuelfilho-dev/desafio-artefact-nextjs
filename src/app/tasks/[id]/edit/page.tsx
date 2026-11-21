import { notFound } from "next/navigation";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import { TaskForm } from "@/app/_components/task-form";

export const dynamic = "force-dynamic";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = getQueryClient();

  try {
    await queryClient.query(trpc.tasks.byId.queryOptions({ id }));
  } catch {
    notFound();
  }

  return (
    <HydrateClient>
      <h1 className="mb-4 text-2xl font-bold">Editar tarefa</h1>
      <TaskForm taskId={id} />
    </HydrateClient>
  );
}
