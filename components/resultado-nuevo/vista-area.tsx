"use client";

import { AnswerValue } from "@/lib/types";
import { AREA_COLORS, AREA_NAMES, SUB_AREA_NAMES } from "@/lib/constants";
import { useEditable, useEditableStyles } from "@/lib/editor/hooks";
import { EditableText } from "@/components/editor/EditableText";

interface VistaAreaProps {
  answers: AnswerValue[];
  selectedArea: number;
  selectedSubArea: number | null;
  onClose: () => void;
  onSubAreaClick: (subAreaIndex: number) => void;
}

// Función para convertir HEX a RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Función para calcular el nivel según el valor individual (0-4)
const getLevel = (value: number): 'critico' | 'desarrollo' | 'solido' | 'ejemplar' => {
  const percentage = (value / 4) * 100;
  if (percentage < 25) return 'critico';
  if (percentage < 50) return 'desarrollo';
  if (percentage < 75) return 'solido';
  return 'ejemplar';
};

// Función para obtener el gradiente según el nivel y porcentaje (especificaciones EXACTAS del PDF)
const getCellGradient = (areaColor: string, percentage: number): string => {
  const rgb = hexToRgb(areaColor);
  const { r, g, b } = rgb;

  if (percentage < 25) {
    // CRÍTICO (≤25%)
    return `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(${r},${g},${b},0.75) 88%, rgba(${r},${g},${b},1) 100%)`;
  } else if (percentage < 50) {
    // DESARROLLO (26-50%)
    return `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(${r},${g},${b},0.75) 58%, rgba(${r},${g},${b},1) 100%)`;
  } else if (percentage < 75) {
    // SÓLIDO (51-75%)
    return `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(${r},${g},${b},0.75) 34%, rgba(${r},${g},${b},1) 100%)`;
  } else {
    // EJEMPLAR (76-100%)
    return `linear-gradient(135deg, rgba(${r},${g},${b},0.5) 0%, rgba(${r},${g},${b},1) 86%)`;
  }
};

export function VistaArea({
  answers,
  selectedArea,
  selectedSubArea,
  onClose,
  onSubAreaClick,
}: VistaAreaProps) {
  // ==========================================
  // HOOKS DEL EDITOR
  // ==========================================
  const { isEditorActive, isSelected, editableProps } = useEditable('vistaArea');
  const styles = useEditableStyles('vistaArea');

  const areaColor = AREA_COLORS[selectedArea];
  const areaName = AREA_NAMES[selectedArea];

  // Obtener las 4 sub-áreas de esta área
  const startIndex = selectedArea * 4;
  const subAreas = Array.from({ length: 4 }, (_, i) => {
    const subAreaIndex = startIndex + i;
    const value = answers[subAreaIndex];
    const percentage = (value / 4) * 100;
    const level = getLevel(value);
    return {
      index: subAreaIndex,
      name: SUB_AREA_NAMES[subAreaIndex],
      value,
      percentage,
      level,
    };
  });

  const cellSize = 120; // Tamaño de cada celda en la vista 2D

  return (
    <div
      className="h-full flex flex-col animate-in fade-in slide-in-from-right duration-500"
      style={{ padding: styles.layout?.padding || '32px' }}
      {...editableProps}
    >
      {/* Header con título y botón cerrar */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <EditableText
            value={styles.title?.content || 'VISTA ÁREA'}
            path="components.vistaArea.title.content"
            as="h2"
            className="mb-1"
            style={{
              fontFamily: styles.title?.fontFamily || 'Poppins, sans-serif',
              fontSize: styles.title?.fontSize || '18px',
              fontWeight: styles.title?.fontWeight || 600,
              color: styles.title?.color || '#FFFFFF',
              opacity: styles.title?.opacity || 0.7,
              lineHeight: styles.title?.lineHeight || '1.2',
              textAlign: styles.title?.textAlign || 'left',
              textTransform: styles.title?.textTransform || 'uppercase',
            }}
          />
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: styles.subtitle?.fontSize || '14px',
              fontWeight: styles.subtitle?.fontWeight || 600,
              color: areaColor,
            }}
          >
            {areaName}
          </p>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-full text-xs text-white/70 hover:bg-white/10 transition-all"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600, // SemiBold
            border: '0.5px solid transparent',
            backgroundImage: 'linear-gradient(30deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'border-box',
          }}
        >
          VOLVER
        </button>
      </div>

      {/* Cuadrado 2D con las 4 sub-áreas */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className="grid grid-cols-2 gap-3"
          style={{
            width: `${cellSize * 2 + 12}px`,
            height: `${cellSize * 2 + 12}px`
          }}
        >
          {subAreas.map((subArea) => {
            // Si esta celda está seleccionada, usar color gris #4D4D4D
            const isSelected = selectedSubArea === subArea.index;
            const displayColor = isSelected ? '#4D4D4D' : areaColor;
            const cellGradient = getCellGradient(displayColor, subArea.percentage);

            return (
              <div
                key={subArea.index}
                onClick={() => onSubAreaClick(subArea.index)}
                className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center justify-center p-4 rounded"
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  background: cellGradient,
                  border: '0.5px solid transparent',
                  backgroundImage: `${cellGradient}, linear-gradient(30deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)`,
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                }}
              >
              {/* Nombre de la sub-área */}
              <span
                className="text-xs text-white/90 text-center mb-2"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 300, // Light
                }}
              >
                {subArea.name}
              </span>

              {/* Porcentaje */}
              <span
                className="text-2xl text-white"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 400, // Regular
                }}
              >
                {Math.round(subArea.percentage)}%
              </span>

              {/* Nivel */}
              <span
                className="text-[10px] text-white/70 mt-1 uppercase"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600, // SemiBold
                }}
              >
                {subArea.level}
              </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Información adicional */}
      <div 
        className="mt-6 p-4 rounded-lg"
        style={{
          background: 'linear-gradient(-45deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
        }}
      >
        <h3 
          className="text-xs font-semibold text-white/70 mb-3"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          PROMEDIO DEL ÁREA
        </h3>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center"
            style={{
              background: getCellGradient(
                areaColor, 
                (subAreas.reduce((acc, sa) => acc + sa.percentage, 0) / 4)
              ),
              border: '0.5px solid',
              borderImage: 'linear-gradient(30deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%) 1',
            }}
          >
            <span 
              className="text-xl font-bold text-white"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {Math.round(subAreas.reduce((acc, sa) => acc + sa.percentage, 0) / 4)}%
            </span>
          </div>
          <div>
            <p 
              className="text-sm text-white/90 font-semibold"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {areaName}
            </p>
            <p 
              className="text-xs text-white/60"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Haz clic en una sub-área para ver el informe detallado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

