"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

// Tipos
export interface ContentItem {
  id: string;
  category: string;
  section_name: string;
  field_name: string;
  field_label: string;
  content: string;
  language: string;
  display_order: number;
  is_active: boolean;
  is_html: boolean;
}

export interface ContentValue {
  content: string;
  is_html: boolean;
}

export type ContentMap = Record<string, ContentValue>;

// Tipos de páginas soportadas
export type PageType = "test" | "results" | "admin" | "code_entry";

// Mapeo de tipos de página a nombres de tabla
const PAGE_TABLE_MAP: Record<PageType, string> = {
  test: "test_content",
  results: "results_content",
  admin: "admin_content",
  code_entry: "code_entry_content",
};

// Mapeo de tipos de página a nombres de eventos
const PAGE_EVENT_MAP: Record<PageType, string> = {
  test: "test-content-updated",
  results: "results-content-updated",
  admin: "admin-content-updated",
  code_entry: "code-entry-content-updated",
};

// Cache en memoria por página
const contentCaches: Record<PageType, ContentMap | null> = {
  test: null,
  results: null,
  admin: null,
  code_entry: null,
};

const cacheTimestamps: Record<PageType, number> = {
  test: 0,
  results: 0,
  admin: 0,
  code_entry: 0,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Hook genérico para cargar contenido de cualquier página desde Supabase
 * @param pageType - Tipo de página ('test', 'results', 'admin', 'code_entry')
 * @param language - Idioma del contenido (por defecto 'es')
 * @param fallbackContent - Contenido de fallback en caso de error
 * @returns { content, loading, error, refetch }
 */
export function usePageContent(
  pageType: PageType,
  language: string = "es",
  fallbackContent: ContentMap = {}
) {
  const [content, setContent] = useState<ContentMap>(fallbackContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const tableName = PAGE_TABLE_MAP[pageType];
  const eventName = PAGE_EVENT_MAP[pageType];

  const fetchContent = async () => {
    try {
      // Verificar si hay cache válido
      const now = Date.now();
      const cachedContent = contentCaches[pageType];
      const cachedTimestamp = cacheTimestamps[pageType];

      if (cachedContent && (now - cachedTimestamp) < CACHE_DURATION) {
        console.log(`📦 [${pageType}] Usando contenido del caché`);
        setContent(cachedContent);
        setLoading(false);
        return;
      }

      console.log(`🔄 [${pageType}] Cargando contenido desde Supabase...`);
      setLoading(true);
      setError(null);

      // Obtener contenido de Supabase
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select("*")
        .eq("language", language)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (fetchError) {
        throw new Error(`Error al cargar contenido: ${fetchError.message}`);
      }

      if (!data || data.length === 0) {
        console.warn(`⚠️ [${pageType}] No se encontró contenido en Supabase, usando fallback`);
        setContent(fallbackContent);
        setLoading(false);
        return;
      }

      console.log(`✅ [${pageType}] Contenido cargado: ${data.length} campos`);

      // Convertir array a mapa de contenido
      const contentMap: ContentMap = {};
      data.forEach((item: any) => {
        // Crear clave única: "category.section_name.field_name"
        const key = `${item.category}.${item.section_name}.${item.field_name}`;
        contentMap[key] = {
          content: item.content,
          is_html: item.is_html || false
        };
      });

      // Actualizar cache
      contentCaches[pageType] = contentMap;
      cacheTimestamps[pageType] = now;

      setContent(contentMap);
      setLoading(false);
      console.log(`✅ [${pageType}] Estado actualizado con nuevo contenido`);
    } catch (err) {
      console.error(`❌ [${pageType}] Error en usePageContent:`, err);
      setError(err as Error);
      setContent(fallbackContent);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();

    // Escuchar evento de actualización de contenido
    const handleContentUpdate = () => {
      console.log(`🔄 [${pageType}] Evento recibido: Recargando contenido...`);
      fetchContent();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(eventName, handleContentUpdate);
    }

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(eventName, handleContentUpdate);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, pageType]);

  return {
    content,
    loading,
    error,
    refetch: fetchContent,
  };
}

/**
 * Función helper para obtener un texto específico (solo texto, sin HTML)
 * @param content - Mapa de contenido
 * @param key - Clave del texto (ej: "hero.title")
 * @param fallback - Texto de fallback opcional
 * @returns El texto solicitado o el fallback
 */
export function getContent(
  content: ContentMap,
  key: string,
  fallback: string = ""
): string {
  const item = content[key];
  if (item) {
    return item.content;
  }
  return fallback || key;
}

/**
 * Función helper para renderizar contenido (HTML o texto)
 * Úsala cuando necesites renderizar contenido que puede contener HTML
 * @param content - Mapa de contenido
 * @param key - Clave del texto
 * @param fallback - Texto de fallback opcional
 * @returns Objeto con el contenido y si es HTML
 */
export function getContentWithHtml(
  content: ContentMap,
  key: string,
  fallback: string = ""
): { content: string; isHtml: boolean } {
  const item = content[key];
  if (item) {
    return { content: item.content, isHtml: item.is_html };
  }
  return { content: fallback || key, isHtml: false };
}

/**
 * Función para invalidar el caché manualmente
 * Útil cuando se actualiza contenido desde el CMS
 */
export function invalidatePageContentCache(pageType: PageType) {
  contentCaches[pageType] = null;
  cacheTimestamps[pageType] = 0;
  console.log(`✅ [${pageType}] Caché de contenido invalidado`);

  // Disparar evento personalizado para notificar a todos los componentes
  if (typeof window !== 'undefined') {
    const eventName = PAGE_EVENT_MAP[pageType];
    window.dispatchEvent(new CustomEvent(eventName));
    console.log(`📢 [${pageType}] Evento '${eventName}' disparado`);
  }
}

/**
 * Hook para actualizar contenido (solo para admins)
 */
export function useUpdatePageContent(pageType: PageType) {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<Error | null>(null);

  const tableName = PAGE_TABLE_MAP[pageType];

  const updateContent = async (
    id: string,
    newContent: string
  ): Promise<boolean> => {
    try {
      setUpdating(true);
      setUpdateError(null);

      const { error } = await supabase
        .from(tableName)
        .update({
          content: newContent,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) {
        throw new Error(`Error al actualizar contenido: ${error.message}`);
      }

      // Invalidar cache
      invalidatePageContentCache(pageType);

      setUpdating(false);
      return true;
    } catch (err) {
      console.error(`❌ [${pageType}] Error en updateContent:`, err);
      setUpdateError(err as Error);
      setUpdating(false);
      return false;
    }
  };

  return {
    updateContent,
    updating,
    updateError,
  };
}

