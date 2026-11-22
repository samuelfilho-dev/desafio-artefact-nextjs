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

function validate(title: string, description: string): Errors {
  const errors: Errors = {};
  if (!title.trim()) errors.title = "O título é obrigatório.";
  else if (title.trim().length > 100)
    errors.title = "O título deve ter no máximo 100 caracteres.";
  if (description.trim().length > 500)
    errors.description = "A descrição deve ter no máximo 500 caracteres.";
  return errors;
}

/* ---------- Formulário (renderizado só quando o modal está aberto) ---------- */

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

/* ---------- Modal + gatilho ---------- */

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
        {/* O form só existe com o modal aberto: o estado reinicia a cada abertura */}
        <TaskForm task={task} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
