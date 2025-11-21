'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { useEditorStore } from '@/lib/editor/store';
import { Lock } from 'lucide-react';
import { get as getNestedValue } from '@/lib/editor/utils'; // ➕ CORREGIDO: Usar 'get' como 'getNestedValue'

interface ResizableWrapperProps {
  children: React.ReactNode;
  componentId: string;
  path: string; // Ruta para guardar tamaño y posición
  initialSize?: { width: number; height: number };
  initialPosition?: { x: number; y: number };
  disabled?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  lockAspectRatio?: boolean;
  grid?: [number, number];
  enableResize?: boolean; // ➕ NUEVO: Habilitar/deshabilitar resize
  enableDrag?: boolean; // ➕ NUEVO: Habilitar/deshabilitar drag
  bounds?: 'parent' | 'window' | string | undefined; // ➕ CAMBIADO: Permitir undefined para movimiento libre
}

export const ResizableWrapper: React.FC<ResizableWrapperProps> = ({
  children,
  componentId,
  path,
  initialSize = { width: 400, height: 300 },
  initialPosition = { x: 0, y: 0 },
  disabled = false,
  minWidth = 200,
  minHeight = 150,
  maxWidth = 1200,
  maxHeight = 800,
  lockAspectRatio = false,
  grid = [1, 1], // ➕ CAMBIADO: Grid más fino para movimiento más suave (antes [8, 8])
  enableResize = true, // ➕ NUEVO: Por defecto habilitado
  enableDrag = true, // ➕ NUEVO: Por defecto habilitado
  bounds = undefined, // ➕ CAMBIADO: Sin límites para movimiento completamente libre
}) => {
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState(initialPosition);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const { updateConfig, isEditorActive, config, selectComponent } = useEditorStore(); // ➕ NUEVO: selectComponent

  // ➕ DEBUG: Log de configuración
  useEffect(() => {
    console.log(`🔧 ResizableWrapper [${componentId}]:`, {
      enableDrag,
      enableResize,
      disableDragging: !enableDrag,
      isEditorActive,
      disabled,
      initialPosition,
      initialSize,
    });
  }, [componentId, enableDrag, enableResize, isEditorActive, disabled]);

  // Sincronizar con el config guardado
  useEffect(() => {
    const savedWidth = getNestedValue(config, `${path}.size.width`);
    const savedHeight = getNestedValue(config, `${path}.size.height`);
    const savedX = getNestedValue(config, `${path}.position.x`);
    const savedY = getNestedValue(config, `${path}.position.y`);

    if (savedWidth !== undefined && savedHeight !== undefined) {
      setSize({ width: savedWidth, height: savedHeight });
    }
    if (savedX !== undefined && savedY !== undefined) {
      setPosition({ x: savedX, y: savedY });
    }
  }, [config, path]);

  // Detectar tecla Shift para mantener proporciones
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResize = (
    e: MouseEvent | TouchEvent,
    direction: string,
    ref: HTMLElement,
    delta: { width: number; height: number },
    position: { x: number; y: number }
  ) => {
    setSize({
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    });
    setPosition(position);
  };

  const handleResizeStop = (
    e: MouseEvent | TouchEvent,
    direction: string,
    ref: HTMLElement,
    delta: { width: number; height: number },
    position: { x: number; y: number }
  ) => {
    setIsResizing(false);

    // Guardar en el store
    console.log(`💾 Guardando tamaño y posición de ${componentId}:`, {
      width: ref.offsetWidth,
      height: ref.offsetHeight,
      x: position.x,
      y: position.y,
      path
    });
    updateConfig(`${path}.size.width`, ref.offsetWidth);
    updateConfig(`${path}.size.height`, ref.offsetHeight);
    updateConfig(`${path}.position.x`, position.x);
    updateConfig(`${path}.position.y`, position.y);
  };

  const handleDragStart = () => {
    setIsDragging(true);
    // ➕ NUEVO: Seleccionar componente al empezar a arrastrar
    selectComponent(componentId);
  };

  const handleDrag = (e: any, d: { x: number; y: number }) => {
    setPosition({ x: d.x, y: d.y });
  };

  const handleDragStop = (e: any, d: { x: number; y: number }) => {
    setIsDragging(false);

    // Guardar posición
    console.log(`💾 Guardando posición de ${componentId}:`, { x: d.x, y: d.y, path });
    updateConfig(`${path}.position.x`, d.x);
    updateConfig(`${path}.position.y`, d.y);
  };

  // Si no está en modo editor, renderizar sin resize
  if (!isEditorActive || disabled) {
    return <div>{children}</div>;
  }

  const shouldLockAspectRatio = lockAspectRatio || isShiftPressed;

  // ➕ NUEVO: Handler de click para seleccionar componente
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que el click se propague
    console.log(`🖱️ Click en componente: ${componentId}`);
    selectComponent(componentId);
  };

  return (
    <div
      className="relative"
      data-element-id={componentId}
      onClick={handleClick} // ➕ NUEVO: Seleccionar al hacer click
      style={{
        zIndex: isDragging || isResizing ? 1000 : 10, // ➕ NUEVO: z-index alto durante drag/resize
        pointerEvents: 'auto', // ➕ NUEVO: Asegurar que captura eventos
      }}
    >
      <Rnd
        size={size}
        position={position}
        onResizeStart={handleResizeStart}
        onResize={handleResize}
        onResizeStop={handleResizeStop}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        minWidth={minWidth}
        minHeight={minHeight}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        lockAspectRatio={shouldLockAspectRatio}
        dragGrid={grid}
        resizeGrid={grid}
        bounds={bounds} // ➕ CORREGIDO: Usar prop bounds configurable
        disableDragging={!enableDrag} // ➕ NUEVO: Deshabilitar drag si enableDrag=false
        dragHandleClassName={enableDrag ? 'drag-handle-area' : undefined} // ➕ NUEVO: Área específica para drag
        className={`
          ${isResizing || isDragging ? 'ring-2 ring-blue-500 shadow-2xl' : ''}
          transition-shadow
          duration-150
        `}
        enableResizing={enableResize ? { // ➕ CORREGIDO: Condicional según enableResize
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        } : false} // Si enableResize=false, deshabilitar todos los handles
        resizeHandleStyles={enableResize ? { // ➕ NUEVO: Solo aplicar estilos si resize habilitado
          top: handleStyle,
          right: handleStyle,
          bottom: handleStyle,
          left: handleStyle,
          topRight: cornerHandleStyle,
          bottomRight: cornerHandleStyle,
          bottomLeft: cornerHandleStyle,
          topLeft: cornerHandleStyle,
        } : {}}
        resizeHandleClasses={enableResize ? { // ➕ NUEVO: Solo aplicar clases si resize habilitado
          top: 'resize-handle resize-handle-top',
          right: 'resize-handle resize-handle-right',
          bottom: 'resize-handle resize-handle-bottom',
          left: 'resize-handle resize-handle-left',
          topRight: 'resize-handle resize-handle-corner',
          bottomRight: 'resize-handle resize-handle-corner',
          bottomLeft: 'resize-handle resize-handle-corner',
          topLeft: 'resize-handle resize-handle-corner',
        } : {}}
      >
        {/* Badge con medidas */}
        {isResizing && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded shadow-lg whitespace-nowrap z-50 flex items-center gap-2">
            {shouldLockAspectRatio && <Lock size={12} />}
            {Math.round(size.width)} × {Math.round(size.height)} px
          </div>
        )}

        {/* Contenido con área de drag */}
        <div className={`w-full h-full ${enableDrag ? 'drag-handle-area cursor-move' : ''}`}>
          {children}
        </div>
      </Rnd>

      {/* Indicador de Shift */}
      {isShiftPressed && isResizing && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Lock size={16} />
          Proporciones bloqueadas
        </div>
      )}

      {/* Estilos para los handles y drag area */}
      <style jsx global>{`
        .resize-handle {
          transition: all 150ms ease;
        }

        .resize-handle:hover {
          transform: scale(1.25);
        }

        .resize-handle-top,
        .resize-handle-bottom {
          cursor: ns-resize !important;
        }

        .resize-handle-left,
        .resize-handle-right {
          cursor: ew-resize !important;
        }

        .resize-handle-corner {
          cursor: nwse-resize !important;
        }

        .resize-handle-corner:nth-child(2) {
          cursor: nesw-resize !important;
        }

        /* ➕ NUEVO: Estilos para el área de drag */
        .drag-handle-area {
          position: relative;
          user-select: none;
        }

        .drag-handle-area * {
          pointer-events: none; /* Los hijos no capturan eventos, solo el wrapper */
        }
      `}</style>
    </div>
  );
};

// ============================================
// ESTILOS DE HANDLES
// ============================================

const handleStyle: React.CSSProperties = {
  width: '10px',
  height: '10px',
  backgroundColor: 'white',
  border: '2px solid #3B82F6',
  borderRadius: '50%',
  zIndex: 100,
};

const cornerHandleStyle: React.CSSProperties = {
  ...handleStyle,
  width: '12px',
  height: '12px',
};
