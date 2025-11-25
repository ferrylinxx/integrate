"use client";

import { AnswerValue } from "@/lib/types";
import { AREA_COLORS, AREA_NAMES, SUB_AREA_NAMES_BY_AREA, getGradientBackground } from "@/lib/constants";

interface VistaGeneralMejoradaProps {
  answers: AnswerValue[];
  selectedFilter: 'critico' | 'desarrollo' | 'solido' | 'ejemplar' | null;
  onFilterChange: (filter: 'critico' | 'desarrollo' | 'solido' | 'ejemplar' | null) => void;
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

export function VistaGeneralMejorada({ answers, selectedFilter, onFilterChange, onAreaClick }: VistaGeneralMejoradaProps) {
  // Validación
  if (!answers || answers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/60">Cargando datos...</p>
      </div>
    );
  }

  // Calcular niveles por sub-área
  const subAreaLevels = answers.map(value => getLevel(value));

  // Patrón de cubo desplegado en cruz (6 áreas × 4 sub-áreas = 24 celdas)
  // Ahora agrupamos por áreas para poder renderizar cada área 2x2 con su borde
  const areaGroups = [
    {
      areaIndex: 1, // ESTRUCTURA - Top
      position: { row: 0, col: 2 },
      subAreas: [
        { subAreaIndex: 4, localRow: 0, localCol: 0 },
        { subAreaIndex: 5, localRow: 0, localCol: 1 },
        { subAreaIndex: 6, localRow: 1, localCol: 0 },
        { subAreaIndex: 7, localRow: 1, localCol: 1 },
      ]
    },
    {
      areaIndex: 4, // RECURSOS - Left
      position: { row: 2, col: 0 },
      subAreas: [
        { subAreaIndex: 16, localRow: 0, localCol: 0 },
        { subAreaIndex: 17, localRow: 0, localCol: 1 },
        { subAreaIndex: 18, localRow: 1, localCol: 0 },
        { subAreaIndex: 19, localRow: 1, localCol: 1 },
      ]
    },
    {
      areaIndex: 0, // ESTRATEGIA - Center
      position: { row: 2, col: 2 },
      subAreas: [
        { subAreaIndex: 0, localRow: 0, localCol: 0 },
        { subAreaIndex: 1, localRow: 0, localCol: 1 },
        { subAreaIndex: 2, localRow: 1, localCol: 0 },
        { subAreaIndex: 3, localRow: 1, localCol: 1 },
      ]
    },
    {
      areaIndex: 2, // ORIENTACIÓN - Right
      position: { row: 2, col: 4 },
      subAreas: [
        { subAreaIndex: 8, localRow: 0, localCol: 0 },
        { subAreaIndex: 9, localRow: 0, localCol: 1 },
        { subAreaIndex: 10, localRow: 1, localCol: 0 },
        { subAreaIndex: 11, localRow: 1, localCol: 1 },
      ]
    },
    {
      areaIndex: 5, // PERSONAS - Far Right
      position: { row: 2, col: 6 },
      subAreas: [
        { subAreaIndex: 20, localRow: 0, localCol: 0 },
        { subAreaIndex: 21, localRow: 0, localCol: 1 },
        { subAreaIndex: 22, localRow: 1, localCol: 0 },
        { subAreaIndex: 23, localRow: 1, localCol: 1 },
      ]
    },
    {
      areaIndex: 3, // EFICACIA - Bottom
      position: { row: 4, col: 2 },
      subAreas: [
        { subAreaIndex: 12, localRow: 0, localCol: 0 },
        { subAreaIndex: 13, localRow: 0, localCol: 1 },
        { subAreaIndex: 14, localRow: 1, localCol: 0 },
        { subAreaIndex: 15, localRow: 1, localCol: 1 },
      ]
    },
  ];

  // Organizar datos por área para la leyenda
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
      areaIndex,
      subAreas,
      hasActiveSubAreas,
    };
  }).filter(area => area.hasActiveSubAreas); // Filtrar áreas sin subáreas activas

  const cellSize = 42; // Tamaño de cada celda (reducido de 50 a 42)
  const areaGap = 6; // Gap entre áreas (reducido de 8 a 6)
  const cellGap = 2; // Gap entre celdas dentro de cada área

  // Detectar si necesitamos 2 columnas (cuando hay muchas áreas activas)
  const needsTwoColumns = areaData.length > 3;

  return (
    <div className="bg-[#1a1a1f] border border-white/10 rounded-lg p-4">
      {/* Header con título y filtros */}
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-white text-lg font-bold uppercase">VISTA GENERAL</h2>

        {/* Filtros */}
        <div className="flex gap-3 items-center">
          {/* Botón GLOBAL (casa) */}
          <button
            onClick={() => onFilterChange(null)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1.5 ${
              selectedFilter === null
                ? 'bg-white/20 text-white border border-white/40'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
            title="Ver todas las áreas"
          >
            {/* Icono de casa SVG */}
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>GLOBAL</span>
          </button>

          {/* Línea separadora vertical */}
          <div className="h-6 w-px bg-white/30"></div>

          {/* Filtros de nivel */}
          <div className="flex gap-1.5">
            {[
              { key: 'critico' as const, label: 'CRÍTICO' },
              { key: 'desarrollo' as const, label: 'DESARROLLO' },
              { key: 'solido' as const, label: 'SÓLIDO' },
              { key: 'ejemplar' as const, label: 'EJEMPLAR' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onFilterChange(key)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                  selectedFilter === key
                    ? 'bg-white/20 text-white border border-white/40'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layout principal: Cubo + Leyendas */}
      <div className="flex gap-6">
        {/* Cubo desplegado - Más hacia la izquierda */}
        <div className="flex-1" style={{ maxWidth: needsTwoColumns ? '55%' : '65%' }}>
          <div className="relative mx-auto" style={{ height: `${cellSize * 6 + areaGap * 2 + 20}px`, width: `${cellSize * 8 + areaGap * 3}px` }}>
            {areaGroups.map((group) => {
              const { areaIndex, position, subAreas } = group;
              const areaColor = AREA_COLORS[areaIndex];

              // Calcular posición del contenedor del área (2x2)
              const areaTop = position.row * cellSize + Math.floor(position.row / 2) * areaGap + 20; // +20px para espacio del título
              const areaLeft = position.col * cellSize + Math.floor(position.col / 2) * areaGap;
              const areaSize = cellSize * 2 + cellGap;

              // No mostrar nombre para ESTRATEGIA (área central, índice 0)
              const showLabel = areaIndex !== 0;

              // EFICACIA (índice 3) va abajo, el resto arriba
              const labelPosition = areaIndex === 3 ? 'bottom' : 'top';

              // Obtener nombre del área sin "Área X: "
              const areaName = AREA_NAMES[areaIndex].replace(/^Área\s+\d+:\s+/i, '');

              return (
                <div
                  key={areaIndex}
                  className="absolute cursor-pointer"
                  onClick={() => onAreaClick?.(areaIndex)}
                  style={{
                    top: `${areaTop}px`,
                    left: `${areaLeft}px`,
                    width: `${areaSize}px`,
                    height: `${areaSize}px`,
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '2px',
                  }}
                >
                  {/* Nombre del área - SOLO SI NO ES ESTRATEGIA */}
                  {showLabel && (
                    <div
                      className="absolute left-0 right-0 text-center"
                      style={{
                        [labelPosition === 'bottom' ? 'bottom' : 'top']: '-18px',
                        fontSize: '8px',
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 0.5)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {areaName}
                    </div>
                  )}
                  {/* Renderizar las 4 sub-celdas dentro del área */}
                  {subAreas.map(({ subAreaIndex, localRow, localCol }) => {
                    const value = answers[subAreaIndex];
                    const level = subAreaLevels[subAreaIndex];
                    const percentage = (value / 4) * 100;
                    const isFiltered = selectedFilter ? level === selectedFilter : true;
                    const background = getGradientBackground(areaColor, percentage);

                    // Calcular el número de la subárea (1-4) basado en su posición local
                    const numeroSubarea = localRow * 2 + localCol + 1;

                    return (
                      <div
                        key={subAreaIndex}
                        className="absolute transition-all duration-300 flex items-center justify-center"
                        style={{
                          top: `${localRow * (cellSize + cellGap)}px`,
                          left: `${localCol * (cellSize + cellGap)}px`,
                          width: `${cellSize}px`,
                          height: `${cellSize}px`,
                          background: background,
                          opacity: isFiltered ? 1 : 0.2,
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        {/* NÚMERO SUTIL ABAJO - SOLO SI ESTÁ ACTIVA */}
                        {isFiltered && (
                          <span className="absolute bottom-0.5 right-0.5 text-[10px] font-bold text-white/80">
                            {numeroSubarea}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Separador vertical */}
        <div className="w-px bg-white/20" />

        {/* Sección de leyendas - Ancho dinámico según columnas */}
        <div
          className="flex flex-col gap-3 overflow-y-auto"
          style={{ width: needsTwoColumns ? '45%' : '35%', maxHeight: '400px' }}
        >
          {/* Lista de todas las áreas con separadores - Layout en 1 o 2 columnas */}
          <div className={needsTwoColumns ? 'grid grid-cols-2 gap-x-4 gap-y-3' : 'flex flex-col gap-3'}>
            {areaData.map((area) => (
              <div key={area.areaIndex} className="flex flex-col gap-2">
                {/* Nombre del área */}
                <h4 className="text-[10px] font-bold text-white uppercase">
                  {AREA_NAMES[area.areaIndex]}
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
                            background: getGradientBackground(AREA_COLORS[area.areaIndex], subArea.percentage)
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
      </div>
    </div>
  );
}

