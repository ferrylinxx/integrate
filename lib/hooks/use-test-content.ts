"use client";

import { usePageContent, ContentMap } from "./use-page-content";

// Contenido de fallback para la página de test
const FALLBACK_TEST_CONTENT: ContentMap = {
  "01_Header.Navegación.titulo": { content: "Test INTEGRATE 2.0", is_html: false },
  "01_Header.Navegación.subtitulo": { content: "Diagnóstico de Áreas Sensibles", is_html: false },
  "02_Progreso.Barra.texto_progreso": { content: "Progreso del Test", is_html: false },
  "03_Preguntas.Instrucciones.titulo": { content: "Responde las siguientes preguntas", is_html: false },
  "03_Preguntas.Instrucciones.descripcion": { content: "Selecciona el nivel que mejor represente la situación actual de tu organización", is_html: false },
  "04_Acciones.Botones.guardar_borrador": { content: "Guardar Borrador", is_html: false },
  "04_Acciones.Botones.enviar_respuestas": { content: "Enviar Respuestas", is_html: false },
  "04_Acciones.Botones.descartar_borrador": { content: "Descartar Borrador", is_html: false },
};

/**
 * Hook para cargar contenido de la página de test desde Supabase
 * @param language - Idioma del contenido (por defecto 'es')
 * @returns { content, loading, error, refetch }
 */
export function useTestContent(language: string = "es") {
  return usePageContent("test", language, FALLBACK_TEST_CONTENT);
}

