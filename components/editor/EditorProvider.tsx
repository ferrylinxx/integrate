"use client";

import { useEffect } from 'react';
import { useEditorStore } from '@/lib/editor/store';
import { useHotkeys } from 'react-hotkeys-hook';

// ============================================
// PROVIDER DEL EDITOR CON HOTKEYS
// ============================================

interface EditorProviderProps {
  children: React.ReactNode;
}

export function EditorProvider({ children }: EditorProviderProps) {
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const saveConfig = useEditorStore((state) => state.saveConfig);
  const toggleEditor = useEditorStore((state) => state.toggleEditor);
  const loadConfig = useEditorStore((state) => state.loadConfig);
  const isDirty = useEditorStore((state) => state.isDirty);
  
  // ==========================================
  // CARGAR CONFIGURACIÓN AL MONTAR
  // ==========================================
  
  useEffect(() => {
    loadConfig('editor-user');
  }, [loadConfig]);

  // ==========================================
  // AUTO-GUARDADO CUANDO HAY CAMBIOS
  // ==========================================

  useEffect(() => {
    if (!isDirty) return;

    console.log('💾 Auto-guardado activado (isDirty=true)');

    // Guardar automáticamente después de 2 segundos de inactividad
    const timer = setTimeout(async () => {
      console.log('💾 Ejecutando auto-guardado...');
      await saveConfig();
    }, 2000); // Debounce de 2 segundos

    return () => clearTimeout(timer);
  }, [isDirty, saveConfig]);

  // ==========================================
  // ADVERTIR ANTES DE SALIR SI HAY CAMBIOS
  // ==========================================

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);
  
  // ==========================================
  // HOTKEYS (ATAJOS DE TECLADO)
  // ==========================================
  
  // Ctrl+Z: Deshacer
  useHotkeys('ctrl+z, meta+z', (e) => {
    e.preventDefault();
    undo();
  }, {
    enableOnFormTags: true,
  });
  
  // Ctrl+Shift+Z o Ctrl+Y: Rehacer
  useHotkeys('ctrl+shift+z, meta+shift+z, ctrl+y, meta+y', (e) => {
    e.preventDefault();
    redo();
  }, {
    enableOnFormTags: true,
  });
  
  // Ctrl+S: Guardar
  useHotkeys('ctrl+s, meta+s', async (e) => {
    e.preventDefault();
    await saveConfig();
    
    // Mostrar notificación temporal
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top duration-300';
    notification.textContent = '✅ Configuración guardada';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('animate-out', 'fade-out', 'slide-out-to-top');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  }, {
    enableOnFormTags: true,
  });
  
  // Ctrl+E: Toggle editor
  useHotkeys('ctrl+e, meta+e', (e) => {
    e.preventDefault();
    toggleEditor();
  });
  
  // Escape: Deseleccionar componente
  useHotkeys('escape', () => {
    useEditorStore.getState().selectComponent(null);
  });
  
  // ==========================================
  // RENDER
  // ==========================================
  
  return <>{children}</>;
}

