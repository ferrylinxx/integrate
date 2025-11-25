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
        className="backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        {/* Header con efecto glass */}
        <div
          className="px-2.5 py-1.5 flex items-center justify-between backdrop-blur-md border-b border-white/10"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-white drop-shadow-lg" />
            <span className="text-white font-semibold text-[11px] drop-shadow-lg">
              Nueva versión {latestVersion}
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/90 hover:text-white hover:bg-white/10 rounded-full p-1 transition-all"
            aria-label="Cerrar notificación"
          >
            <X className="h-3 w-3 drop-shadow-lg" />
          </button>
        </div>

        {/* Contenido */}
        <div className="px-3 py-2.5">
          <p className="text-[11px] text-white font-medium mb-2 drop-shadow-md">
            {releaseNotes?.message || "Actualitza per a les darreres característiques i millores."}
          </p>

          {/* Características */}
          {releaseNotes?.features && releaseNotes.features.length > 0 && (
            <ul className="text-[10px] text-white/95 space-y-1 mb-2 ml-3 drop-shadow-md">
              {releaseNotes.features.slice(0, 2).map((feature, index) => (
                <li key={index} className="list-disc">
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {/* Versiones */}
          <div className="flex items-center justify-between text-[10px] text-white/90 mb-2 drop-shadow-md">
            <span>
              Actual: <strong className="text-white">{currentVersion}</strong>
            </span>
            <span>
              Nueva: <strong className="text-white">{latestVersion}</strong>
            </span>
          </div>

          {/* Botón de actualización */}
          <button
            onClick={handleUpdate}
            className="w-full text-white font-semibold py-1.5 px-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 text-[11px] backdrop-blur-sm border border-white/20"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)",
            }}
          >
            <Download className="h-3 w-3 drop-shadow-lg" />
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

