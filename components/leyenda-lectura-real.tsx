"use client";

import { AnswerValue } from "@/lib/types";
import { AREA_NAMES, SUB_AREA_NAMES_BY_AREA, AREA_COLORS, getGradientBackground } from "@/lib/constants";

interface LeyendaLecturaRealProps {
  answers: AnswerValue[];
  selectedFilter?: 'critico' | 'desarrollo' | 'solido' | 'ejemplar' | null;
}

// Función para calcular el nivel según el valor individual (0-4)
const getLevel = (value: number): 'critico' | 'desarrollo' | 'solido' | 'ejemplar' => {
  const percentage = (value / 4) * 100;
  if (percentage < 25) return 'critico';
  if (percentage < 50) return 'desarrollo';
  if (percentage < 75) return 'solido';
  return 'ejemplar';
};

export function LeyendaLecturaReal({ answers, selectedFilter = null }: LeyendaLecturaRealProps) {
  // Calcular niveles por sub-área
  const subAreaLevels = answers.map(value => getLevel(value));

  // Organizar datos por área y sub-área
  const areaData = Array.from({ length: 6 }, (_, areaIndex) => {
    const startIndex = areaIndex * 4;
    const subAreas = answers.slice(startIndex, startIndex + 4).map((value, subIndex) => {
      const subAreaIndex = startIndex + subIndex;
      const level = subAreaLevels[subAreaIndex];
      const isFiltered = selectedFilter ? level === selectedFilter : true;

      return {
        name: SUB_AREA_NAMES_BY_AREA[areaIndex][subIndex],
        value: value,
        percentage: (value / 4) * 100,
        isFiltered: isFiltered,
      };
    });

    // Solo incluir el área si tiene al menos una subárea activa
    const hasActiveSubAreas = subAreas.some(sub => sub.isFiltered);

    return {
      areaName: AREA_NAMES[areaIndex],
      subAreas,
      hasActiveSubAreas,
    };
  }).filter(area => area.hasActiveSubAreas); // Filtrar áreas sin subáreas activas

  return (
    <div className="flex flex-col gap-4">
      {/* Título */}
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <span>📊</span>
        <span>SUB ÁREAS</span>
      </h3>

      {/* Lista de todas las áreas con separadores */}
      <div className="flex flex-col gap-4">
        {areaData.map((area, areaIndex) => (
          <div key={areaIndex} className="flex flex-col gap-2">
            {/* Nombre del área */}
            <h4 className="text-xs font-bold text-white uppercase">
              {area.areaName}
            </h4>

            {/* Línea separadora */}
            <div className="h-px bg-white/20 mb-1"></div>

            {/* Sub-áreas con cuadrado, número y nombre - SOLO LAS ACTIVAS */}
            <div className="flex flex-col gap-1.5">
              {area.subAreas
                .map((subArea, subIndex) => ({ subArea, subIndex, numeroSubarea: subIndex + 1 }))
                .filter(({ subArea }) => subArea.isFiltered) // Solo mostrar las activas
                .map(({ subArea, subIndex, numeroSubarea }) => (
                  <div
                    key={subIndex}
                    className="flex items-center gap-2"
                  >
                    {/* Cuadrado con gradiente */}
                    <div
                      className="w-4 h-4 rounded-sm border border-white/30 flex-shrink-0"
                      style={{
                        background: getGradientBackground(AREA_COLORS[areaIndex], subArea.percentage)
                      }}
                    ></div>

                    {/* Número en círculo */}
                    <div className="w-4 h-4 rounded-full bg-white border border-gray-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-[8px] font-bold text-gray-900">
                        {numeroSubarea}
                      </span>
                    </div>

                    {/* Nombre de la subárea */}
                    <span className="text-xs text-white flex-1">
                      {subArea.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

