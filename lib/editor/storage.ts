import { EditorConfig } from './types';
import { DEFAULT_CONFIG } from './default-config';
import { supabase } from '@/lib/supabase';

// ============================================
// GESTOR DE ALMACENAMIENTO DE CONFIGURACIONES
// ============================================

export class ConfigStorage {
  private readonly STORAGE_KEY = 'editor_config';
  
  // ==========================================
  // CAPA PRIMARIA: Supabase (persistencia remota)
  // ==========================================
  
  async saveToSupabase(config: EditorConfig, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('editor_configs')
        .upsert(
          {
            user_id: userId,
            config: config,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id', // Especificar la columna de conflicto
            ignoreDuplicates: false, // Actualizar si existe
          }
        );

      if (error) {
        console.error('Error saving to Supabase:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw new Error(`Supabase error: ${error.message || 'Unknown error'}`);
      }

      console.log('✅ Configuración guardada en Supabase');
    } catch (error) {
      console.error('❌ Error al guardar en Supabase:', error);
      throw error;
    }
  }
  
  async loadFromSupabase(userId: string): Promise<EditorConfig | null> {
    try {
      const { data, error } = await supabase
        .from('editor_configs')
        .select('config')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.warn('No se encontró configuración en Supabase:', error.message);
        return null;
      }
      
      if (data?.config) {
        console.log('✅ Configuración cargada desde Supabase');
        return data.config as EditorConfig;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error al cargar desde Supabase:', error);
      return null;
    }
  }
  
  // ==========================================
  // CAPA SECUNDARIA: localStorage (backup local)
  // ==========================================
  
  saveToLocalStorage(config: EditorConfig): void {
    try {
      const json = JSON.stringify(config);
      localStorage.setItem(this.STORAGE_KEY, json);
      console.log('✅ Configuración guardada en localStorage');
    } catch (error) {
      console.error('❌ Error al guardar en localStorage:', error);
    }
  }
  
  loadFromLocalStorage(): EditorConfig | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        console.log('ℹ️ No hay configuración en localStorage');
        return null;
      }
      
      const config = JSON.parse(stored) as EditorConfig;
      console.log('✅ Configuración cargada desde localStorage');
      return config;
    } catch (error) {
      console.error('❌ Error al cargar desde localStorage:', error);
      return null;
    }
  }
  
  clearLocalStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('✅ localStorage limpiado');
    } catch (error) {
      console.error('❌ Error al limpiar localStorage:', error);
    }
  }
  
  // ==========================================
  // EXPORT/IMPORT JSON
  // ==========================================
  
  exportToJSON(config: EditorConfig): string {
    return JSON.stringify(config, null, 2);
  }
  
  importFromJSON(json: string): EditorConfig {
    try {
      const config = JSON.parse(json) as EditorConfig;
      
      // Validar que tenga la estructura correcta
      if (!config.version || !config.components) {
        throw new Error('Configuración inválida: falta version o components');
      }
      
      console.log('✅ Configuración importada correctamente');
      return config;
    } catch (error) {
      console.error('❌ Error al importar configuración:', error);
      throw new Error('El archivo JSON no es válido');
    }
  }
  
  // ==========================================
  // ESTRATEGIA DE CARGA (con fallback)
  // ==========================================
  
  async load(userId: string): Promise<EditorConfig> {
    console.log('🔄 Cargando configuración...');
    
    // 1. Intentar Supabase primero
    const remote = await this.loadFromSupabase(userId);
    if (remote) {
      // Guardar en localStorage como backup
      this.saveToLocalStorage(remote);
      return remote;
    }
    
    // 2. Fallback a localStorage
    const local = this.loadFromLocalStorage();
    if (local) {
      return local;
    }
    
    // 3. Fallback a configuración por defecto
    console.log('ℹ️ Usando configuración por defecto');
    return DEFAULT_CONFIG;
  }
  
  // ==========================================
  // GUARDAR CON ESTRATEGIA DUAL
  // ==========================================
  
  async save(config: EditorConfig, userId: string): Promise<void> {
    // Crear una copia del config con timestamp actualizado
    const configToSave: EditorConfig = {
      ...config,
      updatedAt: new Date().toISOString(),
    };

    // Guardar en localStorage inmediatamente (sincrónico)
    this.saveToLocalStorage(configToSave);
    console.log('✅ Configuración guardada en localStorage');

    // Intentar guardar en Supabase (asincrónico)
    try {
      await this.saveToSupabase(configToSave, userId);
    } catch (error) {
      console.warn('⚠️ No se pudo guardar en Supabase, pero está guardado en localStorage');
      console.info('💡 Para habilitar sincronización en la nube, crea la tabla editor_configs en Supabase');
      // No lanzar error, ya que localStorage es suficiente
    }
  }
  
  // ==========================================
  // UTILIDADES
  // ==========================================
  
  /**
   * Merge configuración parcial con la actual
   */
  mergeConfig(current: EditorConfig, partial: Partial<EditorConfig>): EditorConfig {
    return {
      ...current,
      ...partial,
      updatedAt: new Date().toISOString(),
    };
  }
  
  /**
   * Validar que la configuración sea válida
   */
  validateConfig(config: any): config is EditorConfig {
    return (
      typeof config === 'object' &&
      config !== null &&
      'version' in config &&
      'components' in config &&
      'global' in config
    );
  }
}

// Singleton instance
export const configStorage = new ConfigStorage();

