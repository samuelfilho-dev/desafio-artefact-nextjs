"use client";

import { useState, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { getErrorMessage } from "@/lib/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

type Errors = { title?: string; description?: string };

type TaskData = { id: string; title: string; description: string };

/**
 * Validate the task form fields.
 * Returns an object with error messages for each field if validation fails.
 * @param title - The title of the task.
 * @param description - The description of the task.
 * @returns An object containing error messages for invalid fields.
 */

function validate(title: string, description: string): Errors {
  const errors: Errors = {};
  if (!title.trim()) errors.title = "O título é obrigatório.";
  else if (title.trim().length > 100)
    errors.title = "O título deve ter no máximo 100 caracteres.";
  if (description.trim().length > 500)
    errors.description = "A descrição deve ter no máximo 500 caracteres.";
  return errors;
}

/**
 * TaskForm component handles the creation and editing of tasks.
 * It manages form state, validation, and submission using React Query mutations.
 * @param task - Optional task data for editing an existing task.
 * @param onDone - Callback function to be called when the form is successfully submitted or canceled.
 * @returns JSX.Element representing the task form.
 */
function TaskForm({ task, onDone }: { task?: TaskData; onDone: () => void }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [errors, setErrors] = useState<Errors>({});

  const handleSuccess = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries(trpc.tasks.pathFilter());
    onDone();
  };

  const create = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: () => handleSuccess("Tarefa criada com sucesso."),
      onError: (err) => toast.error(getErrorMessage(err)),
    }),
  );

  const update = useMutation(
    trpc.tasks.update.mutationOptions({
      onSuccess: () => handleSuccess("Tarefa atualizada com sucesso."),
      onError: (err) => {
        toast.error(getErrorMessage(err));
        // Se a tarefa não existe mais, atualiza a lista
        queryClient.invalidateQueries(trpc.tasks.pathFilter());
      },
    }),
  );

  const isSaving = create.isPending || update.isPending;
  const isEditing = !!task;
  const label = isEditing ? "Continuar" : "Criar tarefa";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validation = validate(title, description);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const values = { title: title.trim(), description: description.trim() };
    if (task) update.mutate({ id: task.id, ...values });
    else create.mutate(values);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Altere os dados da tarefa e salve."
            : "Preencha os dados para criar uma nova tarefa."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={title}
          disabled={isSaving}
          aria-invalid={!!errors.title}
          placeholder="Ex: Estudar tRPC"
          autoFocus
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
          }}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          rows={4}
          value={description}
          disabled={isSaving}
          aria-invalid={!!errors.description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description)
              setErrors((p) => ({ ...p, description: undefined }));
          }}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={isSaving}
          onClick={onDone}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Spinner className="mr-2 h-4 w-4" />}
          {label}
        </Button>
      </DialogFooter>
    </form>
  );
}

/**
 * TaskFormDialog component wraps the TaskForm in a modal dialog.
 * It manages the open state of the dialog and provides a trigger button.
 * @param task - Optional task data for editing an existing task.
 * @param children - Optional ReactNode to be used as the trigger content.
 * @param className - Optional className for the trigger button.
 * @param triggerLabel - Optional label for the trigger button if children are not provided.
 * @param triggerClassName - Optional className for the trigger button if children are not provided.
 * @returns JSX.Element representing the task form dialog.
 */

export function TaskFormDialog({
  task,
  children,
  className,
  triggerLabel,
  triggerClassName,
}: {
  task?: TaskData;
  children?: ReactNode;
  className?: string;
  triggerLabel?: string | ReactNode;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button />}
        className={className ?? triggerClassName}
      >
        {children ?? triggerLabel ?? "Nova tarefa"}
      </DialogTrigger>
      <DialogContent>
        <TaskForm task={task} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
