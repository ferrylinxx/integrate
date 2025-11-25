"use client";

import { useState, useEffect } from "react";
import { APP_VERSION } from "@/lib/version";

interface VersionInfo {
  version: string;
  releaseDate: string;
  releaseNotes: {
    es: {
      title: string;
      message: string;
      features: string[];
    };
  };
  minVersion: string;
  updateUrl: string;
}

interface VersionCheckResult {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string | null;
  releaseNotes: VersionInfo["releaseNotes"]["es"] | null;
  updateUrl: string | null;
  isLoading: boolean;
}

/**
 * Hook para verificar si hay una nueva versión disponible
 * Compara la versión actual con la versión en GitHub
 */
export function useVersionCheck(): VersionCheckResult {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [releaseNotes, setReleaseNotes] = useState<VersionInfo["releaseNotes"]["es"] | null>(null);
  const [updateUrl, setUpdateUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        // Verificar si ya se mostró la notificación para esta versión
        const dismissedVersion = localStorage.getItem("dismissedUpdateVersion");

        // Intentar primero desde GitHub (producción)
        let response: Response | null = null;
        let data: VersionInfo | null = null;

        try {
          response = await fetch(
            "https://raw.githubusercontent.com/ferrylinxx/integrate/main/public/version.json",
            {
              cache: "no-store",
              headers: {
                "Cache-Control": "no-cache",
              },
            }
          );

          if (response.ok) {
            data = await response.json();
          }
        } catch (githubError) {
          // Si falla GitHub, intentar desde el servidor local
          console.log("GitHub no disponible, intentando versión local...");
        }

        // Si GitHub falló, intentar desde el servidor local
        if (!data) {
          try {
            response = await fetch("/version.json", {
              cache: "no-store",
              headers: {
                "Cache-Control": "no-cache",
              },
            });

            if (response.ok) {
              data = await response.json();
            }
          } catch (localError) {
            console.log("Archivo version.json no disponible localmente");
          }
        }

        // Si no se pudo obtener datos de ninguna fuente, salir silenciosamente
        if (!data) {
          setIsLoading(false);
          return;
        }

        const latest = data.version;

        setLatestVersion(latest);
        setReleaseNotes(data.releaseNotes.es);
        setUpdateUrl(data.updateUrl);

        // Comparar versiones (semántico: X.Y.Z)
        const isNewer = compareVersions(latest, APP_VERSION) > 0;
        const notDismissed = dismissedVersion !== latest;

        setHasUpdate(isNewer && notDismissed);
      } catch (error) {
        // Error silencioso - no mostrar nada al usuario
        console.log("Verificación de versión no disponible");
      } finally {
        setIsLoading(false);
      }
    };

    // Verificar al cargar la página
    checkVersion();

    // Verificar cada 30 minutos
    const interval = setInterval(checkVersion, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    hasUpdate,
    currentVersion: APP_VERSION,
    latestVersion,
    releaseNotes,
    updateUrl,
    isLoading,
  };
}

/**
 * Comparar dos versiones semánticas (X.Y.Z)
 * @returns 1 si v1 > v2, -1 si v1 < v2, 0 si son iguales
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }

  return 0;
}

/**
 * Marcar la notificación de actualización como descartada
 */
export function dismissUpdateNotification(version: string) {
  localStorage.setItem("dismissedUpdateVersion", version);
}

