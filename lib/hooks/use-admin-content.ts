"use client";

import { usePageContent, ContentMap } from "./use-page-content";

// Contenido de fallback para el panel de administración
const FALLBACK_ADMIN_CONTENT: ContentMap = {
  "01_Header.Título.principal": { content: "Panel de Administración", is_html: false },
  "01_Header.Título.subtitulo": { content: "Gestión de Grupos y Participantes", is_html: false },
  "02_Grupos.Sección.titulo": { content: "Grupos Activos", is_html: false },
  "02_Grupos.Sección.descripcion": { content: "Administra los grupos de evaluación", is_html: false },
  "02_Grupos.Acciones.crear_grupo": { content: "Crear Nuevo Grupo", is_html: false },
  "03_Participantes.Sección.titulo": { content: "Participantes", is_html: false },
  "03_Participantes.Sección.descripcion": { content: "Visualiza y gestiona los participantes", is_html: false },
  "04_CMS.Sección.titulo": { content: "Gestión de Contenido CMS", is_html: false },
  "04_CMS.Sección.descripcion": { content: "Edita el contenido de las páginas", is_html: false },
  "05_Admins.Sección.titulo": { content: "Administradores", is_html: false },
  "05_Admins.Sección.descripcion": { content: "Gestiona los usuarios administradores", is_html: false },
};

/**
 * Hook para cargar contenido del panel de administración desde Supabase
 * @param language - Idioma del contenido (por defecto 'es')
 * @returns { content, loading, error, refetch }
 */
export function useAdminContent(language: string = "es") {
  return usePageContent("admin", language, FALLBACK_ADMIN_CONTENT);
}

