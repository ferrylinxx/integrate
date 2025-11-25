"use client";

import { AnswerValue } from "@/lib/types";
import { AREA_COLORS, AREA_NAMES, SUB_AREA_NAMES, SUB_AREA_SHORT_NAMES, getGradientBackground } from "@/lib/constants";

interface CubeDesplegado2DProps {
  answers: AnswerValue[];
  selectedFilter: 'critico' | 'desarrollo' | 'solido' | 'ejemplar' | null;
  onAreaClick?: (areaIndex: number) => void;
}

// Función para calcular el nivel según el valor individual (0-4)
// CRÍTICO: 0-25% | DESARROLLO: 25-50% | SÓLIDO: 50-75% | EJEMPLAR: 75-100%
const getLevel = (value: number): 'critico' | 'desarrollo' | 'solido' | 'ejemplar' => {
  const percentage = (value / 4) * 100;
  if (percentage <= 25) return 'critico';
  if (percentage <= 50) return 'desarrollo';
  if (percentage <= 75) return 'solido';
  return 'ejemplar';
};

// Función para obtener el color según el nivel
const getLevelColor = (level: string): string => {
  switch (level) {
    case 'critico': return '#DC2626'; // Rojo intenso
    case 'desarrollo': return '#F59E0B'; // Naranja
    case 'solido': return '#10B981'; // Verde
    case 'ejemplar': return '#3B82F6'; // Azul
    default: return '#E5E7EB'; // Gris claro
  }
};

export function CubeDesplegado2D({ answers, selectedFilter, onAreaClick }: CubeDesplegado2DProps) {
  // Validación: Si no hay answers, mostrar mensaje
  if (!answers || answers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/60">Cargando datos...</p>
      </div>
    );
  }

  // Calcular niveles por sub-área (24 sub-áreas)
  const subAreaLevels = answers.map(value => getLevel(value));

  // Patrón de cubo desplegado en cruz con 24 sub-áreas
  // Cada área tiene 4 sub-áreas en un grid 2×2
  // Layout del cubo desplegado:
  //        [ESTR]
  //  [REC] [EST] [ORI] [PER]
  //        [EFI]

  const cubePattern = [
    // ESTRUCTURA (Área 1) - Top - índices 4-7
    { subAreaIndex: 4, row: 0, col: 2, areaIndex: 1, subIndex: 0 },
    { subAreaIndex: 5, row: 0, col: 3, areaIndex: 1, subIndex: 1 },
    { subAreaIndex: 6, row: 1, col: 2, areaIndex: 1, subIndex: 2 },
    { subAreaIndex: 7, row: 1, col: 3, areaIndex: 1, subIndex: 3 },

    // RECURSOS (Área 4) - Left - índices 16-19
    { subAreaIndex: 16, row: 2, col: 0, areaIndex: 4, subIndex: 0 },
    { subAreaIndex: 17, row: 2, col: 1, areaIndex: 4, subIndex: 1 },
    { subAreaIndex: 18, row: 3, col: 0, areaIndex: 4, subIndex: 2 },
    { subAreaIndex: 19, row: 3, col: 1, areaIndex: 4, subIndex: 3 },

    // ESTRATEGIA (Área 0) - Center - índices 0-3
    { subAreaIndex: 0, row: 2, col: 2, areaIndex: 0, subIndex: 0 },
    { subAreaIndex: 1, row: 2, col: 3, areaIndex: 0, subIndex: 1 },
    { subAreaIndex: 2, row: 3, col: 2, areaIndex: 0, subIndex: 2 },
    { subAreaIndex: 3, row: 3, col: 3, areaIndex: 0, subIndex: 3 },

    // ORIENTACIÓN (Área 2) - Right - índices 8-11
    { subAreaIndex: 8, row: 2, col: 4, areaIndex: 2, subIndex: 0 },
    { subAreaIndex: 9, row: 2, col: 5, areaIndex: 2, subIndex: 1 },
    { subAreaIndex: 10, row: 3, col: 4, areaIndex: 2, subIndex: 2 },
    { subAreaIndex: 11, row: 3, col: 5, areaIndex: 2, subIndex: 3 },

    // PERSONAS (Área 5) - Far Right - índices 20-23
    { subAreaIndex: 20, row: 2, col: 6, areaIndex: 5, subIndex: 0 },
    { subAreaIndex: 21, row: 2, col: 7, areaIndex: 5, subIndex: 1 },
    { subAreaIndex: 22, row: 3, col: 6, areaIndex: 5, subIndex: 2 },
    { subAreaIndex: 23, row: 3, col: 7, areaIndex: 5, subIndex: 3 },

    // EFICACIA (Área 3) - Bottom - índices 12-15
    { subAreaIndex: 12, row: 4, col: 2, areaIndex: 3, subIndex: 0 },
    { subAreaIndex: 13, row: 4, col: 3, areaIndex: 3, subIndex: 1 },
    { subAreaIndex: 14, row: 5, col: 2, areaIndex: 3, subIndex: 2 },
    { subAreaIndex: 15, row: 5, col: 3, areaIndex: 3, subIndex: 3 },
  ];

  const cellSize = 40; // Tamaño de cada celda en px (más pequeño para 24 celdas)

  return (
    <div className="flex flex-col gap-4">
      {/* Título */}
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <span>🎯</span>
        <span>FOCO DE INTERVENCIÓN 360</span>
      </h3>

      {/* Cubo desplegado con 24 sub-áreas */}
      <div className="relative mx-auto" style={{ height: `${cellSize * 6}px`, width: `${cellSize * 8}px` }}>
        {cubePattern.map(({ subAreaIndex, row, col, areaIndex, subIndex }) => {
          const value = answers[subAreaIndex];
          const level = subAreaLevels[subAreaIndex];
          const percentage = (value / 4) * 100;
          const isFiltered = selectedFilter ? level === selectedFilter : true;

          // Usar el color del área con degradado basado en porcentaje
          const areaColor = AREA_COLORS[areaIndex];
          const background = isFiltered
            ? getGradientBackground(areaColor, percentage)
            : '#F3F4F6';

          // Número de la subárea (1-4)
          const numeroSubarea = subIndex + 1;

          return (
            <div
              key={subAreaIndex}
              onClick={() => onAreaClick?.(areaIndex)}
              className="absolute border border-gray-700 cursor-pointer transition-all duration-300 ease-out hover:scale-110 hover:shadow-xl hover:z-10 flex flex-col items-center justify-center rounded-sm"
              style={{
                top: `${row * cellSize}px`,
                left: `${col * cellSize}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                background: background,
                opacity: isFiltered ? 1 : 0.3,
                boxShadow: isFiltered ? `0 2px 4px ${areaColor}40` : 'none'
              }}
              title={`${SUB_AREA_NAMES[subAreaIndex]}: ${percentage.toFixed(1)}%`}
            >
              {/* NÚMERO SUTIL ABAJO - SOLO SI ESTÁ ACTIVA */}
              {isFiltered && (
                <div className="absolute bottom-0.5 right-0.5 z-20">
                  <span className="text-[9px] font-bold text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {numeroSubarea}
                  </span>
                </div>
              )}

              <span className="text-[7px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-tight text-center px-0.5">
                {SUB_AREA_SHORT_NAMES[subAreaIndex]}
              </span>
              <span className="text-[9px] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {percentage.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>


    </div>
  );
}

