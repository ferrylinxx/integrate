"use client";

import { AnswerValue } from "@/lib/types";
import { AREA_COLORS, SUB_AREA_SHORT_NAMES } from "@/lib/constants";
import { useEditable, useEditableStyles } from "@/lib/editor/hooks";
import { EditableText } from "@/components/editor/EditableText";

interface VistaGeneralProps {
  answers: AnswerValue[];
  filterLevel: 'critico' | 'desarrollo' | 'solido' | 'ejemplar' | null;
  onFilterChange: (level: 'critico' | 'desarrollo' | 'solido' | 'ejemplar' | null) => void;
  onSubAreaClick: (subAreaIndex: number) => void;
}

// Función para calcular el nivel según el valor individual (0-4)
const getLevel = (value: number): 'critico' | 'desarrollo' | 'solido' | 'ejemplar' => {
  const percentage = (value / 4) * 100;
  if (percentage < 25) return 'critico';
  if (percentage < 50) return 'desarrollo';
  if (percentage < 75) return 'solido';
  return 'ejemplar';
};

// Función para convertir HEX a RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Función para obtener el gradiente según el nivel y porcentaje (según especificaciones EXACTAS del PDF)
const getCellGradient = (areaColor: string, percentage: number, isActive: boolean): string => {
  const color = isActive ? areaColor : '#4D4D4D';
  const rgb = hexToRgb(color);
  const { r, g, b } = rgb;

  if (percentage < 25) {
    // CRÍTICO (≤25%)
    // Ubicación 0%: #FFFFFF opacidad 0%
    // Ubicación 88%: (color cara) opacidad 75%
    // Ubicación 100%: (color cara) opacidad 100%
    return `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(${r},${g},${b},0.75) 88%, rgba(${r},${g},${b},1) 100%)`;
  } else if (percentage < 50) {
    // DESARROLLO (26-50%)
    // Ubicación 0%: #FFFFFF opacidad 0%
    // Ubicación 58%: (color cara) opacidad 75%
    // Ubicación 100%: (color cara) opacidad 100%
    return `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(${r},${g},${b},0.75) 58%, rgba(${r},${g},${b},1) 100%)`;
  } else if (percentage < 75) {
    // SÓLIDO (51-75%)
    // Ubicación 0%: #FFFFFF opacidad 0%
    // Ubicación 34%: (color cara) opacidad 75%
    // Ubicación 100%: (color cara) opacidad 100%
    return `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(${r},${g},${b},0.75) 34%, rgba(${r},${g},${b},1) 100%)`;
  } else {
    // EJEMPLAR (76-100%)
    // Ubicación 0%: (color cara) opacidad 50%
    // Ubicación 86%: (color cara) opacidad 100%
    return `linear-gradient(135deg, rgba(${r},${g},${b},0.5) 0%, rgba(${r},${g},${b},1) 86%)`;
  }
};

// Patrón del cubo desplegado (cruz)
const cubePattern = [
  // Fila 0 - PERSONAS (área 0)
  { subAreaIndex: 0, row: 0, col: 2, areaIndex: 0 },
  { subAreaIndex: 1, row: 0, col: 3, areaIndex: 0 },
  { subAreaIndex: 2, row: 1, col: 2, areaIndex: 0 },
  { subAreaIndex: 3, row: 1, col: 3, areaIndex: 0 },

  // Fila 1 - RECURSOS (área 1)
  { subAreaIndex: 4, row: 2, col: 0, areaIndex: 1 },
  { subAreaIndex: 5, row: 2, col: 1, areaIndex: 1 },
  { subAreaIndex: 6, row: 3, col: 0, areaIndex: 1 },
  { subAreaIndex: 7, row: 3, col: 1, areaIndex: 1 },

  // Fila 2 - ESTRATEGIA (área 2)
  { subAreaIndex: 8, row: 2, col: 2, areaIndex: 2 },
  { subAreaIndex: 9, row: 2, col: 3, areaIndex: 2 },
  { subAreaIndex: 10, row: 3, col: 2, areaIndex: 2 },
  { subAreaIndex: 11, row: 3, col: 3, areaIndex: 2 },

  // Fila 3 - EFICACIA (área 3)
  { subAreaIndex: 12, row: 2, col: 4, areaIndex: 3 },
  { subAreaIndex: 13, row: 2, col: 5, areaIndex: 3 },
  { subAreaIndex: 14, row: 3, col: 4, areaIndex: 3 },
  { subAreaIndex: 15, row: 3, col: 5, areaIndex: 3 },

  // Fila 4 - ESTRUCTURA (área 4)
  { subAreaIndex: 16, row: 2, col: 6, areaIndex: 4 },
  { subAreaIndex: 17, row: 2, col: 7, areaIndex: 4 },
  { subAreaIndex: 18, row: 3, col: 6, areaIndex: 4 },
  { subAreaIndex: 19, row: 3, col: 7, areaIndex: 4 },

  // Fila 5 - ORIENTACIÓN (área 5)
  { subAreaIndex: 20, row: 4, col: 2, areaIndex: 5 },
  { subAreaIndex: 21, row: 4, col: 3, areaIndex: 5 },
  { subAreaIndex: 22, row: 5, col: 2, areaIndex: 5 },
  { subAreaIndex: 23, row: 5, col: 3, areaIndex: 5 },
];

// Función para obtener el color según el nivel
const getLevelColor = (level: string): string => {
  switch (level) {
    case 'critico': return '#DC2626';
    case 'desarrollo': return '#F59E0B';
    case 'solido': return '#10B981';
    case 'ejemplar': return '#3B82F6';
    default: return '#374151';
  }
};

// Mapeo de sub-áreas a áreas (cada área tiene 4 sub-áreas)
const getAreaIndex = (subAreaIndex: number): number => {
  return Math.floor(subAreaIndex / 4);
};

export function VistaGeneral({
  answers,
  filterLevel,
  onFilterChange,
  onSubAreaClick,
}: VistaGeneralProps) {
  // ==========================================
  // HOOKS DEL EDITOR
  // ==========================================
  const { isEditorActive, isSelected, editableProps } = useEditable('vistaGeneral');
  const styles = useEditableStyles('vistaGeneral');

  // Calcular niveles por sub-área
  const subAreaLevels = answers.map(value => getLevel(value));

  // Agrupar sub-áreas por área para el layout del gráfico
  const areaGroups = [
    { areaIndex: 0, subAreas: [0, 1, 2, 3], col: 2 },      // ESTRATEGIA
    { areaIndex: 1, subAreas: [4, 5, 6, 7], col: 3 },      // ESTRUCTURA
    { areaIndex: 2, subAreas: [8, 9, 10, 11], col: 4 },    // ORIENTACIÓN
    { areaIndex: 3, subAreas: [12, 13, 14, 15], col: 5 },  // EFICACIA
    { areaIndex: 4, subAreas: [16, 17, 18, 19], col: 0 },  // RECURSOS
    { areaIndex: 5, subAreas: [20, 21, 22, 23], col: 1 },  // PERSONAS
  ];

  // Reorganizar para el layout visual (6 columnas x 4 filas)
  const visualLayout = [
    { areaIndex: 4, subAreas: [16, 17, 18, 19] }, // RECURSOS
    { areaIndex: 5, subAreas: [20, 21, 22, 23] }, // PERSONAS
    { areaIndex: 0, subAreas: [0, 1, 2, 3] },     // ESTRATEGIA
    { areaIndex: 1, subAreas: [4, 5, 6, 7] },     // ESTRUCTURA
    { areaIndex: 2, subAreas: [8, 9, 10, 11] },   // ORIENTACIÓN
    { areaIndex: 3, subAreas: [12, 13, 14, 15] }, // EFICACIA
  ];

  const maxValue = 4;
  const barHeight = 200; // Altura máxima de las barras
  const cellSize = 30; // Tamaño de cada celda del grid

  const smallCellSize = 28; // Tamaño pequeño para el cubo como en la imagen

  return (
    <div
      className="h-full"
      style={{ padding: styles.layout?.padding || '32px' }}
      {...editableProps}
    >
      {/* Contenedor principal: cubo a la izquierda, controles a la derecha */}
      <div className="flex h-full" style={{ gap: styles.layout?.gap || '24px' }}>
        {/* Lado izquierdo: Título y Cubo desplegado */}
        <div className="flex flex-col">
          <EditableText
            value={styles.title?.content || 'VISTA GENERAL'}
            path="components.vistaGeneral.title.content"
            as="h2"
            className="mb-4"
            style={{
              fontFamily: styles.title?.fontFamily || 'Poppins, sans-serif',
              fontSize: styles.title?.fontSize || '14px',
              fontWeight: styles.title?.fontWeight || 600,
              color: styles.title?.color || '#FFFFFF',
              opacity: styles.title?.opacity || 0.7,
              lineHeight: styles.title?.lineHeight || '1.2',
              textAlign: styles.title?.textAlign || 'left',
              textTransform: styles.title?.textTransform || 'uppercase',
            }}
          />

          {/* Cubo desplegado pequeño */}
          <div className="flex items-start">
            <div className="relative" style={{ width: `${smallCellSize * 8}px`, height: `${smallCellSize * 6}px` }}>
              {cubePattern.map(({ subAreaIndex, row, col, areaIndex }) => {
                const value = answers[subAreaIndex];
                const level = subAreaLevels[subAreaIndex];
                const percentage = (value / 4) * 100;
                const areaColor = AREA_COLORS[areaIndex];
                const isFiltered = filterLevel ? level === filterLevel : true;

                return (
                  <div
                    key={subAreaIndex}
                    onClick={() => onSubAreaClick(subAreaIndex)}
                    className="absolute cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10"
                    style={{
                      top: `${row * smallCellSize}px`,
                      left: `${col * smallCellSize}px`,
                      width: `${smallCellSize - 2}px`,
                      height: `${smallCellSize - 2}px`,
                      background: getCellGradient(areaColor, percentage, isFiltered),
                      border: '0.5px solid',
                      borderImage: 'linear-gradient(30deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%) 1',
                      borderRadius: '2px',
                      opacity: isFiltered ? 1 : 0.3,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Lado derecho: Filtros y Leyenda */}
        <div className="flex-1 flex flex-col">
          {/* Filtros de nivel */}
          <div className="flex gap-2 mb-6">
            {[
              { level: 'critico' as const, label: 'CRÍTICO', color: '#DC2626' },
              { level: 'desarrollo' as const, label: 'DESARROLLO', color: '#F59E0B' },
              { level: 'solido' as const, label: 'SÓLIDO', color: '#10B981' },
              { level: 'ejemplar' as const, label: 'EJEMPLAR', color: '#3B82F6' },
            ].map(({ level, label, color }) => (
              <button
                key={level}
                onClick={() => onFilterChange(filterLevel === level ? null : level)}
                className={`px-3 py-2 rounded-full text-[10px] font-semibold transition-all ${
                  filterLevel === level
                    ? 'text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10'
                }`}
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  // Relleno (botón activo) - Efecto Glass
                  background: filterLevel === level
                    ? 'linear-gradient(-45deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)'
                    : 'transparent',
                  // Contorno de forma - Gradiente en borde
                  border: '0.5px solid transparent',
                  backgroundImage: filterLevel === level
                    ? 'linear-gradient(-45deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%), linear-gradient(30deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)'
                    : 'linear-gradient(30deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: filterLevel === level ? 'padding-box, border-box' : 'border-box',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Leyenda de SUB ÁREAS */}
          <div>
            <h3
              className="text-xs text-white/70 mb-3"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600, // SemiBold
              }}
            >
              SUB ÁREAS
            </h3>
            <div className="space-y-2">
              {[
                { name: 'Comunicación', color: '#F08726' },
                { name: 'Tecnología', color: '#8E235D' },
                { name: 'Procesos', color: '#2C248E' },
              ].map((subArea, index) => {
                const rgb = hexToRgb(subArea.color);
                return (
                  <div key={index} className="flex items-center gap-2">
                    {/* Bola indicadora con gradiente -90º */}
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{
                        background: `linear-gradient(-90deg, rgba(${rgb.r},${rgb.g},${rgb.b},0.5) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},1) 86%)`,
                      }}
                    />
                    <span
                      className="text-xs text-white/70"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600, // SemiBold para nombres
                      }}
                    >
                      {subArea.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda de niveles en la parte inferior */}
      <div className="mt-auto pt-4">
        <div className="flex items-center justify-start gap-6">
          {[
            { level: 'critico', label: 'CRÍTICO', color: '#DC2626', percentage: 25 },
            { level: 'desarrollo', label: 'DESARROLLO', color: '#F59E0B', percentage: 50 },
            { level: 'solido', label: 'SÓLIDO', color: '#10B981', percentage: 75 },
            { level: 'ejemplar', label: 'EJEMPLAR', color: '#3B82F6', percentage: 100 },
          ].map(({ level, label, color, percentage }) => {
            const rgb = hexToRgb(color);
            return (
              <div key={level} className="flex items-center gap-2">
                {/* Bola indicadora con gradiente -90º */}
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{
                    background: `linear-gradient(-90deg, rgba(${rgb.r},${rgb.g},${rgb.b},0.5) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},1) 86%)`,
                  }}
                />
                <span
                  className="text-[10px] text-white/70"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600, // SemiBold para nombres
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

