"use client";

import { useState } from "react";
import { Download, ChevronDown } from "lucide-react";
import { Cube3DRef } from "./cube-3d";
import { AnswerValue } from "@/lib/types";
import { AREA_NAMES } from "@/lib/constants";
import jsPDF from "jspdf";

interface ExportCubeMultiFormatProps {
  cube3DRef: React.RefObject<Cube3DRef>;
  answers: AnswerValue[];
  participantCode: string;
}

export function ExportCubeMultiFormat({ cube3DRef, answers, participantCode }: ExportCubeMultiFormatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Exportar como PNG (código existente)
  const exportAsPNG = async () => {
    setIsExporting(true);
    try {
      const canvas = cube3DRef.current?.getCanvas();
      if (!canvas) {
        console.error("Canvas not found");
        return;
      }

      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `cubo-integrate-${participantCode}.png`;
      link.href = dataURL;
      link.click();
    } catch (error) {
      console.error("Error exporting PNG:", error);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  // Exportar como PDF
  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      const canvas = cube3DRef.current?.getCanvas();
      if (!canvas) {
        console.error("Canvas not found");
        return;
      }

      const dataURL = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Título
      pdf.setFontSize(20);
      pdf.text("Resultados INTEGRATE 2.0", 105, 20, { align: "center" });

      // Código de participante
      pdf.setFontSize(12);
      pdf.text(`Código: ${participantCode}`, 105, 30, { align: "center" });

      // Imagen del cubo
      const imgWidth = 150;
      const imgHeight = 150;
      const x = (210 - imgWidth) / 2; // Centrar en A4 (210mm de ancho)
      pdf.addImage(dataURL, "PNG", x, 40, imgWidth, imgHeight);

      // Tabla de resultados
      pdf.setFontSize(14);
      pdf.text("Resultados por Área", 20, 200);

      pdf.setFontSize(10);
      let yPos = 210;

      for (let i = 0; i < 6; i++) {
        const startIndex = i * 4;
        const areaAnswers = answers.slice(startIndex, startIndex + 4);
        const average = (areaAnswers.reduce((sum, val) => sum + val, 0) / 4).toFixed(2);

        pdf.text(`${AREA_NAMES[i]}: ${average}/4.00`, 20, yPos);
        yPos += 8;
      }

      // Fecha
      pdf.setFontSize(8);
      pdf.text(`Generado: ${new Date().toLocaleDateString()}`, 105, 285, { align: "center" });

      pdf.save(`cubo-integrate-${participantCode}.pdf`);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  // Exportar como JSON
  const exportAsJSON = () => {
    setIsExporting(true);
    try {
      const data = {
        participantCode,
        timestamp: new Date().toISOString(),
        areas: AREA_NAMES.map((name, index) => {
          const startIndex = index * 4;
          const areaAnswers = answers.slice(startIndex, startIndex + 4);
          const average = areaAnswers.reduce((sum, val) => sum + val, 0) / 4;

          return {
            name,
            index,
            answers: areaAnswers,
            average: parseFloat(average.toFixed(2)),
          };
        }),
        rawAnswers: answers,
      };

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `datos-integrate-${participantCode}.json`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting JSON:", error);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  // Exportar como CSV
  const exportAsCSV = () => {
    setIsExporting(true);
    try {
      let csv = "Área,Pregunta 1,Pregunta 2,Pregunta 3,Pregunta 4,Promedio\n";

      for (let i = 0; i < 6; i++) {
        const startIndex = i * 4;
        const areaAnswers = answers.slice(startIndex, startIndex + 4);
        const average = (areaAnswers.reduce((sum, val) => sum + val, 0) / 4).toFixed(2);

        csv += `"${AREA_NAMES[i]}",${areaAnswers.join(",")},${average}\n`;
      }

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `datos-integrate-${participantCode}.csv`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        }}
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">{isExporting ? 'Exportando...' : 'Exportar'}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && !isExporting && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div
            className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
            }}
          >
            <button
              onClick={exportAsPNG}
              className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">🖼️</span>
              <span>Imagen PNG</span>
            </button>

            <button
              onClick={exportAsPDF}
              className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">📄</span>
              <span>Documento PDF</span>
            </button>

            <button
              onClick={exportAsJSON}
              className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">📊</span>
              <span>Datos JSON</span>
            </button>

            <button
              onClick={exportAsCSV}
              className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">📈</span>
              <span>Tabla CSV</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

