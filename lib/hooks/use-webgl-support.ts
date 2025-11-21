"use client";

import { useEffect, useState } from "react";

/**
 * Hook para detectar si el navegador soporta WebGL
 * @returns true si WebGL está soportado, false en caso contrario
 */
export function useWebGLSupport(): boolean {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setIsSupported(!!gl);
    } catch (e) {
      setIsSupported(false);
    }
  }, []);

  return isSupported;
}

