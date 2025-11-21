import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { AREA_NAMES, SUB_AREA_NAMES } from "./constants";

export interface PDFData {
  participantCode: string;
  timestamp: number;
  answers: number[];
  averageScore: number;
}

/**
 * Generar PDF de resultados individuales
 */
export async function generateResultsPDF(data: PDFData): Promise<void> {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Título
  pdf.setFontSize(24);
  pdf.setTextColor(79, 70, 229); // Indigo
  pdf.text("Test de Nivel - Resultados", pageWidth / 2, yPosition, { align: "center" });

  yPosition += 15;

  // Información del participante
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Código de Participante: ${data.participantCode}`, 20, yPosition);
  yPosition += 7;

  const date = new Date(data.timestamp);
  pdf.text(`Fecha: ${date.toLocaleDateString("es-ES")} ${date.toLocaleTimeString("es-ES")}`, 20, yPosition);
  yPosition += 7;

  pdf.text(`Puntuación Promedio: ${data.averageScore.toFixed(2)} / 4.00`, 20, yPosition);
  yPosition += 7;

  const percentage = (data.averageScore / 4) * 100;
  pdf.text(`Porcentaje: ${percentage.toFixed(0)}%`, 20, yPosition);
  yPosition += 15;

  // Línea separadora
  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 10;

  // Resultados por área
  pdf.setFontSize(16);
  pdf.setTextColor(79, 70, 229);
  pdf.text("Resultados por Área", 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);

  for (let areaIndex = 0; areaIndex < 6; areaIndex++) {
    const areaName = AREA_NAMES[areaIndex];
    const startIndex = areaIndex * 4;
    const areaAnswers = data.answers.slice(startIndex, startIndex + 4);
    const areaAverage = areaAnswers.reduce((sum, val) => sum + val, 0) / 4;

    // Nombre del área
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${areaName}`, 20, yPosition);
    yPosition += 6;

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");

    // Preguntas del área
    for (let qIndex = 0; qIndex < 4; qIndex++) {
      const questionIndex = startIndex + qIndex;
      const label = SUB_AREA_NAMES[questionIndex];
      const answer = areaAnswers[qIndex];

      // Verificar si necesitamos nueva página
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.text(`  • ${label}: ${answer}/4`, 25, yPosition);
      yPosition += 5;
    }

    // Promedio del área
    pdf.setFont("helvetica", "bold");
    pdf.text(`  Promedio del área: ${areaAverage.toFixed(2)}/4`, 25, yPosition);
    yPosition += 8;
    pdf.setFont("helvetica", "normal");

    // Línea separadora
    if (areaIndex < 5) {
      pdf.setDrawColor(230, 230, 230);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 6;
    }
  }

  // Nueva página para análisis
  pdf.addPage();
  yPosition = 20;

  // Análisis y recomendaciones
  pdf.setFontSize(16);
  pdf.setTextColor(79, 70, 229);
  pdf.text("Análisis y Recomendaciones", 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);

  // Análisis por nivel
  if (data.averageScore >= 3.5) {
    pdf.text("Nivel: EXCELENTE", 20, yPosition);
    yPosition += 7;
    pdf.text("Has demostrado un dominio excepcional en todas las áreas evaluadas.", 20, yPosition);
    yPosition += 5;
    pdf.text("Continúa desarrollando tus fortalezas y considera compartir tu conocimiento", 20, yPosition);
    yPosition += 5;
    pdf.text("con otros miembros del equipo.", 20, yPosition);
  } else if (data.averageScore >= 2.5) {
    pdf.text("Nivel: BUENO", 20, yPosition);
    yPosition += 7;
    pdf.text("Tienes un buen nivel de competencia en las áreas evaluadas.", 20, yPosition);
    yPosition += 5;
    pdf.text("Identifica las áreas con puntuaciones más bajas y enfoca tu desarrollo", 20, yPosition);
    yPosition += 5;
    pdf.text("en mejorar esas competencias específicas.", 20, yPosition);
  } else if (data.averageScore >= 1.5) {
    pdf.text("Nivel: EN DESARROLLO", 20, yPosition);
    yPosition += 7;
    pdf.text("Estás en proceso de desarrollo de estas competencias.", 20, yPosition);
    yPosition += 5;
    pdf.text("Recomendamos crear un plan de acción enfocado en las áreas con menor", 20, yPosition);
    yPosition += 5;
    pdf.text("puntuación y buscar oportunidades de práctica y formación.", 20, yPosition);
  } else {
    pdf.text("Nivel: INICIAL", 20, yPosition);
    yPosition += 7;
    pdf.text("Hay oportunidades significativas de mejora en varias áreas.", 20, yPosition);
    yPosition += 5;
    pdf.text("Sugerimos trabajar con un mentor o formador para desarrollar un plan", 20, yPosition);
    yPosition += 5;
    pdf.text("estructurado de desarrollo de competencias.", 20, yPosition);
  }

  yPosition += 15;

  // Áreas de fortaleza
  const sortedAreas = AREA_NAMES.map((name, index) => {
    const startIndex = index * 4;
    const areaAnswers = data.answers.slice(startIndex, startIndex + 4);
    const average = areaAnswers.reduce((sum, val) => sum + val, 0) / 4;
    return { name, average };
  }).sort((a, b) => b.average - a.average);

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Áreas de Fortaleza:", 20, yPosition);
  yPosition += 7;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  for (let i = 0; i < 3; i++) {
    pdf.text(`${i + 1}. ${sortedAreas[i].name} (${sortedAreas[i].average.toFixed(2)}/4)`, 25, yPosition);
    yPosition += 6;
  }

  yPosition += 5;

  // Áreas de mejora
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Áreas de Mejora:", 20, yPosition);
  yPosition += 7;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  for (let i = 5; i >= 3; i--) {
    pdf.text(`${6 - i}. ${sortedAreas[i].name} (${sortedAreas[i].average.toFixed(2)}/4)`, 25, yPosition);
    yPosition += 6;
  }

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    "Test de Nivel - © 2025 - Todos los derechos reservados",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  // Descargar PDF
  pdf.save(`resultados-${data.participantCode}.pdf`);
}

/**
 * Capturar elemento HTML como imagen y agregarlo al PDF
 */
export async function captureElementToPDF(
  elementId: string,
  pdf: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(imgData, "PNG", x, y, width, height);
}

