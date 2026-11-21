"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { getErrorMessage } from "@/lib/errors";

export function TaskList() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery(trpc.tasks.list.queryOptions());

  const invalidate = () =>
    queryClient.invalidateQueries(trpc.tasks.pathFilter());

  const remove = useMutation(
    trpc.tasks.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Task deleted successfully.");
        return invalidate();
      },
      onError: (err) => {
        toast.error(getErrorMessage(err));
        invalidate();
      },
    }),
  );

  if (isError) {
    return (
      <div className="rounded border border-red-300 bg-red-50 p-4">
        <p className="text-red-700">
          Não foi possível carregar as tarefas: {getErrorMessage(error)}
        </p>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-2 rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
        >
          {isFetching ? "Tentando..." : "Tentar novamente"}
        </button>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <p className="rounded border border-dashed bg-white p-8 text-center text-gray-500">
        Nenhuma tarefa cadastrada. Crie a primeira!
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => {
        const isDeleting = remove.isPending && remove.variables?.id === task.id;

        return (
          <li
            key={task.id}
            className="flex items-start gap-3 rounded border bg-white p-3"
          >
            <input
              type="checkbox"
              disabled={isDeleting}
              className="mt-1.5 h-4 w-4"
              aria-label={`Marcar "${task.title}" como concluída`}
            />

            <div className="min-w-0 flex-1">
              <p>{task.title}</p>
              {task.description && (
                <p className="text-sm text-gray-600">{task.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                Criada em {task.createdAt.toLocaleString("pt-BR")}
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/tasks/${task.id}/edit`}
                className="rounded border px-3 py-1 text-sm hover:bg-gray-100"
              >
                Editar
              </Link>
              <button
                disabled={isDeleting}
                onClick={() => {
                  if (confirm(`Excluir a tarefa "${task.title}"?`)) {
                    remove.mutate({ id: task.id });
                  }
                }}
                className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
