"use client";

import { useEditorStore } from '@/lib/editor/store';
import { get, parseSize } from '@/lib/editor/utils';
import { ComponentId, ButtonConfig } from '@/lib/editor/types';

// ============================================
// EDITOR DE PROPIEDADES DE BOTONES
// ============================================

interface ButtonEditorProps {
  componentId: ComponentId;
}

export function ButtonEditor({ componentId }: ButtonEditorProps) {
  const config = useEditorStore((state) => state.config);
  const updateConfig = useEditorStore((state) => state.updateConfig);
  
  // Obtener configuración de botones del componente
  const basePath = `components.${componentId}`;
  const buttonConfig = get(config, `${basePath}.buttons`) as ButtonConfig | undefined;
  
  // Para vistaArea, usar backButton
  const backButtonConfig = get(config, `${basePath}.backButton`) as ButtonConfig | undefined;
  
  const activeConfig = buttonConfig || backButtonConfig;
  const configPath = buttonConfig ? `${basePath}.buttons` : `${basePath}.backButton`;
  
  if (!activeConfig) {
    return (
      <div className="text-white/50 text-sm">
        Este componente no tiene configuración de botones
      </div>
    );
  }
  
  const borderRadiusValue = parseSize(activeConfig.borderRadius);
  
  return (
    <div className="space-y-6">
      {/* ========================================
          BORDER RADIUS
      ======================================== */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold text-xs uppercase tracking-wide">
          Redondeo de Bordes
        </h4>
        
        <div>
          <label className="text-white/70 text-xs mb-1 block">
            Border Radius: {activeConfig.borderRadius}
          </label>
          <input
            type="range"
            min="0"
            max="40"
            step="2"
            value={borderRadiusValue}
            onChange={(e) => updateConfig(`${configPath}.borderRadius`, `${e.target.value}px`)}
            className="w-full"
          />
          <div className="flex justify-between text-white/30 text-xs mt-1">
            <span>0px (Cuadrado)</span>
            <span>20px (Píldora)</span>
            <span>40px (Muy redondeado)</span>
          </div>
        </div>
        
        {/* Vista previa */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <button
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium"
            style={{ borderRadius: activeConfig.borderRadius }}
          >
            Vista Previa
          </button>
        </div>
      </div>
      
      {/* ========================================
          PADDING
      ======================================== */}
      <div className="space-y-3 pt-6 border-t border-white/10">
        <h4 className="text-white font-semibold text-xs uppercase tracking-wide">
          Padding del Botón
        </h4>
        
        <div>
          <label className="text-white/70 text-xs mb-1 block">
            Padding: {activeConfig.padding}
          </label>
          <input
            type="text"
            value={activeConfig.padding}
            onChange={(e) => updateConfig(`${configPath}.padding`, e.target.value)}
            placeholder="8px 16px"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <p className="text-white/50 text-xs mt-1">
            Formato: vertical horizontal (ej: 8px 16px)
          </p>
        </div>
      </div>
      
      {/* ========================================
          TAMAÑO DE FUENTE
      ======================================== */}
      <div className="space-y-3 pt-6 border-t border-white/10">
        <h4 className="text-white font-semibold text-xs uppercase tracking-wide">
          Tamaño de Fuente
        </h4>
        
        <div>
          <label className="text-white/70 text-xs mb-1 block">
            Font Size: {activeConfig.fontSize}
          </label>
          <input
            type="range"
            min="10"
            max="18"
            value={parseInt(activeConfig.fontSize)}
            onChange={(e) => updateConfig(`${configPath}.fontSize`, `${e.target.value}px`)}
            className="w-full"
          />
          <div className="flex justify-between text-white/30 text-xs mt-1">
            <span>10px</span>
            <span>14px</span>
            <span>18px</span>
          </div>
        </div>
      </div>
      
      {/* ========================================
          PESO DE FUENTE
      ======================================== */}
      <div className="space-y-3 pt-6 border-t border-white/10">
        <h4 className="text-white font-semibold text-xs uppercase tracking-wide">
          Peso de Fuente
        </h4>
        
        <div>
          <label className="text-white/70 text-xs mb-1 block">
            Font Weight: {activeConfig.fontWeight}
          </label>
          <select
            value={activeConfig.fontWeight}
            onChange={(e) => updateConfig(`${configPath}.fontWeight`, parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="100">Thin (100)</option>
            <option value="200">Extra Light (200)</option>
            <option value="300">Light (300)</option>
            <option value="400">Regular (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">SemiBold (600)</option>
            <option value="700">Bold (700)</option>
            <option value="800">Extra Bold (800)</option>
            <option value="900">Black (900)</option>
          </select>
        </div>
      </div>
      
      {/* ========================================
          VISTA PREVIA COMPLETA
      ======================================== */}
      <div className="pt-6 border-t border-white/10">
        <h4 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">
          Vista Previa Completa
        </h4>
        
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 flex items-center justify-center">
          <button
            className="bg-gradient-to-br from-white/60 to-white/20 text-white border border-white/30"
            style={{
              borderRadius: activeConfig.borderRadius,
              padding: activeConfig.padding,
              fontSize: activeConfig.fontSize,
              fontWeight: activeConfig.fontWeight,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Botón de Ejemplo
          </button>
        </div>
      </div>
      
      {/* ========================================
          INFORMACIÓN
      ======================================== */}
      <div className="pt-6 border-t border-white/10">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <p className="text-blue-400 text-xs leading-relaxed">
            <strong>💡 Tip:</strong> Los botones usan el efecto "glass" con gradientes 
            específicos. Estos estilos se aplican automáticamente en el componente.
          </p>
        </div>
      </div>
    </div>
  );
}

