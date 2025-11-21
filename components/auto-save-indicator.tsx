"use client";

import { useEffect, useState } from "react";
import { Check, Cloud, CloudOff } from "lucide-react";
import { getTimeSinceLastUpdate } from "@/lib/draft-storage";

interface AutoSaveIndicatorProps {
  lastSaved: number | null;
  isSaving?: boolean;
}

export function AutoSaveIndicator({ lastSaved, isSaving = false }: AutoSaveIndicatorProps) {
  const [timeSince, setTimeSince] = useState<string>("");

  useEffect(() => {
    if (!lastSaved) return;

    // Actualizar el tiempo cada 10 segundos
    const updateTime = () => {
      setTimeSince(getTimeSinceLastUpdate(lastSaved));
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);

    return () => clearInterval(interval);
  }, [lastSaved]);

  if (!lastSaved && !isSaving) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <CloudOff className="h-4 w-4" />
        <span>Sin guardar</span>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-sm text-blue-600 animate-pulse">
        <Cloud className="h-4 w-4" />
        <span>Guardando...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600">
      <Check className="h-4 w-4" />
      <span>Guardado {timeSince}</span>
    </div>
  );
}

