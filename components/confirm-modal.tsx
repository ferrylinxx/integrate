"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  answeredCount: number;
  totalCount: number;
}

export function ConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  answeredCount,
  totalCount,
}: ConfirmModalProps) {
  const allAnswered = answeredCount === totalCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar guardado</DialogTitle>
          <DialogDescription>
            {allAnswered ? (
              <>
                Has completado todas las preguntas ({answeredCount}/{totalCount}).
                <br />
                ¿Deseas guardar tus respuestas?
              </>
            ) : (
              <>
                Has respondido {answeredCount} de {totalCount} preguntas.
                <br />
                <span className="text-yellow-600 font-medium">
                  Aún faltan {totalCount - answeredCount} preguntas por responder.
                </span>
                <br />
                ¿Deseas guardar de todas formas?
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>
            Confirmar guardado
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

