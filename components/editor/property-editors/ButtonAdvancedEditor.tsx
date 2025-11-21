"use client";

import React from 'react';
import { useEditorStore } from '@/lib/editor/store';
import { Square, Palette, Sparkles } from 'lucide-react';

interface ButtonAdvancedEditorProps {
  path: string;
  label?: string;
}

export function ButtonAdvancedEditor({ path, label = 'Botón' }: ButtonAdvancedEditorProps) {
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

  const borderRadius = parseInt(getValue('borderRadius') || '20') || 20;
  const paddingX = parseInt(getValue('paddingX') || '16') || 16;
  const paddingY = parseInt(getValue('paddingY') || '8') || 8;
  const fontSize = parseInt(getValue('fontSize') || '12') || 12;
  const backgroundColor = getValue('backgroundColor') || 'transparent';
  const textColor = getValue('textColor') || '#FFFFFF';
  const borderWidth = parseFloat(getValue('borderWidth') || '1') || 1;
  const borderColor = getValue('borderColor') || 'rgba(255,255,255,0.2)';
  const glassOpacity = getValue('glassOpacity') || 1;
  const glassAngle = getValue('glassEffect.angle') || -45;
  
  // Box Shadow
  const shadowX = getValue('boxShadow.x') || 0;
  const shadowY = getValue('boxShadow.y') || 2;
  const shadowBlur = getValue('boxShadow.blur') || 8;
  const shadowSpread = getValue('boxShadow.spread') || 0;
  const shadowColor = getValue('boxShadow.color') || '#000000';
  const shadowOpacity = getValue('boxShadow.opacity') || 0.1;

  return (
    <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Square className="w-4 h-4 text-green-400" />
        <h3 className="text-sm font-semibold text-white">{label}</h3>
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">
          Border Radius: {borderRadius}px
        </label>
        <input
          type="range"
          min="0"
          max="30"
          step="1"
          value={borderRadius}
          onChange={(e) => updateConfig(`${path}.borderRadius`, `${e.target.value}px`)}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
      </div>

      {/* Padding */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-2">
            Padding X: {paddingX}px
          </label>
          <input
            type="range"
            min="4"
            max="32"
            step="2"
            value={paddingX}
            onChange={(e) => updateConfig(`${path}.paddingX`, `${e.target.value}px`)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-2">
            Padding Y: {paddingY}px
          </label>
          <input
            type="range"
            min="4"
            max="24"
            step="2"
            value={paddingY}
            onChange={(e) => updateConfig(`${path}.paddingY`, `${e.target.value}px`)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>
      </div>

      {/* Tamaño de fuente */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">
          Tamaño de fuente: {fontSize}px
        </label>
        <input
          type="range"
          min="10"
          max="18"
          step="1"
          value={fontSize}
          onChange={(e) => updateConfig(`${path}.fontSize`, `${e.target.value}px`)}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
      </div>

      {/* Colores */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-4 h-4 text-green-400" />
          <label className="text-xs text-gray-400">Colores</label>
        </div>

        {/* Color de fondo */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Fondo</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={backgroundColor === 'transparent' ? '#000000' : backgroundColor}
              onChange={(e) => updateConfig(`${path}.backgroundColor`, e.target.value)}
              className="w-12 h-10 rounded cursor-pointer bg-gray-700 border border-gray-600"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => updateConfig(`${path}.backgroundColor`, e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-green-500 focus:outline-none"
              placeholder="transparent"
            />
          </div>
        </div>

        {/* Color de texto */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Texto</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => updateConfig(`${path}.textColor`, e.target.value)}
              className="w-12 h-10 rounded cursor-pointer bg-gray-700 border border-gray-600"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => updateConfig(`${path}.textColor`, e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-green-500 focus:outline-none"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
      </div>

      {/* Borde */}
      <div className="space-y-3">
        <label className="block text-xs text-gray-400">Borde</label>
        
        {/* Grosor de borde */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Grosor: {borderWidth}px
          </label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.5"
            value={borderWidth}
            onChange={(e) => updateConfig(`${path}.borderWidth`, `${e.target.value}px`)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>

        {/* Color de borde */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Color</label>
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
              className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-green-500 focus:outline-none"
              placeholder="rgba(255,255,255,0.2)"
            />
          </div>
        </div>
      </div>

      {/* Efecto Glass */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-green-400" />
          <label className="text-xs text-gray-400">Efecto Glass</label>
        </div>

        {/* Opacidad del efecto glass */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Opacidad: {Math.round(glassOpacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={glassOpacity}
            onChange={(e) => updateConfig(`${path}.glassOpacity`, parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>

        {/* Ángulo del gradiente */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Ángulo: {glassAngle}°
          </label>
          <input
            type="range"
            min="-180"
            max="180"
            step="15"
            value={glassAngle}
            onChange={(e) => updateConfig(`${path}.glassEffect.angle`, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>
      </div>

      {/* Box Shadow */}
      <div className="space-y-3 pt-3 border-t border-gray-700">
        <label className="block text-xs text-gray-400">Sombra (Box Shadow)</label>
        
        <div className="grid grid-cols-2 gap-3">
          {/* X */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">X: {shadowX}px</label>
            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              value={shadowX}
              onChange={(e) => updateConfig(`${path}.boxShadow.x`, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

          {/* Y */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Y: {shadowY}px</label>
            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              value={shadowY}
              onChange={(e) => updateConfig(`${path}.boxShadow.y`, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

          {/* Blur */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Blur: {shadowBlur}px</label>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={shadowBlur}
              onChange={(e) => updateConfig(`${path}.boxShadow.blur`, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

          {/* Spread */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Spread: {shadowSpread}px</label>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={shadowSpread}
              onChange={(e) => updateConfig(`${path}.boxShadow.spread`, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>
        </div>

        {/* Color y opacidad de sombra */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Color</label>
            <input
              type="color"
              value={shadowColor}
              onChange={(e) => updateConfig(`${path}.boxShadow.color`, e.target.value)}
              className="w-full h-10 rounded cursor-pointer bg-gray-700 border border-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Opacidad: {Math.round(shadowOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={shadowOpacity}
              onChange={(e) => updateConfig(`${path}.boxShadow.opacity`, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>
        </div>
      </div>

      {/* Botón Reset */}
      <button
        onClick={() => {
          updateConfig(`${path}.borderRadius`, '20px');
          updateConfig(`${path}.paddingX`, '16px');
          updateConfig(`${path}.paddingY`, '8px');
          updateConfig(`${path}.fontSize`, '12px');
          updateConfig(`${path}.backgroundColor`, 'transparent');
          updateConfig(`${path}.textColor`, '#FFFFFF');
          updateConfig(`${path}.borderWidth`, '1px');
          updateConfig(`${path}.borderColor`, 'rgba(255,255,255,0.2)');
          updateConfig(`${path}.glassOpacity`, 1);
          updateConfig(`${path}.glassEffect.angle`, -45);
          updateConfig(`${path}.boxShadow`, {
            x: 0,
            y: 2,
            blur: 8,
            spread: 0,
            color: '#000000',
            opacity: 0.1,
          });
        }}
        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
      >
        Restablecer valores por defecto
      </button>
    </div>
  );
}

