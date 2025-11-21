"use client";

import { useEditorStore } from '@/lib/editor/store';
import { get, parseSize } from '@/lib/editor/utils';
import { ComponentId, LayoutConfig } from '@/lib/editor/types';

// ============================================
// EDITOR DE PROPIEDADES DE LAYOUT
// ============================================

interface LayoutEditorProps {
  componentId: ComponentId;
}

export function LayoutEditor({ componentId }: LayoutEditorProps) {
  const config = useEditorStore((state) => state.config);
  const updateConfig = useEditorStore((state) => state.updateConfig);
  
  // Obtener configuración de layout del componente
  const basePath = `components.${componentId}`;
  const layoutConfig = get(config, `${basePath}.layout`) as LayoutConfig | undefined;
  
  if (!layoutConfig) {
    return (
      <div className="text-white/50 text-sm">
        Este componente no tiene configuración de layout
      </div>
    );
  }
  
  const paddingValue = parseSize(layoutConfig.padding);
  const gapValue = parseSize(layoutConfig.gap);
  const marginValue = layoutConfig.margin ? parseSize(layoutConfig.margin) : 0;
  
  return (
    <div className="space-y-6">
      {/* ========================================
          PADDING
      ======================================== */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold text-xs uppercase tracking-wide">
          Espaciado Interno (Padding)
        </h4>
        
        <div>
          <label className="text-white/70 text-xs mb-1 block">
            Padding: {layoutConfig.padding}
          </label>
          <input
            type="range"
            min="0"
            max="64"
            step="4"
            value={paddingValue}
            onChange={(e) => updateConfig(`${basePath}.layout.padding`, `${e.target.value}px`)}
            className="w-full"
          />
          <div className="flex justify-between text-white/30 text-xs mt-1">
            <span>0px</span>
            <span>32px</span>
            <span>64px</span>
          </div>
        </div>
        
        {/* Vista previa visual */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div
            className="bg-blue-500/20 border-2 border-dashed border-blue-500/50 rounded flex items-center justify-center text-white/50 text-xs"
            style={{ padding: layoutConfig.padding }}
          >
            <div className="bg-white/10 rounded px-3 py-2">
              Contenido
            </div>
          </div>
        </div>
      </div>
      
      {/* ========================================
          GAP
      ======================================== */}
      <div className="space-y-3 pt-6 border-t border-white/10">
        <h4 className="text-white font-semibold text-xs uppercase tracking-wide">
          Espaciado Entre Elementos (Gap)
        </h4>
        
        <div>
          <label className="text-white/70 text-xs mb-1 block">
            Gap: {layoutConfig.gap}
          </label>
          <input
            type="range"
            min="0"
            max="48"
            step="4"
            value={gapValue}
            onChange={(e) => updateConfig(`${basePath}.layout.gap`, `${e.target.value}px`)}
            className="w-full"
          />
          <div className="flex justify-between text-white/30 text-xs mt-1">
            <span>0px</span>
            <span>24px</span>
            <span>48px</span>
          </div>
        </div>
        
        {/* Vista previa visual */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div
            className="flex flex-col"
            style={{ gap: layoutConfig.gap }}
          >
            <div className="bg-blue-500/20 border border-blue-500/50 rounded px-3 py-2 text-white/50 text-xs text-center">
              Elemento 1
            </div>
            <div className="bg-blue-500/20 border border-blue-500/50 rounded px-3 py-2 text-white/50 text-xs text-center">
              Elemento 2
            </div>
            <div className="bg-blue-500/20 border border-blue-500/50 rounded px-3 py-2 text-white/50 text-xs text-center">
              Elemento 3
            </div>
          </div>
        </div>
      </div>
      
      {/* ========================================
          MARGIN (si existe)
      ======================================== */}
      {layoutConfig.margin !== undefined && (
        <div className="space-y-3 pt-6 border-t border-white/10">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wide">
            Margen Externo (Margin)
          </h4>
          
          <div>
            <label className="text-white/70 text-xs mb-1 block">
              Margin: {layoutConfig.margin}
            </label>
            <input
              type="range"
              min="0"
              max="64"
              step="4"
              value={marginValue}
              onChange={(e) => updateConfig(`${basePath}.layout.margin`, `${e.target.value}px`)}
              className="w-full"
            />
            <div className="flex justify-between text-white/30 text-xs mt-1">
              <span>0px</span>
              <span>32px</span>
              <span>64px</span>
            </div>
          </div>
        </div>
      )}
      
      {/* ========================================
          INFORMACIÓN
      ======================================== */}
      <div className="pt-6 border-t border-white/10">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <p className="text-blue-400 text-xs leading-relaxed">
            <strong>💡 Tip:</strong> El padding controla el espacio interno del componente, 
            mientras que el gap controla el espacio entre elementos hijos.
          </p>
        </div>
      </div>
    </div>
  );
}

