"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Film, Loader2 } from "lucide-react";
import { Cube3DRef } from "@/components/cube-3d";

interface ExportCubeGifProps {
  cube3DRef: React.RefObject<Cube3DRef>;
  participantCode: string;
}

export function ExportCubeGif({ cube3DRef, participantCode }: ExportCubeGifProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExportGif = async () => {
    if (!cube3DRef.current) {
      alert("El cubo 3D no está disponible");
      return;
    }

    const canvas = cube3DRef.current.getCanvas();
    if (!canvas) {
      alert("No se pudo acceder al canvas del cubo");
      return;
    }

    setIsExporting(true);
    setProgress(0);

    try {
      // Importar GIF.js dinámicamente
      const GIF = (await import("gif.js")).default;

      // Crear instancia de GIF
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
        workerScript: "/gif.worker.js", // Necesitaremos copiar este archivo
      });

      // Número de frames para la animación (360 grados / 10 grados por frame = 36 frames)
      const totalFrames = 36;
      const degreesPerFrame = 10;
      const delayPerFrame = 100; // 100ms por frame = 10 FPS

      // Capturar frames
      for (let i = 0; i < totalFrames; i++) {
        // Actualizar progreso
        setProgress(Math.round((i / totalFrames) * 50)); // 0-50% para captura

        // Capturar frame actual
        const frameCanvas = document.createElement("canvas");
        frameCanvas.width = canvas.width;
        frameCanvas.height = canvas.height;
        const ctx = frameCanvas.getContext("2d");
        
        if (ctx) {
          ctx.drawImage(canvas, 0, 0);
          gif.addFrame(frameCanvas, { delay: delayPerFrame, copy: true });
        }

        // Esperar un poco para que el cubo rote (si tiene rotación automática)
        // O podríamos controlar la rotación manualmente
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Renderizar GIF
      gif.on("progress", (p: number) => {
        setProgress(50 + Math.round(p * 50)); // 50-100% para renderizado
      });

      gif.on("finished", (blob: Blob) => {
        // Descargar el GIF
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `cubo-3d-${participantCode}-${Date.now()}.gif`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setIsExporting(false);
        setProgress(0);
      });

      gif.render();
    } catch (error) {
      console.error("Error al exportar GIF:", error);
      alert("Hubo un error al exportar el GIF. Por favor, intenta de nuevo.");
      setIsExporting(false);
      setProgress(0);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExportGif}
      disabled={isExporting}
      className="gap-2 border-2 border-purple-200 hover:bg-purple-50"
      title="Exportar como GIF animado"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="hidden sm:inline">{progress}%</span>
        </>
      ) : (
        <>
          <Film className="h-4 w-4" />
          <span className="hidden sm:inline">GIF</span>
        </>
      )}
    </Button>
  );
}

