"use client";

import React from 'react';
import { useEditorStore } from '@/lib/editor/store';
import { Type, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

interface TextAdvancedEditorProps {
  path: string;
  label?: string;
}

const FONT_FAMILIES = [
  'Poppins, sans-serif',
  'Arial, sans-serif',
  'Roboto, sans-serif',
  'Inter, sans-serif',
  'Montserrat, sans-serif',
  'Open Sans, sans-serif',
];

const FONT_WEIGHTS = [
  { value: 300, label: 'Light' },
  { value: 400, label: 'Regular' },
  { value: 600, label: 'SemiBold' },
  { value: 700, label: 'Bold' },
  { value: 900, label: 'Black' },
];

const TEXT_TRANSFORMS = [
  { value: 'none', label: 'None' },
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'lowercase', label: 'lowercase' },
  { value: 'capitalize', label: 'Capitalize' },
];

export function TextAdvancedEditor({ path, label = 'Texto' }: TextAdvancedEditorProps) {
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

  const fontFamily = getValue('fontFamily') || 'Poppins, sans-serif';
  const fontSize = parseInt(getValue('fontSize') || '14') || 14;
  const fontWeight = getValue('fontWeight') || 400;
  const color = getValue('color') || '#FFFFFF';
  const opacity = getValue('opacity') || 1;
  const letterSpacing = parseFloat(getValue('letterSpacing') || '0') || 0;
  const lineHeight = parseFloat(getValue('lineHeight') || '1.4') || 1.4;
  const textAlign = getValue('textAlign') || 'left';
  const textTransform = getValue('textTransform') || 'none';

  return (
    <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Type className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white">{label}</h3>
      </div>

      {/* Familia de fuente */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">Fuente</label>
        <select
          value={fontFamily}
          onChange={(e) => updateConfig(`${path}.fontFamily`, e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font} value={font}>
              {font.split(',')[0]}
            </option>
          ))}
        </select>
      </div>

      {/* Tamaño de fuente */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">
          Tamaño: {fontSize}px
        </label>
        <input
          type="range"
          min="8"
          max="48"
          step="1"
          value={fontSize}
          onChange={(e) => updateConfig(`${path}.fontSize`, `${e.target.value}px`)}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Peso de fuente */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">Peso</label>
        <div className="grid grid-cols-5 gap-2">
          {FONT_WEIGHTS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateConfig(`${path}.fontWeight`, value)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                fontWeight === value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => updateConfig(`${path}.color`, e.target.value)}
            className="w-12 h-10 rounded cursor-pointer bg-gray-700 border border-gray-600"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => updateConfig(`${path}.color`, e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="#FFFFFF"
          />
        </div>
      </div>

      {/* Opacidad */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">
          Opacidad: {Math.round(opacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={opacity}
          onChange={(e) => updateConfig(`${path}.opacity`, parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Letter Spacing */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">
          Espaciado de letras: {letterSpacing}px
        </label>
        <input
          type="range"
          min="-2"
          max="4"
          step="0.1"
          value={letterSpacing}
          onChange={(e) => updateConfig(`${path}.letterSpacing`, `${e.target.value}px`)}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Line Height */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">
          Altura de línea: {lineHeight}
        </label>
        <input
          type="range"
          min="1.0"
          max="2.5"
          step="0.1"
          value={lineHeight}
          onChange={(e) => updateConfig(`${path}.lineHeight`, e.target.value)}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* Alineación de texto */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">Alineación</label>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => updateConfig(`${path}.textAlign`, 'left')}
            className={`p-2 rounded transition-colors ${
              textAlign === 'left'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="Izquierda"
          >
            <AlignLeft className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => updateConfig(`${path}.textAlign`, 'center')}
            className={`p-2 rounded transition-colors ${
              textAlign === 'center'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="Centro"
          >
            <AlignCenter className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => updateConfig(`${path}.textAlign`, 'right')}
            className={`p-2 rounded transition-colors ${
              textAlign === 'right'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="Derecha"
          >
            <AlignRight className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => updateConfig(`${path}.textAlign`, 'justify')}
            className={`p-2 rounded transition-colors ${
              textAlign === 'justify'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            title="Justificado"
          >
            <AlignJustify className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>

      {/* Transformación de texto */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">Transformación</label>
        <div className="grid grid-cols-2 gap-2">
          {TEXT_TRANSFORMS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateConfig(`${path}.textTransform`, value)}
              className={`px-3 py-2 text-xs rounded transition-colors ${
                textTransform === value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Botón Reset */}
      <button
        onClick={() => {
          updateConfig(`${path}.fontFamily`, 'Poppins, sans-serif');
          updateConfig(`${path}.fontSize`, '14px');
          updateConfig(`${path}.fontWeight`, 400);
          updateConfig(`${path}.color`, '#FFFFFF');
          updateConfig(`${path}.opacity`, 1);
          updateConfig(`${path}.letterSpacing`, '0px');
          updateConfig(`${path}.lineHeight`, '1.4');
          updateConfig(`${path}.textAlign`, 'left');
          updateConfig(`${path}.textTransform`, 'none');
        }}
        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
      >
        Restablecer valores por defecto
      </button>
    </div>
  );
}

