'use client';

import React from 'react';
import { ResizableWrapper } from './ResizableWrapper';
import { useEditorStore } from '@/lib/editor/store';

interface EditorWrapperProps {
  children: React.ReactNode;
  componentId: string;
  path: string;
  enableResize?: boolean;
  enableDrag?: boolean;
  initialSize?: { width: number; height: number };
  initialPosition?: { x: number; y: number };
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  lockAspectRatio?: boolean;
  grid?: [number, number];
}

/**
 * EditorWrapper - Componente que combina las funcionalidades de:
 * 1. Drag & Drop (arrastrar para mover)
 * 2. Resize con handles (redimensionar con esquinas/lados)
 * 3. Selección visual
 * 
 * Uso:
 * <EditorWrapper
 *   componentId="mapaDeSituacion"
 *   path="components.mapaDeSituacion.layout"
 *   enableResize={true}
 *   enableDrag={true}
 * >
 *   <div>Contenido editable</div>
 * </EditorWrapper>
 */
export const EditorWrapper: React.FC<EditorWrapperProps> = ({
  children,
  componentId,
  path,
  enableResize = true,
  enableDrag = true,
  initialSize,
  initialPosition,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  lockAspectRatio = false,
  grid = [1, 1], // ➕ CAMBIADO: Grid más fino para movimiento más suave (antes [8, 8])
}) => {
  const { isEditorActive } = useEditorStore();

  // Si no está en modo editor, renderizar contenido normal
  if (!isEditorActive) {
    return <>{children}</>;
  }

  // ✅ CORREGIDO: Siempre usar ResizableWrapper cuando el editor está activo
  // Si enableDrag=true y enableResize=false, ResizableWrapper deshabilitará el resize
  // pero mantendrá el drag funcional
  return (
    <ResizableWrapper
      componentId={componentId}
      path={path}
      initialSize={initialSize}
      initialPosition={initialPosition}
      minWidth={minWidth}
      minHeight={minHeight}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      lockAspectRatio={lockAspectRatio}
      grid={grid}
      enableResize={enableResize} // ➕ NUEVO: Pasar enableResize a ResizableWrapper
      enableDrag={enableDrag} // ➕ NUEVO: Pasar enableDrag a ResizableWrapper
    >
      {children}
    </ResizableWrapper>
  );
};

