"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { getErrorMessage } from "@/lib/errors";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TaskFormDialog } from "./task-form-dialog";

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
        toast.success("Tarefa excluída com sucesso.");
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
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-destructive">
          Não foi possível carregar as tarefas: {getErrorMessage(error)}
        </p>
        <Button
          variant="destructive"
          size="sm"
          className="mt-2"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Tentando..." : "Tentar novamente"}
        </Button>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <p className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
        Nenhuma tarefa cadastrada. Crie a primeira!
      </p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Criada em</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.map((task) => {
            const isDeleting =
              remove.isPending && remove.variables?.id === task.id;

            return (
              <TableRow
                key={task.id}
                className={isDeleting ? "opacity-50" : ""}
              >
                <TableCell className="font-medium">{task.title}</TableCell>

                <TableCell className="max-w-xs truncate text-muted-foreground">
                  {task.description || "—"}
                </TableCell>

                <TableCell
                  className="whitespace-nowrap text-muted-foreground"
                  suppressHydrationWarning
                >
                  {task.createdAt.toLocaleString("pt-BR")}
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <TaskFormDialog
                      task={task}
                      triggerLabel="Editar"
                      triggerClassName={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    />

                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isDeleting}
                          />
                        }
                      >
                        {isDeleting ? "Excluindo..." : "Excluir"}
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            A tarefa &quot;{task.title}&quot; será excluída
                            permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => remove.mutate({ id: task.id })}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
