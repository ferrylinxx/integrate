'use client';

import React, { useState, useRef, useEffect } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useEditorStore } from '@/lib/editor/store';

interface AlignmentGuide {
  type: 'vertical' | 'horizontal';
  position: number;
  color: string;
}

interface DraggableWrapperProps {
  children: React.ReactNode;
  componentId: string; // 'mapaDeSituacion', 'vistaGeneral', etc.
  path: string; // Ruta para guardar posición, ej: 'components.mapaDeSituacion.layout.position'
  initialPosition?: { x: number; y: number };
  disabled?: boolean;
  grid?: [number, number]; // Snap to grid
  bounds?: string | { left?: number; top?: number; right?: number; bottom?: number };
}

export const DraggableWrapper: React.FC<DraggableWrapperProps> = ({
  children,
  componentId,
  path,
  initialPosition = { x: 0, y: 0 },
  disabled = false,
  grid = [8, 8], // Snap to 8px grid por defecto
  bounds = 'parent',
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [guides, setGuides] = useState<AlignmentGuide[]>([]);
  const nodeRef = useRef<HTMLDivElement>(null);
  const { updateConfig, isEditorMode, config } = useEditorStore();

  // Sincronizar posición con el config
  useEffect(() => {
    const savedPosition = getNestedValue(config, `${path}.x`);
    if (savedPosition !== undefined) {
      setPosition({
        x: getNestedValue(config, `${path}.x`) || 0,
        y: getNestedValue(config, `${path}.y`) || 0,
      });
    }
  }, [config, path]);

  const handleStart = (e: DraggableEvent, data: DraggableData) => {
    setIsDragging(true);
  };

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
    
    // Calcular guías de alineación
    const newGuides = calculateAlignmentGuides(data, componentId);
    setGuides(newGuides);
  };

  const handleStop = (e: DraggableEvent, data: DraggableData) => {
    setIsDragging(false);
    setGuides([]);
    
    // Guardar posición en el store
    updateConfig(`${path}.x`, data.x);
    updateConfig(`${path}.y`, data.y);
  };

  // Si no está en modo editor o está deshabilitado, renderizar sin drag
  if (!isEditorMode || disabled) {
    return <div ref={nodeRef}>{children}</div>;
  }

  return (
    <>
      <Draggable
        nodeRef={nodeRef}
        position={position}
        onStart={handleStart}
        onDrag={handleDrag}
        onStop={handleStop}
        grid={grid}
        bounds={bounds}
        handle=".drag-handle"
      >
        <div
          ref={nodeRef}
          className={`
            relative
            ${isDragging ? 'opacity-80 shadow-2xl z-50' : 'z-auto'}
            transition-opacity
            duration-150
          `}
        >
          {/* Drag Handle - área para arrastrar */}
          <div
            className="drag-handle absolute inset-0 cursor-move"
            title="Arrastrar para mover"
          />
          
          {/* Contenido */}
          <div className="relative pointer-events-auto">
            {children}
          </div>
        </div>
      </Draggable>

      {/* Guías de alineación */}
      {guides.map((guide, index) => (
        <div
          key={index}
          className="fixed pointer-events-none z-[100]"
          style={
            guide.type === 'vertical'
              ? {
                  left: `${guide.position}px`,
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  borderLeft: `1px dashed ${guide.color}`,
                }
              : {
                  top: `${guide.position}px`,
                  left: 0,
                  right: 0,
                  height: '1px',
                  borderTop: `1px dashed ${guide.color}`,
                }
          }
        />
      ))}
    </>
  );
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function calculateAlignmentGuides(
  data: DraggableData,
  currentComponentId: string
): AlignmentGuide[] {
  const guides: AlignmentGuide[] = [];
  const tolerance = 5; // Tolerancia de 5px para snap
  
  // Obtener todos los elementos editables en el canvas
  const allElements = document.querySelectorAll('[data-editable-component]');
  
  if (!data.node) return guides;
  
  const currentRect = data.node.getBoundingClientRect();
  const currentCenterX = currentRect.left + currentRect.width / 2;
  const currentCenterY = currentRect.top + currentRect.height / 2;
  
  allElements.forEach((element) => {
    const elementId = element.getAttribute('data-editable-component');
    
    // No comparar con sí mismo
    if (elementId === currentComponentId) return;
    
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Guía vertical - alineación de centros horizontales
    if (Math.abs(currentCenterX - centerX) < tolerance) {
      guides.push({
        type: 'vertical',
        position: centerX,
        color: '#FF00FF', // Rosa como Figma
      });
    }
    
    // Guía vertical - alineación de borde izquierdo
    if (Math.abs(currentRect.left - rect.left) < tolerance) {
      guides.push({
        type: 'vertical',
        position: rect.left,
        color: '#FF00FF',
      });
    }
    
    // Guía vertical - alineación de borde derecho
    if (Math.abs(currentRect.right - rect.right) < tolerance) {
      guides.push({
        type: 'vertical',
        position: rect.right,
        color: '#FF00FF',
      });
    }
    
    // Guía horizontal - alineación de centros verticales
    if (Math.abs(currentCenterY - centerY) < tolerance) {
      guides.push({
        type: 'horizontal',
        position: centerY,
        color: '#FF00FF',
      });
    }
    
    // Guía horizontal - alineación de borde superior
    if (Math.abs(currentRect.top - rect.top) < tolerance) {
      guides.push({
        type: 'horizontal',
        position: rect.top,
        color: '#FF00FF',
      });
    }
    
    // Guía horizontal - alineación de borde inferior
    if (Math.abs(currentRect.bottom - rect.bottom) < tolerance) {
      guides.push({
        type: 'horizontal',
        position: rect.bottom,
        color: '#FF00FF',
      });
    }
  });
  
  // Guías del canvas (centro)
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;
  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;
  
  if (Math.abs(currentCenterX - canvasCenterX) < tolerance) {
    guides.push({
      type: 'vertical',
      position: canvasCenterX,
      color: '#FF00FF',
    });
  }
  
  if (Math.abs(currentCenterY - canvasCenterY) < tolerance) {
    guides.push({
      type: 'horizontal',
      position: canvasCenterY,
      color: '#FF00FF',
    });
  }
  
  return guides;
}

