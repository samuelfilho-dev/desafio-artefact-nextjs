"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { getErrorMessage } from "@/lib/errors";

type Errors = { title?: string; description?: string };

function validate(title: string, description: string): Errors {
  const errors: Errors = {};
  if (!title.trim()) errors.title = "O título é obrigatório.";
  else if (title.trim().length > 100)
    errors.title = "O título deve ter no máximo 100 caracteres.";
  if (description.trim().length > 500)
    errors.description = "A descrição deve ter no máximo 500 caracteres.";
  return errors;
}

export function TaskForm({ taskId }: { taskId?: string }) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!taskId;

  // Na edição os dados vêm do SSR (hidratados), então o 1º render já tem a tarefa
  const { data: task } = useQuery({
    ...trpc.tasks.byId.queryOptions({ id: taskId ?? "" }),
    enabled: isEditing,
  });

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [errors, setErrors] = useState<Errors>({});

  const onSuccess = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries(trpc.tasks.pathFilter());
    router.push("/");
  };

  const create = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: () => onSuccess("Tarefa criada com sucesso."),
      onError: (err) => toast.error(getErrorMessage(err)),
    }),
  );

  const update = useMutation(
    trpc.tasks.update.mutationOptions({
      onSuccess: () => onSuccess("Tarefa atualizada com sucesso."),
      onError: (err) => toast.error(getErrorMessage(err)),
    }),
  );

  const isSaving = create.isPending || update.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validation = validate(title, description);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      toast.error("Corrija os campos destacados antes de salvar.");
      return;
    }

    const values = { title: title.trim(), description: description.trim() };
    if (isEditing) update.mutate({ id: taskId, ...values });
    else create.mutate(values);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Título *
        </label>
        <input
          id="title"
          value={title}
          disabled={isSaving}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
          }}
          aria-invalid={!!errors.title}
          className={`w-full rounded border bg-white p-2 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: Estudar tRPC"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Descrição
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          disabled={isSaving}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description)
              setErrors((p) => ({ ...p, description: undefined }));
          }}
          aria-invalid={!!errors.description}
          className={`w-full rounded border bg-white p-2 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving
            ? "Salvando..."
            : isEditing
              ? "Salvar alterações"
              : "Criar tarefa"}
        </button>
        <Link href="/" className="rounded border px-4 py-2 hover:bg-gray-100">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
