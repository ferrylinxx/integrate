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

// Textos de fallback en caso de error
const FALLBACK_CONTENT: ContentMap = {
  "01_Portada.Hero Principal.badge": { content: "Modelo INTEGRATE 2.0 · Diagnóstico Organizativo", is_html: false },
  "01_Portada.Hero Principal.titulo": { content: "Descubre las Áreas Sensibles de tu Organización", is_html: false },
  "01_Portada.Hero Principal.subtitulo": { content: "Diagnóstico organizativo basado en el modelo INTEGRATE 2.0. Identifica fortalezas y oportunidades de mejora en 6 dimensiones clave.", is_html: false },
  "01_Portada.Hero Principal.frase_inspiradora": { content: "Este test ayuda a comprender cómo funciona el sistema, no a juzgarlo.", is_html: false },
  "01_Portada.Hero Principal.boton_principal": { content: "Comenzar Test", is_html: false },
};

// Cache en memoria
let contentCache: ContentMap | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Hook para cargar contenido de la landing page desde Supabase
 * @param language - Idioma del contenido (por defecto 'es')
 * @returns { content, loading, error, refetch }
 */
export function useLandingContent(language: string = "es") {
  const [content, setContent] = useState<ContentMap>(FALLBACK_CONTENT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContent = async () => {
    try {
      // Verificar si hay cache válido
      const now = Date.now();
      if (contentCache && (now - cacheTimestamp) < CACHE_DURATION) {
        console.log("📦 Usando contenido del caché");
        setContent(contentCache);
        setLoading(false);
        return;
      }

      console.log("🔄 Cargando contenido desde Supabase...");
      setLoading(true);
      setError(null);

      // Obtener contenido de Supabase
      const { data, error: fetchError } = await supabase
        .from("landing_content")
        .select("*")
        .eq("language", language)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (fetchError) {
        throw new Error(`Error al cargar contenido: ${fetchError.message}`);
      }

      if (!data || data.length === 0) {
        console.warn("No se encontró contenido en Supabase, usando fallback");
        setContent(FALLBACK_CONTENT);
        setLoading(false);
        return;
      }

      console.log(`✅ Contenido cargado: ${data.length} campos`);

      // Convertir array a mapa de contenido
      const contentMap: ContentMap = {};
      data.forEach((item: ContentItem) => {
        // Crear clave única: "category.section_name.field_name"
        const key = `${item.category}.${item.section_name}.${item.field_name}`;
        contentMap[key] = {
          content: item.content,
          is_html: item.is_html || false
        };
      });

      // Actualizar cache
      contentCache = contentMap;
      cacheTimestamp = now;

      setContent(contentMap);
      setLoading(false);
      console.log("✅ Estado actualizado con nuevo contenido");
    } catch (err) {
      console.error("Error en useLandingContent:", err);
      setError(err as Error);
      setContent(FALLBACK_CONTENT);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();

    // Escuchar evento de actualización de contenido
    const handleContentUpdate = () => {
      console.log("🔄 Evento recibido: Recargando contenido...");
      fetchContent();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('landing-content-updated', handleContentUpdate);
    }

    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('landing-content-updated', handleContentUpdate);
      }
    };
  }, [language]);

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
  const fallbackItem = FALLBACK_CONTENT[key];
  if (fallbackItem) {
    return fallbackItem.content;
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
  const fallbackItem = FALLBACK_CONTENT[key];
  if (fallbackItem) {
    return { content: fallbackItem.content, isHtml: fallbackItem.is_html };
  }
  return { content: fallback || key, isHtml: false };
}

/**
 * Función para invalidar el caché manualmente
 * Útil cuando se actualiza contenido desde el CMS
 */
export function invalidateContentCache() {
  contentCache = null;
  cacheTimestamp = 0;
  console.log("✅ Caché de contenido invalidado");

  // Disparar evento personalizado para notificar a todos los componentes
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('landing-content-updated'));
    console.log("📢 Evento 'landing-content-updated' disparado");
  }
}

/**
 * Hook para actualizar contenido (solo para admins)
 */
export function useUpdateLandingContent() {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<Error | null>(null);

  const updateContent = async (
    id: string,
    newContent: string
  ): Promise<boolean> => {
    try {
      setUpdating(true);
      setUpdateError(null);

      const { error } = await supabase
        .from("landing_content")
        .update({
          content: newContent,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) {
        throw new Error(`Error al actualizar contenido: ${error.message}`);
      }

      // Invalidar cache
      invalidateContentCache();

      setUpdating(false);
      return true;
    } catch (err) {
      console.error("Error en updateContent:", err);
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

