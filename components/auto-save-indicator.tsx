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
      <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-500">
        <CloudOff className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden sm:inline">Sin guardar</span>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-blue-600 animate-pulse">
        <Cloud className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden sm:inline">Guardando...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-green-600">
      <Check className="h-3 w-3 md:h-4 md:w-4" />
      <span className="hidden sm:inline">Guardado {timeSince}</span>
      <span className="sm:hidden">✓</span>
    </div>
  );
}

