"use client";

import { useEditorStore } from '@/lib/editor/store';
import { get } from '@/lib/editor/utils';
import { ComponentId, TextConfig } from '@/lib/editor/types';
import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';

// ============================================
// EDITOR DE PROPIEDADES DE TEXTO
// ============================================

interface TextEditorProps {
  componentId: ComponentId;
}

export function TextEditor({ componentId }: TextEditorProps) {
  const config = useEditorStore((state) => state.config);
  const updateConfig = useEditorStore((state) => state.updateConfig);
  
  // Obtener configuraciones de texto del componente
  const basePath = `components.${componentId}`;
  const titleConfig = get(config, `${basePath}.title`) as TextConfig | undefined;
  const subtitleConfig = get(config, `${basePath}.subtitle`) as TextConfig | undefined;
  
  const [showTitleColorPicker, setShowTitleColorPicker] = useState(false);
  const [showSubtitleColorPicker, setShowSubtitleColorPicker] = useState(false);
  
  if (!titleConfig) {
    return (
      <div className="text-white/50 text-sm">
        Este componente no tiene configuración de texto
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* ========================================
          TÍTULO
      ======================================== */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold text-xs uppercase tracking-wide">
          Título
        </h4>
        
        {/* Contenido */}
        <div>
          <label className="text-white/70 text-xs mb-1 block">
            Contenido
          </label>
          <input
            type="text"
            value={titleConfig.content}
            onChange={(e) => updateConfig(`${basePath}.title.content`, e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        
        {/* Tamaño */}
        <div>
          <label className="text-white/70 text-xs mb-1 block">
            Tamaño: {titleConfig.fontSize}
          </label>
          <input
            type="range"
            min="10"
            max="40"
            value={parseInt(titleConfig.fontSize)}
            onChange={(e) => updateConfig(`${basePath}.title.fontSize`, `${e.target.value}px`)}
            className="w-full"
          />
        </div>
        
        {/* Peso */}
        <div>
          <label className="text-white/70 text-xs mb-1 block">
            Peso: {titleConfig.fontWeight}
          </label>
          <select
            value={titleConfig.fontWeight}
            onChange={(e) => updateConfig(`${basePath}.title.fontWeight`, parseInt(e.target.value))}
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
        
        {/* Color */}
        <div>
          <label className="text-white/70 text-xs mb-1 block">
            Color
          </label>
          <div className="relative">
            <button
              onClick={() => setShowTitleColorPicker(!showTitleColorPicker)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm flex items-center gap-2"
            >
              <div
                className="w-6 h-6 rounded border border-white/20"
                style={{ backgroundColor: titleConfig.color }}
              />
              {titleConfig.color}
            </button>
            
            {showTitleColorPicker && (
              <div className="absolute top-full left-0 mt-2 z-10 bg-black/95 p-3 rounded-lg border border-white/10">
                <HexColorPicker
                  color={titleConfig.color}
                  onChange={(color) => updateConfig(`${basePath}.title.color`, color)}
                />
                <button
                  onClick={() => setShowTitleColorPicker(false)}
                  className="mt-2 w-full px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Opacidad */}
        <div>
          <label className="text-white/70 text-xs mb-1 block">
            Opacidad: {Math.round(titleConfig.opacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={titleConfig.opacity * 100}
            onChange={(e) => updateConfig(`${basePath}.title.opacity`, parseInt(e.target.value) / 100)}
            className="w-full"
          />
        </div>
      </div>
      
      {/* ========================================
          SUBTÍTULO (si existe)
      ======================================== */}
      {subtitleConfig && (
        <div className="space-y-3 pt-6 border-t border-white/10">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wide">
            Subtítulo
          </h4>
          
          {/* Contenido */}
          <div>
            <label className="text-white/70 text-xs mb-1 block">
              Contenido
            </label>
            <input
              type="text"
              value={subtitleConfig.content}
              onChange={(e) => updateConfig(`${basePath}.subtitle.content`, e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          
          {/* Tamaño */}
          <div>
            <label className="text-white/70 text-xs mb-1 block">
              Tamaño: {subtitleConfig.fontSize}
            </label>
            <input
              type="range"
              min="10"
              max="24"
              value={parseInt(subtitleConfig.fontSize)}
              onChange={(e) => updateConfig(`${basePath}.subtitle.fontSize`, `${e.target.value}px`)}
              className="w-full"
            />
          </div>
          
          {/* Peso */}
          <div>
            <label className="text-white/70 text-xs mb-1 block">
              Peso: {subtitleConfig.fontWeight}
            </label>
            <select
              value={subtitleConfig.fontWeight}
              onChange={(e) => updateConfig(`${basePath}.subtitle.fontWeight`, parseInt(e.target.value))}
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
          
          {/* Opacidad */}
          <div>
            <label className="text-white/70 text-xs mb-1 block">
              Opacidad: {Math.round(subtitleConfig.opacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={subtitleConfig.opacity * 100}
              onChange={(e) => updateConfig(`${basePath}.subtitle.opacity`, parseInt(e.target.value) / 100)}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

