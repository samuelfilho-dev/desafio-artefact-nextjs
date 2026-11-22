"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Task } from "@/server/model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

function formatTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");

  return h > 0 ? `${String(h).padStart(2, "0")}:${mm}:${ss}` : `${mm}:${ss}`;
}

type StopwatchProps = {
  className?: string;
  task?: Task;
};

export function Stopwatch({ className, task }: StopwatchProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);

  // Marca o "instante zero" virtual da contagem atual.
  // Usar Date.now() evita o drift de somar +1s a cada tick do setInterval.
  const originRef = useRef(0);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setElapsedMs(Date.now() - originRef.current);
    }, 250);

    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (task?.isCompleted) {
      setRunning(false);
    }
  }, [task?.isCompleted]);

  useEffect(() => {
    if (task) {
      setElapsedMs(task.timeSpentMs ?? 0);
    }
  }, [task?.id, task?.timeSpentMs]);

  const update = useMutation(
    trpc.tasks.updateTimeSpent.mutationOptions({
      onSuccess: () => {
        return queryClient.invalidateQueries(trpc.tasks.pathFilter());
      },
      onError: (err) => {
        toast.error(`Erro ao atualizar tempo: ${err.message}`);
      },
    }),
  );

  function start() {
    originRef.current = Date.now() - elapsedMs;
    setRunning(true);
  }

  function reset() {
    setRunning(false);
    setElapsedMs(0);
  }

  function pause() {
    const currentElapsedMs = Date.now() - originRef.current;
    setElapsedMs(currentElapsedMs);

    if (!task) {
      toast.error("Nenhuma tarefa selecionada para atualizar o tempo.");
      setRunning(false);
      return;
    }

    update.mutate({ id: task.id, timeSpentMs: currentElapsedMs });
    setRunning(false);
  }

  const seconds = Math.floor(elapsedMs / 1000);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        role="timer"
        aria-label="Tempo da sessão"
        className="min-w-[4.5ch] font-mono text-xl font-bold tabular-nums"
      >
        {formatTime(seconds)}
      </span>

      {task?.isCompleted === false && (
        <>
          {running ? (
            <Button variant="secondary" size="sm" onClick={pause}>
              <Pause className="size-4 fill-amber-500 text-amber-500" />
              Pausar
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={start}>
              <Play className="size-4 fill-green-500 text-green-500" />
              {elapsedMs > 0 ? "Retomar" : "Iniciar"}
            </Button>
          )}

          {!running && elapsedMs > 0 && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Zerar cronômetro"
              title="Zerar"
              onClick={reset}
            >
              <RotateCcw className="size-4" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}
