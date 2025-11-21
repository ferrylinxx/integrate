"use client";

import { useState } from "react";
import { Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Cube3DRef } from "@/components/cube-3d";

interface ExportCubeImageProps {
  cube3DRef: React.RefObject<Cube3DRef>;
  participantCode: string;
}

export function ExportCubeImage({ cube3DRef, participantCode }: ExportCubeImageProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [resolution, setResolution] = useState<"1080p" | "4k">("1080p");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    // Obtener el canvas a través de la referencia del componente Cube3D
    const canvas = cube3DRef.current?.getCanvas();

    if (!canvas) {
      alert("No se pudo acceder al canvas del cubo 3D. Por favor, espera a que el cubo se cargue completamente.");
      return;
    }

    setIsExporting(true);

    try {
      
      // Configurar resolución
      const width = resolution === "4k" ? 3840 : 1920;
      const height = resolution === "4k" ? 2160 : 1080;
      
      // Crear un canvas temporal con la resolución deseada
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const ctx = tempCanvas.getContext("2d");
      
      if (!ctx) {
        throw new Error("No se pudo crear el contexto 2D");
      }

      // Dibujar el canvas original escalado
      ctx.drawImage(canvas, 0, 0, width, height);

      // Convertir a imagen
      tempCanvas.toBlob((blob) => {
        if (!blob) {
          throw new Error("No se pudo generar la imagen");
        }

        // Crear URL de descarga
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `cubo-3d-${participantCode}-${resolution}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setIsExporting(false);
        setShowDialog(false);
      }, "image/png");
    } catch (error) {
      console.error("Error al exportar imagen:", error);
      alert("Hubo un error al exportar la imagen. Por favor, intenta de nuevo.");
      setIsExporting(false);
    }
  };

  return (
    <>
      <button
        data-export-cube
        onClick={() => setShowDialog(true)}
        className="hidden"
      >
        Exportar
      </button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Exportar Imagen del Cubo 3D
            </DialogTitle>
            <DialogDescription>
              Descarga una imagen de alta resolución del cubo 3D con tus resultados.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Resolución:</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setResolution("1080p")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    resolution === "1080p"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-sm">Full HD</p>
                  <p className="text-xs text-gray-600">1920 × 1080</p>
                </button>
                <button
                  onClick={() => setResolution("4k")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    resolution === "4k"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-sm">4K Ultra HD</p>
                  <p className="text-xs text-gray-600">3840 × 2160</p>
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Nota:</strong> La imagen se descargará en formato PNG con fondo transparente.
                Puedes usarla en presentaciones, informes o compartirla en redes sociales.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isExporting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="gap-2"
            >
              {isExporting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Descargar Imagen
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

