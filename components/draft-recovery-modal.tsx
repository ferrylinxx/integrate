"use client";

import { AlertCircle, Clock, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Draft, getTimeSinceLastUpdate } from "@/lib/draft-storage";

interface DraftRecoveryModalProps {
  open: boolean;
  draft: Draft | null;
  onRecover: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export function DraftRecoveryModal({
  open,
  draft,
  onRecover,
  onDiscard,
  onCancel,
}: DraftRecoveryModalProps) {
  if (!draft) return null;

  const answeredCount = draft.answers.filter(a => a !== null).length;
  const progressPercentage = Math.round((answeredCount / 24) * 100);
  const timeSinceUpdate = getTimeSinceLastUpdate(draft.timestamp);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            <DialogTitle className="text-xl">Progreso Guardado Encontrado</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Encontramos un borrador guardado de tu test anterior. ¿Deseas continuar donde lo dejaste?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Información del draft */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Código de grupo:</span>
              <span className="text-sm font-bold text-gray-900">{draft.groupCode}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Progreso:</span>
              <span className="text-sm font-bold text-blue-600">
                {answeredCount}/24 preguntas ({progressPercentage}%)
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Última actualización:
              </span>
              <span className="text-sm text-gray-600">{timeSinceUpdate}</span>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Progreso del test</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Advertencia */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              <strong>Nota:</strong> Si eliges "Empezar de nuevo", se perderá todo el progreso guardado.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={onDiscard}
            className="w-full sm:w-auto gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Empezar de nuevo
          </Button>
          <Button
            onClick={onRecover}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            Continuar donde lo dejé
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

