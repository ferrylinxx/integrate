"use client";

import React from 'react';
import { useEditorStore } from '@/lib/editor/store';
import { Box, RotateCw, Eye, Palette } from 'lucide-react';

interface CubeAdvancedEditorProps {
  path: string;
  label?: string;
}

export function CubeAdvancedEditor({ path, label = 'Cubo 3D' }: CubeAdvancedEditorProps) {
  const { config, updateConfig } = useEditorStore();
  
  // Obtener el valor actual del path
  const getValue = (subPath: string) => {
    const fullPath = `${path}.${subPath}`;
    const keys = fullPath.split('.');
    let value: any = config;
    for (const key of keys) {
      value = value?.[key];
    }
    return value;
  };

  const size = getValue('size') || 280;
  const perspective = getValue('perspective') || 1200;
  const borderWidth = parseFloat(getValue('borderWidth') || '0.5') || 0.5;
  const borderColor = getValue('borderColor') || 'rgba(255,255,255,0.2)';
  const faceOpacity = getValue('faceOpacity') || 0.9;
  const rotationX = getValue('rotationX') || 0;
  const rotationY = getValue('rotationY') || 0;
  const rotationZ = getValue('rotationZ') || 0;
  const animationSpeed = getValue('animationSpeed') || 5;
  const enableAnimation = getValue('enableAnimation') !== false;
  const enableShadows = getValue('enableShadows') !== false;

  return (
    <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Box className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-semibold text-white">{label}</h3>
      </div>

      {/* Tamaño del cubo */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">
          Tamaño: {size}px
        </label>
        <input
          type="range"
          min="200"
          max="400"
          step="10"
          value={size}
          onChange={(e) => updateConfig(`${path}.size`, parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
      </div>

      {/* Perspectiva */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">
          Perspectiva: {perspective}
        </label>
        <input
          type="range"
          min="800"
          max="2000"
          step="50"
          value={perspective}
          onChange={(e) => updateConfig(`${path}.perspective`, parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
      </div>

      {/* Rotación Manual */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <RotateCw className="w-4 h-4 text-purple-400" />
          <label className="text-xs text-gray-400">Rotación Manual</label>
        </div>
        
        {/* Rotación X */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Eje X: {rotationX}°
          </label>
          <input
            type="range"
            min="-180"
            max="180"
            step="5"
            value={rotationX}
            onChange={(e) => updateConfig(`${path}.rotationX`, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Rotación Y */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Eje Y: {rotationY}°
          </label>
          <input
            type="range"
            min="-180"
            max="180"
            step="5"
            value={rotationY}
            onChange={(e) => updateConfig(`${path}.rotationY`, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Rotación Z */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Eje Z: {rotationZ}°
          </label>
          <input
            type="range"
            min="-180"
            max="180"
            step="5"
            value={rotationZ}
            onChange={(e) => updateConfig(`${path}.rotationZ`, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>

      {/* Velocidad de animación */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">
          Velocidad de animación: {animationSpeed === 0 ? 'Estático' : animationSpeed}
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={animationSpeed}
          onChange={(e) => updateConfig(`${path}.animationSpeed`, parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Estático</span>
          <span>Rápido</span>
        </div>
      </div>

      {/* Opacidad de las caras */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-purple-400" />
          <label className="text-xs text-gray-400">
            Opacidad de caras: {Math.round(faceOpacity * 100)}%
          </label>
        </div>
        <input
          type="range"
          min="0.5"
          max="1"
          step="0.05"
          value={faceOpacity}
          onChange={(e) => updateConfig(`${path}.faceOpacity`, parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
      </div>

      {/* Grosor de bordes */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-4 h-4 text-purple-400" />
          <label className="text-xs text-gray-400">
            Grosor de bordes: {borderWidth}px
          </label>
        </div>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.5"
          value={borderWidth}
          onChange={(e) => updateConfig(`${path}.borderWidth`, `${e.target.value}px`)}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
      </div>

      {/* Color de bordes */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">Color de bordes</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={borderColor.includes('rgba') ? '#FFFFFF' : borderColor}
            onChange={(e) => updateConfig(`${path}.borderColor`, e.target.value)}
            className="w-12 h-10 rounded cursor-pointer bg-gray-700 border border-gray-600"
          />
          <input
            type="text"
            value={borderColor}
            onChange={(e) => updateConfig(`${path}.borderColor`, e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
            placeholder="rgba(255,255,255,0.2)"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-2 border-t border-gray-700">
        {/* Activar/desactivar animación */}
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Animación de rotación</label>
          <button
            onClick={() => updateConfig(`${path}.enableAnimation`, !enableAnimation)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              enableAnimation ? 'bg-purple-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                enableAnimation ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Activar/desactivar sombras */}
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Sombras del cubo</label>
          <button
            onClick={() => updateConfig(`${path}.enableShadows`, !enableShadows)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              enableShadows ? 'bg-purple-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                enableShadows ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Botón Reset */}
      <button
        onClick={() => {
          updateConfig(`${path}.size`, 280);
          updateConfig(`${path}.perspective`, 1200);
          updateConfig(`${path}.borderWidth`, '0.5px');
          updateConfig(`${path}.borderColor`, 'rgba(255,255,255,0.2)');
          updateConfig(`${path}.faceOpacity`, 0.9);
          updateConfig(`${path}.rotationX`, 0);
          updateConfig(`${path}.rotationY`, 0);
          updateConfig(`${path}.rotationZ`, 0);
          updateConfig(`${path}.animationSpeed`, 5);
          updateConfig(`${path}.enableAnimation`, true);
          updateConfig(`${path}.enableShadows`, true);
        }}
        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
      >
        Restablecer valores por defecto
      </button>
    </div>
  );
}

