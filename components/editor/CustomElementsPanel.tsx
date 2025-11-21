"use client";

import { useEditorStore } from '@/lib/editor/store';
import { CustomElement } from '@/lib/editor/types';
import { 
  Trash2, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Type,
  Image as ImageIcon,
  Video,
  Square,
  MousePointer2,
  Code,
  BarChart3,
  Hash,
  Table,
  Sparkles,
} from 'lucide-react';

// ============================================
// PANEL DE ELEMENTOS PERSONALIZADOS
// ============================================

export function CustomElementsPanel() {
  const config = useEditorStore((state) => state.config);
  const updateConfig = useEditorStore((state) => state.updateConfig);
  const customElements = config.customElements || [];

  // Obtener icono según el tipo de elemento
  const getElementIcon = (element: CustomElement) => {
    switch (element.type) {
      case 'text': return Type;
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'button': return MousePointer2;
      case 'shape': return Square;
      case 'html': return Code;
      case 'table': return Table;
      case 'chart': return BarChart3;
      case 'metric': return Hash;
      case 'custom': return Sparkles;
      default: return Square;
    }
  };

  // Obtener nombre legible del elemento
  const getElementName = (element: CustomElement) => {
    if (element.type === 'text') {
      return `${element.subtype?.toUpperCase()} - ${element.content?.substring(0, 20) || 'Sin texto'}`;
    }
    if (element.type === 'button') {
      return `Botón - ${element.content?.text || 'Sin texto'}`;
    }
    if (element.type === 'image') {
      return `Imagen`;
    }
    if (element.type === 'video') {
      return `Video`;
    }
    if (element.type === 'shape') {
      return `${element.subtype === 'circle' ? 'Círculo' : element.subtype === 'rectangle' ? 'Rectángulo' : 'Separador'}`;
    }
    return `${element.type} - ${element.subtype || 'Sin nombre'}`;
  };

  // Eliminar elemento
  const handleDelete = (elementId: string) => {
    if (!confirm('¿Eliminar este elemento?')) return;
    
    const updatedElements = customElements.filter(el => el.id !== elementId);
    updateConfig('customElements', updatedElements);
    console.log('🗑️ Elemento eliminado:', elementId);
  };

  // Toggle visible/oculto
  const handleToggleVisible = (elementId: string) => {
    const updatedElements = customElements.map(el => 
      el.id === elementId ? { ...el, visible: !el.visible } : el
    );
    updateConfig('customElements', updatedElements);
    console.log('👁️ Toggle visible:', elementId);
  };

  // Toggle bloqueado/desbloqueado
  const handleToggleLock = (elementId: string) => {
    const updatedElements = customElements.map(el => 
      el.id === elementId ? { ...el, locked: !el.locked } : el
    );
    updateConfig('customElements', updatedElements);
    console.log('🔒 Toggle lock:', elementId);
  };

  // Centrar vista en elemento (scroll to element)
  const handleCenterView = (element: CustomElement) => {
    // Buscar el elemento en el DOM por su ID
    const domElement = document.querySelector(`[data-element-id="${element.id}"]`);
    if (domElement) {
      domElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      console.log('🎯 Centrado en elemento:', element.id);
    } else {
      console.warn('⚠️ Elemento no encontrado en el DOM:', element.id);
      alert(`Elemento en posición (${element.layout.position.x}, ${element.layout.position.y})`);
    }
  };

  if (customElements.length === 0) {
    return (
      <div className="p-4 text-white/50 text-sm text-center">
        No hay elementos personalizados.
        <br />
        Usa el botón "+ Añadir" para crear uno.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <div className="text-white/70 text-xs font-medium mb-3">
        ELEMENTOS PERSONALIZADOS ({customElements.length})
      </div>
      
      {customElements.map((element) => {
        const Icon = getElementIcon(element);
        const name = getElementName(element);
        
        return (
          <div
            key={element.id}
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 transition-all group"
          >
            {/* Header con icono y nombre */}
            <div className="flex items-start gap-2 mb-2">
              <Icon className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">
                  {name}
                </div>
                <div className="text-white/50 text-xs mt-0.5">
                  Posición: ({element.layout.position.x}, {element.layout.position.y})
                </div>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="flex items-center gap-1 mt-2">
              {/* Centrar vista */}
              <button
                onClick={() => handleCenterView(element)}
                className="flex-1 px-2 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-xs font-medium transition-all"
                title="Centrar vista en este elemento"
              >
                🎯 Ver
              </button>
              
              {/* Toggle visible */}
              <button
                onClick={() => handleToggleVisible(element.id)}
                className={`p-1.5 rounded transition-all ${
                  element.visible
                    ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                    : 'bg-white/5 hover:bg-white/10 text-white/30'
                }`}
                title={element.visible ? 'Ocultar' : 'Mostrar'}
              >
                {element.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              
              {/* Toggle lock */}
              <button
                onClick={() => handleToggleLock(element.id)}
                className={`p-1.5 rounded transition-all ${
                  element.locked
                    ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400'
                    : 'bg-white/5 hover:bg-white/10 text-white/50'
                }`}
                title={element.locked ? 'Desbloquear' : 'Bloquear'}
              >
                {element.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              </button>
              
              {/* Eliminar */}
              <button
                onClick={() => handleDelete(element.id)}
                className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-all"
                title="Eliminar elemento"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

