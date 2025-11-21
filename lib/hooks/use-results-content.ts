"use client";

import { usePageContent, ContentMap } from "./use-page-content";

// Contenido de fallback para la página de resultados
const FALLBACK_RESULTS_CONTENT: ContentMap = {
  "01_Header.Título.principal": { content: "Resultados del Diagnóstico", is_html: false },
  "01_Header.Título.subtitulo": { content: "Análisis de Áreas Sensibles INTEGRATE 2.0", is_html: false },
  "02_Resumen.Métricas.puntuacion_promedio": { content: "Puntuación Promedio", is_html: false },
  "02_Resumen.Métricas.areas_evaluadas": { content: "Áreas Evaluadas", is_html: false },
  "03_Visualización.Cubo.titulo": { content: "Visualización 3D de Resultados", is_html: false },
  "03_Visualización.Cubo.descripcion": { content: "Explora tus resultados en el cubo interactivo", is_html: false },
  "04_Insights.Análisis.titulo": { content: "Análisis Detallado", is_html: false },
  "04_Insights.Análisis.descripcion": { content: "Insights y recomendaciones basadas en tus respuestas", is_html: false },
  "05_Acciones.Botones.descargar_pdf": { content: "Descargar PDF", is_html: false },
  "05_Acciones.Botones.volver_inicio": { content: "Volver al Inicio", is_html: false },
};

/**
 * Hook para cargar contenido de la página de resultados desde Supabase
 * @param language - Idioma del contenido (por defecto 'es')
 * @returns { content, loading, error, refetch }
 */
export function useResultsContent(language: string = "es") {
  return usePageContent("results", language, FALLBACK_RESULTS_CONTENT);
}

