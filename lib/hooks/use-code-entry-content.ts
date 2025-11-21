"use client";

import { usePageContent, ContentMap } from "./use-page-content";

// Contenido de fallback para la página de entrada de código
const FALLBACK_CODE_ENTRY_CONTENT: ContentMap = {
  "01_Header.Título.principal": { content: "Acceso al Test", is_html: false },
  "01_Header.Título.subtitulo": { content: "Ingresa el código de tu grupo", is_html: false },
  "02_Formulario.Instrucciones.titulo": { content: "Código de Grupo", is_html: false },
  "02_Formulario.Instrucciones.descripcion": { content: "Ingresa el código proporcionado por tu administrador", is_html: false },
  "02_Formulario.Campos.placeholder_codigo": { content: "Ingresa el código", is_html: false },
  "02_Formulario.Campos.placeholder_nombre": { content: "Tu nombre (opcional)", is_html: false },
  "03_Acciones.Botones.continuar": { content: "Continuar al Test", is_html: false },
  "03_Acciones.Botones.volver": { content: "Volver al Inicio", is_html: false },
  "04_Mensajes.Error.codigo_invalido": { content: "Código inválido. Por favor verifica e intenta nuevamente.", is_html: false },
  "04_Mensajes.Error.codigo_requerido": { content: "El código es requerido", is_html: false },
};

/**
 * Hook para cargar contenido de la página de entrada de código desde Supabase
 * @param language - Idioma del contenido (por defecto 'es')
 * @returns { content, loading, error, refetch }
 */
export function useCodeEntryContent(language: string = "es") {
  return usePageContent("code_entry", language, FALLBACK_CODE_ENTRY_CONTENT);
}

