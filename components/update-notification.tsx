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
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] max-w-xl w-full mx-4 animate-slide-down"
      style={{
        animation: "slideDown 0.3s ease-out",
      }}
    >
      <div
        className="bg-white border-2 rounded-lg shadow-2xl overflow-hidden"
        style={{
          borderColor: "#2C248E",
        }}
      >
        {/* Header con gradiente */}
        <div
          className="px-4 py-2 flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, #2C248E 0%, #412761 50%, #8E235D 100%)",
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-white font-semibold text-sm">
              {releaseNotes?.title || "Nueva versión disponible"}
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white hover:bg-white/20 rounded p-1 transition-colors"
            aria-label="Cerrar notificación"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="px-4 py-3 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
          <p className="text-sm text-gray-700 mb-2">
            {releaseNotes?.message || "Actualitza per a les darreres característiques i millores."}
          </p>

          {/* Características */}
          {releaseNotes?.features && releaseNotes.features.length > 0 && (
            <ul className="text-xs text-gray-600 space-y-1 mb-3 ml-4">
              {releaseNotes.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="list-disc">
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {/* Versiones */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>
              Versión actual: <strong className="text-gray-700">{currentVersion}</strong>
            </span>
            <span>
              Nueva versión: <strong style={{ color: "#2C248E" }}>{latestVersion}</strong>
            </span>
          </div>

          {/* Botón de actualización */}
          <button
            onClick={handleUpdate}
            className="w-full text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
            style={{
              background: "linear-gradient(135deg, #2C248E 0%, #412761 20%, #8E235D 50%, #E65B3E 80%, #F08726 100%)",
            }}
          >
            <Download className="h-4 w-4" />
            Ver detalles de actualización
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
}

