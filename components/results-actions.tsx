"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Printer, Share2, FileText, Loader2 } from "lucide-react";
import { generateResultsPDF, PDFData } from "@/lib/pdf-generator";

interface ResultsActionsProps {
  onGoHome: () => void;
  pdfData?: PDFData;
}

export function ResultsActions({ onGoHome, pdfData }: ResultsActionsProps) {
  const [exportingPDF, setExportingPDF] = useState(false);
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mis Resultados del Test",
          text: "Mira mis resultados del test de evaluación",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copiar URL
      await navigator.clipboard.writeText(window.location.href);
      alert("¡Enlace copiado al portapapeles!");
    }
  };

  const handleExportPDF = async () => {
    if (!pdfData) {
      alert("No hay datos disponibles para exportar");
      return;
    }

    setExportingPDF(true);
    try {
      await generateResultsPDF(pdfData);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error al generar el PDF. Por favor, intenta de nuevo.");
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <Card className="border-2 border-gray-200 shadow-lg">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 text-center mb-4">
            Acciones Disponibles
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Volver al inicio */}
            <Button
              onClick={onGoHome}
              variant="outline"
              className="gap-2 h-auto py-4 flex-col hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              <Home className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-semibold">Volver al Inicio</span>
            </Button>

            {/* Imprimir */}
            <Button
              onClick={handlePrint}
              variant="outline"
              className="gap-2 h-auto py-4 flex-col hover:bg-purple-50 hover:border-purple-300 transition-all"
            >
              <Printer className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-semibold">Imprimir</span>
            </Button>

            {/* Compartir */}
            <Button
              onClick={handleShare}
              variant="outline"
              className="gap-2 h-auto py-4 flex-col hover:bg-green-50 hover:border-green-300 transition-all"
            >
              <Share2 className="h-6 w-6 text-green-600" />
              <span className="text-sm font-semibold">Compartir</span>
            </Button>

            {/* Exportar PDF */}
            <Button
              onClick={handleExportPDF}
              variant="outline"
              className="gap-2 h-auto py-4 flex-col hover:bg-orange-50 hover:border-orange-300 transition-all"
              disabled={exportingPDF || !pdfData}
            >
              {exportingPDF ? (
                <>
                  <Loader2 className="h-6 w-6 text-orange-600 animate-spin" />
                  <span className="text-sm font-semibold">Generando...</span>
                </>
              ) : (
                <>
                  <FileText className="h-6 w-6 text-orange-600" />
                  <span className="text-sm font-semibold">Exportar PDF</span>
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            💡 Guarda o comparte tus resultados para futuras referencias
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

