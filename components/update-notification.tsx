"use client";

import { useVersionCheck, dismissUpdateNotification } from "@/hooks/use-version-check";
import { X, Download, Sparkles } from "lucide-react";
import { useState } from "react";

/**
 * Componente de notificación de nueva versión
 * Se muestra en la parte superior de la página cuando hay una actualización disponible
 */
export function UpdateNotification() {
  const { hasUpdate, currentVersion, latestVersion, releaseNotes, updateUrl } = useVersionCheck();
  const [isVisible, setIsVisible] = useState(true);

  if (!hasUpdate || !isVisible || !latestVersion) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    dismissUpdateNotification(latestVersion);
  };

  const handleUpdate = () => {
    if (updateUrl) {
      window.open(updateUrl, "_blank");
    }
  };

  return (
    <div
      className="fixed bottom-4 left-4 z-[9999] max-w-xs w-full mx-4 md:mx-0 animate-slide-up"
      style={{
        animation: "slideUp 0.3s ease-out",
      }}
    >
      <div
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
          boxShadow: "0 8px 32px 0 rgba(44, 36, 142, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)",
        }}
      >
        {/* Header con gradiente glass */}
        <div
          className="px-2.5 py-1 flex items-center justify-between backdrop-blur-sm"
          style={{
            background: "linear-gradient(135deg, rgba(44, 36, 142, 0.8) 0%, rgba(65, 39, 97, 0.7) 50%, rgba(142, 35, 93, 0.8) 100%)",
          }}
        >
          <div className="flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5 text-white" />
            <span className="text-white font-semibold text-[10px]">
              Nueva versión {latestVersion}
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white hover:bg-white/20 rounded p-0.5 transition-colors"
            aria-label="Cerrar notificación"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="px-2.5 py-2 backdrop-blur-md">
          <p className="text-[10px] text-white/90 mb-1.5 font-medium">
            {releaseNotes?.message || "Actualitza per a les darreres característiques i millores."}
          </p>

          {/* Características */}
          {releaseNotes?.features && releaseNotes.features.length > 0 && (
            <ul className="text-[9px] text-white/70 space-y-0.5 mb-1.5 ml-2">
              {releaseNotes.features.slice(0, 2).map((feature, index) => (
                <li key={index} className="list-disc">
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {/* Versiones */}
          <div className="flex items-center justify-between text-[9px] text-white/60 mb-1.5">
            <span>
              Actual: <strong className="text-white/80">{currentVersion}</strong>
            </span>
            <span>
              Nueva: <strong className="text-white">{latestVersion}</strong>
            </span>
          </div>

          {/* Botón de actualización */}
          <button
            onClick={handleUpdate}
            className="w-full text-white font-semibold py-1 px-2 rounded-md shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1 text-[10px] backdrop-blur-sm"
            style={{
              background: "linear-gradient(135deg, rgba(44, 36, 142, 0.9) 0%, rgba(65, 39, 97, 0.8) 20%, rgba(142, 35, 93, 0.9) 50%, rgba(230, 91, 62, 0.8) 80%, rgba(240, 135, 38, 0.9) 100%)",
            }}
          >
            <Download className="h-2.5 w-2.5" />
            Ver detalles
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

