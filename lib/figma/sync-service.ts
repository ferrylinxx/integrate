/**
 * Servicio de sincronización entre Figma y Supabase
 */

import { createClient } from "@supabase/supabase-js";
import { FigmaClient } from "./client";

export interface SyncResult {
  success: boolean;
  itemsProcessed: number;
  itemsCreated: number;
  itemsUpdated: number;
  errors: string[];
}

/**
 * Sincroniza contenido de Figma a Supabase
 */
export async function syncFigmaToSupabase(
  figmaClient: FigmaClient,
  fileKey: string,
  tableName: string = "landing_content"
): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    itemsProcessed: 0,
    itemsCreated: 0,
    itemsUpdated: 0,
    errors: [],
  };

  try {
    // 1. Obtener contenido de Figma
    console.log("🎨 Obteniendo contenido de Figma...");
    const content = await figmaClient.syncContent(fileKey);
    result.itemsProcessed = content.length;
    console.log(`✅ ${content.length} elementos encontrados en Figma`);

    // 2. Conectar a Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Configuración de Supabase no encontrada");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 3. Sincronizar cada elemento
    console.log("💾 Sincronizando con Supabase...");
    
    for (const item of content) {
      try {
        // Verificar si el elemento ya existe
        const { data: existing } = await supabase
          .from(tableName)
          .select("id")
          .eq("category", item.category)
          .eq("section_name", item.sectionName)
          .eq("field_name", item.fieldName)
          .eq("language", "es")
          .single();

        if (existing) {
          // Actualizar elemento existente
          const { error } = await supabase
            .from(tableName)
            .update({
              content: item.content,
              is_html: item.isHtml,
              field_label: item.fieldLabel,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);

          if (error) {
            result.errors.push(`Error actualizando ${item.category}/${item.sectionName}/${item.fieldName}: ${error.message}`);
          } else {
            result.itemsUpdated++;
            console.log(`✏️  Actualizado: ${item.category}/${item.sectionName}/${item.fieldName}`);
          }
        } else {
          // Crear nuevo elemento
          const { error } = await supabase
            .from(tableName)
            .insert({
              category: item.category,
              section_name: item.sectionName,
              field_name: item.fieldName,
              field_label: item.fieldLabel,
              content: item.content,
              is_html: item.isHtml,
              language: "es",
              is_active: true,
              display_order: 0,
            });

          if (error) {
            result.errors.push(`Error creando ${item.category}/${item.sectionName}/${item.fieldName}: ${error.message}`);
          } else {
            result.itemsCreated++;
            console.log(`➕ Creado: ${item.category}/${item.sectionName}/${item.fieldName}`);
          }
        }
      } catch (itemError: any) {
        result.errors.push(`Error procesando ${item.category}/${item.sectionName}/${item.fieldName}: ${itemError.message}`);
      }
    }

    result.success = result.errors.length === 0;
    
    console.log("\n📊 Resumen de sincronización:");
    console.log(`   ✅ Procesados: ${result.itemsProcessed}`);
    console.log(`   ➕ Creados: ${result.itemsCreated}`);
    console.log(`   ✏️  Actualizados: ${result.itemsUpdated}`);
    console.log(`   ❌ Errores: ${result.errors.length}`);

    return result;
  } catch (error: any) {
    result.errors.push(`Error general: ${error.message}`);
    return result;
  }
}

