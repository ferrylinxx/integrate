"use client";

import { useEditorStore, useCanUndo, useCanRedo, useUnsavedChanges } from '@/lib/editor/store';
import { Eye, Palette, Undo2, Redo2, Save, RotateCcw, Download, Upload, Grid2X2 } from 'lucide-react';
import { useRef, useState } from 'react'; // ➕ useState
import { AddElementMenu } from './AddElementMenu'; // ➕ NUEVO
import { AddElementModal } from './AddElementModal'; // ➕ NUEVO
import { CustomElement } from '@/lib/editor/types'; // ➕ NUEVO

// ============================================
// TOOLBAR SUPERIOR DEL EDITOR
// ============================================

export function EditorToolbar() {
  const isEditorActive = useEditorStore((state) => state.isEditorActive);
  const toggleEditor = useEditorStore((state) => state.toggleEditor);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const saveConfig = useEditorStore((state) => state.saveConfig);
  const resetToDefault = useEditorStore((state) => state.resetToDefault);
  const exportConfig = useEditorStore((state) => state.exportConfig);
  const importConfig = useEditorStore((state) => state.importConfig);
  const updateConfig = useEditorStore((state) => state.updateConfig);
  const config = useEditorStore((state) => state.config); // ➕ NUEVO

  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const hasUnsavedChanges = useUnsavedChanges();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ➕ NUEVO: Estado para el modal de añadir elemento
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedElementType, setSelectedElementType] = useState<{ type: string; subtype: string }>({ type: '', subtype: '' });
  
  // ==========================================
  // HANDLERS
  // ==========================================
  
  const handleExport = () => {
    const json = exportConfig();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `editor-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      importConfig(json);
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSave = async () => {
    await saveConfig();
    alert('✅ Configuración guardada exitosamente');
  };

  // ➕ NUEVO: Resetear solo las posiciones del layout (volver al grid original)
  const handleResetLayout = async () => {
    if (!confirm('¿Resetear todas las posiciones al layout grid original? Los estilos se mantendrán.')) {
      return;
    }

    // Resetear posiciones de layouts principales
    updateConfig('components.mapaDeSituacion.layout.position', { x: 0, y: 0 });
    updateConfig('components.vistaGeneral.layout.position', { x: 960, y: 0 }); // 50vw en 1920px
    updateConfig('components.vistaArea.layout.position', { x: 0, y: 0 });
    updateConfig('components.panelInferior.layout.position', { x: 0, y: 880 }); // Altura - 200px

    // Resetear posiciones de elementos internos
    updateConfig('components.mapaDeSituacion.title.layout.position', { x: 0, y: 0 });
    updateConfig('components.mapaDeSituacion.subtitle.layout.position', { x: 0, y: 30 });
    updateConfig('components.mapaDeSituacion.cube.layout.position', { x: 0, y: 0 });

    await saveConfig();
    alert('✅ Layout reseteado al grid original');
  };

  // ➕ NUEVO: Manejar añadir elemento
  const handleAddElement = (type: string, subtype?: string) => {
    setSelectedElementType({ type, subtype: subtype || '' });
    setShowAddModal(true);
  };

  // ➕ NUEVO: Confirmar creación de elemento
  const handleConfirmElement = (elementConfig: any) => {
    const newElement: CustomElement = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: selectedElementType.type as any,
      subtype: selectedElementType.subtype,
      content: elementConfig.content,
      layout: {
        position: { x: 400, y: 300 }, // Centro de la pantalla aproximadamente
        size: elementConfig.width && elementConfig.height
          ? { width: elementConfig.width, height: elementConfig.height }
          : undefined,
      },
      styles: {
        fontFamily: elementConfig.fontFamily,
        fontSize: elementConfig.fontSize,
        fontWeight: elementConfig.fontWeight,
        color: elementConfig.color,
        backgroundColor: elementConfig.backgroundColor,
        borderRadius: elementConfig.borderRadius,
        textAlign: elementConfig.textAlign,
      },
      visible: true,
      locked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // ➕ DEBUG: Log del elemento creado
    console.log('✅ Elemento creado:', newElement);

    // Añadir al array de customElements
    const currentElements = config.customElements || [];
    const updatedElements = [...currentElements, newElement];

    console.log('📦 Array de elementos actualizado:', {
      antes: currentElements.length,
      despues: updatedElements.length,
      elementos: updatedElements,
    });

    updateConfig('customElements', updatedElements);

    console.log(`✅ Elemento "${selectedElementType.subtype}" añadido en posición (${newElement.layout.position.x}, ${newElement.layout.position.y})`);
    alert(`✅ Elemento "${selectedElementType.subtype}" añadido en posición (${newElement.layout.position.x}, ${newElement.layout.position.y})`);
  };
  
  // ==========================================
  // RENDER
  // ==========================================
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo y Modo */}
        <div className="flex items-center gap-4">
          <h1 className="text-white font-semibold text-sm">
            Editor Visual
          </h1>
          
          <button
            onClick={toggleEditor}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              isEditorActive
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {isEditorActive ? (
              <>
                <Palette className="w-4 h-4" />
                Modo Edición
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Modo Vista
              </>
            )}
          </button>
          
          {hasUnsavedChanges && (
            <span className="text-yellow-400 text-xs">
              ● Cambios sin guardar
            </span>
          )}
        </div>
        
        {/* Controles (solo visible en modo edición) */}
        {isEditorActive && (
          <div className="flex items-center gap-2">
            {/* ➕ NUEVO: Botón Añadir Elemento */}
            <div className="border-r border-white/10 pr-2">
              <AddElementMenu onAddElement={handleAddElement} />
            </div>

            {/* Undo/Redo */}
            <div className="flex items-center gap-1 border-r border-white/10 pr-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className={`p-2 rounded-lg transition-all ${
                  canUndo
                    ? 'text-white hover:bg-white/10'
                    : 'text-white/30 cursor-not-allowed'
                }`}
                title="Deshacer (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              
              <button
                onClick={redo}
                disabled={!canRedo}
                className={`p-2 rounded-lg transition-all ${
                  canRedo
                    ? 'text-white hover:bg-white/10'
                    : 'text-white/30 cursor-not-allowed'
                }`}
                title="Rehacer (Ctrl+Shift+Z)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
            
            {/* Export/Import */}
            <div className="flex items-center gap-1 border-r border-white/10 pr-2">
              <button
                onClick={handleExport}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-all"
                title="Exportar configuración"
              >
                <Download className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-all"
                title="Importar configuración"
              >
                <Upload className="w-4 h-4" />
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
            
            {/* Guardar/Resetear */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-all shadow-lg shadow-green-500/30"
                title="Guardar (Ctrl+S)"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>

              {/* ➕ NUEVO: Botón para resetear solo el layout */}
              <button
                onClick={handleResetLayout}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg text-xs font-medium transition-all"
                title="Resetear posiciones al grid original (mantiene estilos)"
              >
                <Grid2X2 className="w-4 h-4" />
                Resetear Layout
              </button>

              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-medium transition-all"
                title="Resetear TODO a valores por defecto"
              >
                <RotateCcw className="w-4 h-4" />
                Resetear Todo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ➕ NUEVO: Modal para configurar nuevo elemento */}
      <AddElementModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        elementType={selectedElementType.type}
        elementSubtype={selectedElementType.subtype}
        onConfirm={handleConfirmElement}
      />
    </div>
  );
}

