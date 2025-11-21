import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { EditorStore, ComponentId, EditorConfig } from './types';
import { DEFAULT_CONFIG } from './default-config';
import { configStorage } from './storage';
import { set as setPath, deepClone } from './utils';

// ============================================
// ZUSTAND STORE PARA EL EDITOR
// ============================================

export const useEditorStore = create<EditorStore>()(
  immer((set, get) => ({
    // ==========================================
    // ESTADO INICIAL
    // ==========================================
    isEditorActive: false,
    selectedComponent: null,
    selectedElement: null,
    config: DEFAULT_CONFIG,
    history: [DEFAULT_CONFIG],
    historyIndex: 0,
    isDirty: false,
    
    // ==========================================
    // ACCIONES
    // ==========================================
    
    /**
     * Activar/desactivar modo edición
     */
    toggleEditor: () => {
      set((state) => {
        state.isEditorActive = !state.isEditorActive;
        
        // Si se desactiva, deseleccionar componente
        if (!state.isEditorActive) {
          state.selectedComponent = null;
          state.selectedElement = null;
        }
      });
    },
    
    /**
     * Seleccionar componente
     */
    selectComponent: (id: ComponentId | null) => {
      set((state) => {
        state.selectedComponent = id;
        state.selectedElement = null;
      });
    },
    
    /**
     * Seleccionar elemento dentro de un componente
     */
    selectElement: (id: string | null) => {
      set((state) => {
        state.selectedElement = id;
      });
    },
    
    /**
     * Actualizar configuración
     */
    updateConfig: (path: string, value: any) => {
      console.log(`📝 updateConfig llamado:`, { path, value }); // ➕ NUEVO: Log
      set((state) => {
        // Clonar configuración actual
        const newConfig = deepClone(state.config);

        // Actualizar valor en el path
        setPath(newConfig, path, value);

        console.log(`✅ Valor actualizado en config:`, { path, value, newConfig }); // ➕ NUEVO: Log

        // Actualizar timestamp
        newConfig.updatedAt = new Date().toISOString();

        // Actualizar estado
        state.config = newConfig;
        state.isDirty = true;
        
        // Agregar a historial (limitar a últimos 50)
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(deepClone(newConfig));
        
        if (newHistory.length > 50) {
          newHistory.shift();
        }
        
        state.history = newHistory;
        state.historyIndex = newHistory.length - 1;
      });
    },
    
    /**
     * Deshacer cambio
     */
    undo: () => {
      set((state) => {
        if (state.historyIndex > 0) {
          state.historyIndex--;
          state.config = deepClone(state.history[state.historyIndex]);
          state.isDirty = true;
        }
      });
    },
    
    /**
     * Rehacer cambio
     */
    redo: () => {
      set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex++;
          state.config = deepClone(state.history[state.historyIndex]);
          state.isDirty = true;
        }
      });
    },
    
    /**
     * Resetear a configuración por defecto
     */
    resetToDefault: () => {
      const confirmed = confirm(
        '¿Estás seguro de que quieres resetear toda la configuración a los valores por defecto?'
      );
      
      if (!confirmed) return;
      
      set((state) => {
        const newConfig = deepClone(DEFAULT_CONFIG);
        newConfig.createdAt = new Date().toISOString();
        newConfig.updatedAt = new Date().toISOString();
        
        state.config = newConfig;
        state.history = [newConfig];
        state.historyIndex = 0;
        state.isDirty = true;
      });
    },
    
    /**
     * Guardar configuración
     */
    saveConfig: async () => {
      const state = get();
      
      try {
        // Usar 'editor-user' como userId por defecto
        // En producción, esto vendría del sistema de autenticación
        await configStorage.save(state.config, 'editor-user');
        
        set((state) => {
          state.isDirty = false;
        });
        
        console.log('✅ Configuración guardada exitosamente');
      } catch (error) {
        console.error('❌ Error al guardar configuración:', error);
        alert('Error al guardar la configuración. Revisa la consola para más detalles.');
      }
    },
    
    /**
     * Cargar configuración
     */
    loadConfig: async (userId: string = 'editor-user') => {
      try {
        const config = await configStorage.load(userId);
        
        set((state) => {
          state.config = config;
          state.history = [config];
          state.historyIndex = 0;
          state.isDirty = false;
        });
        
        console.log('✅ Configuración cargada exitosamente');
      } catch (error) {
        console.error('❌ Error al cargar configuración:', error);
        alert('Error al cargar la configuración. Se usará la configuración por defecto.');
      }
    },
    
    /**
     * Exportar configuración a JSON
     */
    exportConfig: () => {
      const state = get();
      return configStorage.exportToJSON(state.config);
    },
    
    /**
     * Importar configuración desde JSON
     */
    importConfig: (json: string) => {
      try {
        const config = configStorage.importFromJSON(json);
        
        set((state) => {
          state.config = config;
          state.history = [config];
          state.historyIndex = 0;
          state.isDirty = true;
        });
        
        console.log('✅ Configuración importada exitosamente');
      } catch (error) {
        console.error('❌ Error al importar configuración:', error);
        alert('Error al importar la configuración. Verifica que el archivo JSON sea válido.');
      }
    },
  }))
);

// ==========================================
// HOOKS PERSONALIZADOS
// ==========================================

/**
 * Hook para verificar si hay cambios sin guardar
 */
export function useUnsavedChanges(): boolean {
  return useEditorStore((state) => state.isDirty);
}

/**
 * Hook para verificar si se puede deshacer
 */
export function useCanUndo(): boolean {
  return useEditorStore((state) => state.historyIndex > 0);
}

/**
 * Hook para verificar si se puede rehacer
 */
export function useCanRedo(): boolean {
  return useEditorStore((state) => 
    state.historyIndex < state.history.length - 1
  );
}

