"use client";

import { useEditorStore } from '@/lib/editor/store';
import { X } from 'lucide-react';
import { useState } from 'react';
import { TextEditor } from './property-editors/TextEditor';
import { LayoutEditor } from './property-editors/LayoutEditor';
import { CubeEditor } from './property-editors/CubeEditor';
import { ButtonEditor } from './property-editors/ButtonEditor';
// ➕ NUEVO: Importar editores avanzados
import { TextAdvancedEditor } from './property-editors/TextAdvancedEditor';
import { CubeAdvancedEditor } from './property-editors/CubeAdvancedEditor';
import { ButtonAdvancedEditor } from './property-editors/ButtonAdvancedEditor';
import { CustomElementsPanel } from './CustomElementsPanel'; // ➕ NUEVO

// ============================================
// PANEL LATERAL DEL EDITOR
// ============================================

type Tab = 'text' | 'layout' | 'cube' | 'buttons' | 'elements'; // ➕ elements

export function EditorPanel() {
  const isEditorActive = useEditorStore((state) => state.isEditorActive);
  const selectedComponent = useEditorStore((state) => state.selectedComponent);
  const selectComponent = useEditorStore((state) => state.selectComponent);
  
  const [activeTab, setActiveTab] = useState<Tab>('text');
  
  // No mostrar si el editor no está activo
  if (!isEditorActive) {
    return null;
  }
  
  // Mostrar mensaje si no hay componente seleccionado
  if (!selectedComponent) {
    return (
      <div className="fixed right-0 top-16 bottom-0 w-80 bg-black/95 backdrop-blur-lg border-l border-white/10 p-6">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-6xl mb-4">👆</div>
          <p className="text-white/50 text-sm">
            Haz clic en un componente para editarlo
          </p>
          <p className="text-white/30 text-xs mt-2">
            Los componentes editables tienen un borde azul al pasar el mouse
          </p>
        </div>
      </div>
    );
  }
  
  // ==========================================
  // TABS DISPONIBLES SEGÚN COMPONENTE
  // ==========================================
  
  const tabs: { id: Tab; label: string }[] = [
    { id: 'elements', label: '📦 Elementos' }, // ➕ NUEVO: Tab de elementos personalizados
    { id: 'text', label: 'Texto' },
    { id: 'layout', label: 'Layout' },
  ];

  // Agregar tab de cubo solo para MapaDeSituacion
  if (selectedComponent === 'mapaDeSituacion') {
    tabs.push({ id: 'cube', label: 'Cubo 3D' });
  }

  // Agregar tab de botones para componentes que los tienen
  if (['mapaDeSituacion', 'vistaArea'].includes(selectedComponent)) {
    tabs.push({ id: 'buttons', label: 'Botones' });
  }
  
  // ==========================================
  // NOMBRES AMIGABLES DE COMPONENTES
  // ==========================================
  
  const componentNames: Record<string, string> = {
    mapaDeSituacion: 'Mapa de Situación',
    vistaGeneral: 'Vista General',
    vistaArea: 'Vista de Área',
    panelInferior: 'Panel Inferior',
  };
  
  // ==========================================
  // RENDER
  // ==========================================
  
  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-black/95 backdrop-blur-lg border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div>
          <h3 className="text-white font-semibold text-sm">
            Editando
          </h3>
          <p className="text-white/50 text-xs mt-1">
            {componentNames[selectedComponent]}
          </p>
        </div>
        
        <button
          onClick={() => selectComponent(null)}
          className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'text-white bg-white/5 border-b-2 border-blue-500'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'text' && (
          <>
            {/* Editor avanzado de título */}
            {selectedComponent === 'mapaDeSituacion' && (
              <>
                <TextAdvancedEditor
                  path="components.mapaDeSituacion.title"
                  label="Título Principal"
                />
                <TextAdvancedEditor
                  path="components.mapaDeSituacion.subtitle"
                  label="Subtítulo"
                />
              </>
            )}

            {selectedComponent === 'vistaGeneral' && (
              <TextAdvancedEditor
                path="components.vistaGeneral.title"
                label="Título"
              />
            )}

            {selectedComponent === 'vistaArea' && (
              <TextAdvancedEditor
                path="components.vistaArea.title"
                label="Título"
              />
            )}
          </>
        )}

        {activeTab === 'layout' && (
          <LayoutEditor componentId={selectedComponent} />
        )}

        {activeTab === 'cube' && selectedComponent === 'mapaDeSituacion' && (
          <CubeAdvancedEditor path="components.mapaDeSituacion.cube" />
        )}

        {activeTab === 'buttons' && (
          <>
            {selectedComponent === 'mapaDeSituacion' && (
              <ButtonAdvancedEditor
                path="components.mapaDeSituacion.buttons"
                label="Botones de Equipo"
              />
            )}

            {selectedComponent === 'vistaArea' && (
              <ButtonAdvancedEditor
                path="components.vistaArea.backButton"
                label="Botón Volver"
              />
            )}
          </>
        )}

        {/* ➕ NUEVO: Tab de elementos personalizados */}
        {activeTab === 'elements' && (
          <CustomElementsPanel />
        )}
      </div>
    </div>
  );
}

