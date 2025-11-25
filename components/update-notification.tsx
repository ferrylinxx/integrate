"use client";

import { useVersionCheck, dismissUpdateNotification } from "@/hooks/use-version-check";
import { X, Download, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Componente de notificación de nueva versión
 * Se muestra en la parte superior de la página cuando hay una actualización disponible
 */
export function UpdateNotification() {
  const { hasUpdate, currentVersion, latestVersion, releaseNotes, updateUrl } = useVersionCheck();
  const [isVisible, setIsVisible] = useState(true);
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  // Detectar si el fondo es oscuro o claro
  useEffect(() => {
    const detectBackgroundColor = () => {
      const body = document.body;
      const bgColor = window.getComputedStyle(body).backgroundColor;

      // Convertir RGB a luminosidad
      const rgb = bgColor.match(/\d+/g);
      if (rgb) {
        const [r, g, b] = rgb.map(Number);
        const luminosity = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        setIsDarkBackground(luminosity < 0.5);
      }
    };

    detectBackgroundColor();

    // Observar cambios en el DOM
    const observer = new MutationObserver(detectBackgroundColor);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });

    return () => observer.disconnect();
  }, []);

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
      className="fixed bottom-4 left-4 z-[9999] max-w-sm w-full mx-4 md:mx-0 animate-slide-up"
      style={{
        animation: "slideUp 0.3s ease-out",
      }}
    >
      <div
        className="backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden"
        style={{
          background: isDarkBackground
            ? "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)"
            : "linear-gradient(135deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.08) 100%)",
          border: isDarkBackground ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(0, 0, 0, 0.2)",
          boxShadow: isDarkBackground
            ? "0 8px 32px 0 rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset"
            : "0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5) inset",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        {/* Header con gradiente Integrate */}
        <div
          className="px-3 py-2 flex items-center justify-between backdrop-blur-md"
          style={{
            background: "linear-gradient(135deg, #2C248E 0%, #412761 50%, #8E235D 100%)",
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-white drop-shadow-lg" />
            <span className="text-white font-semibold text-xs drop-shadow-lg">
              Nueva versión {latestVersion}
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/90 hover:text-white hover:bg-white/10 rounded-full p-1 transition-all"
            aria-label="Cerrar notificación"
          >
            <X className="h-3.5 w-3.5 drop-shadow-lg" />
          </button>
        </div>

        {/* Contenido */}
        <div className="px-3.5 py-3">
          <p
            className="text-xs font-medium mb-2.5 drop-shadow-md"
            style={{ color: isDarkBackground ? "white" : "#1f2937" }}
          >
            {releaseNotes?.message || "Actualitza per a les darreres característiques i millores."}
          </p>

          {/* Características */}
          {releaseNotes?.features && releaseNotes.features.length > 0 && (
            <ul
              className="text-[11px] space-y-1 mb-2.5 ml-3 drop-shadow-md"
              style={{ color: isDarkBackground ? "rgba(255, 255, 255, 0.95)" : "#374151" }}
            >
              {releaseNotes.features.slice(0, 2).map((feature, index) => (
                <li key={index} className="list-disc">
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {/* Versiones */}
          <div
            className="flex items-center justify-between text-[11px] mb-2.5 drop-shadow-md"
            style={{ color: isDarkBackground ? "rgba(255, 255, 255, 0.9)" : "#4b5563" }}
          >
            <span>
              Actual: <strong style={{ color: isDarkBackground ? "white" : "#1f2937" }}>{currentVersion}</strong>
            </span>
            <span>
              Nueva: <strong style={{ color: isDarkBackground ? "white" : "#1f2937" }}>{latestVersion}</strong>
            </span>
          </div>

          {/* Botón de actualización con gradiente Integrate */}
          <button
            onClick={handleUpdate}
            className="w-full text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-xs"
            style={{
              background: "linear-gradient(135deg, #2C248E 0%, #412761 20%, #8E235D 50%, #E65B3E 80%, #F08726 100%)",
            }}
          >
            <Download className="h-3.5 w-3.5 drop-shadow-lg" />
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

